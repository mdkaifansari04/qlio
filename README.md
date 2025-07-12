# ⚙️ Qlio — Asynchronous Script Execution Engine

Qlio is a scalable, full-stack system for executing shell commands asynchronously on a **remote job runner** with real-time logs, priority queues, retry handling, and concurrency support — inspired by tools like **BullMQ**, **Sidekiq**, and frontend UX inspired by **Render.com**.

> Built from scratch. Queue system, worker engine, job tracker — all hand-crafted.  
> Designed for performance, resilience, and developer control.

---

## 🧠 Use Case

- Need to execute shell commands/scripts in the background?
- Want to handle long-running or unreliable jobs with retries?
- Need real-time output streaming like Render or Railway?
- Want to build a Sidekiq/BullMQ-type infra by yourself?

💥 **Qlio does that. From scratch.**

---

## 🚀 Features

✅ **Remote Job Execution** (over HTTP + WebSocket)  
✅ **Priority Queues** (high-priority jobs get picked first)  
✅ **Multiple Worker Support** (true concurrency)  
✅ **Retry with Delay** & Retry Queue  
✅ **Real-time Log Streaming** (WebSocket)  
✅ **Script with Parameters Support**  
✅ **Process Termination on Cancel**  
✅ **Persistent DB (Postgres)** for job metadata  
✅ **Race Condition Handling**  
✅ **Queue Offloading for Heavy Tasks**  
✅ **Frontend built with Next.js + Tailwind** (Render-like UX)

---

## 🧱 Architecture Overview

<p align="center">
  <img src=".github/image/architecture.png" alt="Architecture Diagram" width="700"/>
  <br/>
  <em>Qlio system architecture — manager, queue, worker, and real-time feedback loop.</em>
</p>

- Redis: shared queue between manager & worker
- Postgres: job persistence
- WebSocket: real-time logs

---

## 🧑‍💻 Tech Stack

| Layer       | Stack                                |
| ----------- | ------------------------------------ |
| Frontend    | Next.js, TailwindCSS                 |
| Job Manager | Hono (Node.js), Redis, Prisma        |
| Worker      | Node.js, Redis, Spawn, WebSocket     |
| Queue       | Custom-built using Redis             |
| DB          | PostgreSQL (via Prisma ORM)          |
| Deploy      | Vercel (Frontend) + Render (Backend) |

---

## 📦 Repository Structure

```
qlio/
│   ├── frontend/       # Next.js client
│   ├── job-manager/    # API + queue handler
│   └── job-worker/     # Job execution engine
```

---

## ⚙️ Environment Variables

### Frontend `.env`

```env
NEXT_PUBLIC_HOST_URL=https://qlio-pprb.onrender.com/api/v1
NEXT_PUBLIC_SOCKET_URL=https://qlio-pprb.onrender.com
```

### Job Manager `.env`

```env
DATABASE_URL=your_postgres_url
PORT=8080
NODE_ENV=development
JWT_SECRET=jwtsecretforqliowebapp
REDIS_HOST=your_redis_url
FRONTEND_URL=https://qlio-one.vercel.app
JOB_WORKER_URL=https://qlio-job-worker.onrender.com
```

### Job Worker `.env`

```env
DATABASE_URL=your_postgres_url
JOB_MANGER_SOCKET_URL=ws://localhost:8080
REDIS_HOST=your_redis_url
PORT=8081
```

---

## 🛠️ Getting Started

### 🖼 Frontend (Next.js)

```bash
cd apps/frontend
pnpm install
pnpm dev
# or npm run dev
```

### ⚙️ Job Manager (API Server)

```bash
cd apps/job-manager
pnpm install
pnpm dev
# or npm run dev
```

### 🔨 Job Worker (Executor)

```bash
cd apps/job-worker
pnpm install
pnpm dev
# or npm run dev
```

---

## 🧪 Scripts

### Start Frontend Sever

```bash
    cd frontend
    npm install
    npm run dev
```

### Job Manager Server

```bash
    cd job-manager
    pnpm install
    pnpm run dev
```

### Job Worker Server

```bash
    cd job-worker
    pnpm install
    pnpm run dev
```

---

## 🔍 Testing

> Functional testing done via real job runs and log validation

🧪 Includes:

- Retry logic
- Job queue consumption
- Race condition protection
- Cancel job mid-execution
- Real-time log streaming via WebSocket

---

## 🌐 Live URLs

- **Frontend**: [qlio-one.vercel.app](https://qlio-one.vercel.app)
- **API Server**: [qlio-pprb.onrender.com](https://qlio-pprb.onrender.com)
- **Worker**: [qlio-job-worker.onrender.com](https://qlio-job-worker.onrender.com)

---

## 📅 Future Improvements

- [ ] Docker & CI/CD setup
- [ ] CLI interface

---

## 📜 License

MIT — do whatever you want, just don’t resell it as yours.

---

## ✍️ Author

**Md Kaif Ansari**
Built with love, pain, sleep deprivation & passion.
[@mdkaifansari04](https://github.com/mdkaifansari04)
