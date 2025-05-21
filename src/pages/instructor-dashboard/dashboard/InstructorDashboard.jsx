import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './InstructorDashboard.css';

const InstructorDashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructorId, setInstructorId] = useState(null);
  const navigate = useNavigate();

  // Run once when component loads
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login'); // 👈 Don't alert before navigating
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.role !== 'instructor') {
        navigate('/'); // 👈 Redirect non-instructors
        return;
      }

      setInstructorId(decoded.id); // ✅ Store user ID for course creation
    } catch (error) {
      console.error('Invalid token');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  // Optional: Welcome message after login
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

      // Reset form
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to create course.');
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
    </div>
  );
};

export default InstructorDashboard;
