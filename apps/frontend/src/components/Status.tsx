export default function Status({ text }) {
  return (
    <div className="status">
      <span className="status-dot" />
      <span>{text}</span>
    </div>
  );
}
