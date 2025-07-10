export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    id: "1",
    question: "What is Qlio?",
    answer:
      "Qlio is a real-time job execution platform that lets developers run shell commands, scripts, or long-running processes in the cloud. It supports prioritization, retries, live logs, cancellation, and detailed analytics for each job.",
  },
  {
    id: "2",
    question: "What kind of jobs can I run?",
    answer:
      "You can run any shell-based script — from Bash one-liners to full deployment workflows. Qlio supports stdout, stderr streaming, retry logic, timeouts, and command parameters.",
  },
  {
    id: "3",
    question: "How does the retry system work?",
    answer:
      "Each job supports up to 3 retry attempts. If a job fails, it’s moved to a retry queue with exponential backoff. After 3 failures, the job is marked as FAILED and no longer retried.",
  },
  {
    id: "4",
    question: "Can I see logs in real-time?",
    answer:
      "Yes. Qlio streams stdout and stderr in real-time to your browser. You’ll see your job output as it happens — just like a real terminal.",
  },
  {
    id: "5",
    question: "What is 'priority' in a job?",
    answer:
      "Jobs can be assigned a priority level (1 being highest). The worker queue system always pulls higher-priority jobs before lower ones, ensuring time-sensitive tasks are handled first.",
  },
  {
    id: "6",
    question: "What happens if my script hangs or runs forever?",
    answer:
      "Every job includes a timeout (in milliseconds). If the script exceeds the timeout, it is forcefully terminated and marked as FAILED.",
  },
  {
    id: "7",
    question: "How can I cancel a running job?",
    answer:
      "Each job has a unique ID. If a job is RUNNING, you can cancel it in real-time via the dashboard. It will immediately terminate the process on the worker machine.",
  },
  {
    id: "8",
    question: "How do you track resource usage?",
    answer:
      "During execution, we track CPU and memory usage of each job process using system-level metrics. These stats are stored and shown in your job detail view.",
  },
  {
    id: "9",
    question: "Can I run multiple jobs at once?",
    answer:
      "Yes. Qlio supports concurrency. You can scale horizontally by running multiple worker instances, and they will automatically distribute and process jobs in parallel.",
  },
  {
    id: "10",
    question: "Is my command history saved?",
    answer:
      "Yes. All submitted commands, their output, status, resource usage, and timestamps are saved under your account so you can view past jobs and their performance metrics anytime.",
  },
  {
    id: "11",
    question: "Is Qlio open source?",
    answer:
      "Depends on your implementation. But yes — if you’ve cloned or built your own version of it, you can host it, scale it, or modify it however you like.",
  },
];
