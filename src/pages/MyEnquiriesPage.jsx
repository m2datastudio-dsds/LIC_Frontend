function MyEnquiriesPage() {
  return (
    <div className="page-shell">
      <h1>My Enquiries</h1>
      <table className="table-card">
        <thead>
          <tr>
            <th>Product</th>
            <th>Message</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Term Assurance Plus</td>
            <td>Need information for family protection</td>
            <td>15 Aug 2026</td>
            <td>NEW</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MyEnquiriesPage;
