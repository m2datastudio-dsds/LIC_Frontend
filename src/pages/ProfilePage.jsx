function ProfilePage() {
  return (
    <div className="page-shell">
      <h1>Profile</h1>
      <form className="form-card auth-card">
        <input placeholder="Name" defaultValue="Customer Name" />
        <input placeholder="Mobile" defaultValue="9876543210" />
        <input placeholder="Email" defaultValue="customer@example.com" />
        <input type="password" placeholder="Current Password" />
        <input type="password" placeholder="New Password" />
        <input type="password" placeholder="Confirm Password" />
        <button className="btn btn-primary" type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default ProfilePage;
