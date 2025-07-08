# Qlio - Asynchronous Script Execution Engine_

## Infrastructure

- job-worker : pull out all the jobs from job-queue and executing and sends back the response to the job-manager server.
- job-manager that initiates the job and push that to the job-queue and both the server shared a common queue using redis.
- frontend - that supports user to create and execute command and also get real time response from the job-manager server.
