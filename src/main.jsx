import React, { useEffect, useState, Suspense, lazy, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen,
  Bot,
  Brain,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Code2,
  Flame,
  FolderKanban,
  Github,
  GitBranch,
  GraduationCap,
  Home as HomeIcon,
  Key,
  Lightbulb,
  Menu,
  Moon,
  Play,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings,
  Sparkles,
  Sun,
  Target,
  Terminal,
  Trophy,
  X,
  Zap
} from "lucide-react";
import "./styles.css";

const MonacoEditor = lazy(() => import("@monaco-editor/react"));

const AVAILABLE_MODELS = [
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash (Recommended - Fast & Smart)" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro (Deep Reasoning & Analysis)" },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash (Ultra Fast)" }
];

function CodeEditorWrapper({ value, onChange, language, height = "400px" }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <textarea
        style={{
          width: "100%",
          height,
          background: "#080c15",
          color: "#eef2ff",
          fontFamily: "monospace",
          fontSize: "14px",
          border: "none",
          padding: "16px",
          outline: "none",
          boxSizing: "border-box",
          resize: "none"
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <Suspense
      fallback={
        <div style={{ height, display: "grid", placeItems: "center", color: "#8994aa" }}>
          Loading editor...
        </div>
      }
    >
      <MonacoEditor
        height={height}
        theme="vs-dark"
        language={language}
        value={value}
        onChange={(val) => onChange(val || "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true
        }}
        loading={
          <div style={{ height, display: "grid", placeItems: "center", color: "#8994aa" }}>
            Loading editor...
          </div>
        }
      />
    </Suspense>
  );
}

const STORAGE = "codeverse-v2";

const lessons = [
  {
    id: "variables",
    title: "Variables & Data",
    level: "Beginner",
    xp: 80,
    time: "12 min",
    desc: "Store values, change them, and understand types.",
    lang: "python",
    code: `name = "CodeVerse"\nxp = 100\nprint(name)\nprint(xp)`
  },
  {
    id: "conditions",
    title: "Conditions",
    level: "Beginner",
    xp: 90,
    time: "15 min",
    desc: "Make programs choose what happens next.",
    lang: "python",
    code: `score = 78\n\nif score >= 50:\n    print("Passed")\nelse:\n    print("Try again")`
  },
  {
    id: "loops",
    title: "Loops",
    level: "Beginner",
    xp: 100,
    time: "18 min",
    desc: "Repeat work without repeating yourself.",
    lang: "python",
    code: `for i in range(5):\n    print("Step", i)`
  },
  {
    id: "functions",
    title: "Functions",
    level: "Beginner",
    xp: 120,
    time: "20 min",
    desc: "Turn repeated logic into reusable building blocks.",
    lang: "javascript",
    code: `function greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("Coder"));`
  },
  {
    id: "arrays",
    title: "Arrays & Lists",
    level: "Intermediate",
    xp: 140,
    time: "24 min",
    desc: "Work with collections and visualize indexes.",
    lang: "javascript",
    code: `const scores = [72, 91, 64, 88];\n\nconsole.log(scores[1]);\nconsole.log(scores.length);`
  },
  {
    id: "algorithms",
    title: "Algorithm Thinking",
    level: "Intermediate",
    xp: 180,
    time: "30 min",
    desc: "Break problems into measurable steps.",
    lang: "javascript",
    code: `function findMax(values) {\n  let best = values[0];\n  for (const value of values) {\n    if (value > best) best = value;\n  }\n  return best;\n}\n\nconsole.log(findMax([4, 9, 2, 7]));`
  }
];

const challenges = [
  {
    id: "reverse",
    title: "Reverse a String",
    difficulty: "Easy",
    xp: 100,
    lang: "javascript",
    prompt: "Return the input string reversed.",
    starter: `function reverse(text) {\n  // write your solution\n}\n\nconsole.log(reverse("code"));`,
    answer: `function reverse(text) {\n  return text.split("").reverse().join("");\n}\n\nconsole.log(reverse("code"));`
  },
  {
    id: "fizz",
    title: "FizzBuzz",
    difficulty: "Easy",
    xp: 150,
    lang: "javascript",
    prompt: "Print 1–30. Multiples of 3 become Fizz, 5 become Buzz, both become FizzBuzz.",
    starter: `for (let i = 1; i <= 30; i++) {\n  // write your solution\n}`,
    answer: `for (let i = 1; i <= 30; i++) {\n  if (i % 15 === 0) console.log("FizzBuzz");\n  else if (i % 3 === 0) console.log("Fizz");\n  else if (i % 5 === 0) console.log("Buzz");\n  else console.log(i);\n}`
  },
  {
    id: "binary",
    title: "Binary Search",
    difficulty: "Medium",
    xp: 220,
    lang: "javascript",
    prompt: "Return the index of target in a sorted array, or -1.",
    starter: `function binarySearch(items, target) {\n  // write your solution\n}`,
    answer: `function binarySearch(items, target) {\n  let lo = 0;\n  let hi = items.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (items[mid] === target) return mid;\n    if (items[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}`
  }
];

const projects = [
  {
    id: "todo",
    title: "Smart Todo App",
    tag: "Frontend",
    desc: "Build a polished todo list with filters and local persistence.",
    stack: ["HTML", "CSS", "JavaScript"],
    difficulty: "Beginner"
  },
  {
    id: "weather",
    title: "Weather Dashboard",
    tag: "API",
    desc: "Create a dashboard that fetches and visualizes weather data.",
    stack: ["JavaScript", "REST API"],
    difficulty: "Intermediate"
  },
  {
    id: "chat",
    title: "AI Chat Interface",
    tag: "AI",
    desc: "Build a streaming-style chat interface around an AI backend.",
    stack: ["React", "API", "UX"],
    difficulty: "Advanced"
  },
  {
    id: "game",
    title: "Browser Game",
    tag: "Game",
    desc: "Make a small interactive game with score, state and animations.",
    stack: ["JavaScript", "Canvas"],
    difficulty: "Intermediate"
  }
];

const languages = {
  javascript: { name: "JavaScript", ext: "js" },
  python: { name: "Python (In-Browser)", ext: "py" },
  html: { name: "HTML", ext: "html" },
  css: { name: "CSS", ext: "css" },
  cpp: { name: "C++", ext: "cpp" },
  java: { name: "Java", ext: "java" }
};

const defaults = {
  javascript: `console.log("Hello, CodeVerse!");\nfor (let i = 1; i <= 3; i++) {\n  console.log("Step", i);\n}`,
  python: `name = "CodeVerse"\nprint(f"Hello, {name} from in-browser Python!")\n\nfor i in range(3):\n    print(f"Iteration {i}")`,
  html: `<main class="card">\n  <h1>Hello CodeVerse</h1>\n  <p>Edit the HTML and see it live.</p>\n</main>`,
  css: `.card {\n  font-family: system-ui;\n  padding: 32px;\n  border-radius: 24px;\n  background: #151b2b;\n  color: white;\n}`,
  cpp: `#include <iostream>\n\nint main() {\n  std::cout << "Hello, CodeVerse!";\n  return 0;\n}`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, CodeVerse!");\n  }\n}`
};

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE)) || {};
  } catch {
    return {};
  }
}

