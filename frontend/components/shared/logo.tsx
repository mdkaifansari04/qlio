import { Zap } from "lucide-react";

export function Logo() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
      <Zap className="h-4 w-4" />
    </div>
  );
}
