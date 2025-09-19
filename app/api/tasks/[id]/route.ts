import { NextRequest, NextResponse } from 'next/server';
import { getTaskById, updateTask, deleteTask } from '@/app/tasks/repo';
import { validateTaskUpdateInput } from '@/lib/validation';
import {
  UpdateTaskResponse,
  DeleteTaskResponse,
  ApiErrorResponse,
  ValidationErrorResponse,
  UpdateTaskRequest,
  ApiSuccessResponse,
} from '@/types/api';
import { Task } from '@/types/task';

// * GET /api/tasks/[id] - Get a specific task
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiSuccessResponse<Task> | ApiErrorResponse>> {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Task ID is required and must be a string',
          code: 'INVALID_TASK_ID',
        } as ApiErrorResponse,
        { status: 400 },
      );
    }

    const task = await getTaskById(id);
    if (!task) {
      return NextResponse.json(
        {
          success: false,
          error: 'Task not found',
          code: 'TASK_NOT_FOUND',
        } as ApiErrorResponse,
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error(`[API] Error fetching task:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error occurred while fetching task',
        code: 'INTERNAL_ERROR',
      } as ApiErrorResponse,
      { status: 500 },
    );
  }
}

// * PUT /api/tasks/[id] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<UpdateTaskResponse | ApiErrorResponse | ValidationErrorResponse>> {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Task ID is required and must be a string',
          code: 'INVALID_TASK_ID',
        } as ApiErrorResponse,
        { status: 400 },
      );
    }

    let body: UpdateTaskRequest;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body',
          code: 'INVALID_JSON',
        } as ApiErrorResponse,
        { status: 400 },
      );
    }

    // ? Validate and sanitize input
    const validation = validateTaskUpdateInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors: validation.errors,
        } as ValidationErrorResponse,
        { status: 400 },
      );
    }

    // ? Update task with validated data
    const updated = await updateTask(id, validation.sanitizedData!);
    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          error: 'Task not found',
          code: 'TASK_NOT_FOUND',
        } as ApiErrorResponse,
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Task updated successfully',
    } as UpdateTaskResponse);
  } catch (error) {
    console.error(`[API] Error updating task:`, error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error occurred while updating task',
        code: 'INTERNAL_ERROR',
      } as ApiErrorResponse,
      { status: 500 },
    );
  }
}

// * DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<DeleteTaskResponse | ApiErrorResponse>> {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Task ID is required and must be a string',
          code: 'INVALID_TASK_ID',
        } as ApiErrorResponse,
        { status: 400 },
      );
    }

    const success = await deleteTask(id);
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Task not found',
          code: 'TASK_NOT_FOUND',
        } as ApiErrorResponse,
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { id },
      message: 'Task deleted successfully',
    } as DeleteTaskResponse);
  } catch (error) {
    console.error(`[API] Error deleting task:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error occurred while deleting task',
        code: 'INTERNAL_ERROR',
      } as ApiErrorResponse,
      { status: 500 },
    );
  }
}

// * Handle unsupported HTTP methods
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED',
    } as ApiErrorResponse,
    {
      status: 405,
      headers: { Allow: 'GET, PUT, DELETE' },
    },
  );
}
