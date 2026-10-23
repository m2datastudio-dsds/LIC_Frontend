function RegisterPage() {
  return (
    <div className="auth-shell">
      <form className="form-card auth-card">
        <h1>Register</h1>
        <input placeholder="Full Name" />
        <input placeholder="Mobile Number" />
        <input placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm Password" />
        <button className="btn btn-primary" type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default RegisterPage;
