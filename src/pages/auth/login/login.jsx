import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {

const role = data.user.role;
console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@${role}@@@@@@@@@@@@@@@@`)

        setMessage('Login successful!');

if(data.user.role==="student"){
navigate('/student-dashboard')
}else if(data.user.role==="instructor"){
 // After successful login
localStorage.setItem('token', data.token);
sessionStorage.setItem('justLoggedIn', 'true');
navigate('/instructor-dashboard');
}


        // Store token if needed
        // localStorage.setItem('token', data.token);
      } else {
        setMessage(data.message || 'Login failed');
        navigate('./register')
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again later.');
    }

    setTimeout(() => {
      setMessage('');
    }, 2000);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />

        <button type="submit">Login</button>

        {message && <p className="message">{message}</p>}

        <div className="register-link">
          <p>Don't have an account?</p>
          <button type="button" onClick={() => navigate('/')}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
