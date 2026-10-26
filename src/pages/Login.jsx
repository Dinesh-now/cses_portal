
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const username = formData.username.trim();
    const password = formData.password;

    if (!username || !password.trim()) {
      setMessageType("error");
      setMessage("Please enter both username and password.");
      return;
    }

    // Demo credentials only. Replace with backend authentication later.
    if (username === "admin" && password === "admin123") {
      sessionStorage.setItem("isLoggedIn", "true");

      navigate("/dashboard", { replace: true });
    } else {
      setMessageType("error");
      setMessage("Invalid username or password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>CSES Login</h1>

        <p>Sign in to the Child Support Enforcement System.</p>

        {message && (
          <div
            className={`login-message ${
              messageType === "success"
                ? "login-message-success"
                : "login-message-error"
            }`}
            role="status"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Password</label>

            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
