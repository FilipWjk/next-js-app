import { TaskStatus, TaskPriority } from '@/types/task';
import { ValidationError, CreateTaskRequest, UpdateTaskRequest } from '@/types/api';

const validateTitle = (title: string, required = true): ValidationError | null => {
  if (required && !title) {
    return { field: 'title', message: 'Title is required' };
  }
  if (!required && !title) {
    return null;
  }
  if (title.trim().length < 1) {
    return { field: 'title', message: 'Title cannot be empty' };
  }
  if (title.trim().length > 200) {
    return { field: 'title', message: 'Title cannot exceed 200 characters' };
  }
  return null;
};

const validateDescription = (description: string, required = true): ValidationError | null => {
  if (required && !description) {
    return { field: 'description', message: 'Description is required' };
  }
  if (!required && !description) {
    return null;
  }
  if (description.trim().length < 1) {
    return { field: 'description', message: 'Description cannot be empty' };
  }
  if (description.trim().length > 1000) {
    return { field: 'description', message: 'Description cannot exceed 1000 characters' };
  }
  return null;
};

const validateStatus = (status: TaskStatus): ValidationError | null => {
  const allowedStatuses: TaskStatus[] = ['todo', 'in-progress', 'completed'];
  if (!allowedStatuses.includes(status)) {
    return {
      field: 'status',
      message: `Status must be one of: ${allowedStatuses.join(', ')}`,
    };
  }
  return null;
};

const validatePriority = (priority: TaskPriority): ValidationError | null => {
  const allowedPriorities: TaskPriority[] = ['low', 'medium', 'high'];
  if (!allowedPriorities.includes(priority)) {
    return {
      field: 'priority',
      message: `Priority must be one of: ${allowedPriorities.join(', ')}`,
    };
  }
  return null;
};

const validateDueDate = (dueDate?: string | null): ValidationError | null => {
  if (!dueDate || dueDate === '') {
    return null;
  }
  const date = new Date(dueDate);
  if (isNaN(date.getTime())) {
    return { field: 'dueDate', message: 'Due date must be a valid ISO date string' };
  }
  return null;
};

export function validateTaskInput(data: CreateTaskRequest): {
  isValid: boolean;
  errors: ValidationError[];
  sanitizedData?: CreateTaskRequest;
} {
  const errors: ValidationError[] = [];

  // * Validate required fields
  const titleError = validateTitle(data.title, true);
  const descriptionError = validateDescription(data.description, true);
  const statusError = validateStatus(data.status);
  const priorityError = validatePriority(data.priority);
  const dueDateError = validateDueDate(data.dueDate);

  // * Collect errors
  [titleError, descriptionError, statusError, priorityError, dueDateError]
    .filter(Boolean)
    .forEach((error) => errors.push(error!));

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // * Return sanitized data
  return {
    isValid: true,
    errors: [],
    sanitizedData: {
      title: data.title.trim(),
      description: data.description.trim(),
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
    },
  };
}

export function validateTaskUpdateInput(data: UpdateTaskRequest): {
  isValid: boolean;
  errors: ValidationError[];
  sanitizedData?: UpdateTaskRequest;
} {
  const errors: ValidationError[] = [];
  const sanitizedData: UpdateTaskRequest = {};

  // ? Validate only provided fields (partial update)
  if (data.title !== undefined) {
    const error = validateTitle(data.title, false);
    if (error) {
      errors.push(error);
    } else {
      sanitizedData.title = data.title.trim();
    }
  }

  if (data.description !== undefined) {
    const error = validateDescription(data.description, false);
    if (error) {
      errors.push(error);
    } else {
      sanitizedData.description = data.description.trim();
    }
  }

  if (data.status !== undefined) {
    const error = validateStatus(data.status);
    if (error) {
      errors.push(error);
    } else {
      sanitizedData.status = data.status;
    }
  }

  if (data.priority !== undefined) {
    const error = validatePriority(data.priority);
    if (error) {
      errors.push(error);
    } else {
      sanitizedData.priority = data.priority;
    }
  }

  if (data.dueDate !== undefined) {
    const error = validateDueDate(data.dueDate);
    if (error) {
      errors.push(error);
    } else {
      sanitizedData.dueDate = data.dueDate === '' ? null : data.dueDate;
    }
  }

  if (Object.keys(sanitizedData).length === 0 && errors.length === 0) {
    errors.push({ field: 'general', message: 'At least one field must be provided for update' });
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    sanitizedData,
  };
}
