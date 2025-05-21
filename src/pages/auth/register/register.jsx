import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful!');
        setForm({ name: '', email: '', password: '', role: 'student' });

        setTimeout(() => {
          setMessage('');
          navigate('/login'); // Redirect after success
        }, 2000);
      } else {
        setMessage(data.message || 'Registration failed');
        clearMessage();
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again later.');
      clearMessage();
    }
  };

  const clearMessage = () => {
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="role">Role</label>
        <select id="role" name="role" value={form.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>

        <button type="submit">Register</button>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="login-button"
        >
          Go to Login
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
