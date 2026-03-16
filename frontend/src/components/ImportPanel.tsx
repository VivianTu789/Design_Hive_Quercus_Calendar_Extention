import { useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import type { Assignment } from '../models/assignment';
import { getCourseColor } from '../features/courses/courseColors';

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

  // Sort assignments within each course by due date (earliest first), then time.
  const groups = Array.from(map.values());
  groups.forEach((group) => {
    group.assignments.sort((a, b) => {
      const aDate = new Date(a.dueDate).getTime();
      const bDate = new Date(b.dueDate).getTime();
      if (aDate !== bDate) return aDate - bDate;

      const aTime = a.dueTime ?? '23:59';
      const bTime = b.dueTime ?? '23:59';
      return aTime.localeCompare(bTime);
    });
  });

  return groups;
};

// Static import catalog: assignments that are available via the Import Panel.
const IMPORT_ASSIGNMENTS: Assignment[] = [
  // ECE496 - Design Project
  {
    id: 'imp-ece496-final-report',
    title: 'Final Report',
    description: 'ECE496 final design project report.',
    dueDate: new Date(new Date().getFullYear(), 2, 21, 23, 59).toISOString(),
    dueTime: '23:59',
    courseId: 'course-4',
    assignmentLink: '',
  },
  {
    id: 'imp-ece496-design-fair',
    title: 'Design Fair',
    description: 'ECE496 design fair presentation.',
    dueDate: new Date(new Date().getFullYear(), 2, 25, 23, 59).toISOString(),
    dueTime: '23:59',
    courseId: 'course-4',
    assignmentLink: '',
    location: 'MY 150',
  },
  {
    id: 'imp-ece496-final-design-review',
    title: 'Final Design Review with Supervisor',
    description: 'ECE496 final design review with supervisor.',
    dueDate: new Date(new Date().getFullYear(), 2, 27, 23, 59).toISOString(), // March 27
    dueTime: '23:59',
    courseId: 'course-4',
    assignmentLink: '',
    location: 'BA 4128',
  },
  // JRE420
  {
    id: 'imp-jre420-group-report',
    title: 'Group Report',
    description: 'JRE420 group report.',
    dueDate: new Date(new Date().getFullYear(), 2, 26, 18, 0).toISOString(),
    dueTime: '18:00',
    courseId: 'course-5',
    assignmentLink: '',
  },
  {
    id: 'imp-jre420-individual-paper',
    title: 'Individual Paper',
    description: 'JRE420 individual paper.',
    dueDate: new Date(new Date().getFullYear(), 2, 12, 18, 0).toISOString(), // March 12
    dueTime: '18:00',
    courseId: 'course-5',
    assignmentLink: '',
  },
  {
    id: 'imp-jre420-group-presentation',
    title: 'Group Presentation',
    description: 'JRE420 group presentation.',
    dueDate: new Date(new Date().getFullYear(), 2, 26, 18, 0).toISOString(),
    dueTime: '18:00',
    courseId: 'course-5',
    assignmentLink: '',
  },
  {
    id: 'imp-jre420-group-peer-review',
    title: 'Group Peer Review',
    description: 'JRE420 group peer review.',
    dueDate: new Date(new Date().getFullYear(), 3, 2, 23, 59).toISOString(), // April 2
    dueTime: '23:59',
    courseId: 'course-5',
    assignmentLink: '',
  },
  // CSC318
  {
    id: 'imp-csc318-studio-5',
    title: 'Studio 5',
    description: 'CSC318 Studio 5 submission.',
    dueDate: new Date(new Date().getFullYear(), 2, 16, 9, 0).toISOString(), // March 16 (moved back one day)
    dueTime: '09:00',
    courseId: 'course-6',
    assignmentLink: '',
  },
  {
    id: 'imp-csc318-studio-5-critique',
    title: 'Studio 5 Critique',
    description: 'CSC318 Studio 5 critique.',
    dueDate: new Date(new Date().getFullYear(), 2, 18, 23, 59).toISOString(),
    dueTime: '23:59',
    courseId: 'course-6',
    assignmentLink: '',
  },
  {
    id: 'imp-csc318-g3-contribution-plan',
    title: 'G3 Contribution Plan',
    description: 'CSC318 Group 3 contribution plan.',
    dueDate: new Date(new Date().getFullYear(), 2, 22, 23, 59).toISOString(),
    dueTime: '23:59',
    courseId: 'course-6',
    assignmentLink: '',
  },
  {
    id: 'imp-csc318-g3-high-fidelity-prototype',
    title: 'G3 - High Fidelity Prototype',
    description: 'CSC318 G3 high fidelity prototype.',
    dueDate: new Date(new Date().getFullYear(), 3, 1, 23, 59).toISOString(), // April 1
    dueTime: '23:59',
    courseId: 'course-6',
    assignmentLink: '',
  },
  {
    id: 'imp-csc318-studio-6',
    title: 'Studio 6',
    description: 'CSC318 Studio 6.',
    dueDate: new Date(new Date().getFullYear(), 2, 30, 23, 59).toISOString(), // March 30 (moved back one day)
    dueTime: '23:59',
    courseId: 'course-6',
    assignmentLink: '',
  },
  {
    id: 'imp-csc318-studio-6-critique',
    title: 'Studio 6 Critique',
    description: 'CSC318 Studio 6 critique.',
    dueDate: new Date(new Date().getFullYear(), 3, 1, 23, 59).toISOString(), // April 1
    dueTime: '23:59',
    courseId: 'course-6',
    assignmentLink: '',
  },
  {
    id: 'imp-csc318-studio-4',
    title: 'Studio 4',
    description: 'CSC318 Studio 4.',
    dueDate: new Date(new Date().getFullYear(), 2, 9, 23, 59).toISOString(), // March 9 (moved back one day)
    dueTime: '23:59',
    courseId: 'course-6',
    assignmentLink: '',
  },
  {
    id: 'imp-csc318-studio-4-critique',
    title: 'Studio 4 Critique',
    description: 'CSC318 Studio 4 critique.',
    dueDate: new Date(new Date().getFullYear(), 2, 11, 23, 59).toISOString(), // March 11
    dueTime: '23:59',
    courseId: 'course-6',
    assignmentLink: '',
  },
  {
    id: 'imp-csc318-g2-design-exploration',
    title: 'G2: Design Exploration',
    description: 'CSC318 G2 design exploration.',
    dueDate: new Date(new Date().getFullYear(), 2, 5, 23, 59).toISOString(), // March 5
    dueTime: '23:59',
    courseId: 'course-6',
    assignmentLink: '',
  },
  {
    id: 'imp-csc318-g2-anonymous-feedback',
    title: 'G2: Anonymous Feedback Form',
    description: 'CSC318 G2 anonymous feedback form.',
    dueDate: new Date(new Date().getFullYear(), 2, 6, 23, 59).toISOString(), // March 6
    dueTime: '23:59',
    courseId: 'course-6',
    assignmentLink: '',
  },
  {
    id: 'imp-csc318-quiz-3',
    title: 'Quiz 3',
    description: 'CSC318 Quiz 3.',
    dueDate: new Date(new Date().getFullYear(), 2, 3, 23, 59).toISOString(), // March 3
    dueTime: '23:59',
    courseId: 'course-6',
    assignmentLink: '',
  },
  // ECE568
  {
    id: 'imp-ece568-lab-3',
    title: 'Lab 3',
    description: 'ECE568 Lab 3.',
    dueDate: new Date(new Date().getFullYear(), 2, 20, 23, 59).toISOString(), // March 20
    dueTime: '23:59',
    courseId: 'course-7', // ECE568
    assignmentLink: '',
  },
  {
    id: 'imp-ece568-midterm',
    title: 'Midterm',
    description: 'ECE568 midterm.',
    dueDate: new Date(new Date().getFullYear(), 2, 4, 23, 59).toISOString(), // March 4
    dueTime: '23:59',
    courseId: 'course-7',
    assignmentLink: '',
    location: 'SF 3202',
  },
  // ECE316
  {
    id: 'imp-ece316-term-test-2',
    title: 'Term Test 2',
    description: 'ECE316 Term Test 2.',
    dueDate: new Date(new Date().getFullYear(), 2, 12, 23, 59).toISOString(), // March 12
    dueTime: '23:59',
    courseId: 'course-8', // ECE316
    assignmentLink: '',
    location: 'EX 310',
  },
  {
    id: 'imp-ece316-lab-4',
    title: 'Lab 4',
    description: 'ECE316 Lab 4.',
    dueDate: new Date(new Date().getFullYear(), 2, 6, 23, 59).toISOString(), // March 6
    dueTime: '23:59',
    courseId: 'course-8',
    assignmentLink: '',
    location: 'SF 2201',
  },
  {
    id: 'imp-ece316-lab-5',
    title: 'Lab 5',
    description: 'ECE316 Lab 5.',
    dueDate: new Date(new Date().getFullYear(), 2, 20, 23, 59).toISOString(), // March 20
    dueTime: '23:59',
    courseId: 'course-8',
    assignmentLink: '',
    location: 'SF 2201',
  },
];

