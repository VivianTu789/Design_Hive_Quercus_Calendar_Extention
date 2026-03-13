export type CalendarView = 'month' | 'week' | 'day';

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  // Full ISO datetime string; date + time.
  dueDate: string;
  // Human-readable due time for display, e.g. "3:00 PM".
  dueTime?: string;
  courseId: string;
  // Link back to the source assignment in the LMS or app.
  assignmentLink?: string;
}

