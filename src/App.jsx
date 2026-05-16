import { useState, useEffect } from "react";

const courses = [
  { id: 1, title: "Foundations of Generative AI", category: "Core", duration: "3h 20m", xp: 150 },
  { id: 2, title: "Prompt Engineering Fundamentals", category: "Core", duration: "2h 45m", xp: 120 },
  { id: 3, title: "Large Language Models Deep Dive", category: "Technical", duration: "4h 10m", xp: 200 },
  { id: 4, title: "AI Ethics & Responsible Use", category: "Core", duration: "2h 00m", xp: 100 },
  { id: 5, title: "RAG & Knowledge Retrieval", category: "Technical", duration: "3h 30m", xp: 175 },
  { id: 6, title: "Fine-Tuning & Model Adaptation", category: "Advanced", duration: "5h 00m", xp: 250 },
  { id: 7, title: "AI Product Strategy", category: "Business", duration: "2h 15m", xp: 110 },
  { id: 8, title: "Multimodal AI Systems", category: "Technical", duration: "3h 50m", xp: 190 },
  { id: 9, title: "AI Agents & Autonomy", category: "Advanced", duration: "4h 30m", xp: 225 },
  { id: 10, title: "Data Pipelines for AI", category: "Technical", duration: "3h 00m", xp: 150 },
  { id: 11, title: "Evaluating AI Performance", category: "Core", duration: "2h 30m", xp: 125 },
  { id: 12, title: "Security & AI Risk Management", category: "Business", duration: "2h 50m", xp: 140 },
  { id: 13, title: "Deploying AI at Scale", category: "Advanced", duration: "4h 45m", xp: 235 },
  { id: 14, title: "AI Governance & Compliance", category: "Business", duration: "2h 20m", xp: 115 },
  { id: 15, title: "Capstone: Gen AI E2 Project", category: "Capstone", duration: "6h 00m", xp: 300 },
];

const categoryColors = {
  Core: { bg: "#e8f5e8", text: "#2d6a2d", dot: "#4caf50" },
  Technical: { bg: "#e3f0ff", text: "#1a4a8a", dot: "#3b82f6" },
  Advanced: { bg: "#f3e8ff", text: "#5b2d8a", dot: "#9333ea" },
  Business: { bg: "#fff3e0", text: "#7a4000", dot: "#f59e0b" },
  Capstone: { bg: "#fce8ff", text: "#7a005a", dot: "#e91e8c" },
};

const STORAGE_KEY = "gen-ai-e2-completed";
const NAMES_KEY = "gen-ai-e2-names";

