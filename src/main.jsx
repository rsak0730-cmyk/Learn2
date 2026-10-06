import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  Code2,
  Flame,
  HelpCircle,
  Key,
  Layers,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  Zap,
  ArrowLeft,
  Bot,
  Compass,
  Cpu
} from "lucide-react";
import "./styles.css";

const PROFILE_KEY = "codeverse_academy_profile";

const AVAILABLE_MODELS = [
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash (Fast)" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro (Deep Reasoning)" },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash (Speed)" }
];

const TRACKS = {
  Python: {
    color: "#38bdf8",
    levels: [
      {
        id: "py-1",
        tier: "Beginner",
        title: "1. Variables & Data Types",
        summary: "Understand memory boxes, strings, integers, and floats.",
        analogy: "Like labeled jars in a kitchen holding sugar or salt.",
        starterCode: 'player_name = "manish"\nscore = 100\nprint(f"player: {player_name}, score: {score}")',
        task: 'create a variable named `user_age` set to 17, then print it using `print(user_age)`.'
      },
      {
        id: "py-2",
        tier: "Beginner",
        title: "2. Conditional Decisions",
        summary: "Master if, elif, and else logic gates.",
        analogy: "Like deciding whether to carry an umbrella based on rain.",
        starterCode: 'score = 85\n\nif score >= 50:\n    print("passed")\nelse:\n    print("review")',
        task: 'write an if-statement that prints "grade a" if score >= 80, else prints "grade b".'
      },
      {
        id: "py-3",
        tier: "Intermediate",
        title: "3. Loops & Sequences",
        summary: "Automate repetition with for and while loops.",
        analogy: "Like running laps on an athletic field.",
        starterCode: 'for i in range(1, 4):\n    print(f"lap {i}")',
        task: 'write a loop that prints numbers from 1 to 5 using `range(1, 6)`.'
      },
      {
        id: "py-4",
        tier: "Advanced",
        title: "4. Functions & Return Values",
        summary: "Modularize logic into reusable components.",
        analogy: "Like a recipe you can trigger on demand.",
        starterCode: 'def greet(name):\n    return f"hello, {name}!"\n\nprint(greet("explorer"))',
        task: 'create a function `multiply(a, b)` that returns `a * b` and print `multiply(4, 5)`.'
      }
    ]
  },
  JavaScript: {
    color: "#facc15",
    levels: [
      {
        id: "js-1",
        tier: "Beginner",
        title: "1. Variables: let vs const",
        summary: "Store mutable and immutable values in modern JavaScript.",
        analogy: "Const is permanent ink; let is pencil with an eraser.",
        starterCode: 'const appname = "codeverse";\nlet xp = 50;\nconsole.log(appname, xp);',
        task: 'declare a variable `let level = 1;` and log it using `console.log(level);`.'
      },
      {
        id: "js-2",
        tier: "Intermediate",
        title: "2. Arrow Functions & Callbacks",
        summary: "Write concise modern functions.",
        analogy: "A shortcut macro on your keyboard.",
        starterCode: 'const add = (a, b) => a + b;\nconsole.log(add(5, 10));',
        task: 'create an arrow function `square = (n) => n * n` and log `square(6)`.'
      },
      {
        id: "js-3",
        tier: "Advanced",
        title: "3. Array Methods & Map/Filter",
        summary: "Transform collections declaratively without manual loops.",
        analogy: "Like a conveyor belt sorting and packaging items.",
        starterCode: 'const nums = [1, 2, 3];\nconst doubled = nums.map(n => n * 2);\nconsole.log(doubled);',
        task: 'use `.filter()` to keep only numbers greater than 10 from `[5, 12, 8, 20]`.'
      }
    ]
  },
  "C++": {
    color: "#60a5fa",
    levels: [
      {
        id: "cpp-1",
        tier: "Beginner",
        title: "1. Syntax & Standard I/O",
        summary: "Direct memory management and standard streams.",
        analogy: "Speaking directly to the engine room without a translator.",
        starterCode: '#include <iostream>\n\nint main() {\n    std::cout << "hello codeverse!" << std::endl;\n    return 0;\n}',
        task: 'declare an integer `int score = 100;` and print it using `std::cout << score;`.'
      },
      {
        id: "cpp-2",
        tier: "Intermediate",
        title: "2. Pointers & References",
        summary: "Manipulate actual hardware memory addresses.",
        analogy: "Giving someone the GPS coordinates instead of copying the house.",
        starterCode: 'int val = 42;\nint* ptr = &val;\nstd::cout << *ptr;',
        task: 'create an integer `x = 10` and print its pointer memory address `&x`.'
      }
    ]
  },
  Rust: {
    color: "#f97316",
    levels: [
      {
        id: "rs-1",
        tier: "Beginner",
        title: "1. Immutability & Variables",
        summary: "Memory safety without a garbage collector.",
        analogy: "A strict contract where variables are locked by default.",
        starterCode: 'fn main() {\n    let mut score = 10;\n    score += 5;\n    println!("score: {}", score);\n}',
        task: 'declare a mutable variable `let mut xp = 0;` and print it using `println!("{}", xp);`.'
      }
    ]
  }
};

