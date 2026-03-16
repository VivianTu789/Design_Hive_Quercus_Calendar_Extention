import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Assignment, CalendarView } from '../models/assignment';
import type { Course } from '../models/course';

interface CalendarState {
  view: CalendarView;
  currentDate: Date;
  selectedDate: Date;
  assignments: Assignment[];
  courses: Course[];
  visibleCourseIds: string[];
  showUncategorized: boolean;
  selectedAssignmentId?: string;
  isImportOpen: boolean;
  isChangeReviewOpen: boolean;
  isCreateOpen: boolean;
  showChangeAlert: boolean;
  reopenImportAfterAssignmentClose: boolean;
}

interface CalendarContextValue extends CalendarState {
  setView: (view: CalendarView) => void;
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
  navigateToDate: (date: Date) => void;
  navigateToToday: () => void;
  navigateMonth: (direction: number) => void;
  navigateWeek: (direction: number) => void;
  navigateDay: (direction: number) => void;
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (assignment: Assignment) => void;
  deleteAssignment: (id: string) => void;
  setVisibleCourseIds: (ids: string[]) => void;
  setShowUncategorized: (show: boolean) => void;
  markAllSeen: () => void;
  hideChangeAlert: () => void;
  showChangeAlertBanner: () => void;
  openAssignment: (id: string | undefined) => void;
  closeAssignment: () => void;
  openImport: () => void;
  closeImport: () => void;
  openChangeReview: () => void;
  closeChangeReview: () => void;
  openCreate: () => void;
  closeCreate: () => void;
  setReopenImportAfterAssignmentClose: (value: boolean) => void;
}

const STORAGE_KEY = 'calendar_prototype_state_v2';

const CalendarContext = createContext<CalendarContextValue | undefined>(undefined);

const isValidDate = (value: unknown): value is string | number | Date => {
  if (value === null || value === undefined) return false;
  const date = new Date(value as string | number | Date);
  return !Number.isNaN(date.getTime());
};

const toDate = (value: unknown, fallback = new Date()): Date => {
  return isValidDate(value) ? new Date(value as string | number | Date) : fallback;
};

const normalizeAssignment = (assignment: Partial<Assignment>): Assignment => {
  return {
    id: assignment.id ?? crypto.randomUUID(),
    title: assignment.title ?? 'Untitled Assignment',
    description: assignment.description ?? '',
    dueDate: isValidDate(assignment.dueDate)
      ? new Date(assignment.dueDate).toISOString()
      : new Date().toISOString(),
    dueTime:
      typeof assignment.dueTime === 'string' && /^\d{2}:\d{2}$/.test(assignment.dueTime)
        ? assignment.dueTime
        : '23:59',
    courseId: assignment.courseId ?? '',
    assignmentLink: assignment.assignmentLink ?? '',
    location: assignment.location ?? '',
    status: assignment.status,
  };
};