export default function App() {
  const [completed, setCompleted] = useState(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [customNames, setCustomNames] = useState(() => {
    try { const s = localStorage.getItem(NAMES_KEY); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const [hoveredId, setHoveredId] = useState(null);
  const [justCompleted, setJustCompleted] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(completed)); } catch {}
  }, [completed]);

  useEffect(() => {
    try { localStorage.setItem(NAMES_KEY, JSON.stringify(customNames)); } catch {}
  }, [customNames]);

  const toggle = (id) => {
    if (editingId === id) return;
    setCompleted(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      setJustCompleted(id);
      setTimeout(() => setJustCompleted(null), 800);
      return [...prev, id];
    });
  };

  const startEdit = (e, course) => {
    e.stopPropagation();
    setEditingId(course.id);
    setEditValue(customNames[course.id] ?? course.title);
  };

  const commitEdit = (id) => {
    const trimmed = editValue.trim();
    if (trimmed) setCustomNames(prev => ({ ...prev, [id]: trimmed }));
    setEditingId(null);
  };

  const handleEditKey = (e, id) => {
    if (e.key === "Enter") commitEdit(id);
    if (e.key === "Escape") setEditingId(null);
  };

  const totalXP = courses.filter(c => completed.includes(c.id)).reduce((s, c) => s + c.xp, 0);
  const maxXP = courses.reduce((s, c) => s + c.xp, 0);
  const pct = Math.round((completed.length / courses.length) * 100);
  const isComplete = completed.length === courses.length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f7f6f3",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#1a1814",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=JetBrains+Mono:wght@300;400&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .portal-root { font-family: 'Cormorant Garamond', Georgia, serif; }
        
        .hero { 
          background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse 50% 40% at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 50%),
                      #ffffff;
          padding: 56px 32px 48px;
          border-bottom: 1px solid rgba(0,0,0,0.07);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(124,58,237,0.08);
          border: 1px solid rgba(124,58,237,0.2);
          color: #6d28d9;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          padding: 5px 14px;
          border-radius: 20px;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        .badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #7c3aed;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .hero-title {
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 300;
          letter-spacing: -0.01em;
          line-height: 1.1;
          color: #1a1814;
          margin-bottom: 8px;
        }

        .hero-title em {
          font-style: italic;
          color: #7c3aed;
        }

        .hero-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          color: rgba(26,24,20,0.4);
          margin-bottom: 40px;
        }

        .stats-row {
          display: flex;
          justify-content: center;
          gap: 48px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }

        .stat {
          text-align: center;
        }

        .stat-val {
          font-size: 36px;
          font-weight: 300;
          letter-spacing: -0.02em;
          color: #1a1814;
          line-height: 1;
        }

        .stat-val span { color: #7c3aed; }

        .stat-lbl {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          color: rgba(26,24,20,0.4);
          text-transform: uppercase;
          margin-top: 4px;
        }

        .progress-track {
          max-width: 480px;
          margin: 0 auto;
        }

        .progress-bar-bg {
          height: 4px;
          background: rgba(0,0,0,0.08);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #6d28d9, #9333ea, #a855f7);
          border-radius: 2px;
          transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
          position: relative;
        }

        .progress-bar-fill::after {
          content: '';
          position: absolute;
          right: 0; top: -2px;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #9333ea;
          box-shadow: 0 0 8px rgba(147,51,234,0.5);
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: rgba(26,24,20,0.35);
          letter-spacing: 0.08em;
        }

        .main {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }

        .section-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 13px;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.18em;
          color: rgba(26,24,20,0.35);
          text-transform: uppercase;
        }

        .section-count {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: rgba(26,24,20,0.3);
        }

        .courses-grid {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .course-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
          border: 1px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .course-row:hover {
          background: rgba(0,0,0,0.03);
          border-color: rgba(0,0,0,0.06);
        }

        .course-row.done {
          background: rgba(124,58,237,0.04);
        }

        .course-row.just-done {
          animation: completePop 0.5s ease;
        }

        @keyframes completePop {
          0% { transform: scale(1); }
          30% { transform: scale(1.01); background: rgba(124,58,237,0.1); }
          100% { transform: scale(1); }
        }

        .course-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: rgba(26,24,20,0.2);
          width: 24px;
          flex-shrink: 0;
          text-align: right;
          letter-spacing: 0.05em;
        }

        .course-row.done .course-num {
          color: rgba(124,58,237,0.4);
        }

        .checkbox {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          border: 1.5px solid rgba(0,0,0,0.18);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          background: transparent;
        }

        .course-row.done .checkbox {
          background: #7c3aed;
          border-color: #7c3aed;
          box-shadow: 0 0 10px rgba(124,58,237,0.25);
        }

        .check-icon {
          opacity: 0;
          transform: scale(0.5);
          transition: all 0.2s ease;
        }

        .course-row.done .check-icon {
          opacity: 1;
          transform: scale(1);
        }

        .course-info { flex: 1; min-width: 0; }

        .course-title {
          font-size: 16px;
          font-weight: 400;
          color: #1a1814;
          letter-spacing: -0.01em;
          line-height: 1.3;
          transition: color 0.2s;
        }

        .course-row.done .course-title {
          color: rgba(26,24,20,0.4);
          text-decoration: line-through;
          text-decoration-color: rgba(124,58,237,0.3);
        }

        .course-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
        }

        .cat-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 2px 7px;
          border-radius: 10px;
          font-weight: 400;
        }

        .course-duration {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: rgba(26,24,20,0.3);
          letter-spacing: 0.05em;
        }

        .course-xp {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: rgba(124,58,237,0.4);
          flex-shrink: 0;
          letter-spacing: 0.05em;
          transition: color 0.2s;
        }

        .course-row.done .course-xp {
          color: #7c3aed;
        }

        .divider {
          height: 1px;
          background: rgba(0,0,0,0.07);
          margin: 32px 0;
        }

        .complete-banner {
          text-align: center;
          padding: 40px 24px;
          border: 1px solid rgba(124,58,237,0.2);
          border-radius: 8px;
          background: radial-gradient(ellipse at center, rgba(124,58,237,0.06) 0%, transparent 70%);
          margin-bottom: 40px;
          animation: bannerIn 0.6s ease;
        }

        @keyframes bannerIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .complete-icon {
          font-size: 48px;
          margin-bottom: 12px;
          display: block;
        }

        .complete-title {
          font-size: 32px;
          font-weight: 300;
          color: #6d28d9;
          font-style: italic;
          margin-bottom: 6px;
        }

        .complete-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: rgba(26,24,20,0.4);
          letter-spacing: 0.12em;
        }

        .reset-btn {
          display: block;
          margin: 32px auto 0;
          background: none;
          border: 1px solid rgba(0,0,0,0.12);
          color: rgba(26,24,20,0.35);
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 8px 20px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reset-btn:hover {
          border-color: rgba(0,0,0,0.22);
          color: rgba(26,24,20,0.6);
        }

        .edit-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 3px 5px;
          border-radius: 4px;
          color: rgba(26,24,20,0.25);
          opacity: 0;
          transition: opacity 0.15s, color 0.15s, background 0.15s;
          flex-shrink: 0;
          line-height: 1;
        }

        .course-row:hover .edit-btn {
          opacity: 1;
        }

        .edit-btn:hover {
          color: #7c3aed;
          background: rgba(124,58,237,0.08);
        }

        .title-edit-input {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 16px;
          font-weight: 400;
          color: #1a1814;
          letter-spacing: -0.01em;
          line-height: 1.3;
          border: none;
          border-bottom: 1.5px solid #7c3aed;
          outline: none;
          background: transparent;
          width: 100%;
          padding: 0 0 2px 0;
        }

        .title-hint {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: rgba(124,58,237,0.5);
          letter-spacing: 0.08em;
          margin-top: 3px;
        }

        .course-title-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .custom-indicator {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #7c3aed;
          opacity: 0.4;
          flex-shrink: 0;
        }
      `}</style>

      <div className="portal-root">
        {/* Hero */}
        <div className="hero">
          <div className="badge">
            <div className="badge-dot" />
            Certification Track
          </div>
          <h1 className="hero-title">
            Gen AI <em>E2</em> Level
          </h1>
          <p className="hero-sub">Course Completion Portal · {courses.length} Required Courses</p>

          <div className="stats-row">
            <div className="stat">
              <div className="stat-val">{completed.length}<span>/{courses.length}</span></div>
              <div className="stat-lbl">Courses Done</div>
            </div>
            <div className="stat">
              <div className="stat-val">{pct}<span>%</span></div>
              <div className="stat-lbl">Complete</div>
            </div>
            <div className="stat">
              <div className="stat-val">{totalXP.toLocaleString()}</div>
              <div className="stat-lbl">XP Earned</div>
            </div>
          </div>

          <div className="progress-track">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="progress-labels">
              <span>0 / {courses.length} courses</span>
              <span>{maxXP.toLocaleString()} XP total</span>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="main">
          {isComplete && (
            <div className="complete-banner">
              <span className="complete-icon">✦</span>
              <div className="complete-title">E2 Certification Achieved</div>
              <div className="complete-sub">All {courses.length} courses complete · {maxXP.toLocaleString()} XP earned</div>
            </div>
          )}

          <div className="section-header">
            <div className="section-title">Course Curriculum</div>
            <div className="section-count">{completed.length} of {courses.length} completed</div>
          </div>

          <div className="courses-grid">
            {courses.map((course, i) => {
              const isDone = completed.includes(course.id);
              const cat = categoryColors[course.category];
              return (
                <div
                  key={course.id}
                  className={`course-row ${isDone ? "done" : ""} ${justCompleted === course.id ? "just-done" : ""}`}
                  onClick={() => toggle(course.id)}
                  onMouseEnter={() => setHoveredId(course.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="course-num">{String(i + 1).padStart(2, "0")}</div>

                  <div className="checkbox">
                    <svg className="check-icon" width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  <div className="course-info">
                    {editingId === course.id ? (
                      <div onClick={e => e.stopPropagation()}>
                        <input
                          className="title-edit-input"
                          value={editValue}
                          autoFocus
                          onChange={e => setEditValue(e.target.value)}
                          onBlur={() => commitEdit(course.id)}
                          onKeyDown={e => handleEditKey(e, course.id)}
                        />
                        <div className="title-hint">Enter to save · Esc to cancel</div>
                      </div>
                    ) : (
                      <div className="course-title-wrap">
                        <div className="course-title">
                          {customNames[course.id] ?? course.title}
                        </div>
                        {customNames[course.id] && <div className="custom-indicator" title="Renamed" />}
                      </div>
                    )}
                    <div className="course-meta">
                      <span className="cat-tag" style={{ background: cat.bg, color: cat.text }}>
                        {course.category}
                      </span>
                      <span className="course-duration">{course.duration}</span>
                    </div>
                  </div>

                  {editingId !== course.id && (
                    <button
                      className="edit-btn"
                      title="Rename course"
                      onClick={e => startEdit(e, course)}
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M9 2L11 4L4.5 10.5H2.5V8.5L9 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}

                  <div className="course-xp">+{course.xp} xp</div>
                </div>
              );
            })}
          </div>

          <div className="divider" />

          <button
            className="reset-btn"
            onClick={() => { if (confirm("Reset all progress?")) setCompleted([]); }}
          >
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
}
