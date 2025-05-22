// LessonPage.jsx
import React, { useState, useEffect } from 'react';
import './Lesson.css';

const Lesson = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get courseId from URL query param
  const getCourseIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('courseId');
  };

  const courseId = getCourseIdFromUrl();

  useEffect(() => {
    if (!courseId) {
      setError('Course ID not specified');
      setLoading(false);
      return;
    }

    const fetchLessons = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/lessons/course/${courseId}`);
        if (!res.ok) throw new Error('Failed to fetch lessons');
        const data = await res.json();
        setLessons(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [courseId]);

  if (loading) return <div className="lesson-container">Loading lessons...</div>;
  if (error) return <div className="lesson-container error">{error}</div>;
  if (lessons.length === 0) return <div className="lesson-container">No lessons found for this course.</div>;

  return (
  <div className="lesson-container">
  <h2>Lessons for Course ID: {courseId}</h2>
  <ul className="lesson-list">
    {lessons.map(lesson => (
      <li key={lesson.id} className="lesson-item">
        <h3>{lesson.title}</h3>
        <p>{lesson.description || 'No description provided.'}</p>

        <div className="lesson-actions">
          {lesson.content && (
            <a href={lesson.content} target="_blank" rel="noopener noreferrer" className="lesson-link">
              📘 Read Content
            </a>
          )}
          {lesson.video_url && (
            <a href={lesson.video_url} target="_blank" rel="noopener noreferrer" className="lesson-link">
              🎥 Watch Video
            </a>
          )}
        </div>
      </li>
    ))}
  </ul>
</div>

  );
};

export default Lesson;
