// StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingInstructor, setLoadingInstructor] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    setSelectedInstructor('');
    setLoadingInstructor(true);

    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}/instructor`);
      const data = await response.json();

      if (data && data.name) {
        setSelectedInstructor(data.name);
      } else {
        setSelectedInstructor('Instructor not found');
      }
    } catch (error) {
      console.error('Error fetching instructor:', error);
      setSelectedInstructor('Error loading instructor');
    } finally {
      setLoadingInstructor(false);
    }
  };

  const handleLearnClick = () => {
    if (!selectedCourseId) {
      alert('Please select a course first!');
      return;
    }
    // Open new window/tab with courseId param
    window.open(`/lessons.html?courseId=${selectedCourseId}`, '_blank');
  };

  return (
    <div className="dashboard-container">
      <h2>Student Dashboard</h2>

      {loadingCourses ? (
        <p>Loading courses...</p>
      ) : (
        <>
          <div className="dropdown-group">
            <label>Select Course:</label>
            <select onChange={handleCourseChange} value={selectedCourseId}>
              <option value="" disabled>Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>

          <div className="dropdown-group">
            <label>Instructor:</label>
            <select value={selectedInstructor} disabled>
              <option>{loadingInstructor ? 'Loading instructor...' : (selectedInstructor || 'Select a course first')}</option>
            </select>
          </div>

          <div className="button-group">
            <button className="learn-button" onClick={handleLearnClick}>Learn</button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
