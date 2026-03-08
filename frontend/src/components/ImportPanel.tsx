import { useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import type { Assignment } from '../models/assignment';

interface CourseGroup {
  courseId: string;
  courseName: string;
  assignments: Assignment[];
}

const groupByCourse = (assignments: Assignment[], courses: { id: string; name: string }[]) => {
  const map = new Map<string, CourseGroup>();
  for (const assignment of assignments) {
    const course = courses.find((c) => c.id === assignment.courseId);
    const id = course?.id ?? 'unknown';
    const name = course?.name ?? 'Unknown course';
    if (!map.has(id)) {
      map.set(id, { courseId: id, courseName: name, assignments: [] });
    }
    map.get(id)!.assignments.push(assignment);
  }
  return Array.from(map.values());
};

export const ImportPanel = () => {
  const { assignments, courses, isImportOpen, closeImport } = useCalendar();
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [selectedAssignments, setSelectedAssignments] = useState<Set<string>>(new Set());

  if (!isImportOpen) return null;

  const groups = groupByCourse(assignments, courses);

  const toggleCourse = (courseId: string) => {
    setExpandedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) {
        next.delete(courseId);
      } else {
        next.add(courseId);
      }
      return next;
    });
  };

  const toggleAssignment = (assignmentId: string) => {
    setSelectedAssignments((prev) => {
      const next = new Set(prev);
      if (next.has(assignmentId)) {
        next.delete(assignmentId);
      } else {
        next.add(assignmentId);
      }
      return next;
    });
  };

  const handleImport = () => {
    // Placeholder: in a real app, this would push selected assignments into the calendar
    // For now we just close the panel to simulate completion.
    closeImport();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal large">
        <header className="modal-header">
          <h2>Import Assignments</h2>
          <button type="button" className="ghost" onClick={closeImport}>
            Close
          </button>
        </header>
        <section className="modal-body">
          {groups.map((group) => (
            <div key={group.courseId} className="course-group">
              <button
                type="button"
                className="course-row"
                onClick={() => toggleCourse(group.courseId)}
              >
                <span>{expandedCourses.has(group.courseId) ? '▾' : '▸'}</span>
                <span>{group.courseName}</span>
              </button>
              {expandedCourses.has(group.courseId) && (
                <div className="assignment-list">
                  {group.assignments.map((assignment) => (
                    <label key={assignment.id} className="assignment-row">
                      <input
                        type="checkbox"
                        checked={selectedAssignments.has(assignment.id)}
                        onChange={() => toggleAssignment(assignment.id)}
                      />
                      <span>{assignment.title}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          {groups.length === 0 && (
            <p className="empty-state">
              No assignments to import yet. This will list assignments by course in the future.
            </p>
          )}
        </section>
        <footer className="modal-footer">
          <button type="button" className="primary" onClick={handleImport}>
            Import selected
          </button>
        </footer>
      </div>
    </div>
  );
};