const getDefaultState = (): CalendarState => {
  const courses: Course[] = [
    { id: 'course-1', name: 'COMP 101' },
    { id: 'course-2', name: 'MATH 202' },
    { id: 'course-3', name: 'HIST 210' },
    { id: 'course-4', name: 'ECE496 - Design Project' },
    { id: 'course-5', name: 'JRE420 - Organizational Behavior' },
    { id: 'course-6', name: 'CSC318 - Interactive Computational Media' },
    { id: 'course-7', name: 'ECE568 - Computer Security' },
    { id: 'course-8', name: 'ECE316 - Communication Systems' },
  ];

  const now = new Date();
  const currentYear = now.getFullYear();

  // Default assignments that appear on the calendar immediately.
  const assignments: Assignment[] = [
    // CSC318 (Default) assignments
    {
      id: 'csc318-studio-6',
      title: 'Studio 6',
      description: 'CSC318 Studio 6.',
      dueDate: new Date(currentYear, 2, 30, 23, 59).toISOString(), // March 30 (moved back one day)
      dueTime: '23:59',
      courseId: 'course-6',
      assignmentLink: '',
      location: 'MY 420',
    },
    {
      id: 'csc318-studio-4',
      title: 'Studio 4',
      description: 'CSC318 Studio 4.',
      dueDate: new Date(currentYear, 2, 9, 23, 59).toISOString(), // March 9 (moved back one day)
      dueTime: '23:59',
      courseId: 'course-6',
      assignmentLink: '',
      location: 'MY 420',
    },
    {
      id: 'csc318-studio-4-critique',
      title: 'Studio 4 Critique',
      description: 'CSC318 Studio 4 critique.',
      dueDate: new Date(currentYear, 2, 11, 23, 59).toISOString(), // March 11
      dueTime: '23:59',
      courseId: 'course-6',
      assignmentLink: '',
    },
    {
      id: 'csc318-g2-design-exploration',
      title: 'G2: Design Exploration',
      description: 'CSC318 G2 design exploration.',
      dueDate: new Date(currentYear, 2, 5, 23, 59).toISOString(), // March 5
      dueTime: '23:59',
      courseId: 'course-6',
      assignmentLink: '',
    },
    {
      id: 'csc318-g2-anonymous-feedback',
      title: 'G2: Anonymous Feedback Form',
      description: 'CSC318 G2 anonymous feedback form.',
      dueDate: new Date(currentYear, 2, 6, 23, 59).toISOString(), // March 6
      dueTime: '23:59',
      courseId: 'course-6',
      assignmentLink: '',
    },
    {
      id: 'csc318-quiz-3',
      title: 'Quiz 3',
      description: 'CSC318 Quiz 3.',
      dueDate: new Date(currentYear, 2, 3, 23, 59).toISOString(), // March 3
      dueTime: '23:59',
      courseId: 'course-6',
      assignmentLink: '',
    },

    // JRE420 (Default) assignment
    {
      id: 'jre420-group-peer-review',
      title: 'Group Peer Review',
      description: 'JRE420 group peer review.',
      dueDate: new Date(currentYear, 3, 2, 23, 59).toISOString(), // April 2
      dueTime: '23:59',
      courseId: 'course-5',
      assignmentLink: '',
    },

    // JRE420 - other assignments
    {
      id: 'jre420-group-report',
      title: 'Group Report',
      description: 'JRE420 group report.',
      dueDate: new Date(currentYear, 2, 26, 18, 0).toISOString(), // March 26
      dueTime: '18:00',
      courseId: 'course-5',
      assignmentLink: '',
    },
    {
      id: 'jre420-individual-paper',
      title: 'Individual Paper',
      description: 'JRE420 individual paper.',
      dueDate: new Date(currentYear, 2, 12, 18, 0).toISOString(), // March 12
      dueTime: '18:00',
      courseId: 'course-5',
      assignmentLink: '',
    },
    {
      id: 'jre420-group-presentation',
      title: 'Group Presentation',
      description: 'JRE420 group presentation.',
      dueDate: new Date(currentYear, 2, 26, 18, 0).toISOString(), // March 26
      dueTime: '18:00',
      courseId: 'course-5',
      assignmentLink: '',
      location: 'MY 490',
    },

    // CSC318 - additional defaults
    {
      id: 'csc318-studio-5',
      title: 'Studio 5',
      description: 'CSC318 Studio 5 submission.',
      dueDate: new Date(currentYear, 2, 16, 9, 0).toISOString(), // March 16 (moved back one day)
      dueTime: '09:00',
      courseId: 'course-6',
      assignmentLink: '',
      location: 'MY 420',
    },
    {
      id: 'csc318-g3-high-fidelity-prototype',
      title: 'G3 - High Fidelity Prototype',
      description: 'CSC318 G3 high fidelity prototype.',
      dueDate: new Date(currentYear, 3, 1, 23, 59).toISOString(), // April 1
      dueTime: '23:59',
      courseId: 'course-6',
      assignmentLink: '',
    },
    {
      id: 'csc318-g3-contribution-plan',
      title: 'G3 Contribution Plan',
      description: 'CSC318 Group 3 contribution plan.',
      dueDate: new Date(currentYear, 2, 22, 23, 59).toISOString(), // March 22
      dueTime: '23:59',
      courseId: 'course-6',
      assignmentLink: '',
    },

    // ECE568
    {
      id: 'ece568-lab-3',
      title: 'Lab 3',
      description: 'ECE568 Lab 3.',
      dueDate: new Date(currentYear, 2, 20, 23, 59).toISOString(), // March 20
      dueTime: '23:59',
      courseId: 'course-7',
      assignmentLink: '',
    },

    // ECE316
    {
      id: 'ece316-lab-4',
      title: 'Lab 4',
      description: 'ECE316 Lab 4.',
      dueDate: new Date(currentYear, 2, 6, 23, 59).toISOString(), // March 6
      dueTime: '23:59',
      courseId: 'course-8',
      assignmentLink: '',
      location: 'SF 2201',
    },
    // Intro sample assignments for COMP 101, MATH 202, HIST 210
    {
      id: 'comp101-assignment-1',
      title: 'COMP 101 Assignment',
      description: 'Sample assignment for COMP 101.',
      // One year back
      dueDate: new Date(currentYear - 1, 2, 10, 23, 59).toISOString(),
      dueTime: '23:59',
      courseId: 'course-1',
      assignmentLink: '',
      location: '',
    },
    {
      id: 'math202-assignment-1',
      title: 'MATH 202 Assignment',
      description: 'Sample assignment for MATH 202.',
      // One year back
      dueDate: new Date(currentYear - 1, 2, 15, 23, 59).toISOString(),
      dueTime: '23:59',
      courseId: 'course-2',
      assignmentLink: '',
      location: '',
    },
    {
      id: 'hist210-assignment-1',
      title: 'HIST 210 Assignment',
      description: 'Sample assignment for HIST 210.',
      // One year back
      dueDate: new Date(currentYear - 1, 2, 20, 23, 59).toISOString(),
      dueTime: '23:59',
      courseId: 'course-3',
      assignmentLink: '',
      location: '',
    },
  ];

  return {
    view: 'month',
    currentDate: now,
    selectedDate: now,
    assignments,
    courses,
    visibleCourseIds: courses.map((c) => c.id),
    showUncategorized: true,
    selectedAssignmentId: undefined,
    isImportOpen: false,
    isChangeReviewOpen: false,
    isCreateOpen: false,
    showChangeAlert: true,
    reopenImportAfterAssignmentClose: false,
  };
};

