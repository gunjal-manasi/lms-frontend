import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LessonAdd.css';

const LessonAdd = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleAddLesson = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_id: parseInt(courseId),
          title,
          content,
          video_url: videoUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add lesson');
      }

      alert('✅ Lesson added successfully!');
      navigate(-1); // go back
    } catch (err) {
      console.error(err);
      alert('❌ Failed to add lesson.');
    }
  };

  return (
    <div className="lesson-add-container">
      <h2>Add Lesson to Course ID: {courseId}</h2>
      <form onSubmit={handleAddLesson} className="lesson-form">
        <input
          type="text"
          placeholder="Lesson Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Content (e.g., resource link)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <button type="submit">Add Lesson</button>
      </form>
    </div>
  );
};

export default LessonAdd;
