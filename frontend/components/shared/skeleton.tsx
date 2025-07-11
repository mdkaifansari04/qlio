import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Clock, MemoryStick, Terminal, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Cpu, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function CardSkeleton({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <Skeleton className="h-6 w-8" />
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          <Skeleton className="h-3 w-30" />
        </p>
      </CardContent>
    </Card>
  );
}

export const StatsCardPendingView = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <CardSkeleton
        title="Total Jobs"
        icon={<Terminal className="h-4 w-4 text-muted-foreground" />}
      />
      <CardSkeleton
        title="Successful Jobs"
        icon={<CheckCircle className="h-4 w-4 text-green-500" />}
      />
      <CardSkeleton title="Failed Jobs" icon={<XCircle className="h-4 w-4 text-red-500" />} />
      <CardSkeleton
        title="Avg Execution Time"
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
};

export const JobCardPendingView = () => {
  return (
    <div className="grid gap-4">
      <JobCardView />
      <JobCardView />
    </div>
  );
};

export const JobCardView = () => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base w-full">
            <Terminal className="h-4 w-4" />
            <span className="font-mono text-sm truncate max-w-md">
              <Skeleton className="h-8 min-w-100" />
            </span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1">
              <ExternalLink className="h-3 w-3" />
              View
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              <Skeleton className="h-5 w-10 rounded-sm" />
            </div>
            <div className="flex items-center gap-1">
              <MemoryStick className="h-3 w-3" />
              <Skeleton className="h-5 w-10 rounded-sm" />
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <Skeleton className="h-5 w-10 rounded-sm" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <Skeleton className="h-5 w-20 rounded-sm " />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
