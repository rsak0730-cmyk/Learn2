import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  Award,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Code2,
  Flame,
  Key,
  Layers,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  User,
  Zap,
  ArrowLeft
} from "lucide-react";
import "./styles.css";

const PROFILE_KEY = "codeverse_user_profile";
const TRACK_KEY = "codeverse_learning_track";

const DEFAULT_CURRICULUM = {
  Python: [
    {
      id: 1,
      title: "Variables & Memory Boxes",
      summary: "Learn how to store text and numbers in memory.",
      analogy: "Think of a variable as a labeled storage box where you keep values.",
      starterCode: 'name = "Explorer"\nxp = 100\nprint(f"Welcome {name}, XP: {xp}")',
      task: 'Create a variable named `score` set to 50, then print it using `print(score)`.'
    },
    {
      id: 2,
      title: "Conditions & Decision Making",
      summary: "Teach your program to make choices using if/else.",
      analogy: "Like a traffic light: if green, drive; if red, stop.",
      starterCode: 'score = 75\n\nif score >= 50:\n    print("You passed!")\nelse:\n    print("Try again!")',
      task: 'Write an if-statement that prints "High" if score is greater than 80, otherwise prints "Low".'
    },
    {
      id: 3,
      title: "Loops & Repetition",
      summary: "Automate repetitive tasks with for-loops.",
      analogy: "Like counting reps while exercising.",
      starterCode: 'for i in range(1, 4):\n    print(f"Repetition #{i}")',
      task: 'Write a loop that prints the numbers 0, 1, 2 using `range(3)`.'
    },
    {
      id: 4,
      title: "Functions: Reusable Spells",
      summary: "Package logic into reusable blocks.",
      analogy: "Like a recipe: write the recipe once, cook it whenever needed.",
      starterCode: 'def greet(user):\n    return f"Hello, {user}!"\n\nprint(greet("Manish"))',
      task: 'Define a function `add_five(x)` that returns `x + 5`.'
    }
  ]
};

