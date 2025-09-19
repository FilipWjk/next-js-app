import 'server-only';

import { prisma } from '@/lib/prisma';
import { Task } from '@/types/task';
import { DummyJsonService } from '@/lib/dummyJsonService';

type CreateInput = {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate?: string;
};

type UpdateInput = Partial<Omit<CreateInput, 'dueDate'>> & { dueDate?: string | null };

type DbTask = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function toDomain(row: DbTask): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status as Task['status'],
    priority: row.priority as Task['priority'],
    dueDate: row.dueDate ? row.dueDate.toISOString() : undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function seedIfEmpty() {
  const count = await prisma.task.count();
  if (count > 0) return;
  const tasks = await DummyJsonService.fetchTodos(25);
  if (!tasks.length) return;
  await prisma.task.createMany({
    data: tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      ...(t.dueDate ? { dueDate: new Date(t.dueDate) } : {}),
    })),
  });
}

export async function listTasks(): Promise<Task[]> {
  await seedIfEmpty();
  const rows = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
  return rows.map(toDomain);
}

export async function getTaskById(id: string): Promise<Task | null> {
  await seedIfEmpty();
  const row = await prisma.task.findUnique({ where: { id } });
  return row ? toDomain(row) : null;
}

export async function createTask(input: CreateInput): Promise<Task> {
  const row = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
    },
  });
  return toDomain(row);
}

export async function updateTask(id: string, patch: UpdateInput): Promise<Task | null> {
  try {
    const data: Record<string, unknown> = {
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.description !== undefined ? { description: patch.description } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.priority !== undefined ? { priority: patch.priority } : {}),
    };
    if (patch.dueDate !== undefined) {
      data.dueDate = patch.dueDate === null ? null : new Date(patch.dueDate);
    }

    const row = await prisma.task.update({ where: { id }, data });
    return toDomain(row);
  } catch (err: any) {
    if (err?.code === 'P2025') return null; // ? record not found
    throw err;
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    await prisma.task.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