function App() {
  const [profile, setProfile] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(PROFILE_KEY)) || {
          name: "",
          selectedTrack: "Python",
          xp: 100,
          streak: 1,
          completed: []
        }
      );
    } catch {
      return { name: "", selectedTrack: "Python", xp: 100, streak: 1, completed: [] };
    }
  });

  const [navTab, setNavTab] = useState("curriculum");
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const [selectedModel, setSelectedModel] = useState(
    localStorage.getItem("gemini_selected_model") || "gemini-2.5-flash"
  );

  const [activeLesson, setActiveLesson] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [pyodide, setPyodide] = useState(null);

  // Helper AI & Teacher States
  const [helperClues, setHelperClues] = useState([]);
  const [isHelperThinking, setIsHelperThinking] = useState(false);
  const [teacherEvaluation, setTeacherEvaluation] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Theory Lab States
  const [theoryTopic, setTheoryTopic] = useState("recursion");
  const [theoryText, setTheoryText] = useState("");
  const [isTheoryLoading, setIsTheoryLoading] = useState(false);

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

  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    localStorage.setItem("gemini_selected_model", modelId);
  };

  // In-Browser Code Runner
  const executeCode = async (codeToRun) => {
    setTerminalOutput("running code in-browser...");
    const currentLang = profile.selectedTrack;

    if (currentLang === "Python") {
      try {
        let py = pyodide;
        if (!py) {
          if (!window.loadPyodide) {
            setTerminalOutput("webassembly engine initializing... please wait 3 seconds and retry.");
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
        py.runPython(codeToRun);
        const out = py.runPython("sys.stdout.getvalue()");
        const err = py.runPython("sys.stderr.getvalue()");
        setTerminalOutput(out || err || "program completed with 0 output.");
      } catch (err) {
        setTerminalOutput(`runtime error:\n${err.message || err}`);
      }
    } else if (currentLang === "JavaScript") {
      const logs = [];
      try {
        const orig = console.log;
        console.log = (...args) => logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" "));
        new Function(codeToRun)();
        console.log = orig;
        setTerminalOutput(logs.join("\n") || "program completed with 0 output.");
      } catch (err) {
        setTerminalOutput(`javascript error:\n${err.message || err}`);
      }
    } else {
      setTerminalOutput(`notice: ${currentLang} native compiler emulation is active.`);
    }
  };

  // Helper AI: Generates Clues
  const askHelperAI = async () => {
    if (!geminiKey) {
      alert("Please paste your Gemini API Key in the top bar to activate Helper AI.");
      return;
    }

    setIsHelperThinking(true);
    const prompt = `You are "Helper AI", a friendly coding assistant sitting right next to a student.
Task to solve: "${activeLesson ? activeLesson.task : theoryTopic}"
Language: ${profile.selectedTrack}
Current Code written by student:
\`\`\`
${userCode}
\`\`\`
Latest Terminal Output/Error:
\`\`\`
${terminalOutput}
\`\`\`

Give 2 short, bulleted clues or hints in lowercase code format. DO NOT write the full answer directly. Point out logic gaps or syntax typos so the student learns by fixing it themselves.`;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${geminiKey.trim()}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Helper could not inspect code.";
      setHelperClues((prev) => [...prev, reply]);
    } catch (e) {
      setHelperClues((prev) => [...prev, "Helper AI connection failed. Check your API key."]);
    } finally {
      setIsHelperThinking(false);
    }
  };

  // Main Teacher: Submits to Selected Model
  const submitToTeacher = async () => {
    if (!geminiKey) {
      alert("Please enter your Gemini API Key in the top bar.");
      return;
    }

    setIsEvaluating(true);
    setTeacherEvaluation(`Teacher (${selectedModel}) is evaluating your submission...`);

    const prompt = `You are the Lead Academy Instructor.
Module: "${activeLesson.title}"
Task Goal: "${activeLesson.task}"
Student Code:
\`\`\`
${userCode}
\`\`\`

Check if the student code passes the task requirement.
Return ONLY valid JSON matching this structure:
{
  "passed": true,
  "feedback": "2 sentences praising accuracy or giving direct instruction on what to adjust."
}`;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${geminiKey.trim()}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await res.json();
      let raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();
      const result = JSON.parse(raw);

      setTeacherEvaluation(result.feedback);

      if (result.passed) {
        if (!profile.completed.includes(activeLesson.id)) {
          setProfile((prev) => ({
            ...prev,
            xp: prev.xp + 150,
            completed: [...prev.completed, activeLesson.id]
          }));
        }
      }
    } catch (err) {
      setTeacherEvaluation("Could not connect to Teacher AI. Please verify key.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // Request Theory with Selected Model
  const requestTheoryLecture = async (topic) => {
    if (!geminiKey) {
      alert("Enter Gemini API Key in the header to generate live theory lectures.");
      return;
    }

    setIsTheoryLoading(true);
    setTheoryText(`AI Teacher (${selectedModel}) is preparing a lecture...`);

    const prompt = `You are a computer science professor explaining "${topic}" in ${profile.selectedTrack}.
Structure your explanation into:
1. The Core Concept (Plain English, 2-3 sentences)
2. A Real-World Metaphor / Analogy
3. A Minimal Code Example
4. A 1-sentence prompt for the student to practice in the terminal.`;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${geminiKey.trim()}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate theory lecture.";
      setTheoryText(reply);
    } catch (e) {
      setTheoryText("Could not generate lecture. Please check API key.");
    } finally {
      setIsTheoryLoading(false);
    }
  };

  const currentTrackData = TRACKS[profile.selectedTrack] || TRACKS.Python;
  const currentLevels = currentTrackData.levels;
  const studentLevel = Math.floor(profile.xp / 250) + 1;

  // Onboarding Screen
  if (!profile.name) {
    return (
      <div className="onboard-screen">
        <div className="onboard-card">
          <div className="brandMark" style={{ margin: "0 auto 16px" }}>
            <Code2 size={24} />
          </div>
          <h1>CodeVerse Academy</h1>
          <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "24px" }}>
            Learn any programming language from 0 to Advanced with interactive tasks, in-browser code execution, and an AI helper.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = e.target.username.value.trim();
              const selectedTrack = e.target.track.value;
              if (!name) return;
              setProfile((p) => ({ ...p, name, selectedTrack }));
            }}
          >
            <label className="input-label">Student Name</label>
            <input
              name="username"
              type="text"
              placeholder="e.g. Manish Kumar"
              required
              className="styled-input"
              autoCapitalize="words"
              autoCorrect="off"
            />

            <label className="input-label" style={{ marginTop: "14px" }}>Select Starting Language</label>
            <select name="track" className="styled-input">
              {Object.keys(TRACKS).map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>

            <button type="submit" className="primary full" style={{ marginTop: "24px" }}>
              Enter Academy <ChevronRight size={16} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Split-Screen Practice Studio
  if (activeLesson) {
    return (
      <div className="lesson-page">
        <header className="topbar">
          <button className="textBtn" onClick={() => setActiveLesson(null)} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <ArrowLeft size={16} /> Exit Studio
          </button>

          <div style={{ marginLeft: "auto", display: "flex", gap: "10px", alignItems: "center" }}>
            <select
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="model-select"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <span className="xpPill"><Zap size={14} /> +150 XP</span>
          </div>
        </header>

        <div className="studio-container">
          <div className="studio-col left-panel">
            <span className="eyebrow"><BookOpen size={14} /> {activeLesson.tier.toUpperCase()} · MODULE</span>
            <h2>{activeLesson.title}</h2>
            <p className="lesson-text">{activeLesson.summary}</p>

            <div className="concept">
              <Lightbulb className="conceptIcon" />
              <div>
                <b>Mental Model Analogy</b>
                <p>{activeLesson.analogy}</p>
              </div>
            </div>

            <div className="mission-box">
              <b style={{ color: "#a89dff" }}>Mission Objective:</b>
              <p style={{ margin: "6px 0 0", fontSize: "13px", lineHeight: "1.6" }}>{activeLesson.task}</p>
            </div>

            <div className="helper-drawer">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "13px" }}>
                  <Bot size={16} color="#38bdf8" /> Helper.AI (Clues & Guidance)
                </span>
                <button className="secondary" style={{ padding: "4px 8px", fontSize: "11px" }} onClick={askHelperAI} disabled={isHelperThinking}>
                  {isHelperThinking ? "Inspecting..." : "Ask for Clue"}
                </button>
              </div>

              {helperClues.length > 0 ? (
                <div className="clue-list">
                  {helperClues.map((clue, idx) => (
                    <div key={idx} className="clue-card">
                      <b>Clue #{idx + 1}:</b>
                      <p>{clue}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "11px", color: "var(--muted)", margin: "8px 0 0" }}>
                  Stuck or getting an error? Click "Ask for Clue" and Helper.AI will inspect your code without spoiling the solution.
                </p>
              )}
            </div>

            {teacherEvaluation && (
              <div className="teacher-feedback">
                <b>Teacher's Verdict:</b>
                <p style={{ margin: "6px 0 0" }}>{teacherEvaluation}</p>
              </div>
            )}
          </div>

          <div className="studio-col right-panel">
            <div className="editorHead">
              <span>{profile.selectedTrack} Code Editor (Small Letters)</span>
              <button className="runBtn" onClick={() => executeCode(userCode)}>
                <Play size={13} /> Run in Terminal
              </button>
            </div>

            <textarea
              className="code-textarea"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              spellCheck="false"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              data-gramm="false"
            />

            <div className="terminal-box">
              <span style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>
                In-Browser Terminal Output:
              </span>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{terminalOutput || "Press 'Run in Terminal' to execute."}</pre>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <button className="primary full" onClick={submitToTeacher} disabled={isEvaluating}>
                <Sparkles size={16} /> {isEvaluating ? "Evaluating..." : "Submit to Main Teacher"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard & Roadmap
  return (
    <div className="app-container">
      <header className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="brandMark"><Code2 size={18} /></div>
          <b>CodeVerse Academy</b>
        </div>

        <div className="nav-tabs-center">
          <button
            className={`tab-btn ${navTab === "curriculum" ? "active" : ""}`}
            onClick={() => setNavTab("curriculum")}
          >
            <Layers size={14} /> Curriculum Tracks
          </button>
          <button
            className={`tab-btn ${navTab === "theory-lab" ? "active" : ""}`}
            onClick={() => setNavTab("theory-lab")}
          >
            <Terminal size={14} /> Theory & Terminal Lab
          </button>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: "10px", alignItems: "center" }}>
          <div className="streak"><Flame size={15} /> {profile.streak} Day</div>
          <div className="xpPill"><Zap size={14} /> {profile.xp} XP (Lvl {studentLevel})</div>

          <select
            value={selectedModel}
            onChange={(e) => handleModelChange(e.target.value)}
            className="model-select"
            title="Active Gemini Model Engine"
          >
            {AVAILABLE_MODELS.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          <input
            type="password"
            placeholder="Gemini API Key"
            value={geminiKey}
            onChange={(e) => {
              setGeminiKey(e.target.value);
              localStorage.setItem("gemini_api_key", e.target.value.trim());
            }}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            style={{
              width: "120px",
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
            <h2 style={{ margin: "0 0 4px" }}>Welcome back, {profile.name}!</h2>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Active Track:</span>
              <select
                value={profile.selectedTrack}
                onChange={(e) => setProfile((p) => ({ ...p, selectedTrack: e.target.value }))}
                className="track-select"
              >
                {Object.keys(TRACKS).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="secondary"
            style={{ marginLeft: "auto" }}
            onClick={() => {
              if (confirm("Reset profile and learning progress?")) {
                localStorage.clear();
                location.reload();
              }
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        {navTab === "curriculum" && (
          <div>
            <div className="sectionHead" style={{ marginTop: "32px" }}>
              <div>
                <span className="eyebrow"><Compass size={14} /> STRUCTURED SYLLABUS</span>
                <h2>{profile.selectedTrack} Learning Progression</h2>
              </div>
              <span style={{ color: "var(--muted)", fontSize: "13px" }}>
                {profile.completed.length} Modules Completed
              </span>
            </div>

            <div className="roadmap-grid">
              {currentLevels.map((lvl, idx) => {
                const isCompleted = profile.completed.includes(lvl.id);
                const isLocked = idx > 0 && !profile.completed.includes(currentLevels[idx - 1].id);

                return (
                  <div
                    key={lvl.id}
                    className={`roadmap-card ${isCompleted ? "completed" : ""} ${isLocked ? "locked" : ""}`}
                    onClick={() => {
                      if (isLocked) return;
                      setActiveLesson(lvl);
                      setUserCode(lvl.starterCode);
                      setTerminalOutput("");
                      setHelperClues([]);
                      setTeacherEvaluation("");
                    }}
                  >
                    <div className="step-badge">
                      {isCompleted ? <CheckCircle size={20} color="#4ade80" /> : idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span className="tier-pill">{lvl.tier}</span>
                        <h3 style={{ margin: 0, fontSize: "16px" }}>{lvl.title}</h3>
                      </div>
                      <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "12px", lineHeight: "1.5" }}>
                        {lvl.summary}
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
        )}

        {navTab === "theory-lab" && (
          <div style={{ marginTop: "32px" }}>
            <div className="sectionHead">
              <div>
                <span className="eyebrow"><Cpu size={14} /> LECTURE & EXPERIMENT LAB</span>
                <h2>AI Theory & Live Terminal Sandbox</h2>
              </div>
            </div>

            <div className="theory-container">
              <div className="panel" style={{ flex: 1 }}>
                <h3>Ask AI Teacher for a Concept Breakdown</h3>
                <div style={{ display: "flex", gap: "10px", margin: "14px 0" }}>
                  <input
                    type="text"
                    value={theoryTopic}
                    onChange={(e) => setTheoryTopic(e.target.value)}
                    placeholder="e.g. recursion, pointers, binary trees"
                    className="styled-input"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    style={{ flex: 1 }}
                  />
                  <button className="primary" onClick={() => requestTheoryLecture(theoryTopic)} disabled={isTheoryLoading}>
                    <Sparkles size={14} /> {isTheoryLoading ? "Lecturing..." : "Teach Me"}
                  </button>
                </div>

                {theoryText ? (
                  <div className="lecture-content">
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", lineHeight: "1.7", fontSize: "13px" }}>
                      {theoryText}
                    </pre>
                  </div>
                ) : (
                  <p style={{ color: "var(--muted)", fontSize: "13px" }}>
                    Type any technical topic above. The AI Teacher will explain the theory, share a real-world metaphor, and provide runnable syntax for the terminal.
                  </p>
                )}
              </div>

              <div className="panel" style={{ flex: 1 }}>
                <div className="editorHead">
                  <span>Live Practice Terminal ({profile.selectedTrack})</span>
                  <button className="runBtn" onClick={() => executeCode(userCode || 'print("hello from terminal!")')}>
                    <Play size={13} /> Run
                  </button>
                </div>

                <textarea
                  className="code-textarea"
                  value={userCode}
                  placeholder={`write ${profile.selectedTrack} code here to experiment with theory...`}
                  onChange={(e) => setUserCode(e.target.value)}
                  style={{ minHeight: "180px" }}
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="off"
                  spellCheck="false"
                />

                <div className="terminal-box">
                  <span style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>
                    Terminal Output:
                  </span>
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{terminalOutput || "Ready."}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
