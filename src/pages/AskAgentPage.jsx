function AskAgentPage() {
  return (
    <div className="page-shell">
      <h1>Ask Agent</h1>
      <div className="chat-box">
        <div className="chat-message customer">Which plan is suitable for a 30-year-old person?</div>
        <div className="chat-message agent">I can help you compare suitable plans based on your budget and family needs.</div>
      </div>
      <form className="chat-form">
        <input placeholder="Ask your question..." />
        <button className="btn btn-primary" type="submit">Send</button>
      </form>
    </div>
  );
}

export default AskAgentPage;
