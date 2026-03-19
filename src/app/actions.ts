'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ─── Projects ────────────────────────────────────────────────
export async function createProject(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const stage = (formData.get('stage') as string) || 'idea'
  const priority = (formData.get('priority') as string) || 'medium'

  if (!name) return { error: 'Project name is required.' }

  try {
    await prisma.project.create({
      data: {
        name,
        description: description || null,
        stage,
        priority,
        status: 'active',
        lastWorkedAt: new Date(),
      },
    })
    revalidatePath('/')
    revalidatePath('/projects')
    return { success: true }
  } catch {
    return { error: 'Failed to create project.' }
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/projects')
    return { success: true }
  } catch {
    return { error: 'Failed to delete project.' }
  }
}

export async function updateProjectStatus(id: string, status: string) {
  try {
    await prisma.project.update({ where: { id }, data: { status } })
    revalidatePath('/')
    revalidatePath('/projects')
    return { success: true }
  } catch {
    return { error: 'Failed to update project.' }
  }
}

// ─── Tasks ───────────────────────────────────────────────────
export async function createTask(formData: FormData) {
  const projectId = formData.get('projectId') as string
  const title = (formData.get('title') as string)?.trim()
  const urgency = (formData.get('urgency') as string) || 'medium'

  if (!projectId || !title) return { error: 'Project and task title are required.' }

  try {
    await prisma.task.create({
      data: { projectId, title, urgency, status: 'todo' },
    })
    revalidatePath('/')
    revalidatePath('/projects')
    return { success: true }
  } catch {
    return { error: 'Failed to create task.' }
  }
}

export async function completeTask(id: string) {
  try {
    await prisma.task.update({
      where: { id },
      data: { status: 'done', completedAt: new Date() },
    })
    revalidatePath('/')
    revalidatePath('/projects')
    return { success: true }
  } catch {
    return { error: 'Failed to complete task.' }
  }
}

// ─── Sessions ────────────────────────────────────────────────
export async function logSession(formData: FormData) {
  const projectId = formData.get('projectId') as string
  const duration = parseInt(formData.get('duration') as string, 10)
  const notes = (formData.get('notes') as string)?.trim()

  if (!projectId || !duration || isNaN(duration) || duration <= 0) {
    return { error: 'A valid project and duration are required.' }
  }

  try {
    await prisma.session.create({
      data: {
        projectId,
        startTime: new Date(Date.now() - duration * 60000),
        endTime: new Date(),
        duration,
        notes: notes || null,
      },
    })

    await prisma.project.update({
      where: { id: projectId },
      data: { lastWorkedAt: new Date() },
    })

    revalidatePath('/')
    revalidatePath('/timer')
    revalidatePath('/analytics')
    return { success: true }
  } catch {
    return { error: 'Failed to log session.' }
  }
}

// ─── Analytics helper ─────────────────────────────────────────
export async function getWeekStats() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const sessions = await prisma.session.findMany({
    where: { startTime: { gte: weekAgo } },
    orderBy: { startTime: 'asc' },
  })
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration ?? 0), 0)
  return { sessions, totalMinutes, totalHours: Math.round((totalMinutes / 60) * 10) / 10 }
}
