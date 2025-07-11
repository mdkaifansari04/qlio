import { useQuery } from "@tanstack/react-query";
import * as Job from "./data-access/job";

export const useGetJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: () => Job.getJobs(),
  });
};

export const getJobById = (id: string) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => Job.getJobById(id),
    enabled: !!id,
  });
};
