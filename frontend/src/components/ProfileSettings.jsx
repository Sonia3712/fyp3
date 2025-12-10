// frontend/src/components/ProfileSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProfileSettings() {
  const [user, setUser] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("livestocksync_user"));
    setUser(u);
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("livestocksync_token");
    return { Authorization: `Bearer ${token}` };
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.put("http://localhost:8000/api/auth/update-email", 
        { new_email: newEmail },
        { headers: getAuthHeader() }
      );
      // update localStorage with new user + token
      if (resp.data?.access_token) localStorage.setItem("livestocksync_token", resp.data.access_token);
      if (resp.data?.user) localStorage.setItem("livestocksync_user", JSON.stringify(resp.data.user));
      setUser(resp.data.user);
      alert("Email updated successfully");
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || "Error updating email";
      alert(msg);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      alert("Fill both current and new password");
      return;
    }
    try {
      const resp = await axios.put("http://localhost:8000/api/auth/change-password",
        { current_password: currentPassword, new_password: newPassword },
        { headers: getAuthHeader() }
      );
      if (resp.data?.access_token) localStorage.setItem("livestocksync_token", resp.data.access_token);
      alert("Password changed successfully");
      // clear fields
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || "Error changing password";
      alert(msg);
    }
  };

  if (!user) return <div>Loading profile...</div>;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h3>Profile Settings</h3>
      <p>Logged in as: <strong>{user.email}</strong> | Role: {user.role}</p>

      <hr />

      <form onSubmit={handleChangeEmail}>
        <h4>Change Email</h4>
        <input
          type="email"
          placeholder="new.email@gmail.com"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          required
        />
        <button type="submit">Update Email</button>
      </form>

      <hr />

      <form onSubmit={handleChangePassword}>
        <h4>Change Password</h4>
        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New password (min 6 chars)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}
