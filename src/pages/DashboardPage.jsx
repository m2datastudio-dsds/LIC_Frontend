function DashboardPage() {
  return (
    <div className="page-shell">
      <h1>Welcome, Customer Name</h1>
      <div className="stats-grid">
        <div className="stat-card"><h3>Life Insurance</h3><p>12 plans</p></div>
        <div className="stat-card"><h3>Health Insurance</h3><p>8 plans</p></div>
        <div className="stat-card"><h3>Real Estate</h3><p>5 listings</p></div>
        <div className="stat-card"><h3>My Enquiries</h3><p>4 active</p></div>
      </div>
    </div>
  );
}

export default DashboardPage;
