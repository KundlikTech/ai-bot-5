export default function Message({ role, content }) {
  return (
    <div className={`message message-${role}`}>
      <div className="message-meta">
        {role === "user" ? "You" : "Assistant"}
      </div>
      <div className="message-bubble">{content}</div>
    </div>
  );
}
