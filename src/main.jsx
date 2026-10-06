import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
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
  Zap,
  ArrowLeft
} from "lucide-react";
import "./styles.css";

const PROFILE_KEY = "codeverse_user_profile";
const ACTIVE_MODEL = "gemini-2.5-flash"; // Working production endpoint

const CURRICULUM = {
  Python: [
    {
      id: 1,
      title: "Variables & Data Types",
      summary: "Understand how computers remember information using labeled variables.",
      analogy: "Like labeled kitchen jars: a jar labeled 'sugar' holds sugar, a jar labeled 'score' holds 100.",
      starterCode: 'player_name = "Manish"\nscore = 100\nprint(f"Player: {player_name}, Score: {score}")',
      task: 'Create a variable named `user_age` set to your age (a number), then write: `print(user_age)`.'
    },
    {
      id: 2,
      title: "Conditions & Smart Decisions",
      summary: "Teach your program to choose different paths using if and else logic.",
      analogy: "Like an umbrella check: if it rains, bring an umbrella; otherwise, wear sunglasses.",
      starterCode: 'marks = 85\n\nif marks >= 50:\n    print("Exam Passed!")\nelse:\n    print("Review again")',
      task: 'Write an if-statement checking if `marks >= 80`. If true, print "Grade A", else print "Grade B".'
    },
    {
      id: 3,
      title: "Loops: Automating Repetition",
      summary: "Run instructions repeatedly without writing duplicate lines of code.",
      analogy: "Like setting an alarm ring or running laps around a track.",
      starterCode: 'for lap in range(1, 4):\n    print(f"Running lap #{lap}")',
      task: 'Write a for-loop that counts from 1 to 5 using `for i in range(1, 6):` and prints each number.'
    },
    {
      id: 4,
      title: "Functions: Custom Commands",
      summary: "Group code into a reusable tool you can execute anytime by name.",
      analogy: "Like a microwave button: press 'Popcorn' and it automatically executes preset cooking logic.",
      starterCode: 'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Explorer"))',
      task: 'Define a function `add_numbers(a, b)` that returns `a + b`, then test it with `print(add_numbers(10, 20))`.'
    }
  ]
};

