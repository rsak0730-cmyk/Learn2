import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import Editor from "@monaco-editor/react";
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
  Home as HomeIcon,
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
  Users,
  X,
  Zap
} from "lucide-react";
import "./styles.css";

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
    code: `name = "CodeVerse"
xp = 100
print(name)
print(xp)`
  },
  {
    id: "conditions",
    title: "Conditions",
    level: "Beginner",
    xp: 90,
    time: "15 min",
    desc: "Make programs choose what happens next.",
    lang: "python",
    code: `score = 78

if score >= 50:
    print("Passed")
else:
    print("Try again")`
  },
  {
    id: "loops",
    title: "Loops",
    level: "Beginner",
    xp: 100,
    time: "18 min",
    desc: "Repeat work without repeating yourself.",
    lang: "python",
    code: `for i in range(5):
    print("Step", i)`
  },
  {
    id: "functions",
    title: "Functions",
    level: "Beginner",
    xp: 120,
    time: "20 min",
    desc: "Turn repeated logic into reusable building blocks.",
    lang: "javascript",
    code: `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("Coder"));`
  },
  {
    id: "arrays",
    title: "Arrays & Lists",
    level: "Intermediate",
    xp: 140,
    time: "24 min",
    desc: "Work with collections and visualize indexes.",
    lang: "javascript",
    code: `const scores = [72, 91, 64, 88];

console.log(scores[1]);
console.log(scores.length);`
  },
  {
    id: "algorithms",
    title: "Algorithm Thinking",
    level: "Intermediate",
    xp: 180,
    time: "30 min",
    desc: "Break problems into measurable steps.",
    lang: "javascript",
    code: `function findMax(values) {
  let best = values[0];

  for (const value of values) {
    if (value > best) best = value;
  }

  return best;
}

console.log(findMax([4, 9, 2, 7]));`
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
    starter: `function reverse(text) {
  // write your solution
}

console.log(reverse("code"));`,
    answer: `function reverse(text) {
  return text.split("").reverse().join("");
}

console.log(reverse("code"));`
  },
  {
    id: "fizz",
    title: "FizzBuzz",
    difficulty: "Easy",
    xp: 150,
    lang: "javascript",
    prompt:
      "Print 1–30. Multiples of 3 become Fizz, 5 become Buzz, both become FizzBuzz.",
    starter: `for (let i = 1; i <= 30; i++) {
  // write your solution
}`,
    answer: `for (let i = 1; i <= 30; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}`
  },
  {
    id: "binary",
    title: "Binary Search",
    difficulty: "Medium",
    xp: 220,
    lang: "javascript",
    prompt: "Return the index of target in a sorted array, or -1.",
    starter: `function binarySearch(items, target) {
  // write your solution
}`,
    answer: `function binarySearch(items, target) {
  let lo = 0;
  let hi = items.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);

    if (items[mid] === target) return mid;

    if (items[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  return -1;
}`
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
  python: { name: "Python", ext: "py" },
  html: { name: "HTML", ext: "html" },
  css: { name: "CSS", ext: "css" },
  cpp: { name: "C++", ext: "cpp" },
  java: { name: "Java", ext: "java" }
};

