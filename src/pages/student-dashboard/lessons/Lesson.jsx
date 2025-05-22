import React, { useState, useEffect } from 'react';
import './Lesson.css';

const Lesson = () => {
  const [lessons, setLessons] = useState([]);
  const [course, setCourse] = useState(null);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [error, setError] = useState(null);

  // Get courseId from URL query param
  const getCourseIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('courseId');
  };

  const courseId = getCourseIdFromUrl();

  // Fetch course details
  useEffect(() => {
    if (!courseId) {
      setError('Course ID not specified');
      setLoadingCourse(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/courses/${courseId}`);
        if (!res.ok) throw new Error('Failed to fetch course details');
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Fetch lessons
  useEffect(() => {
    if (!courseId) {
      setError('Course ID not specified');
      setLoadingLessons(false);
      return;
    }

    const fetchLessons = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/lessons/course/${courseId}`);
        if (!res.ok) throw new Error('Failed to fetch lessons');
        const data = await res.json();
        setLessons(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingLessons(false);
      }
    };

    fetchLessons();
  }, [courseId]);

  if (loadingCourse || loadingLessons) {
    return <div className="lesson-container">Loading course and lessons...</div>;
  }

  if (error) {
    return <div className="lesson-container error">{error}</div>;
  }

  return (
    <div className="lesson-container">
      {course && (
        <>
          <h2>{course.title}</h2>
         
        </>
      )}
      {lessons.length === 0 ? (
        <div>No lessons found for this course.</div>
      ) : (
        <ul className="lesson-list">
          {lessons.map((lesson) => (
            <li key={lesson.id} className="lesson-item">
              <h3>{lesson.title}</h3>
              <p>{course.description}</p>

              <div className="lesson-actions">
                {lesson.content && (
                  <a
                    href={lesson.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lesson-link"
                  >
                    📘 Read Content
                  </a>
                )}
                {lesson.video_url && (
                  <a
                    href={lesson.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lesson-link"
                  >
                    🎥 Watch Video
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Lesson;