function App() {
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
      setTimeout(() => loader.remove(), 200);
    }
  }, []);

  const runPythonCode = async () => {
    setCodeOutput("Running Python via in-browser engine...");
    try {
      let py = pyodide;
      if (!py) {
        if (!window.loadPyodide) {
          setCodeOutput("WebAssembly Python is initializing... please wait 3 seconds and retry.");
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
      py.runPython(userCode);
      const stdout = py.runPython("sys.stdout.getvalue()");
      const stderr = py.runPython("sys.stderr.getvalue()");
      setCodeOutput(stdout || stderr || "Execution finished with no output.");
    } catch (err) {
      setCodeOutput(`Execution Error: ${err.message || err}`);
    }
  };

  const verifyWithAI = async () => {
    if (!geminiKey.trim()) {
      alert("Please paste your Gemini API Key in the top header first.");
      return;
    }

    setIsVerifying(true);
    setAiFeedback("Teacher is reviewing your code logic...");

    const prompt = `You are an encouraging coding teacher reviewing a student's answer.
Lesson: "${activeLesson.title}"
Assigned Task: "${activeLesson.task}"
Student's Code:
\`\`\`python
${userCode}
\`\`\`

Evaluate if the code correctly fulfills the task.
Return ONLY valid JSON matching this exact structure:
{
  "passed": true,
  "comment": "1-2 sentences of encouraging feedback or advice."
}`;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${ACTIVE_MODEL}:generateContent?key=${geminiKey.trim()}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await res.json();
      if (data.error) {
        setAiFeedback(`Gemini Error: ${data.error.message}`);
      } else {
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
      }
    } catch (e) {
      setAiFeedback("Could not reach Gemini API. Please check your key.");
    } finally {
      setIsVerifying(false);
    }
  };

  const currentLessons = CURRICULUM[profile.language] || CURRICULUM["Python"];

  // 1. Profile Creation View
  if (!profile.name) {
    return (
      <div className="onboard-screen">
        <div className="onboard-card">
          <div className="brandMark" style={{ margin: "0 auto 16px" }}>
            <Code2 size={24} />
          </div>
          <h1>Create Your Student Profile</h1>
          <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "22px" }}>
            Start your personalized programming curriculum with in-browser practice and AI guidance.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = e.target.username.value.trim();
              if (!name) return;
              setProfile((prev) => ({ ...prev, name }));
            }}
          >
            <label className="input-label">Your Name</label>
            <input
              name="username"
              type="text"
              placeholder="e.g. Manish"
              required
              className="styled-input"
            />

            <label className="input-label" style={{ marginTop: "14px" }}>Language Track</label>
            <select className="styled-input" disabled>
              <option>Python Fundamentals</option>
            </select>

            <button type="submit" className="primary full" style={{ marginTop: "24px" }}>
              Build My Learning Track <ChevronRight size={16} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Interactive Lesson Studio (Split Screen: Theory + Code Editor + Terminal)
  if (activeLesson) {
    return (
      <div className="lesson-page">
        <header className="topbar">
          <button className="textBtn" onClick={() => setActiveLesson(null)} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <ArrowLeft size={16} /> Back to Learning Track
          </button>
          <div style={{ marginLeft: "auto", display: "flex", gap: "10px", alignItems: "center" }}>
            <span className="xpPill"><Zap size={14} /> +100 XP</span>
          </div>
        </header>

        <div className="lesson-layout">
          <div className="lesson-content-panel">
            <span className="eyebrow"><BookOpen size={14} /> LESSON {activeLesson.id}</span>
            <h2>{activeLesson.title}</h2>
            <p style={{ color: "var(--text)", lineHeight: "1.7", fontSize: "14px" }}>{activeLesson.summary}</p>

            <div className="concept" style={{ margin: "20px 0" }}>
              <Lightbulb className="conceptIcon" />
              <div>
                <b>Mental Model</b>
                <p>{activeLesson.analogy}</p>
              </div>
            </div>

            <div style={{ background: "var(--panel2)", padding: "16px", borderRadius: "12px", border: "1px solid var(--line)" }}>
              <b style={{ color: "#a89dff" }}>Your Mission:</b>
              <p style={{ margin: "6px 0 0", fontSize: "13px", lineHeight: "1.6" }}>{activeLesson.task}</p>
            </div>

            {aiFeedback && (
              <div style={{ marginTop: "18px", padding: "14px", borderRadius: "10px", background: "rgba(139,124,255,0.1)", border: "1px solid var(--accent)", fontSize: "13px", lineHeight: "1.6" }}>
                <b>Teacher Evaluation:</b>
                <p style={{ margin: "6px 0 0" }}>{aiFeedback}</p>
              </div>
            )}
          </div>

          <div className="lesson-editor-panel">
            <div className="editorHead">
              <span>Interactive Python Editor</span>
              <button className="runBtn" onClick={runPythonCode}>
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
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{codeOutput || "Run code to verify output..."}</pre>
            </div>

            <button className="primary full" style={{ marginTop: "12px" }} onClick={verifyWithAI} disabled={isVerifying}>
              <Sparkles size={16} /> {isVerifying ? "Evaluating..." : "Submit to AI Teacher"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Learning Roadmap Dashboard
  const completedCount = profile.completedLessons.length;
  const progressPercent = Math.round((completedCount / currentLessons.length) * 100);

  return (
    <div className="app-container">
      <header className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="brandMark"><Code2 size={18} /></div>
          <b>CodeVerse Academy</b>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: "12px", alignItems: "center" }}>
          <div className="streak"><Flame size={15} /> {profile.streak} Day Streak</div>
          <div className="xpPill"><Zap size={14} /> {profile.xp} XP</div>
          <input
            type="password"
            placeholder="Paste Gemini API Key"
            value={geminiKey}
            onChange={(e) => {
              setGeminiKey(e.target.value);
              localStorage.setItem("gemini_api_key", e.target.value.trim());
            }}
            style={{
              width: "140px",
              background: "var(--panel2)",
              border: "1px solid var(--line)",
              padding: "6px 10px",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "11px"
            }}
          />
        </div>
      </header>

      <div className="content">
        <div className="profile-banner">
          <div className="avatar" style={{ width: "48px", height: "48px", fontSize: "18px" }}>
            {profile.name[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: "0 0 4px" }}>Welcome, {profile.name}!</h2>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: "13px" }}>
              Track: <b>{profile.language} Course</b> · Progress: {progressPercent}%
            </p>
          </div>
          <button
            className="secondary"
            style={{ marginLeft: "auto" }}
            onClick={() => {
              if (confirm("Reset profile and all progress?")) {
                localStorage.clear();
                location.reload();
              }
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        <div className="sectionHead" style={{ marginTop: "32px" }}>
          <div>
            <span className="eyebrow"><Layers size={14} /> CURRICULUM ROADMAP</span>
            <h2>Python Mastery Path</h2>
          </div>
          <span style={{ color: "var(--muted)", fontSize: "13px" }}>
            {completedCount} of {currentLessons.length} Modules Finished
          </span>
        </div>

        <div className="roadmap-grid">
          {currentLessons.map((lesson, idx) => {
            const isCompleted = profile.completedLessons.includes(lesson.id);
            const isLocked = idx > 0 && !profile.completedLessons.includes(currentLessons[idx - 1].id);

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
                <button className="primary" style={{ padding: "8px 14px", fontSize: "12px" }} disabled={isLocked}>
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