const defaults = {
  javascript: `console.log("Hello, CodeVerse!");`,
  python: `name = "CodeVerse"
print(f"Hello, {name}!")`,
  html: `<main class="card">
  <h1>Hello CodeVerse</h1>
  <p>Edit the HTML and see it live.</p>
</main>`,
  css: `.card {
  font-family: system-ui;
  padding: 32px;
  border-radius: 24px;
  background: #151b2b;
  color: white;
}`,
  cpp: `#include <iostream>

int main() {
  std::cout << "Hello, CodeVerse!";
  return 0;
}`,
  java: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, CodeVerse!");
  }
}`
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE));
    return saved || {};
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

  useEffect(() => {
    const loader = document.getElementById("loading");
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => loader.remove(), 300);
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
  }, [
    page,
    theme,
    xp,
    streak,
    completed,
    savedProjects,
    selectedLesson,
    selectedChallenge
  ]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 2200);

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

          <button
            className="iconBtn mobileClose"
            onClick={() => setMobileOpen(false)}
          >
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
          <button
            className="iconBtn menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu />
          </button>

          <div className="search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search lessons, projects, challenges..."
            />
          </div>

          <div className="topActions">
            <button
              className="iconBtn"
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
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

        {page === "playground" && <Playground />}
        {page === "visual" && <VisualLab />}
        {page === "projects" && (
          <Projects
            saved={savedProjects}
            setSaved={setSavedProjects}
            toast={setToast}
          />
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
            reset={() => {
              localStorage.removeItem(STORAGE);
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

function Home({ go, xp, streak, completed, finish }) {
  const next =
    lessons.find((lesson) => !completed.includes(lesson.id)) ||
    lessons[0];

  return (
    <div className="content">
      <section className="hero">
        <div>
          <span className="eyebrow">
            <Sparkles size={14} />
            LEARNING ENGINE 2.0
          </span>

          <h1>
            Don’t just learn code.
            <br />
            <span>See it happen.</span>
          </h1>

          <p>
            Learn programming through visual explanations, interactive
            code, practical challenges, projects and an AI-powered
            learning workflow.
          </p>

          <div className="heroBtns">
            <button className="primary" onClick={() => go("learn")}>
              Continue learning
              <ChevronRight size={16} />
            </button>

            <button
              className="secondary"
              onClick={() => go("playground")}
            >
              <Terminal size={16} />
              Open playground
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
              {next.code
                .split("\n")
                .slice(0, 6)
                .map((line, index) => (
                  <React.Fragment key={index}>
                    <i>{index + 1}</i>
                    <b>{line || " "}</b>
                  </React.Fragment>
                ))}
            </div>
          </div>

          <button
            className="primary"
            style={{ marginTop: 15 }}
            onClick={() => go("learn")}
          >
            Open lesson
            <ChevronRight size={16} />
          </button>
        </section>

        <section className="panel">
          <span className="eyebrow">
            <Bot size={14} />
            AI TEACHER
          </span>

          <h2>What should we build today?</h2>

          <p className="muted">
            Ask for an explanation, debugging help, a project idea,
            or a visual breakdown of a difficult concept.
          </p>

          <div className="aiPrompt">
            <span>Explain recursion visually...</span>
            <button>
              <Send size={14} />
            </button>
          </div>

          <div className="suggestions">
            <span>Explain arrays</span>
            <span>Debug my code</span>
            <span>Build a game</span>
            <span>Learn Python</span>
          </div>
        </section>
      </div>

      <div className="sectionHead">
        <div>
          <span className="eyebrow">ROADMAP</span>
          <h2>Recommended lessons</h2>
        </div>

        <button className="textBtn" onClick={() => go("learn")}>
          View all
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="lessonGrid">
        {lessons.slice(0, 4).map((lesson) => (
          <button
            className="lessonCard"
            key={lesson.id}
            onClick={() => go("learn")}
          >
            <div className="lessonIcon">
              <BookOpen />
            </div>

            <div className="lessonInfo">
              <b>{lesson.title}</b>
              <p>{lesson.desc}</p>
              <small>
                {lesson.level} · {lesson.time}
              </small>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Learn({
  completed,
  selected,
  setSelected,
  finish,
  search
}) {
  const filtered = lessons.filter((lesson) =>
    `${lesson.title} ${lesson.desc} ${lesson.level}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const lesson =
    lessons.find((item) => item.id === selected) || lessons[0];

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
              className={`lessonCard ${
                item.id === selected ? "selected" : ""
              }`}
              onClick={() => setSelected(item.id)}
            >
              <div className="lessonIcon">
                {completed.includes(item.id) ? (
                  <Check />
                ) : (
                  <BookOpen />
                )}
              </div>

              <div className="lessonInfo">
                <b>{item.title}</b>
                <p>{item.desc}</p>
                <small>
                  {item.level} · {item.time} · +{item.xp} XP
                </small>
              </div>
            </button>
          ))}
        </div>

        <section className="panel lessonDetail">
          <div className="detailTop">
            <div>
              <span className="eyebrow">
                {lesson.level.toUpperCase()}
              </span>

              <h2>{lesson.title}</h2>

              <p className="muted">{lesson.desc}</p>
            </div>

            {completed.includes(lesson.id) && (
              <span className="done">
                <Check size={13} />
                Complete
              </span>
            )}
          </div>

          <div className="concept">
            <Lightbulb className="conceptIcon" />

            <div>
              <b>Concept in plain language</b>

              <p>
                Think of this concept as a tool your program can use.
                The goal is not to memorize syntax. Understand what
                the computer is doing and then use the syntax to
                express that idea.
              </p>
            </div>
          </div>

          <div className="lessonCode">
            <div className="miniBar">
              <span>
                {languages[lesson.lang]?.name || lesson.lang}
              </span>

              <span>{languages[lesson.lang]?.ext}</span>
            </div>

            <pre>{lesson.code}</pre>
          </div>

          <div className="detailActions">
            <button
              className="primary"
              onClick={() => finish(lesson.id)}
            >
              <Check size={16} />
              Mark complete
            </button>

            <button className="secondary">
              <Play size={16} />
              Visualize
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Playground() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(defaults.javascript);
  const [output, setOutput] = useState(
    "Click Run to execute your JavaScript."
  );
  const [preview, setPreview] = useState(false);

  const changeLanguage = (value) => {
    setLanguage(value);
    setCode(defaults[value] || "");
    setOutput("Ready.");
  };

  const run = () => {
    if (language === "javascript") {
      const logs = [];

      try {
        const original = console.log;

        console.log = (...args) => {
          logs.push(
            args
              .map((value) =>
                typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value)
              )
              .join(" ")
          );
        };

        new Function(code)();

        console.log = original;

        setOutput(
          logs.length
            ? logs.join("\n")
            : "Program finished with no console output."
        );
      } catch (error) {
        setOutput(
          `Error: ${error?.message || String(error)}`
        );
      }

      return;
    }

    if (language === "html" || language === "css") {
      setPreview(true);
      setOutput("Live preview updated.");
      return;
    }

    setOutput(
      `${languages[language]?.name} execution requires a secure backend sandbox.`
    );
  };

  const previewDocument =
    language === "html"
      ? code
      : `<style>${language === "css" ? code : ""}</style>
<div class="card">
  <h2>CodeVerse Preview</h2>
  <p>Edit your HTML/CSS and run again.</p>
</div>`;

  return (
    <div className="content">
      <PageTitle
        eyebrow="PLAYGROUND"
        title="Code. Run. See."
        desc="Experiment freely. JavaScript runs in-browser; native languages should be connected to a secure execution sandbox."
      />

      <div className="playground">
        <section className="editorPanel">
          <div className="editorHead">
            <div className="langTabs">
              {Object.entries(languages).map(([key, value]) => (
                <button
                  key={key}
                  className={language === key ? "active" : ""}
                  onClick={() => changeLanguage(key)}
                >
                  {value.name}
                </button>
              ))}
            </div>

            <button className="runBtn" onClick={run}>
              <Play size={13} />
              Run
            </button>
          </div>

          <Editor
            height="470px"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 15 },
              automaticLayout: true
            }}
          />
        </section>

        <section className="outputPanel">
          <div className="outputTabs">
            <button
              className={!preview ? "active" : ""}
              onClick={() => setPreview(false)}
            >
              Output
            </button>

            <button
              className={preview ? "active" : ""}
              onClick={() => setPreview(true)}
            >
              Preview
            </button>
          </div>

          {preview &&
          (language === "html" || language === "css") ? (
            <iframe
              className="previewFrame"
              title="CodeVerse preview"
              sandbox=""
              srcDoc={previewDocument}
            />
          ) : (
            <pre className="output">{output}</pre>
          )}

          <div className="runMeta">
            <span>
              <i className="statusDot" />
              Ready
            </span>
            <span>{languages[language]?.name}</span>
          </div>
        </section>
      </div>

      <div className="hintRow">
        <Sparkles size={15} />
        <span>
          Production execution for Python, C++ and Java should use
          isolated server-side containers with strict CPU, memory,
          network and filesystem limits.
        </span>
      </div>
    </div>
  );
}