export const ImportPanel = () => {
  const { assignments, courses, isImportOpen, closeImport, openAssignment, setReopenImportAfterAssignmentClose, addAssignment } = useCalendar();
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [selectedAssignments, setSelectedAssignments] = useState<Set<string>>(new Set());
  const [showHelp, setShowHelp] = useState(false);

  if (!isImportOpen) return null;
  const groups = groupByCourse(IMPORT_ASSIGNMENTS, courses);

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

    let importedCount = 0;

    selectedAssignments.forEach((id) => {
      const toImport = IMPORT_ASSIGNMENTS.find((a) => a.id === id);
      if (!toImport) return;

      const alreadyExists = assignments.some(
        (a) =>
          a.courseId === toImport.courseId &&
          a.title === toImport.title &&
          a.dueDate === toImport.dueDate &&
          a.dueTime === toImport.dueTime,
      );

      if (!alreadyExists) {
        addAssignment({ ...toImport, status: 'new' as const });
        importedCount += 1;
      }
    });

    closeImport();
    alert(
      importedCount === 0
        ? 'No new assignments were imported (they already exist in your calendar).'
        : `${importedCount} assignment${importedCount > 1 ? 's' : ''} imported successfully!`,
    );
  };

  

  return (
    <div className="modal-backdrop">
      <div className="modal large">
        <header
          className="modal-header"
          style={{
            backgroundColor: '#0b3b76',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px 24px',
            position: 'relative',
            borderRadius: '12px 12px 0 0',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '24px',
              textAlign: 'center',
              flex: 1,
              color: 'white',
            }}
          >
            Import Details
          </h2>
          <button
            type="button"
            onClick={() => setShowHelp(true)}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '28px',
              height: '28px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.8)',
              backgroundColor: 'transparent',
              color: 'white',
              fontWeight: 700,
              fontSize: '16px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
            aria-label="Import help"
          >
            ?
          </button>
          <button type="button" className="close-button" onClick={closeImport} aria-label="Close">
            ×
          </button>
        </header>
        {/* <section className="modal-body">
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
        </section> */}
        <section className="modal-body" style={{padding: '24px'}}>
          {/* Table Header */}
          <div className="table-header" style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr 100px 80px 80px',
            gap: '12px',
            padding: '12px 0',
            fontWeight: '600',
            color: '#374151',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <span>Course</span>
            <span>Item</span>
            <span>Due Date</span>
            <span>Time</span>
            <span>Details</span>
          </div>

          {/* Course Groups with Dropdown */}
          {groups.map((group) => {
            const courseColor = getCourseColor(group.courseId);
            const allSelected = group.assignments.every((a) => selectedAssignments.has(a.id));

            return (
             <div key={group.courseId} className="course-section">
              {/* Course Row Header */}
              <div
                className="course-header"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 0',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    if (e.target.checked) {
                      group.assignments.forEach((a) =>
                        setSelectedAssignments((prev) => new Set(prev).add(a.id)),
                      );
                    } else {
                      group.assignments.forEach((a) =>
                        setSelectedAssignments((prev) => {
                          const next = new Set(prev);
                          next.delete(a.id);
                          return next;
                        }),
                      );
                    }
                  }}
                  style={{
                    width: '20px',
                    height: '20px',
                    accentColor: allSelected ? courseColor : '#0b3b76',
                    borderColor: allSelected ? courseColor : '#bfdbfe',
                  }}
                />
                <span style={{ fontWeight: '600', color: courseColor }}>{group.courseName}</span>
                <button
                  type="button"
                  style={{
                    marginLeft: 'auto',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    width: '28px',
                    height: '28px',
                    borderRadius: '999px',
                    backgroundColor: '#e5f0ff',
                    color: '#0b3b76',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #bfdbfe',
                  }}
                  onClick={() => toggleCourse(group.courseId)}
                >
                  {expandedCourses.has(group.courseId) ? '▾' : '▸'}
                </button>
              </div>

              {/* Expandable Assignments Table Rows */}
              {expandedCourses.has(group.courseId) &&
                group.assignments.map((assignment) => {
                  const isChecked = selectedAssignments.has(assignment.id);
                  return (
                    <label
                      key={assignment.id}
                      className="assignment-row"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '120px 1fr 100px 80px 80px',
                        gap: '12px',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom: '1px solid #f3f4f6',
                      }}
                    >
                      {/* spacer to indent relative to course checkbox */}
                      <span />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAssignment(assignment.id)}
                          style={{
                            width: '20px',
                            height: '20px',
                            accentColor: isChecked ? courseColor : '#0b3b76',
                            borderColor: isChecked ? courseColor : '#bfdbfe',
                          }}
                        />
                        <span style={{ fontWeight: '500' }}>{assignment.title}</span>
                      </div>
                      <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                      <span>{assignment.dueTime}</span>
                      <button
                        type="button"
                        onClick={() => {
                          closeImport();
                          setReopenImportAfterAssignmentClose(true);
                          openAssignment(assignment.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          color: courseColor,
                          textDecoration: 'underline',
                          fontSize: 'inherit',
                        }}
                      >
                        View
                      </button>
                    </label>
                  );
                })}
            </div>
          );
        })}
        </section>
        <footer className="modal-footer">
          <button type="button" className="primary" onClick={handleImport}>
            Confirm
          </button>
        </footer>
      </div>
      {showHelp && (
        <div className="modal-backdrop">
          <div className="modal">
            <header className="modal-header">
              <h2>Import Help</h2>
              <button type="button" className="close-button" onClick={() => setShowHelp(false)} aria-label="Close">
                ×
              </button>
            </header>
            <section className="modal-body">
              <p>
                To import deadlines from your course syllabus into the calendar that are not included
                by default, you can select the specific items you want to bring in.
              </p>
              <p>
                Use the checkboxes next to each assignment to import individual deadlines, or use
                the checkbox in the course header to include all assignments for that course.
              </p>
              <p>
                You can expand or collapse a course to see its assignments by clicking the course
                header or the expand arrow.
              </p>
              <p>
                When you are satisfied with your selections, press the <strong>Confirm</strong>{' '}
                button to finalize the import and add the selected deadlines to your calendar.
              </p>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

