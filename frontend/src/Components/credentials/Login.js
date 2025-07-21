// frontend/src/Components/credentials/Login.js
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthWrapper>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <input type="email" name="email" placeholder="Email" value={inputs.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={inputs.password} onChange={handleChange} required />
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </AuthWrapper>
  );
}

const AuthWrapper = styled.div`
  min-width: 340px;
  margin: 6rem auto;
  padding: 2rem 2.5rem;
  border-radius: 1.2rem;
  background: #fcf6f9;
  box-shadow: 0 1px 15px rgba(0,0,0,0.06);
  h2 {
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }
  form {
    display: flex; flex-direction: column; gap: 1.2rem;
    input { padding: 1rem; border-radius: 0.5rem; border: 1px solid #eee; }
    button { background: var(--color-accent); color: #fff; border: none; border-radius: 0.5rem; padding: 1rem; font-weight: bold; cursor: pointer; }
    .error { color: red; }
    a { color: var(--color-accent); }
  }
`;

export default Login;
