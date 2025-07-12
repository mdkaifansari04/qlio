"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Terminal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCreateJob } from "@/hooks/mutation"
import { Textarea } from "@/components/ui/textarea"
import { getErrorMessage } from "@/lib/utils"
import { useSocket } from "@/provider/socket-provider"

const page = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { mutate: createJobMutation, isPending: isSubmitting } = useCreateJob()
  const socket = useSocket()
  const [formData, setFormData] = useState({
    command: "",
    priority: 3,
    timeout: 300000,
    params: [""],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    createJobMutation(
      {
        command: formData.command,
        priority: Number(formData.priority),
        timeout: Number(formData.timeout),
        params: formData.params,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Job Created",
            description:
              "Your job has been successfully created and queued for execution.",
          })
          router.push(`/dashboard/jobs/${data.id}`)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: getErrorMessage(error),
            variant: "destructive",
          })
        },
      }
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleParamsChange = (params: string[]) => {
    setFormData((prev) => ({ ...prev, params }))
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Create New Job</h1>
        <p className="text-muted-foreground">
          Configure and submit a new job for execution
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Job Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Command */}
              <div className="space-y-2">
                <Label htmlFor="command">Command *</Label>
                <Textarea
                  id="command"
                  placeholder="Enter your shell command here..."
                  value={formData.command}
                  onChange={(e) => handleInputChange("command", e.target.value)}
                  className="font-mono min-h-[100px]"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter the shell command you want to execute. Use proper shell
                  syntax.
                </p>
              </div>

              <ScriptParamsInput onChange={handleParamsChange} />

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority.toString()}
                  onValueChange={(value) =>
                    handleInputChange("priority", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - High</SelectItem>
                    <SelectItem value="2">2 - Normal</SelectItem>
                    <SelectItem value="3">3 - Low</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Higher priority jobs are executed first when resources are
                  available.
                </p>
              </div>

              {/* Timeout */}
              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout (milliseconds)</Label>
                <Input
                  id="timeout"
                  type="number"
                  placeholder="300000"
                  value={formData.timeout.toString()}
                  onChange={(e) => handleInputChange("timeout", e.target.value)}
                  min="1000"
                  max="3600000"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum execution time in milliseconds (1000ms = 1 second).
                  Max: 1 hour.
                </p>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="rounded-md bg-muted p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Terminal className="h-4 w-4" />
                    <span className="font-medium">Command:</span>
                    <span className="font-mono text-xs bg-background px-2 py-1 rounded">
                      {formData.command || "No command entered"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Terminal className="h-4 w-4" />
                    <span className="font-medium">Parameters:</span>
                    <span className="font-mono text-xs bg-background px-2 py-1 rounded">
                      {formData.params.join(" ")}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Priority: {formData.priority} | Timeout:{" "}
                    {formData.timeout / 1000}s
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.command.trim()}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Job
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ScriptParamsInput({
  onChange,
}: {
  onChange: (params: string[]) => void
}) {
  const [params, setParams] = useState<string[]>([""])

  const updateParam = (index: number, value: string) => {
    const updated = [...params]
    updated[index] = value
    setParams(updated)
    onChange(updated.filter((p) => p.trim())) // send only valid ones
  }

  const addParam = () => {
    setParams([...params, ""])
  }

  const removeParam = (index: number) => {
    const updated = params.filter((_, i) => i !== index)
    setParams(updated)
    onChange(updated.filter((p) => p.trim()))
  }

  return (
    <div className="space-y-2">
      {params.map((param, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            placeholder={`${index + 1} value`}
            value={param}
            onChange={(e) => updateParam(index, e.target.value)}
          />
          {params.length > 1 && (
            <Button variant="destructive" onClick={() => removeParam(index)}>
              Remove
            </Button>
          )}
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={addParam}>
        + Add Parameter
      </Button>
    </div>
  )
}

export default page
