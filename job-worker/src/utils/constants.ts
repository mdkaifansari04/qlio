export const constants = {
  SALT: 10,
  JOB_QUEUE_KEY: "queue:job",
  JOB_QUEUE_KEY_RETRY: "queue:job:retry",
  MAX_RETRIES: 3,
  RACE_CONDITION_TIMEOUT: 1000 * 60 * 10, // 10 minutes
};
