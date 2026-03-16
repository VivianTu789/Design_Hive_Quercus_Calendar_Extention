export const getCourseColor = (courseId: string): string => {
  switch (courseId) {
    case 'course-6': // CSC318
      return '#22c55e';
    case 'course-5': // JRE420
      return '#fb923c';
    case 'course-7': // ECE568
      return '#ec4899';
    case 'course-8': // ECE316
      return '#3b82f6';
    case 'course-4': // ECE496
      return '#8b5cf6';
    default:
      return '#6b7280';
  }
};