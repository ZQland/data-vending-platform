'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter hook for navigation
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const router = useRouter(); // Get the router object

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Send the login request to the API
      const response = await axios.post('/api/auth/login', { email, password });

      // Store the JWT token in localStorage
      localStorage.setItem('token', response.data.token);

      // Navigate to the dashboard after a successful login
      router.push('/dashboard');
    } catch (error) {
      setErrorMessage('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      <style jsx>{`
        form {
          margin-top: 20px;
        }
        div {
          margin-bottom: 10px;
        }
        input {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          padding: 10px 20px;
          background-color: blue;
          color: white;
          border: none;
          cursor: pointer;
        }
        button:hover {
          background-color: darkblue;
        }
      `}</style>
    </div>
  );
}
