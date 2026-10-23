function LoginPage() {
  return (
    <div className="auth-shell">
      <form className="form-card auth-card">
        <h1>Customer Login</h1>
        <input placeholder="Email / Mobile" />
        <input type="password" placeholder="Password" />
        <button className="btn btn-primary" type="submit">Login</button>
        <div className="auth-links">
          <button className="link-btn" type="button">Forgot Password</button>
          <button className="link-btn" type="button">Register</button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
