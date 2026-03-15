import { useEffect, useState } from 'react';
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
  const { assignments, courses, isImportOpen, closeImport, addAssignment } = useCalendar();
  const [sourceType, setSourceType] = useState<'quercus' | 'ics' | 'google'>('quercus');
  const [previewAssignments, setPreviewAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [selectedAssignments, setSelectedAssignments] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPreviewAssignments([
        {
          id: 'mock1',
          title: 'Quercus Assignment 1',
          description: 'Mock import',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          dueTime: '23:59',
          courseId: courses[0]?.id || courses[0]?.id || 'course-1',
          assignmentLink: ''
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (!isImportOpen) return null;
  const groups = previewAssignments.length > 0 ? groupByCourse(previewAssignments, courses) : groupByCourse(assignments, courses);

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
    if (selectedAssignments.size === 0) {
      alert('Select assignments to import!');
      return;
    }
    selectedAssignments.forEach(id => {
      const toImport = previewAssignments.find(a => a.id === id) || 
                       assignments.find(a => a.id === id);
      if (toImport) {
        addAssignment(toImport);  // adds to calendar + saves localStorage
      }
    });
    closeImport();
    alert(`${selectedAssignments.size} imported successfully!`);
  };

  

  return (
    <div className="modal-backdrop">
      <div className="modal large">
        <header className="modal-header" style={{
          backgroundColor: '#0b3b76',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '16px 24px',
          position: 'relative',
          borderRadius: '12px 12px 0 0'
        }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: '24px', 
          // fontWeight: 'bold',
          textAlign: 'center',
          flex: 1,
          color: 'white' 
        }}>Import Details</h2>
          <button type="button" className="close-btn" onClick={closeImport}
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '28px', 
            color: 'white', 
            cursor: 'pointer' 
          }}>
            X
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