function App() {
  const saved = loadState();

  const [page, setPage] = useState(saved.page || "home");
  const [theme, setTheme] = useState(saved.theme || "dark");
  const [xp, setXp] = useState(saved.xp || 420);
  const [streak, setStreak] = useState(saved.streak || 4);
  const [completed, setCompleted] = useState(saved.completed || ["variables"]);
  const [savedProjects, setSavedProjects] = useState(saved.savedProjects || []);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(saved.selectedLesson || lessons[0].id);
  const [selectedChallenge, setSelectedChallenge] = useState(saved.selectedChallenge || challenges[0].id);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const [geminiKey, setGeminiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const [selectedModel, setSelectedModel] = useState(
    localStorage.getItem("gemini_selected_model") || "gemini-2.5-flash"
  );

  const saveGeminiKey = (newKey) => {
    const trimmed = newKey.trim();
    setGeminiKey(trimmed);
    if (trimmed) {
      localStorage.setItem("gemini_api_key", trimmed);
      setToast("Gemini API key saved!");
    } else {
      localStorage.removeItem("gemini_api_key");
      setToast("Gemini API key cleared");
    }
  };

  const handleSelectModel = (modelId) => {
    setSelectedModel(modelId);
    localStorage.setItem("gemini_selected_model", modelId);
    setToast(`Active model: ${modelId}`);
  };

  useEffect(() => {
    const loader = document.getElementById("loading");
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => loader.remove(), 250);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE,
      JSON.stringify({
        page,
        theme,
        xp,
        streak,
        completed,
        savedProjects,
        selectedLesson,
        selectedChallenge
      })
    );
    document.documentElement.dataset.theme = theme;
  }, [page, theme, xp, streak, completed, savedProjects, selectedLesson, selectedChallenge]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const finishLesson = (id) => {
    if (!completed.includes(id)) {
      setCompleted((value) => [...value, id]);
      const lesson = lessons.find((item) => item.id === id);
      const amount = lesson?.xp || 50;
      setXp((value) => value + amount);
      setToast(`Lesson complete · +${amount} XP`);
    } else {
      setToast("Already completed");
    }
  };

  const nav = [
    ["home", "Home", HomeIcon],
    ["learn", "Learn", BookOpen],
    ["aitutor", "AI Dynamic Track", GraduationCap],
    ["playground", "Playground", Terminal],
    ["visual", "Visual Lab", Brain],
    ["projects", "Projects", FolderKanban],
    ["challenges", "Challenges", Target],
    ["debug", "Debug Detective", Search],
    ["career", "Career", BriefcaseBusiness],
    ["github", "Git & GitHub", Github],
    ["settings", "Settings", Settings]
  ];

  return (
    <div className="app">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brandMark">
            <Code2 size={19} />
          </div>
          <span>CodeVerse</span>
          <button className="iconBtn mobileClose" onClick={() => setMobileOpen(false)}>
            <X />
          </button>
        </div>

        <div className="profileMini">
          <div className="avatar">CV</div>
          <div>
            <b>Code Explorer</b>
            <small>Level 4 · {xp} XP</small>
          </div>
        </div>

        <nav>
          {nav.map(([id, label, Icon]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => {
                setPage(id);
                setMobileOpen(false);
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
              {id === "challenges" && <em>3</em>}
              {id === "aitutor" && <span style={{ marginLeft: "auto", fontSize: "10px", color: "#a89dff" }}>AI</span>}
            </button>
          ))}
        </nav>

        <div className="sidebarBottom">
          <div className="streak">
            <Flame size={17} />
            <b>{streak} day streak</b>
            <small>Keep it going!</small>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="iconBtn menu" onClick={() => setMobileOpen(true)}>
            <Menu />
          </button>

          <div className="search">
            <Search size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lessons, projects, challenges..."
            />
          </div>

          <div className="topActions">
            <button
              className="iconBtn"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title="Theme"
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>

            <div className="xpPill">
              <Zap size={15} /> {xp} XP
            </div>
            <div className="avatar">CV</div>
          </div>
        </header>

        {page === "home" && (
          <Home
            go={setPage}
            xp={xp}
            streak={streak}
            completed={completed}
            finish={finishLesson}
            geminiKey={geminiKey}
            onSaveKey={saveGeminiKey}
            selectedModel={selectedModel}
            onSelectModel={handleSelectModel}
          />
        )}
        {page === "learn" && (
          <Learn
            completed={completed}
            selected={selectedLesson}
            setSelected={setSelectedLesson}
            finish={finishLesson}
            search={search}
          />
        )}
        {page === "aitutor" && (
          <CustomAiTutor
            geminiKey={geminiKey}
            selectedModel={selectedModel}
            addXp={(amount) => setXp((v) => v + amount)}
            toast={setToast}
            onOpenSettings={() => setPage("settings")}
          />
        )}
        {page === "playground" && (
          <Playground
            geminiKey={geminiKey}
            selectedModel={selectedModel}
            toast={setToast}
          />
        )}
        {page === "visual" && <VisualLab />}
        {page === "projects" && (
          <Projects saved={savedProjects} setSaved={setSavedProjects} toast={setToast} />
        )}
        {page === "challenges" && (
          <Challenges
            selected={selectedChallenge}
            setSelected={setSelectedChallenge}
            finish={finishLesson}
            addXp={(amount) => setXp((value) => value + amount)}
            toast={setToast}
          />
        )}
        {page === "debug" && <Debug />}
        {page === "career" && <Career />}
        {page === "github" && <GitHubPage />}
        {page === "settings" && (
          <SettingsPage
            theme={theme}
            setTheme={setTheme}
            geminiKey={geminiKey}
            onSaveKey={saveGeminiKey}
            selectedModel={selectedModel}
            onSelectModel={handleSelectModel}
            reset={() => {
              localStorage.removeItem(STORAGE);
              localStorage.removeItem("gemini_api_key");
              localStorage.removeItem("gemini_selected_model");
              localStorage.removeItem("codeverse_ai_course");
              location.reload();
            }}
          />
        )}
      </main>

      {toast && (
        <div className="toast">
          <Check size={17} />
          {toast}
        </div>
      )}
    </div>
  );
}

function PageTitle({ eyebrow, title, desc, children }) {
  return (
    <div className="pageTitle">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      {children}
    </div>
  );
}

/* =========================================================
   CUSTOM AI TUTOR (ANY LANGUAGE DYNAMIC TRACK)
========================================================= */
function CustomAiTutor({ geminiKey, selectedModel, addXp, toast, onOpenSettings }) {
  const [language, setLanguage] = useState("Python");
  const [level, setLevel] = useState("Beginner");
  const [syllabus, setSyllabus] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const savedCourse = JSON.parse(localStorage.getItem("codeverse_ai_course"));
      if (savedCourse && savedCourse.syllabus && savedCourse.syllabus.length > 0) {
        setLanguage(savedCourse.language);
        setLevel(savedCourse.level || "Beginner");
        setSyllabus(savedCourse.syllabus);
        setCurrentStepIndex(savedCourse.currentStepIndex || 0);
        setUserCode(savedCourse.syllabus[savedCourse.currentStepIndex || 0]?.starterCode || "");
      }
    } catch (e) {
      console.error("Failed to load saved AI track", e);
    }
  }, []);

  const saveCourseState = (newSyllabus, newIndex) => {
    localStorage.setItem(
      "codeverse_ai_course",
      JSON.stringify({
        language,
        level,
        syllabus: newSyllabus,
        currentStepIndex: newIndex
      })
    );
  };

  const generateCourse = async () => {
    if (!geminiKey) {
      toast("Please connect your Gemini API key in Settings first!");
      return;
    }

    setIsLoading(true);
    setFeedback("Building your custom structured curriculum with Gemini...");

    const prompt = `You are a curriculum designer for programming education.
Create a high-impact, 6-step progressive lesson syllabus for learning "${language}" at "${level}" level.
Return ONLY valid JSON matching this exact structure with no extra markdown text:
[
  {
    "id": 1,
    "title": "Lesson title",
    "concept": "2-3 clear sentences explaining the underlying concept.",
    "analogy": "A simple, memorable real-life analogy.",
    "starterCode": "Runnable starter snippet for the student to practice",
    "task": "A specific micro-exercise the student must write code for",
    "completed": false
  }
]`;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${geminiKey}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await res.json();
      let raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

      const parsed = JSON.parse(raw);
      setSyllabus(parsed);
      setCurrentStepIndex(0);
      setUserCode(parsed[0]?.starterCode || "");
      saveCourseState(parsed, 0);
      setFeedback("Curriculum ready! Complete Step 1 below.");
    } catch (err) {
      setFeedback("Failed to build track. Please verify your Gemini API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyStep = async () => {
    if (!geminiKey) {
      toast("Please connect your Gemini API key in Settings!");
      return;
    }

    setIsLoading(true);
    setFeedback("Evaluating your solution...");

    const activeStep = syllabus[currentStepIndex];
    const prompt = `You are an encouraging coding teacher evaluating a student's answer for ${language}.
Lesson task: "${activeStep.task}"
Student's code:
\`\`\`
${userCode}
\`\`\`

Evaluate if the code correctly solves the task.
Return ONLY valid JSON in this exact structure:
{
  "passed": true,
  "message": "2-3 sentences of constructive feedback, encouragement, or explanation of what needs fixing."
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

      setFeedback(result.message);

      if (result.passed) {
        addXp(75);
        toast("Step passed! +75 XP");

        const updated = [...syllabus];
        updated[currentStepIndex].completed = true;

        const nextIndex = Math.min(currentStepIndex + 1, syllabus.length - 1);
        setSyllabus(updated);
        setCurrentStepIndex(nextIndex);
        setUserCode(updated[nextIndex]?.starterCode || "");
        saveCourseState(updated, nextIndex);
      }
    } catch (err) {
      setFeedback("Could not verify step. Check network connection or API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const completedCount = syllabus.filter((s) => s.completed).length;
  const progressPercent = syllabus.length ? Math.round((completedCount / syllabus.length) * 100) : 0;
  const activeLesson = syllabus[currentStepIndex];

  return (
    <div className="content">
      <PageTitle
        eyebrow="AI DYNAMIC CURRICULUM"
        title="Master Any Language Step-by-Step"
        desc="Choose any programming language. The AI generates a customized, progressive track with practical milestones saved automatically to your device."
      />

      {!geminiKey && (
        <div style={{ padding: "14px", background: "rgba(251,113,133,0.1)", border: "1px solid var(--danger)", borderRadius: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>A Google Gemini API Key is required to generate dynamic tracks and verify exercises.</span>
          <button className="primary" onClick={onOpenSettings}><Key size={14} /> Connect Key</button>
        </div>
      )}

      {syllabus.length === 0 ? (
        <div className="panel">
          <h2>Create a New AI Track</h2>
          <p className="muted">Type any language you want to study today (e.g., Python, C++, Go, Rust, TypeScript, Java).</p>

          <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. Python, Rust, SQL"
              style={{ padding: "11px 14px", background: "var(--panel2)", border: "1px solid var(--line)", borderRadius: "10px", color: "var(--text)", minWidth: "220px" }}
            />

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              style={{ padding: "11px 14px", background: "var(--panel2)", border: "1px solid var(--line)", borderRadius: "10px", color: "var(--text)" }}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>

            <button className="primary" onClick={generateCourse} disabled={isLoading}>
              <Sparkles size={16} /> Generate Track
            </button>
          </div>

          {feedback && <p style={{ marginTop: "14px", color: "var(--muted)" }}>{feedback}</p>}
        </div>
      ) : (
        <div className="learnLayout">
          {/* Left Step Roadmap */}
          <div className="lessonList">
            <div style={{ padding: "14px", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "14px", marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "8px" }}>
                <b>{language} ({level})</b>
                <span style={{ color: "#a89dff" }}>{progressPercent}% Done</span>
              </div>
              <div className="progress">
                <span style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            {syllabus.map((step, idx) => (
              <button
                key={step.id}
                className={`lessonCard ${idx === currentStepIndex ? "selected" : ""}`}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setUserCode(step.starterCode || "");
                }}
              >
                <div className="lessonIcon">
                  {step.completed ? <Check size={16} /> : <span>{idx + 1}</span>}
                </div>
                <div className="lessonInfo">
                  <b>{step.title}</b>
                  <small>{step.completed ? "Completed" : "In Progress"}</small>
                </div>
              </button>
            ))}

            <button
              className="secondary danger"
              style={{ marginTop: "10px" }}
              onClick={() => {
                localStorage.removeItem("codeverse_ai_course");
                setSyllabus([]);
              }}
            >
              <RotateCcw size={15} /> Reset / Pick New Language
            </button>
          </div>

          {/* Right Active Step Work Area */}
          {activeLesson && (
            <section className="panel lessonDetail">
              <div className="detailTop">
                <div>
                  <span className="eyebrow">STEP {currentStepIndex + 1} OF {syllabus.length}</span>
                  <h2>{activeLesson.title}</h2>
                  <p className="muted">{activeLesson.concept}</p>
                </div>
                {activeLesson.completed && (
                  <span className="done"><Check size={13} /> Complete</span>
                )}
              </div>

              <div className="concept">
                <Lightbulb className="conceptIcon" />
                <div>
                  <b>Mental Analogy</b>
                  <p>{activeLesson.analogy}</p>
                </div>
              </div>

              <div style={{ margin: "16px 0", fontSize: "13px" }}>
                <b>Exercise Task:</b>
                <p style={{ color: "var(--muted)", margin: "4px 0" }}>{activeLesson.task}</p>
              </div>

              <div className="lessonCode" style={{ marginBottom: "14px" }}>
                <div className="miniBar">
                  <span>{language} Exercise Workspace</span>
                </div>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  rows={8}
                  style={{
                    width: "100%",
                    background: "#080c15",
                    border: "none",
                    color: "#eef2ff",
                    fontFamily: "monospace",
                    fontSize: "14px",
                    padding: "16px",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
              </div>

              <div className="detailActions">
                <button className="primary" onClick={verifyStep} disabled={isLoading}>
                  <Check size={16} /> Submit & Check with AI
                </button>
              </div>

              {feedback && (
                <div style={{ marginTop: "16px", padding: "14px", background: "var(--panel2)", borderRadius: "10px", fontSize: "13px", lineHeight: "1.6", border: "1px solid var(--line)" }}>
                  {feedback}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   HOME PAGE (WITH EMBEDDED AI TEACHER)
========================================================= */
function Home({
  go,
  xp,
  streak,
  completed,
  finish,
  geminiKey,
  onSaveKey,
  selectedModel,
  onSelectModel
}) {
  const next = lessons.find((l) => !completed.includes(l.id)) || lessons[0];

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [tempKey, setTempKey] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);

  const handleAskGemini = async (customPrompt) => {
    const question = customPrompt || aiPrompt;
    if (!question.trim()) return;

    if (!geminiKey) {
      setShowKeyModal(true);
      return;
    }

    setIsAiLoading(true);
    setAiResponse(`Thinking with ${selectedModel}...`);

    const systemPrompt = `You are a supportive, clear coding tutor inside CodeVerse.
Context:
- Current lesson: ${next.title} (${next.lang})
- Lesson code:
${next.code}

Student question: ${question}

Provide a practical explanation or hint in 3-5 sentences.`;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${geminiKey}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
      });

      const data = await res.json();
      if (data.error) {
        setAiResponse(`Gemini Error: ${data.error.message || "Invalid API Key"}`);
      } else {
        const reply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No answer received from Gemini.";
        setAiResponse(reply);
      }
    } catch (err) {
      setAiResponse("Failed to connect to Gemini API. Check your network or API key.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="content">
      <section className="hero">
        <div>
          <span className="eyebrow">
            <Sparkles size={14} />
            LEARNING ENGINE 2.0
          </span>
          <h1>
            Don’t just learn code.<br />
            <span>See it happen.</span>
          </h1>
          <p>
            Learn programming through visual explanations, in-browser code execution, practical challenges,
            and an adaptive Gemini AI tutor.
          </p>

          <div className="heroBtns">
            <button className="primary" onClick={() => go("learn")}>
              Continue learning <ChevronRight size={16} />
            </button>
            <button className="secondary" onClick={() => go("playground")}>
              <Terminal size={16} /> Open playground
            </button>
          </div>
        </div>

        <div className="heroOrb">
          <div className="orbCore">
            <Code2 size={50} />
          </div>
          <span className="float f1">AI Teacher</span>
          <span className="float f2">Live Output</span>
          <span className="float f3">Visual Lab</span>
        </div>
      </section>

      <div className="stats">
        <div className="stat">
          <Trophy size={21} />
          <div>
            <b>{xp} XP</b>
            <small>Total experience</small>
          </div>
        </div>
        <div className="stat">
          <Flame size={21} />
          <div>
            <b>{streak} days</b>
            <small>Current streak</small>
          </div>
        </div>
        <div className="stat">
          <Check size={21} />
          <div>
            <b>{completed.length}</b>
            <small>Lessons complete</small>
          </div>
        </div>
        <div className="stat">
          <Target size={21} />
          <div>
            <b>3</b>
            <small>Challenges waiting</small>
          </div>
        </div>
      </div>

      <div className="grid2">
        <section className="panel">
          <div className="panelHead">
            <div>
              <span className="eyebrow">CONTINUE</span>
              <h2>{next.title}</h2>
            </div>
            <span className="xpTag">+{next.xp} XP</span>
          </div>

          <p className="muted">{next.desc}</p>

          <div className="lessonPreview">
            <div className="codeLines">
              {next.code.split("\n").slice(0, 6).map((line, index) => (
                <React.Fragment key={index}>
                  <i>{index + 1}</i>
                  <b>{line || " "}</b>
                </React.Fragment>
              ))}
            </div>
          </div>

          <button className="primary" style={{ marginTop: 15 }} onClick={() => go("learn")}>
            Open lesson <ChevronRight size={16} />
          </button>
        </section>

        <section className="panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            <span className="eyebrow">
              <Bot size={14} /> AI TEACHER
            </span>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <select
                value={selectedModel}
                onChange={(e) => onSelectModel(e.target.value)}
                style={{
                  background: "var(--panel2)",
                  color: "var(--muted)",
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  outline: "none"
                }}
              >
                {AVAILABLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowKeyModal(true)}
                style={{
                  background: "transparent",
                  border: "1px solid var(--line)",
                  color: geminiKey ? "#4ade80" : "#fb7185",
                  borderRadius: "8px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}
              >
                <Key size={12} />
                {geminiKey ? "Key Active" : "Add Key"}
              </button>
            </div>
          </div>

          <h2>What should we build today?</h2>
          <p className="muted">
            Ask for an explanation, debugging help, or an algorithmic breakdown.
          </p>

          <div className="aiPrompt">
            <input
              type="text"
              value={aiPrompt}
              placeholder="Ask anything about this lesson..."
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAskGemini()}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "inherit",
                width: "100%"
              }}
            />
            <button onClick={() => handleAskGemini()} disabled={isAiLoading}>
              <Send size={14} />
            </button>
          </div>

          {aiResponse && (
            <div
              style={{
                marginTop: "14px",
                padding: "12px",
                background: "var(--panel2)",
                borderRadius: "10px",
                fontSize: "13px",
                lineHeight: "1.6",
                whiteSpace: "pre-wrap",
                border: "1px solid var(--line)"
              }}
            >
              {aiResponse}
            </div>
          )}

          <div className="suggestions">
            {["Explain arrays", "Debug my code", "Explain this lesson", "Give me a practice challenge"].map(
              (text) => (
                <span
                  key={text}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setAiPrompt(text);
                    handleAskGemini(text);
                  }}
                >
                  {text}
                </span>
              )
            )}
          </div>
        </section>
      </div>

      {showKeyModal && (
        <div className="modalBack" onClick={() => setShowKeyModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modalClose" onClick={() => setShowKeyModal(false)}>
              <X />
            </button>
            <span className="eyebrow">GEMINI API KEY</span>
            <h2>Enter your Gemini Key</h2>
            <p style={{ color: "var(--muted)", fontSize: "13px", margin: "10px 0 16px" }}>
              To enable the AI Teacher, paste your free Google Gemini API key from Google AI Studio. It is saved only in
              your local browser and is never stored on a server.
            </p>

            <input
              type="password"
              placeholder="AIzaSy..."
              value={tempKey || geminiKey}
              onChange={(e) => setTempKey(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                background: "var(--panel2)",
                border: "1px solid var(--line)",
                borderRadius: "10px",
                color: "var(--text)",
                marginBottom: "14px",
                boxSizing: "border-box"
              }}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="primary full"
                onClick={() => {
                  onSaveKey(tempKey || geminiKey);
                  setShowKeyModal(false);
                }}
              >
                Save Key
              </button>
              {geminiKey && (
                <button
                  className="secondary danger"
                  onClick={() => {
                    onSaveKey("");
                    setTempKey("");
                    setShowKeyModal(false);
                  }}
                >
                  Clear Key
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="sectionHead">
        <div>
          <span className="eyebrow">ROADMAP</span>
          <h2>Recommended lessons</h2>
        </div>
        <button className="textBtn" onClick={() => go("learn")}>
          View all <ChevronRight size={15} />
        </button>
      </div>

      <div className="lessonGrid">
        {lessons.slice(0, 4).map((lesson) => (
          <button className="lessonCard" key={lesson.id} onClick={() => go("learn")}>
            <div className="lessonIcon">
              <BookOpen />
            </div>
            <div className="lessonInfo">
              <b>{lesson.title}</b>
              <p>{lesson.desc}</p>
              <small>{lesson.level} · {lesson.time}</small>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   LEARN PAGE
========================================================= */
function Learn({ completed, selected, setSelected, finish, search }) {
  const filtered = lessons.filter((lesson) =>
    `${lesson.title} ${lesson.desc} ${lesson.level}`.toLowerCase().includes(search.toLowerCase())
  );
  const lesson = lessons.find((item) => item.id === selected) || lessons[0];

  return (
    <div className="content">
      <PageTitle
        eyebrow="LEARN"
        title="Build your programming foundation"
        desc="Every concept connects to code, output and a practical mental model."
      />

      <div className="learnLayout">
        <div className="lessonList">
          {filtered.map((item) => (
            <button
              key={item.id}
              className={`lessonCard ${item.id === selected ? "selected" : ""}`}
              onClick={() => setSelected(item.id)}
            >
              <div className="lessonIcon">
                {completed.includes(item.id) ? <Check /> : <BookOpen />}
              </div>
              <div className="lessonInfo">
                <b>{item.title}</b>
                <p>{item.desc}</p>
                <small>{item.level} · {item.time} · +{item.xp} XP</small>
              </div>
            </button>
          ))}
        </div>

        <section className="panel lessonDetail">
          <div className="detailTop">
            <div>
              <span className="eyebrow">{lesson.level.toUpperCase()}</span>
              <h2>{lesson.title}</h2>
              <p className="muted">{lesson.desc}</p>
            </div>
            {completed.includes(lesson.id) && (
              <span className="done"><Check size={13} /> Complete</span>
            )}
          </div>

          <div className="concept">
            <Lightbulb className="conceptIcon" />
            <div>
              <b>Concept in plain language</b>
              <p>
                Think of this concept as a tool your program can use. Understand what the computer is doing, then use syntax to express that idea.
              </p>
            </div>
          </div>

          <div className="lessonCode">
            <div className="miniBar">
              <span>{languages[lesson.lang]?.name || lesson.lang}</span>
              <span>{languages[lesson.lang]?.ext}</span>
            </div>
            <pre>{lesson.code}</pre>
          </div>

          <div className="detailActions">
            <button className="primary" onClick={() => finish(lesson.id)}>
              <Check size={16} /> Mark complete
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   PLAYGROUND (WITH IN-BROWSER PYTHON VIA PYODIDE & AI REVIEW)
========================================================= */
function Playground({ geminiKey, selectedModel, toast }) {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(defaults.javascript);
  const [output, setOutput] = useState("Click Run to execute your code.");
  const [preview, setPreview] = useState(false);
  const [pyodideInstance, setPyodideInstance] = useState(null);
  const [isPyLoading, setIsPyLoading] = useState(false);
  const [aiReview, setAiReview] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);

  const changeLanguage = (val) => {
    setLanguage(val);
    setCode(defaults[val] || "");
    setOutput("Ready.");
    setAiReview("");
  };

  const run = async () => {
    // 1. In-Browser JavaScript Execution
    if (language === "javascript") {
      const logs = [];
      try {
        const original = console.log;
        console.log = (...args) => {
          logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
        };
        new Function(code)();
        console.log = original;
        setOutput(logs.length ? logs.join("\n") : "Program finished with no console output.");
      } catch (err) {
        setOutput(`Error: ${err?.message || String(err)}`);
      }
      return;
    }

    // 2. In-Browser Python Execution via Pyodide
    if (language === "python") {
      setOutput("Running Python in browser via WebAssembly...");
      try {
        let py = pyodideInstance;
        if (!py) {
          if (!window.loadPyodide) {
            setOutput("Pyodide engine is still loading from CDN. Please wait 5 seconds and run again.");
            return;
          }
          setIsPyLoading(true);
          py = await window.loadPyodide();
          setPyodideInstance(py);
          setIsPyLoading(false);
        }

        py.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);
        py.runPython(code);
        const stdout = py.runPython("sys.stdout.getvalue()");
        const stderr = py.runPython("sys.stderr.getvalue()");
        setOutput(stdout || stderr || "Python executed successfully with no output.");
      } catch (err) {
        setOutput(`Python Error: ${err?.message || String(err)}`);
      }
      return;
    }

    // 3. HTML/CSS Live Sandbox Preview
    if (language === "html" || language === "css") {
      setPreview(true);
      setOutput("Live preview updated.");
      return;
    }

    setOutput(`${languages[language]?.name} execution requires a backend server sandbox.`);
  };

  const handleReviewCode = async () => {
    if (!geminiKey) {
      toast("Please connect your Gemini API key in Settings first!");
      return;
    }

    setIsReviewing(true);
    setAiReview("AI Reviewer is analyzing your code...");

    const prompt = `Review this ${language} code as a senior developer.
\`\`\`${language}
${code}
\`\`\`

Provide:
1. Quality Score (out of 10)
2. Big-O Time & Space Complexity estimate
3. Readability & Potential Edge Cases
4. One refactored senior-level improvement snippet`;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${geminiKey}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No review returned.";
      setAiReview(reply);
    } catch (err) {
      setAiReview("Failed to get AI review. Check network or key.");
    } finally {
      setIsReviewing(false);
    }
  };

  const previewDocument =
    language === "html"
      ? code
      : `<style>${language === "css" ? code : ""}</style><div class="card"><h2>CodeVerse Preview</h2><p>Live preview active.</p></div>`;

  return (
    <div className="content">
      <PageTitle
        eyebrow="PLAYGROUND"
        title="Code. Run. See."
        desc="JavaScript and Python run 100% inside your browser tab without any servers. HTML & CSS render live previews."
      />

      <div className="playground">
        <section className="editorPanel">
          <div className="editorHead">
            <div className="langTabs">
              {Object.entries(languages).map(([key, val]) => (
                <button
                  key={key}
                  className={language === key ? "active" : ""}
                  onClick={() => changeLanguage(key)}
                >
                  {val.name}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "6px", marginRight: "8px" }}>
              <button
                className="secondary"
                style={{ padding: "6px 10px", fontSize: "11px" }}
                onClick={handleReviewCode}
                disabled={isReviewing}
              >
                <Sparkles size={12} /> Review
              </button>
              <button className="runBtn" onClick={run} disabled={isPyLoading}>
                <Play size={13} /> {isPyLoading ? "Loading Py..." : "Run"}
              </button>
            </div>
          </div>

          <CodeEditorWrapper
            language={language === "python" ? "python" : language}
            value={code}
            onChange={(val) => setCode(val)}
            height="470px"
          />
        </section>

        <section className="outputPanel">
          <div className="outputTabs">
            <button className={!preview ? "active" : ""} onClick={() => setPreview(false)}>
              Output
            </button>
            <button className={preview ? "active" : ""} onClick={() => setPreview(true)}>
              Preview
            </button>
          </div>

          {preview && (language === "html" || language === "css") ? (
            <iframe className="previewFrame" title="preview" sandbox="" srcDoc={previewDocument} />
          ) : (
            <pre className="output">{output}</pre>
          )}

          <div className="runMeta">
            <span><i className="statusDot" /> Ready</span>
            <span>{languages[language]?.name}</span>
          </div>
        </section>
      </div>

      {aiReview && (
        <div className="panel" style={{ marginTop: "16px" }}>
          <span className="eyebrow"><Sparkles size={13} /> AI CODE REVIEW</span>
          <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "13px", lineHeight: "1.6", color: "var(--text)", margin: "10px 0 0" }}>
            {aiReview}
          </pre>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   VISUAL LAB (WITH STEPPING ALGORITHM VISUALIZER)
========================================================= */
function VisualLab() {
  const [values, setValues] = useState([34, 72, 51, 91, 18, 64, 42, 83]);
  const [target, setTarget] = useState(64);
  const [step, setStep] = useState(-1);

  const sorted = [...values].sort((a, b) => a - b);
  const mid = step >= 0 ? Math.floor(step / 2) : -1;

  const handleBubbleSortStep = () => {
    const arr = [...values];
    let swapped = false;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        const tmp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = tmp;
        swapped = true;
        break;
      }
    }
    setValues(arr);
  };

  return (
    <div className="content">
      <PageTitle
        eyebrow="VISUAL LAB"
        title="See algorithms think"
        desc="Interactive visualizations making invisible program state and sorting mechanics visible."
      />

      <div className="visualGrid">
        <section className="panel">
          <div className="panelHead">
            <div>
              <span className="eyebrow">DATA STRUCTURES</span>
              <h2>Array & Sorting Playground</h2>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button className="secondary" onClick={handleBubbleSortStep}>
                Step Sort
              </button>
              <button
                className="secondary"
                onClick={() =>
                  setValues(Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10))
                }
              >
                <RotateCcw size={15} /> Randomize
              </button>
            </div>
          </div>

          <div className="bars">
            {values.map((val, idx) => (
              <div className="barCol" key={idx}>
                <div className="bar" style={{ height: `${val * 2}px` }}>
                  <span>{val}</span>
                </div>
                <small>[{idx}]</small>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panelHead">
            <div>
              <span className="eyebrow">SEARCH ALGORITHM</span>
              <h2>Binary search</h2>
            </div>
          </div>

          <div className="searchControl">
            <label>
              Target
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
              />
            </label>
            <button className="primary" onClick={() => setStep(0)}>Start</button>
          </div>

          <div className="binary">
            {sorted.map((val, idx) => (
              <div
                className={`binaryCell ${idx === mid ? "focus" : ""} ${val === target ? "found" : ""}`}
                key={idx}
              >
                {val}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   PROJECTS
========================================================= */
function Projects({ saved, setSaved, toast }) {
  const [active, setActive] = useState(null);

  const create = (p) => {
    setSaved((val) => (val.includes(p.id) ? val : [...val, p.id]));
    toast(`${p.title} added to My Projects`);
  };

  return (
    <div className="content">
      <PageTitle
        eyebrow="PROJECT STUDIO"
        title="Build something real"
        desc="Transform code into practical work."
      />

      <div className="projectGrid">
        {projects.map((p) => (
          <article className="projectCard" key={p.id}>
            <div className="projectTop">
              <span className="projectTag">{p.tag}</span>
              <span>{p.difficulty}</span>
            </div>
            <h2>{p.title}</h2>
            <p>{p.desc}</p>
            <div className="stack">
              {p.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
            <button className="primary full" onClick={() => { create(p); setActive(p); }}>
              {saved.includes(p.id) ? "In My Projects" : "Start project"}
            </button>
          </article>
        ))}
      </div>

      {active && (
        <div className="modalBack" onClick={() => setActive(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modalClose" onClick={() => setActive(null)}><X /></button>
            <span className="eyebrow">PROJECT WORKSPACE</span>
            <h2>{active.title}</h2>
            <p>{active.desc}</p>
            <button className="primary full" onClick={() => setActive(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   CHALLENGES
========================================================= */
function Challenges({ selected, setSelected, addXp, toast }) {
  const challenge = challenges.find((item) => item.id === selected) || challenges[0];
  const [code, setCode] = useState(challenge.starter);

  useEffect(() => {
    setCode(challenge.starter);
  }, [selected]);

  const submit = () => {
    const isGood = code.replace(/\s/g, "") === challenge.answer.replace(/\s/g, "");
    if (isGood) {
      addXp(challenge.xp);
      toast(`Challenge passed · +${challenge.xp} XP`);
    } else {
      toast("Not quite — check logic again.");
    }
  };

  return (
    <div className="content">
      <PageTitle
        eyebrow="CHALLENGES"
        title="Practice under pressure"
        desc="Solve focused exercises with immediate verification."
      />

      <div className="challengeLayout">
        <div className="challengeList">
          {challenges.map((item) => (
            <button
              className={item.id === selected ? "active" : ""}
              key={item.id}
              onClick={() => setSelected(item.id)}
            >
              <div>
                <b>{item.title}</b>
                <small>{item.difficulty} · +{item.xp} XP</small>
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>

        <section className="panel challengeMain">
          <span className="eyebrow">{challenge.difficulty.toUpperCase()} · {challenge.lang.toUpperCase()}</span>
          <h2>{challenge.title}</h2>
          <p>{challenge.prompt}</p>

          <div className="challengeEditor">
            <CodeEditorWrapper
              language={challenge.lang}
              value={code}
              onChange={(val) => setCode(val)}
              height="300px"
            />
          </div>

          <div className="detailActions">
            <button className="primary" onClick={submit}>
              <Check size={16} /> Check solution
            </button>
            <button className="secondary" onClick={() => setCode(challenge.starter)}>
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   DEBUG DETECTIVE
========================================================= */
function Debug() {
  const [step, setStep] = useState(0);
  const lines = [
    "const scores = [10, 20, 30];",
    "let total = 0;",
    "for (let i = 0; i <= scores.length; i++) {",
    "  total += scores[i];",
    "}",
    "console.log(total);"
  ];
  const fixes = [
    "The loop uses <=, so it runs once after the final valid index.",
    "At i = 3, scores[3] is undefined.",
    "Change <= to < so i stops at 2.",
    "Now every array access points to a real value."
  ];

  return (
    <div className="content">
      <PageTitle eyebrow="DEBUG DETECTIVE" title="Find the bug" desc="Reason step-by-step through execution." />
      <div className="debugGrid">
        <section className="panel bugCode">
          <div className="miniBar">
            <span>broken-example.js</span>
            <span className="errorBadge">1 bug</span>
          </div>
          {lines.map((line, index) => (
            <div className={`debugLine ${index === 2 ? "buggy" : ""}`} key={index}>
              <i>{index + 1}</i>
              <code>{line}</code>
            </div>
          ))}
        </section>
        <section className="panel detective">
          <span className="eyebrow">INVESTIGATION · {step + 1}/4</span>
          <h2>Why does the output become NaN?</h2>
          <div className="clue">
            <Search />
            <p>{fixes[step]}</p>
          </div>
          <button className="primary full" onClick={() => setStep((step + 1) % 4)}>Next clue</button>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   CAREER MODE & GITHUB PRACTICE
========================================================= */
function Career() {
  const paths = [
    ["Frontend Engineer", "HTML · CSS · JS · React", "72%"],
    ["Backend Engineer", "APIs · Databases · Systems", "34%"],
    ["AI Engineer", "Python · ML · LLMs", "18%"]
  ];

  return (
    <div className="content">
      <PageTitle eyebrow="CAREER MODE" title="Turn learning into a direction" desc="Structured career paths." />
      <div className="pathGrid">
        {paths.map((p) => (
          <div className="panel path" key={p[0]}>
            <span className="eyebrow">CAREER PATH</span>
            <h2>{p[0]}</h2>
            <p>{p[1]}</p>
            <div className="progress"><span style={{ width: p[2] }} /></div>
            <b>{p[2]} complete</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function GitHubPage() {
  return (
    <div className="content">
      <PageTitle eyebrow="GIT & GITHUB" title="Learn the workflow" desc="Version control practice." />
      <div className="gitGrid">
        <div className="panel">
          <Github size={30} />
          <h2>Commit simulator</h2>
          <p className="muted">Understand the working tree → staging → commit flow.</p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SETTINGS PAGE
========================================================= */
function SettingsPage({
  theme,
  setTheme,
  geminiKey,
  onSaveKey,
  selectedModel,
  onSelectModel,
  reset
}) {
  const [inputVal, setInputVal] = useState(geminiKey);

  return (
    <div className="content">
      <PageTitle
        eyebrow="SETTINGS"
        title="Your learning environment"
        desc="Control appearance, API keys, active models, and local learning data."
      />

      <div className="settingsGrid">
        <div className="panel setting">
          <div>
            <Moon />
            <div>
              <b>Appearance</b>
              <p>Switch dark/light UI.</p>
            </div>
          </div>
          <button className="switch" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <span className={theme === "dark" ? "on" : ""} />
          </button>
        </div>

        <div className="panel setting" style={{ flexDirection: "column", alignItems: "stretch", gap: "14px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Key style={{ color: "#8b7cff" }} />
            <div>
              <b>Google Gemini API Key</b>
              <p style={{ margin: "2px 0", fontSize: "11px", color: "var(--muted)" }}>
                Paste your personal Gemini key from Google AI Studio. Stored strictly in local browser storage.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="password"
              placeholder="Paste AIzaSy... key"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 12px",
                background: "var(--panel2)",
                border: "1px solid var(--line)",
                borderRadius: "8px",
                color: "var(--text)"
              }}
            />
            <button className="primary" onClick={() => onSaveKey(inputVal)}>
              Save
            </button>
          </div>
        </div>

        <div className="panel setting" style={{ flexDirection: "column", alignItems: "stretch", gap: "14px" }}>
          <div>
            <b>Gemini Model Engine</b>
            <p style={{ margin: "2px 0", fontSize: "11px", color: "var(--muted)" }}>
              Select the active model used across AI Tutoring and Code Review.
            </p>
          </div>

          <select
            value={selectedModel}
            onChange={(e) => onSelectModel(e.target.value)}
            style={{
              padding: "10px",
              background: "var(--panel2)",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              color: "var(--text)",
              fontSize: "13px",
              outline: "none"
            }}
          >
            {AVAILABLE_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="panel setting">
          <div>
            <RotateCcw />
            <div>
              <b>Reset local progress</b>
              <p>Clears XP, courses, lesson completion, projects and settings on this device.</p>
            </div>
          </div>
          <button className="secondary danger" onClick={reset}>Reset data</button>
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
