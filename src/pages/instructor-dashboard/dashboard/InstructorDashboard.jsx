import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './InstructorDashboard.css';

const InstructorDashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructorId, setInstructorId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.role !== 'instructor') {
        navigate('/');
        return;
      }

      setInstructorId(decoded.id);
    } catch (error) { 
      console.error('Invalid token');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn) {
      sessionStorage.removeItem('justLoggedIn');
    }
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          instructor_id: instructorId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      const data = await response.json();
      alert(`✅ Course "${data.title}" created successfully!`);

      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to create course.');
    }
  };

  const handleShowCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data);
      setShowDropdown(true);
    } catch (err) {
      console.error('Error fetching courses:', err);
      alert('❌ Failed to fetch courses.');
    }
  };

  return (
    <div className="create-course-container">
      <h2>Create a New Course</h2>
      <form onSubmit={handleCreateCourse} className="course-form">
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Course Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Create Course</button>
      </form>

      <hr />

      <button onClick={handleShowCourses} className="show-courses-button">
        📚 Show All Courses
      </button>

    {showDropdown && (
  <div className="dropdown-container">
    <label htmlFor="course-select"><strong>Select a Course:</strong></label>
    <select
      id="course-select"
      value={selectedCourse}
      onChange={(e) => setSelectedCourse(e.target.value)}
    >
      <option value="">-- Choose a course --</option>
      {courses.map(course => (
        <option key={course.id} value={course.id}>
          {course.title}
        </option>
      ))}
    </select>

    {selectedCourse && (
      <button
        className="add-lesson-button"
        onClick={() => navigate(`/lesson-add/${selectedCourse}`)}
      >
        ➕ Add Lesson
      </button>
    )}
  </div>
)}
    </div>
  );
};

export default InstructorDashboard;
