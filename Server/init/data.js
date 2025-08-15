const sampleTasks = [
  {
    title: "Build Authentication Module",
    description: "Implement JWT-based authentication for FocusHub backend.",
    priority: "High",
    status: "in_Progress",
    dueDate: new Date("2025-08-20"),
    tags: "backend,security,auth",
    inProgress: 60,
    user: "6894bf94ff89b80345c155b1"
  },
  {
    title: "Design Dashboard UI",
    description: "Create a responsive dashboard layout using MUI.",
    priority: "Medium",
    status: "todo",
    dueDate: new Date("2025-08-18"),
    tags: "frontend,UI,design",
    inProgress: 0,
    user: "6894bf94ff89b80345c155b1"
  },
  {
    title: "Write Task API Tests",
    description: "Cover all Task CRUD operations with Jest tests.",
    priority: "High",
    status: "todo",
    dueDate: new Date("2025-08-25"),
    tags: "testing,backend,api",
    inProgress: 0,
    user: "6894bf94ff89b80345c155b1"
  },
  {
    title: "Setup CI/CD Pipeline",
    description: "Configure GitHub Actions for automated testing and deployment.",
    priority: "Medium",
    status: "todo",
    dueDate: new Date("2025-08-28"),
    tags: "devops,ci-cd,automation",
    inProgress: 0,
    user: "6894bf94ff89b80345c155b1"
  },
  {
    title: "Integrate Calendar View",
    description: "Show tasks in a calendar format with drag-and-drop support.",
    priority: "Low",
    status: "in_Progress",
    dueDate: new Date("2025-09-05"),
    tags: "frontend,calendar,UX",
    inProgress: 25,
    user: "6894bf94ff89b80345c155b1"
  },
  {
    title: "Implement Tag Filter",
    description: "Allow tasks to be filtered by tags in the dashboard.",
    priority: "Low",
    status: "todo",
    dueDate: new Date("2025-08-22"),
    tags: "frontend,filter,UX",
    inProgress: 0,
    user: "6894bf94ff89b80345c155b1"
  },
  {
    title: "Improve API Performance",
    description: "Optimize MongoDB queries for faster task retrieval.",
    priority: "High",
    status: "in_Progress",
    dueDate: new Date("2025-08-30"),
    tags: "backend,optimization,performance",
    inProgress: 40,
    user: "6894bf94ff89b80345c155b1"
  },
  {
    title: "Create Onboarding Tutorial",
    description: "Guide new users through app features with a step-by-step tutorial.",
    priority: "Medium",
    status: "todo",
    dueDate: new Date("2025-09-02"),
    tags: "frontend,onboarding,UX",
    inProgress: 0,
    user: "6894bf94ff89b80345c155b1"
  },
  {
    title: "Add Dark Mode",
    description: "Implement theme toggling between light and dark mode.",
    priority: "Low",
    status: "todo",
    dueDate: new Date("2025-09-10"),
    tags: "frontend,theme,UX",
    inProgress: 0,
    user: "6894bf94ff89b80345c155b1"
  },
  {
    title: "Backup & Recovery System",
    description: "Implement daily automatic backups for task data.",
    priority: "High",
    status: "todo",
    dueDate: new Date("2025-09-15"),
    tags: "backend,backup,security",
    inProgress: 0,
    user: "6894bf94ff89b80345c155b1"
  }
]

module.exports = sampleTasks;