const sampleTasks = [
  {
    title: "Design user profile page",
    decription: "Create a responsive user profile page with editable fields and avatar upload.",
    priority: "High",
    status: "todo",
    dueDate: new Date("2025-07-20"),
    tags: "frontend,design,react",
    createdAt: new Date()
  },
  {
    title: "Set up MongoDB indexing",
    decription: "Optimize database performance by setting up proper indexes on the 'tasks' collection.",
    priority: "Medium",
    status: "in_Progress",
    dueDate: new Date("2025-07-25"),
    tags: "backend,mongodb,database",
    createdAt: new Date()
  },
  {
    title: "Write unit tests for task API",
    decription: "Add tests for create, update, delete, and get task endpoints using Jest.",
    priority: "High",
    status: "done",
    dueDate: new Date("2025-07-10"),
    tags: "backend,test,jest",
    createdAt: new Date()
  },
  {
    title: "Implement dark mode toggle",
    decription: "Allow users to switch between light and dark mode via UI toggle.",
    priority: "Low",
    status: "todo",
    dueDate: new Date("2025-07-30"),
    tags: "frontend,ui,react",
    createdAt: new Date()
  },
  {
    title: "Refactor Redux state management",
    decription: "Move async logic into thunks and clean up action creators.",
    priority: "Medium",
    status: "in_Progress",
    dueDate: new Date("2025-07-22"),
    tags: "frontend,redux,optimization",
    createdAt: new Date()
  },
  {
    title: "Deploy app to Vercel",
    decription: "Push the production build and configure custom domain on Vercel.",
    priority: "High",
    status: "done",
    dueDate: new Date("2025-07-12"),
    tags: "devops,vercel,deploy",
    createdAt: new Date()
  }
];


module.exports = sampleTasks;