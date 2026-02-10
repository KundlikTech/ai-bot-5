import "./App.css";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  return (
    <div className="app">
      <div className="bg">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="grid" />
      </div>

      <header className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Groq-powered support</div>
          <h1>AI Customer Support</h1>
          <p>
            A fast, routed, memory-aware assistant that handles orders,
            billing, and support with clarity.
          </p>
          <div className="pill-row">
            <span className="pill">Orders</span>
            <span className="pill">Billing</span>
            <span className="pill">Support</span>
          </div>
        </div>

        <div className="hero-panel">
          <ChatWindow />
        </div>
      </header>
    </div>
  );
}
