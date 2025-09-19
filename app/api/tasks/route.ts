import { NextRequest, NextResponse } from 'next/server';
import { createTask } from '@/app/tasks/repo';
import { validateTaskInput } from '@/lib/validation';
import {
  CreateTaskResponse,
  ApiErrorResponse,
  ValidationErrorResponse,
  CreateTaskRequest,
} from '@/types/api';

// * POST /api/tasks - Create a new task
export async function POST(
  request: NextRequest,
): Promise<NextResponse<CreateTaskResponse | ApiErrorResponse | ValidationErrorResponse>> {
  try {
    let body: CreateTaskRequest;
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
    const validation = validateTaskInput(body);
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

    // ? Create task with validated data
    const created = await createTask(validation.sanitizedData!);

    return NextResponse.json(
      {
        success: true,
        data: created,
        message: 'Task created successfully',
      } as CreateTaskResponse,
      { status: 201 },
    );
  } catch (error) {
    console.error('[API] Error creating task:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error occurred while creating task',
        code: 'INTERNAL_ERROR',
      } as ApiErrorResponse,
      { status: 500 },
    );
  }
}

// * Handle unsupported HTTP methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED',
    } as ApiErrorResponse,
    {
      status: 405,
      headers: { Allow: 'POST' },
    },
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED',
    } as ApiErrorResponse,
    {
      status: 405,
      headers: { Allow: 'POST' },
    },
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED',
    } as ApiErrorResponse,
    {
      status: 405,
      headers: { Allow: 'POST' },
    },
  );
}