function VisualLab() {
  const [values, setValues] = useState([34, 72, 51, 91, 18, 64, 42, 83]);
  const [target, setTarget] = useState(64);
  const [step, setStep] = useState(-1);

  const sorted = [...values].sort((a, b) => a - b);
  const mid = step >= 0 ? Math.floor(step / 2) : -1;

  return (
    <div className="content">
      <PageTitle
        eyebrow="VISUAL LAB"
        title="See algorithms think"
        desc="Interactive visualizations make invisible program state visible."
      />

      <div className="visualGrid">
        <section className="panel">
          <div className="panelHead">
            <div>
              <span className="eyebrow">DATA STRUCTURES</span>
              <h2>Array playground</h2>
            </div>

            <button
              className="secondary"
              onClick={() =>
                setValues(
                  Array.from(
                    { length: 8 },
                    () => Math.floor(Math.random() * 90) + 10
                  )
                )
              }
            >
              <RotateCcw size={15} />
              Randomize
            </button>
          </div>

          <div className="bars">
            {values.map((value, index) => (
              <div className="barCol" key={index}>
                <div
                  className="bar"
                  style={{ height: `${value * 2}px` }}
                >
                  <span>{value}</span>
                </div>
                <small>[{index}]</small>
              </div>
            ))}
          </div>

          <div className="visualExplain">
            <b>What you are seeing</b>
            <p>
              Each bar is an array value. The index underneath is
              how a program locates that value in constant time.
            </p>
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
                onChange={(event) =>
                  setTarget(Number(event.target.value))
                }
              />
            </label>

            <button
              className="primary"
              onClick={() => setStep(0)}
            >
              Start
            </button>
          </div>

          <div className="binary">
            {sorted.map((value, index) => (
              <div
                className={`binaryCell ${
                  index === mid ? "focus" : ""
                } ${value === target ? "found" : ""}`}
                key={index}
              >
                {value}
              </div>
            ))}
          </div>

          <p className="muted">
            {step < 0
              ? "Choose a target and start the visualization."
              : sorted.includes(target)
                ? `Checking the middle of the remaining range. Target ${target} is highlighted.`
                : "The target is not in this array."}
          </p>
        </section>
      </div>
    </div>
  );
}

