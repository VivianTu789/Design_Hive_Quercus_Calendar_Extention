export type CalendarView = 'month' | 'week' | 'day';

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO string
  courseId: string;
}

