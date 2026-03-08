import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import type { Assignment, CalendarView } from '../models/assignment';
import type { Course } from '../models/course';

interface CalendarState {
  view: CalendarView;
  assignments: Assignment[];
  courses: Course[];
  selectedAssignmentId?: string;
  isImportOpen: boolean;
  isChangeReviewOpen: boolean;
}

interface CalendarContextValue extends CalendarState {
  setView: (view: CalendarView) => void;
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (assignment: Assignment) => void;
  deleteAssignment: (id: string) => void;
  openAssignment: (id: string | undefined) => void;
  closeAssignment: () => void;
  openImport: () => void;
  closeImport: () => void;
  openChangeReview: () => void;
  closeChangeReview: () => void;
}

const STORAGE_KEY = 'calendar_prototype_state_v1';

const CalendarContext = createContext<CalendarContextValue | undefined>(undefined);

const createInitialState = (): CalendarState => {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved) as CalendarState;
    } catch {
      // ignore parse errors and fall back to defaults
    }
  }

  // Seed with some fake data
  const courses: Course[] = [
    { id: 'course-1', name: 'COMP 101' },
    { id: 'course-2', name: 'MATH 202' },
  ];

  const assignments: Assignment[] = [
    {
      id: 'a-1',
      title: 'Example Assignment',
      description: 'This is a placeholder assignment in the calendar.',
      dueDate: new Date().toISOString(),
      courseId: 'course-1',
    },
  ];

  return {
    view: 'month',
    assignments,
    courses,
    selectedAssignmentId: undefined,
    isImportOpen: false,
    isChangeReviewOpen: false,
  };
};

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CalendarState>(() => createInitialState());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value: CalendarContextValue = useMemo(
    () => ({
      ...state,
      setView: (view) => setState((s) => ({ ...s, view })),
      addAssignment: (assignment) =>
        setState((s) => ({ ...s, assignments: [...s.assignments, assignment] })),
      updateAssignment: (assignment) =>
        setState((s) => ({
          ...s,
          assignments: s.assignments.map((a) => (a.id === assignment.id ? assignment : a)),
        })),
      deleteAssignment: (id) =>
        setState((s) => ({
          ...s,
          assignments: s.assignments.filter((a) => a.id !== id),
          selectedAssignmentId: s.selectedAssignmentId === id ? undefined : s.selectedAssignmentId,
        })),
      openAssignment: (id) =>
        setState((s) => ({
          ...s,
          selectedAssignmentId: id,
        })),
      closeAssignment: () =>
        setState((s) => ({
          ...s,
          selectedAssignmentId: undefined,
        })),
      openImport: () =>
        setState((s) => ({
          ...s,
          isImportOpen: true,
        })),
      closeImport: () =>
        setState((s) => ({
          ...s,
          isImportOpen: false,
        })),
      openChangeReview: () =>
        setState((s) => ({
          ...s,
          isChangeReviewOpen: true,
        })),
      closeChangeReview: () =>
        setState((s) => ({
          ...s,
          isChangeReviewOpen: false,
        })),
    }),
    [state],
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
};

export const useCalendar = (): CalendarContextValue => {
  const ctx = useContext(CalendarContext);
  if (!ctx) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return ctx;
};