function App() {
  // Profile State
  const [profile, setProfile] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(PROFILE_KEY)) || {
          name: "",
          language: "Python",
          level: "Beginner",
          xp: 0,
          streak: 1,
          completedLessons: []
        }
      );
    } catch {
      return { name: "", language: "Python", level: "Beginner", xp: 0, streak: 1, completedLessons: [] };
    }
  });

  const [geminiKey, setGeminiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const [selectedModel, setSelectedModel] = useState(
    localStorage.getItem("gemini_selected_model") || "gemini-2.5-flash"
  );

  // Navigation State
  const [activeLesson, setActiveLesson] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [codeOutput, setCodeOutput] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [pyodide, setPyodide] = useState(null);

  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    const loader = document.getElementById("loading");
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => loader.remove(), 250);
    }
  }, []);

  // In-browser Python initialization
  const runPythonCode = async (code) => {
    setCodeOutput("Executing Python in-browser...");
    try {
      let py = pyodide;
      if (!py) {
        if (!window.loadPyodide) {
          setCodeOutput("WebAssembly engine loading... please wait a moment.");
          return;
        }
        py = await window.loadPyodide();
        setPyodide(py);
      }
      py.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);
      py.runPython(code);
      const out = py.runPython("sys.stdout.getvalue()");
      const err = py.runPython("sys.stderr.getvalue()");
      setCodeOutput(out || err || "Code finished with no output.");
    } catch (e) {
      setCodeOutput(`Execution Error: ${e.message || e}`);
    }
  };

  // AI Verification for Lesson Task
  const verifyCodeWithAI = async () => {
    if (!geminiKey) {
      alert("Please enter your free Gemini API Key in the top bar to get real-time AI checking!");
      return;
    }

    setIsVerifying(true);
    setAiFeedback("AI Teacher is inspecting your code...");

    const prompt = `You are a supportive, high-energy coding tutor reviewing a beginner student's work.
Lesson: "${activeLesson.title}"
Task Requirements: "${activeLesson.task}"
Student's Code:
\`\`\`${profile.language}${userCode}
\`\`\`

Evaluate if the code satisfies the task correctly.
Return strictly valid JSON in this format:
{
  "passed": true,
  "comment": "Encouraging remark and explanation of how well they solved it."
}`;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${geminiKey}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await res.json();
      let raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();
      const result = JSON.parse(raw);

      setAiFeedback(result.comment);

      if (result.passed) {
        if (!profile.completedLessons.includes(activeLesson.id)) {
          setProfile((prev) => ({
            ...prev,
            xp: prev.xp + 100,
            completedLessons: [...prev.completedLessons, activeLesson.id]
          }));
        }
      }
    } catch (err) {
      setAiFeedback("Could not complete AI evaluation. Please verify your Gemini Key.");
    } finally {
      setIsVerifying(false);
    }
  };

  const lessonsList = DEFAULT_CURRICULUM[profile.language] || DEFAULT_CURRICULUM["Python"];

  // 1. Profile Onboarding Screen (If no user name is set)
  if (!profile.name) {
    return (
      <div className="onboard-screen">
        <div className="onboard-card">
          <div className="brandMark" style={{ margin: "0 auto 16px" }}>
            <Code2 size={24} />
          </div>
          <h1>Create Your Coding Profile</h1>
          <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "24px" }}>
            Your personal AI tutor will tailor daily practice and milestones to your pace.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const name = formData.get("name").trim();
              const lang = formData.get("language");
              if (!name) return;
              setProfile((prev) => ({ ...prev, name, language: lang }));
            }}
          >
            <label className="input-label">Your Name</label>
            <input
              name="name"
              type="text"
              placeholder="e.g. Alex"
              required
              className="styled-input"
            />

            <label className="input-label" style={{ marginTop: "14px" }}>What do you want to learn?</label>
            <select name="language" className="styled-input">
              <option value="Python">Python (Data, Backend, Scripting)</option>
            </select>

            <button type="submit" className="primary full" style={{ marginTop: "24px" }}>
              Start Learning Journey <ChevronRight size={16} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Active Lesson Screen (Theory + Sandbox + AI verification)
  if (activeLesson) {
    return (
      <div className="lesson-page">
        <header className="topbar">
          <button className="textBtn" onClick={() => setActiveLesson(null)} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <ArrowLeft size={16} /> Back to Track
          </button>
          <div style={{ marginLeft: "auto", display: "flex", gap: "10px", alignItems: "center" }}>
            <span className="xpPill"><Zap size={14} /> +100 XP</span>
          </div>
        </header>

        <div className="lesson-layout">
          {/* Left Column: Lesson Content */}
          <div className="lesson-content-panel">
            <span className="eyebrow"><BookOpen size={14} /> LESSON {activeLesson.id}</span>
            <h2>{activeLesson.title}</h2>
            <p style={{ color: "var(--text)", lineHeight: "1.7", fontSize: "14px" }}>{activeLesson.summary}</p>

            <div className="concept" style={{ margin: "20px 0" }}>
              <Lightbulb className="conceptIcon" />
              <div>
                <b>Visual Mental Model</b>
                <p>{activeLesson.analogy}</p>
              </div>
            </div>

            <div style={{ background: "var(--panel2)", padding: "16px", borderRadius: "12px", border: "1px solid var(--line)" }}>
              <b style={{ color: "#a89dff" }}>Your Mission:</b>
              <p style={{ margin: "6px 0 0", fontSize: "13px", lineHeight: "1.6" }}>{activeLesson.task}</p>
            </div>

            {aiFeedback && (
              <div style={{ marginTop: "18px", padding: "14px", borderRadius: "10px", background: "rgba(139,124,255,0.1)", border: "1px solid var(--accent)", fontSize: "13px", lineHeight: "1.6" }}>
                <b>Teacher's Feedback:</b>
                <p style={{ margin: "6px 0 0" }}>{aiFeedback}</p>
              </div>
            )}
          </div>

          {/* Right Column: Code Practice Sandbox */}
          <div className="lesson-editor-panel">
            <div className="editorHead">
              <span>Interactive Python Editor</span>
              <button className="runBtn" onClick={() => runPythonCode(userCode)}>
                <Play size={13} /> Run Code
              </button>
            </div>

            <textarea
              className="code-textarea"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              spellCheck="false"
            />

            <div className="terminal-box">
              <span style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Terminal Output:</span>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{codeOutput || "Run your code to see output here."}</pre>
            </div>

            <button className="primary full" style={{ marginTop: "12px" }} onClick={verifyCodeWithAI} disabled={isVerifying}>
              <Sparkles size={16} /> {isVerifying ? "Evaluating..." : "Submit Task to AI Teacher"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Main Dashboard & Progressive Roadmap Screen
  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="brandMark"><Code2 size={18} /></div>
          <b>CodeVerse Academy</b>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: "12px", alignItems: "center" }}>
          <div className="streak"><Flame size={15} /> {profile.streak} Day Streak</div>
          <div className="xpPill"><Zap size={14} /> {profile.xp} XP</div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="password"
              placeholder="Gemini API Key"
              value={geminiKey}
              onChange={(e) => {
                setGeminiKey(e.target.value);
                localStorage.setItem("gemini_api_key", e.target.value.trim());
              }}
              style={{
                width: "120px",
                background: "var(--panel2)",
                border: "1px solid var(--line)",
                padding: "6px 8px",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "11px"
              }}
            />
          </div>
        </div>
      </header>

      {/* Profile Bar */}
      <div className="content">
        <div className="profile-banner">
          <div className="avatar" style={{ width: "48px", height: "48px", fontSize: "16px" }}>
            {profile.name[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: "0 0 4px" }}>Welcome back, {profile.name}!</h2>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: "13px" }}>
              Track: <b>{profile.language} Fundamentals</b> · Level: {profile.level}
            </p>
          </div>
          <button
            className="secondary"
            style={{ marginLeft: "auto" }}
            onClick={() => {
              if (confirm("Reset profile and progress?")) {
                localStorage.clear();
                location.reload();
              }
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        {/* Roadmap Overview */}
        <div className="sectionHead" style={{ marginTop: "32px" }}>
          <div>
            <span className="eyebrow"><Layers size={14} /> LEARNING PATH</span>
            <h2>Step-by-Step Curriculum</h2>
          </div>
          <span style={{ color: "var(--muted)", fontSize: "13px" }}>
            {profile.completedLessons.length} of {lessonsList.length} Completed
          </span>
        </div>

        <div className="roadmap-grid">
          {lessonsList.map((lesson, idx) => {
            const isCompleted = profile.completedLessons.includes(lesson.id);
            const isLocked = idx > 0 && !profile.completedLessons.includes(lessonsList[idx - 1].id);

            return (
              <div
                key={lesson.id}
                className={`roadmap-card ${isCompleted ? "completed" : ""} ${isLocked ? "locked" : ""}`}
                onClick={() => {
                  if (isLocked) return;
                  setActiveLesson(lesson);
                  setUserCode(lesson.starterCode);
                  setCodeOutput("");
                  setAiFeedback("");
                }}
              >
                <div className="step-badge">
                  {isCompleted ? <CheckCircle size={20} color="#4ade80" /> : idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 6px", fontSize: "16px" }}>{lesson.title}</h3>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: "12px", lineHeight: "1.5" }}>
                    {lesson.summary}
                  </p>
                </div>
                <button className="primary" style={{ padding: "8px 12px", fontSize: "12px" }} disabled={isLocked}>
                  {isCompleted ? "Review" : "Start"} <ChevronRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
