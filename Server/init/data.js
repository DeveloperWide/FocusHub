const sampleTasks = [
  {
    title: "Design user profile page",
    description: "Create a responsive user profile page with editable fields and avatar upload.",
    priority: "High",
    status: "todo",
    inProgress: 0,
    dueDate: new Date("2025-07-20"),
    tags: "frontend",
    createdAt: new Date()
  },
  {
    title: "Set up MongoDB indexing",
    description: "Optimize database performance by setting up proper indexes on the 'tasks' collection.",
    priority: "Medium",
    status: "in_Progress",
    inProgress: 50,
    dueDate: new Date("2025-07-25"),
    tags: "backend",
    createdAt: new Date()
  },
  {
    title: "Write unit tests for task API",
    description: "Add tests for create, update, delete, and get task endpoints using Jest.",
    priority: "High",
    status: "done",
    inProgress: 100,
    dueDate: new Date("2025-07-10"),
    tags: "test",
    createdAt: new Date()
  },
  {
    title: "Implement dark mode toggle",
    description: "Allow users to switch between light and dark mode via UI toggle.",
    priority: "Low",
    status: "todo",
    inProgress: 0,
    dueDate: new Date("2025-07-30"),
    tags: "ui",
    createdAt: new Date()
  },
  {
    title: "Refactor Redux state management",
    description: "Move async logic into thunks and clean up action creators.",
    priority: "Medium",
    status: "in_Progress",
    inProgress: 50,
    dueDate: new Date("2025-07-22"),
    tags: "redux",
    createdAt: new Date()
  },
  {
    title: "Deploy app to Vercel",
    description: "Push the production build and configure custom domain on Vercel.",
    priority: "High",
    status: "done",
    inProgress: 100,
    dueDate: new Date("2025-07-12"),
    tags: "deploy",
    createdAt: new Date()
  }
];


module.exports = sampleTasks;