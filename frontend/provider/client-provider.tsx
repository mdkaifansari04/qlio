"use client";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { useLayoutEffect, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as Job from "@/hooks/data-access/job";
function ClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      <PreFetchData />
    </QueryClientProvider>
  );
}

function PreFetchData() {
  const queryClient = useQueryClient();
  useLayoutEffect(() => {
    queryClient.fetchQuery({
      queryKey: ["jobs"],
      queryFn: () => Job.getJobs(),
    });
  }, []);
  return <></>;
}

export default ClientProvider;
