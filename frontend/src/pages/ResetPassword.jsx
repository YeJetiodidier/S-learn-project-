import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { confirmResetPassword, mapAuthError } from "../firebase/authService";
import "../auth.css";

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const oobCode = query.get("oobCode");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (!oobCode) {
            setError("Missing reset code. Please use the link from your email.");
            return;
        }
        try {
            await confirmResetPassword(oobCode, newPassword);
            setMessage("Password reset successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(mapAuthError(err));
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Reset Password</h1>
                {message && <div className="auth-alert-success">{message}</div>}
                {error && <div className="auth-alert-danger" style={{ color: "red", margin: "1rem 0" }}>{error}</div>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <div className="auth-labels">
                            <span className="auth-label">New Password</span>
                        </div>
                        <div className="auth-input-wrapper">
                            <input
                                className="auth-input"
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="auth-input-group">
                        <div className="auth-labels">
                            <span className="auth-label">Confirm Password</span>
                        </div>
                        <div className="auth-input-wrapper">
                            <input
                                className="auth-input"
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="auth-btn">Reset Password</button>
                </form>
                <div className="auth-footer">
                    <Link to="/login" className="auth-link">Back to Login &rsaquo;</Link>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