const loadPersistedState = (): CalendarState => {
  const fallback = getDefaultState();
  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (!saved) return fallback;

  try {
    const parsed = JSON.parse(saved) as Partial<CalendarState>;

    return {
      view: parsed.view === 'month' || parsed.view === 'week' || parsed.view === 'day'
        ? parsed.view
        : fallback.view,
      currentDate: toDate(parsed.currentDate, fallback.currentDate),
      selectedDate: toDate(parsed.selectedDate, fallback.selectedDate),
      assignments: Array.isArray(parsed.assignments)
        ? parsed.assignments.map((a) => normalizeAssignment(a))
        : fallback.assignments,
      courses: (() => {
        const savedCourses = Array.isArray(parsed.courses) ? parsed.courses : [];
        const merged = new Map<string, Course>();
        // Keep defaults, but allow saved state to override or add new
        fallback.courses.forEach((c) => merged.set(c.id, c));
        savedCourses.forEach((c) => merged.set(c.id, c));
        return Array.from(merged.values());
      })(),
      visibleCourseIds: Array.isArray(parsed.visibleCourseIds)
        ? parsed.visibleCourseIds
        : fallback.visibleCourseIds,
      showUncategorized:
        typeof (parsed as any).showUncategorized === 'boolean'
          ? (parsed as any).showUncategorized
          : true,
      selectedAssignmentId: undefined,
      isImportOpen: false,
      isChangeReviewOpen: false,
      isCreateOpen: false,
      showChangeAlert: true,
      reopenImportAfterAssignmentClose: false,
    };
  } catch {
    return fallback;
  }
};

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CalendarState>(loadPersistedState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value: CalendarContextValue = useMemo(
    () => ({
      ...state,
      setView: (view) => setState((s) => ({ ...s, view })),
      setCurrentDate: (date) => setState((s) => ({ ...s, currentDate: date })),
      setSelectedDate: (date) => setState((s) => ({ ...s, selectedDate: date })),
      navigateToDate: (date) => setState((s) => ({ ...s, currentDate: date, selectedDate: date })),
      navigateToToday: () => {
        const today = new Date();
        setState((s) => ({ ...s, currentDate: today, selectedDate: today }));
      },
      navigateMonth: (direction) =>
        setState((s) => {
          const newDate = new Date(s.currentDate);
          newDate.setMonth(newDate.getMonth() + direction);
          return { ...s, currentDate: newDate };
        }),
      navigateWeek: (direction) =>
        setState((s) => {
          const newDate = new Date(s.currentDate);
          newDate.setDate(newDate.getDate() + direction * 7);
          return { ...s, currentDate: newDate };
        }),
      navigateDay: (direction) =>
        setState((s) => {
          const newDate = new Date(s.currentDate);
          newDate.setDate(newDate.getDate() + direction);
          return { ...s, currentDate: newDate };
        }),
      setVisibleCourseIds: (ids) =>
        setState((s) => ({
          ...s,
          visibleCourseIds: ids,
        })),
      setShowUncategorized: (show) =>
        setState((s) => ({
          ...s,
          showUncategorized: show,
        })),
      addAssignment: (assignment) =>
        setState((s) => ({ ...s, assignments: [...s.assignments, normalizeAssignment(assignment)] })),
      updateAssignment: (assignment) =>
        setState((s) => ({
          ...s,
          assignments: s.assignments.map((a) =>
            a.id === assignment.id ? normalizeAssignment(assignment) : a,
          ),
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
          assignments: s.assignments.map((a) =>
            a.id === id ? { ...a, status: undefined } : a,
          ),
        })),
      closeAssignment: () => setState((s) => ({ ...s, selectedAssignmentId: undefined })),
      openImport: () => setState((s) => ({ ...s, isImportOpen: true })),
      closeImport: () => setState((s) => ({ ...s, isImportOpen: false })),
      openChangeReview: () => setState((s) => ({ ...s, isChangeReviewOpen: true })),
      closeChangeReview: () => setState((s) => ({ ...s, isChangeReviewOpen: false })),
      openCreate: () => setState((s) => ({ ...s, isCreateOpen: true })),
      closeCreate: () => setState((s) => ({ ...s, isCreateOpen: false })),
      setReopenImportAfterAssignmentClose: (value) => setState((s) => ({ ...s, reopenImportAfterAssignmentClose: value })),
      markAllSeen: () =>
        setState((s) => ({
          ...s,
          assignments: s.assignments.map((a) => ({
            ...a,
            status: undefined,
          })),
        })),
      hideChangeAlert: () => setState((s) => ({ ...s, showChangeAlert: false })),
      showChangeAlertBanner: () => setState((s) => ({ ...s, showChangeAlert: true })),
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