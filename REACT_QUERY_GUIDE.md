# TanStack Query (React Query) Guide

This guide explains how to use TanStack Query in the Stallion Frontend project. We use a **Custom Hook Pattern** to keep our components clean and logic reusable.

## 1. Directory Structure

We organize queries by feature in `lib/api/[feature]/queries.ts`.
Example: `lib/api/notifications/queries.ts`

## 2. Fetching Data (`useQuery`)

Use `useQuery` for GET requests. It handles caching, loading, and error states automatically.

### Define the Hook (`lib/api/example/queries.ts`)

```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api' // Axios instance

// 1. Define the fetching function (Service Layer)
// Usually in lib/api/example/index.ts
const fetchProjects = async () => {
  const { data } = await api.get('/projects')
  return data
}

// 2. Create the Custom Hook
export function useGetProjects() {
  return useQuery({
    queryKey: ['projects'], // Unique key for caching
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
  })
}
```

### Use in Component

```tsx
import { useGetProjects } from '@/lib/api/example/queries'

export function ProjectList() {
  const { data: projects, isLoading, isError } = useGetProjects()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading projects</div>

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.title}</li>
      ))}
    </ul>
  )
}
```

---

## 3. Modifying Data (`useMutation`)

Use `useMutation` for POST, PUT, DELETE requests.

### Define the Hook (`lib/api/example/queries.ts`)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'

// Service function
const createProject = async (newProject: any) => {
  const { data } = await api.post('/projects', newProject)
  return data
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProject,

    // Lifecycle hooks
    onSuccess: () => {
      toast.success('Project created!')

      // ✨ Magic: Refetch the 'projects' query automatically
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      toast.error('Failed to create project')
      console.error(error)
    },
  })
}
```

### Use in Component

```tsx
import { useCreateProject } from '@/lib/api/example/queries'
import { useState } from 'react'

export function CreateProjectForm() {
  const [title, setTitle] = useState('')

  // Destructure 'mutate' function (rename it to 'createProject' for clarity)
  const { mutate: createProject, isPending } = useCreateProject()

  const handleSubmit = (e) => {
    e.preventDefault()
    createProject({ title }) // Triggers the mutation
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button disabled={isPending}>{isPending ? 'Saving...' : 'Create'}</button>
    </form>
  )
}
```

---

## 4. Dependent Queries

Run a query only when a condition is met (e.g., waiting for an ID).

```typescript
export function useGetProjectDetails(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectById(id),
    enabled: !!id, // Only run if ID exists
  })
}
```

## 5. Query Keys Best Practices

Always use array keys.

- **List**: `['todos']`
- **Detail**: `['todos', todoId]`
- **Filtered List**: `['todos', { status: 'done' }]`

This allows granular invalidation:

```typescript
// Invalidates all todo lists and details
queryClient.invalidateQueries({ queryKey: ['todos'] })
```
