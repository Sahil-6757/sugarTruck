import React, { useState } from "react";
import "../css/auth.css";
import axios from "axios";
import {
  FaSeedling,
  FaIndustry,
  FaUsers,
  FaTruck,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const roles = [
  { name: "Farmer", icon: <FaSeedling /> },
  { name: "Factory Admin", icon: <FaIndustry /> },
  { name: "Field Staff", icon: <FaUsers /> },
  { name: "Driver", icon: <FaTruck /> },
];

const Auth = () => {
  const navigation = useNavigate();
  const [tab, setTab] = useState("login"); // login | register
  const [role, setRole] = useState("Farmer");
  const [method, setMethod] = useState("otp"); // otp | email
  const [emailOtp, setEmailOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "email") {
      setOtpSent(false);
      setEmailVerified(false);
      setEmailOtp("");
      setErrors((prev) => ({ ...prev, emailOtp: "" }));
    }
  };

  const validateRegister = () => {
    const nextErrors = {};

    if (!role) nextErrors.role = "Please select role";
    if (!form.name.trim()) nextErrors.name = "Full name is required";
    if (!form.password) nextErrors.password = "Password is required";

    if (method === "otp" && !form.phone.trim()) {
      nextErrors.phone = "Mobile number is required";
    }

    if (method === "email") {
      if (!form.email.trim()) {
        nextErrors.email = "Email is required";
      }
      if (!emailVerified) {
        nextErrors.emailOtp = "Please verify email OTP";
      }
    }

    return nextErrors;
  };

  const sendOTP = () => {
    if (!form.email) return alert("Enter email");
    axios.post("http://localhost:8000/send-email-otp", { email: form.email })
      .then(() => {
        setOtpSent(true);
        setEmailVerified(false);
        alert("OTP sent to " + form.email);
      })
      .catch((error) => {
        alert("Error sending OTP: " + (error?.response?.data?.message || "Unable to send OTP"));
      });
  };

  const verifyEmailOtp = () => {
    if (!form.email) return alert("Enter email");
    if (!emailOtp) return alert("Enter OTP");

    axios
      .post("http://localhost:8000/verify-email-otp", {
        email: form.email,
        otp: emailOtp,
      })
      .then(() => {
        setEmailVerified(true);
        alert("Email verified successfully");
        setEmailOtp("");
        setOtpSent(false);
        setErrors((prev) => ({ ...prev, email: "", emailOtp: "" }));
      })
      .catch((error) => {
        setEmailVerified(false);
        alert(error?.response?.data?.message || "Invalid OTP");
      });
  };

  const handleSubmit = () => {
    if (tab === "register") {
      const registerErrors = validateRegister();
      setErrors(registerErrors);
      if (Object.keys(registerErrors).length > 0) {
        return alert("Please fill all required fields");
      }
    }

    if (tab === "login" && method === "email" && !form.password) {
      return alert("Enter password");
    }

    const payload = {
      role,
      type: tab,
      loginMethod: method,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.toLowerCase().trim(),
      password: form.password,
    };

    const endpoint =
      tab === "login"
        ? "/login"
        : role === "Farmer"
          ? "/register-farmer"
          : role === "Factory Admin"
            ? "/register-factory"
            : role === "Field Staff"
              ? "/register-field-staff"
              : "/register-driver";

    axios
      .post(`http://localhost:8000${endpoint}`, payload)
      .then((response) => {
        console.log(response.data);
        const user = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        if (user.role === "Farmer") {
          navigation("/farmer");
        }
        else if (user.role === "Factory Admin") {
          navigation("/farmer-admin-panel");
        }
        else if (user.role === "Field Staff") {
          navigation("/field");
        }
        else if (user.role === "Driver") {
          navigation("/driver");
        }
        setTab("login")
        setErrors({});
        setForm({
          name: "",
          phone: "",
          email: "",
          password: "",
        });
      })
      .catch((error) => {
        alert(error?.response?.data || "Request failed");
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* Back */}
        <div className="back" onClick={() => navigation("/")}>← Back to Home</div>

        {/* Header */}
        <h2>🌱 SugarTrack</h2>
        <p>{tab === "login" ? "Sign in to your account" : "Create a new account"}</p>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={tab === "login" ? "active" : ""}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={tab === "register" ? "active" : ""}
            onClick={() => setTab("register")}
          >
            Register
          </button>
        </div>

        {/* REGISTER ROLE SELECT */}
        {tab === "register" && (
          <>
            <p className="label">Select Role</p>
            <div className="role-grid">
              {roles.map((r) => (
                <div
                  key={r.name}
                  className={`role-card ${role === r.name ? "selected" : ""}`}
                  onClick={() => setRole(r.name)}
                >
                  <span style={{ marginRight: 5, display: "inline" }}>
                    {r.icon}
                  </span>
                  <span>{r.name}</span>
                </div>
              ))}
            </div>
            {errors.role && <p className="error-text">{errors.role}</p>}
          </>
        )}

        {/* LOGIN ROLE DROPDOWN */}
        {tab === "login" && (
          <>
            <p className="label">Login as</p>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input"
            >
              {roles.map((r) => (
                <option key={r.name}>{r.name}</option>
              ))}
            </select>
          </>
        )}

        {/* METHOD SWITCH */}
        <div className="method">
          <button
            className={method === "otp" ? "active" : ""}
            onClick={() => setMethod("otp")}
          >
            <FaPhone /> Mobile OTP
          </button>
          <button
            className={method === "email" ? "active" : ""}
            onClick={() => setMethod("email")}
          >
            <FaEnvelope /> Email
          </button>
        </div>

        {/* FORM */}
        {tab === "register" && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className={`input ${errors.name ? "input-error" : ""}`}
              onChange={handleChange}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </>
        )}

        {method === "otp" ? (
          <div className="phone-box">
            <input
              type="text"
              name="phone"
              placeholder="Mobile Number"
              className={`input ${errors.phone ? "input-error" : ""}`}
              onChange={handleChange}
            />
            {tab === "register" && (
              <button className="otp-btn" onClick={sendOTP}>
                Send OTP
              </button>
            )}
          </div>
        ) :
          (
            <>
              <div className="phone-box">

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className={`input ${errors.email ? "input-error" : ""}`}
                  onChange={handleChange}
                />
                {tab === "register" && (
                  <button className="otp-btn" onClick={sendOTP}>
                    Send email otp
                  </button>
                )}
              </div>
              {tab === "register" && otpSent && !emailVerified && (
                <div className="phone-box otp-verify-row">
                  <input
                    type="text"
                    name="emailOtp"
                    placeholder="Enter OTP"
                    className="input"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                  />
                  <button className="otp-btn" onClick={verifyEmailOtp}>
                    Verify OTP
                  </button>
                </div>
              )}
              {emailVerified && <p className="verify-success">Email verified</p>}
              {errors.email && <p className="error-text">{errors.email}</p>}
              {errors.emailOtp && <p className="error-text">{errors.emailOtp}</p>}
              {tab === "login" && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input"
                  onChange={handleChange}
                />
              )}
            </>
          )}

        {tab === "register" && (
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            className={`input ${errors.password ? "input-error" : ""}`}
            onChange={handleChange}
          />
        )}
        {errors.password && <p className="error-text">{errors.password}</p>}

        {/* SUBMIT */}
        <button className="submit-btn" onClick={handleSubmit}>
          {tab === "login" ? "Sign In" : "Create Account"}
        </button>

        {/* FOOTER */}
        <p className="switch">
          {tab === "login"
            ? "Don't have an account? Switch to Register"
            : "Already registered? Switch to Login"}
        </p>
      </div>
    </div>
  );
};

export default Auth;