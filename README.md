# SaaS Command Center (SCC)

This is the codebase for the SaaS Command Center, a centralized dashboard tracking SaaS projects, tasks, and daily work outputs. The project was generated based on the instructions requested and prepared for a scalable Next.js deployment.

## Tech Stack
- **Frontend/Backend:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** SQLite (via [Prisma ORM](https://www.prisma.io/)) *(For Vercel deployment, eventually migrate to Turso or Vercel Postgres, as SQLite is stateless in serverless environments)*
- **Data Visualization:** Recharts
- **Icons:** Lucide React

## Getting Started

1. **Install dependencies**
   Ensure all dependencies are installed:
   ```bash
   npm install
   ```

2. **Initialize Database**
   The Prisma schema is already provided with Project, Task, and Session models. If you need to re-generate or start a new DB:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. **Run the Development Server**
   Start the local Next.js server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Next Steps
Please refer to the generated PRD document in the workspace for detailed feature milestones.
