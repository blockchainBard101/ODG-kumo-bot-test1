import './login.css';
import { AuthService } from "../../utils/authService";
import { useState } from 'react';

function Login() {
  const [loading, setLoading] = useState(false);
  const authService = new AuthService();

  const handleGoogleLogin = () => {
    setLoading(true);
    authService.login();
  };

  return (
    <div className="login-container">
      <h1>ODG Kumo Bot</h1>
      <h2>Login</h2>
      <button className="google-login-button" onClick={handleGoogleLogin}>
        {loading ? 'Logging in...' : 'Login with Google'}
      </button>
      <p>Please login with your Google account to create a SUI account for you</p>
      <p >Powered by SUI</p>
    </div>
  );
}

export default Login;