function Projects({ saved, setSaved, toast }) {
  const [active, setActive] = useState(null);

  const create = (project) => {
    setSaved((value) =>
      value.includes(project.id) ? value : [...value, project.id]
    );
    toast(`${project.title} added to My Projects`);
  };

  return (
    <div className="content">
      <PageTitle
        eyebrow="PROJECT STUDIO"
        title="Build something real"
        desc="Projects turn syntax into a portfolio. Start from a guided brief, then make it yours."
      />

      <div className="projectGrid">
        {projects.map((project) => (
          <article className="projectCard" key={project.id}>
            <div className="projectTop">
              <span className="projectTag">{project.tag}</span>
              <span>{project.difficulty}</span>
            </div>

            <h2>{project.title}</h2>
            <p>{project.desc}</p>

            <div className="stack">
              {project.stack.map((stackItem) => (
                <span key={stackItem}>{stackItem}</span>
              ))}
            </div>

            <button
              className="primary full"
              onClick={() => {
                create(project);
                setActive(project);
              }}
            >
              {saved.includes(project.id) ? (
                <>
                  <Check size={16} />
                  In My Projects
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Start project
                </>
              )}
            </button>
          </article>
        ))}
      </div>

      <section className="panel aiBuilder">
        <div className="aiIcon">
          <Sparkles />
        </div>

        <div>
          <span className="eyebrow">AI PROJECT BUILDER</span>
          <h2>Have an idea? Turn it into milestones.</h2>
          <p>
            Describe a project, and the AI layer can generate
            requirements, learning prerequisites, file structure,
            tasks and tests.
          </p>
        </div>

        <button
          className="secondary"
          onClick={() =>
            setActive({
              title: "Custom Project",
              desc: "AI project planning workspace"
            })
          }
        >
          Create custom
          <ChevronRight size={16} />
        </button>
      </section>

      {active && (
        <div className="modalBack" onClick={() => setActive(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <button className="modalClose" onClick={() => setActive(null)}>
              <X />
            </button>

            <span className="eyebrow">PROJECT WORKSPACE</span>
            <h2>{active.title}</h2>
            <p>{active.desc}</p>

            <div className="milestones">
              <b>1. Understand requirements</b>
              <b>2. Build the smallest working version</b>
              <b>3. Add tests</b>
              <b>4. Polish UI and document it</b>
            </div>

            <button className="primary full" onClick={() => setActive(null)}>
              Open workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Challenges({ selected, setSelected, addXp, toast }) {
  const challenge =
    challenges.find((item) => item.id === selected) || challenges[0];

  const [code, setCode] = useState(challenge.starter);

  useEffect(() => {
    setCode(challenge.starter);
  }, [selected]);

  const submit = () => {
    const good =
      code.replace(/\s/g, "") ===
      challenge.answer.replace(/\s/g, "");

    if (good) {
      addXp(challenge.xp);
      toast(`Challenge passed · +${challenge.xp} XP`);
    } else {
      toast("Not quite — run the code and inspect the logic.");
    }
  };

  return (
    <div className="content">
      <PageTitle
        eyebrow="CHALLENGES"
        title="Practice under pressure"
        desc="Solve small problems, get immediate feedback, and earn XP."
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
                <small>
                  {item.difficulty} · +{item.xp} XP
                </small>
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>

        <section className="panel challengeMain">
          <span className="eyebrow">
            {challenge.difficulty.toUpperCase()} ·{" "}
            {challenge.lang.toUpperCase()}
          </span>

          <h2>{challenge.title}</h2>
          <p>{challenge.prompt}</p>

          <div className="challengeEditor">
            <Editor
              height="330px"
              theme="vs-dark"
              language={challenge.lang}
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14
              }}
            />
          </div>

          <div className="detailActions">
            <button className="primary" onClick={submit}>
              <Check size={16} />
              Check solution
            </button>

            <button
              className="secondary"
              onClick={() => setCode(challenge.starter)}
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

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
      <PageTitle
        eyebrow="DEBUG DETECTIVE"
        title="Find the bug"
        desc="Debugging is a reasoning skill. Follow state, not guesses."
      />

      <div className="debugGrid">
        <section className="panel bugCode">
          <div className="miniBar">
            <span>broken-example.js</span>
            <span className="errorBadge">1 bug</span>
          </div>

          {lines.map((line, index) => (
            <div
              className={`debugLine ${index === 2 ? "buggy" : ""}`}
              key={index}
            >
              <i>{index + 1}</i>
              <code>{line}</code>
            </div>
          ))}
        </section>

        <section className="panel detective">
          <span className="eyebrow">
            INVESTIGATION · {step + 1}/4
          </span>

          <h2>Why does the output become NaN?</h2>

          <div className="clue">
            <Search />
            <p>{fixes[step]}</p>
          </div>

          <div className="debugSteps">
            {fixes.map((_, index) => (
              <button
                className={index <= step ? "done" : ""}
                key={index}
                onClick={() => setStep(index)}
              >
                <span>{index + 1}</span>
                {index === step ? "Current clue" : `Clue ${index + 1}`}
              </button>
            ))}
          </div>

          <button
            className="primary full"
            onClick={() => setStep((step + 1) % 4)}
          >
            Next clue
            <ChevronRight size={16} />
          </button>
        </section>
      </div>
    </div>
  );
}

function Career() {
  const paths = [
    ["Frontend Engineer", "HTML · CSS · JS · React", "72%"],
    ["Backend Engineer", "APIs · Databases · Systems", "34%"],
    ["AI Engineer", "Python · ML · LLMs", "18%"]
  ];

  return (
    <div className="content">
      <PageTitle
        eyebrow="CAREER MODE"
        title="Turn learning into a direction"
        desc="Use skill paths and practical milestones instead of random tutorials."
      />

      <div className="careerHero panel">
        <div className="careerIcon">
          <BriefcaseBusiness />
        </div>

        <div>
          <span className="eyebrow">YOUR NEXT STEP</span>
          <h2>Frontend Engineer</h2>
          <p>
            Finish JavaScript fundamentals, then build two
            portfolio projects.
          </p>
        </div>

        <button className="primary">
          Start interview
          <Bot size={16} />
        </button>
      </div>

      <div className="pathGrid">
        {paths.map((path) => (
          <div className="panel path" key={path[0]}>
            <span className="eyebrow">CAREER PATH</span>
            <h2>{path[0]}</h2>
            <p>{path[1]}</p>

            <div className="progress">
              <span style={{ width: path[2] }} />
            </div>

            <b>{path[2]} complete</b>

            <button className="textBtn">
              View roadmap
              <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function GitHubPage() {
  return (
    <div className="content">
      <PageTitle
        eyebrow="GIT & GITHUB"
        title="Learn the workflow"
        desc="Practice version control concepts before connecting a real GitHub account."
      />

      <div className="gitGrid">
        <div className="panel">
          <Github size={30} />
          <h2>Commit simulator</h2>
          <p className="muted">
            Understand the working tree → staging → commit flow.
          </p>

          <div className="gitFlow">
            <span>Working tree</span>
            <ChevronRight />
            <span>Staged</span>
            <ChevronRight />
            <span>Commit</span>
          </div>

          <button className="primary">Create practice commit</button>
        </div>

        <div className="panel">
          <GitBranch size={30} />
          <h2>Branch lab</h2>
          <p className="muted">
            Experiment with feature branches, merges and conflicts in a safe
            learning model.
          </p>

          <div className="branchGraph">
            <span>main</span>
            <i />
            <span>feature</span>
          </div>

          <button className="secondary">Open branch lab</button>
        </div>
      </div>

      <div className="securityNote">
        <Github />
        <div>
          <b>Real GitHub integration</b>
          <p>
            For production OAuth/API access, add a backend that
            stores OAuth tokens securely. Never put GitHub secrets
            in client-side source.
          </p>
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ theme, setTheme, reset }) {
  return (
    <div className="content">
      <PageTitle
        eyebrow="SETTINGS"
        title="Your learning environment"
        desc="Control appearance and local learning data."
      />

      <div className="settingsGrid">
        <div className="panel setting">
          <div>
            <Moon />
            <div>
              <b>Appearance</b>
              <p>Switch between dark and light UI.</p>
            </div>
          </div>

          <button
            className="switch"
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
          >
            <span className={theme === "dark" ? "on" : ""} />
          </button>
        </div>

        <div className="panel setting">
          <div>
            <RotateCcw />
            <div>
              <b>Reset local progress</b>
              <p>
                Clears XP, lesson completion, projects and settings
                on this browser.
              </p>
            </div>
          </div>

          <button className="secondary danger" onClick={reset}>
            Reset data
          </button>
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");

if (rootElement) {
  try {
    createRoot(rootElement).render(<App />);
  } catch (error) {
    console.error("CodeVerse startup error:", error);
    rootElement.innerHTML = `
      <div style="min-height:100vh;display:grid;place-items:center;padding:24px;background:#070a12;color:#eef2ff;font-family:system-ui,sans-serif;">
        <div style="width:min(700px,100%);padding:30px;border:1px solid #273044;border-radius:18px;background:#0d121e;">
          <h1>CodeVerse couldn't start</h1>
          <p style="color:#8994aa;line-height:1.6;">A JavaScript error prevented CodeVerse from loading.</p>
          <pre style="white-space:pre-wrap;overflow:auto;padding:16px;border-radius:12px;background:#070a12;color:#ff8fa3;">${String(error?.stack || error)}</pre>
        </div>
      </div>
    `;
  }
}
