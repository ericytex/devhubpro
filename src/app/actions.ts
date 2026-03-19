'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createProject(formData: FormData) {
  const name = formData.get('name') as string
  const stage = formData.get('stage') as string

  if (!name || !stage) return

  await prisma.project.create({
    data: {
      name,
      stage,
      priority: 'high',
      status: 'active',
      lastWorkedAt: new Date(),
    },
  })

  revalidatePath('/')
}

export async function logSession(formData: FormData) {
  const projectId = formData.get('projectId') as string
  const duration = parseInt(formData.get('duration') as string, 10)

  if (!projectId || !duration) return

  await prisma.session.create({
    data: {
      projectId,
      startTime: new Date(),
      endTime: new Date(Date.now() + duration * 60000),
      duration,
    },
  })

  await prisma.project.update({
    where: { id: projectId },
    data: { lastWorkedAt: new Date() },
  })

  revalidatePath('/')
}
