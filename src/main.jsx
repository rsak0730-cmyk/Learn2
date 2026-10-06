import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import Editor from "@monaco-editor/react";
import {
  BookOpen, Bot, Brain, BriefcaseBusiness, Check, ChevronRight, Code2,
  Flame, FolderKanban, Github, GitBranch, GraduationCap, Home, LayoutGrid,
  Lightbulb, Menu, Moon, Play, Plus, RotateCcw, Search, Send, Settings,
  Sparkles, Sun, Target, Terminal, Trophy, Users, X, Zap
} from "lucide-react";
import "./styles.css";

const STORAGE = "codeverse-v2";

const lessons = [
  { id:"variables", title:"Variables & Data", level:"Beginner", xp:80, time:"12 min", desc:"Store values, change them, and understand types.", lang:"python", code:"name = \"CodeVerse\"\\nxp = 100\\nprint(name)\\nprint(xp)" },
  { id:"conditions", title:"Conditions", level:"Beginner", xp:90, time:"15 min", desc:"Make programs choose what happens next.", lang:"python", code:"score = 78\\n\\nif score >= 50:\\n    print(\"Passed\")\\nelse:\\n    print(\"Try again\")" },
  { id:"loops", title:"Loops", level:"Beginner", xp:100, time:"18 min", desc:"Repeat work without repeating yourself.", lang:"python", code:"for i in range(5):\\n    print(\"Step\", i)" },
  { id:"functions", title:"Functions", level:"Beginner", xp:120, time:"20 min", desc:"Turn repeated logic into reusable building blocks.", lang:"javascript", code:"function greet(name) {\\n  return `Hello, ${name}!`;\\n}\\n\\nconsole.log(greet(\"Coder\"));" },
  { id:"arrays", title:"Arrays & Lists", level:"Intermediate", xp:140, time:"24 min", desc:"Work with collections and visualize indexes.", lang:"javascript", code:"const scores = [72, 91, 64, 88];\\nconsole.log(scores[1]);\\nconsole.log(scores.length);" },
  { id:"algorithms", title:"Algorithm Thinking", level:"Intermediate", xp:180, time:"30 min", desc:"Break problems into measurable steps.", lang:"javascript", code:"function findMax(values) {\\n  let best = values[0];\\n  for (const value of values) {\\n    if (value > best) best = value;\\n  }\\n  return best;\\n}\\n\\nconsole.log(findMax([4, 9, 2, 7]));" }
];

const challenges = [
  { id:"reverse", title:"Reverse a String", difficulty:"Easy", xp:100, lang:"javascript", prompt:"Return the input string reversed.", starter:"function reverse(text) {\\n  // write your solution\\n}\\n\\nconsole.log(reverse(\"code\"));", answer:"function reverse(text) {\\n  return text.split(\"\").reverse().join(\"\");\\n}\\n\\nconsole.log(reverse(\"code\"));" },
  { id:"fizz", title:"FizzBuzz", difficulty:"Easy", xp:150, lang:"javascript", prompt:"Print 1–30. Multiples of 3 become Fizz, 5 become Buzz, both become FizzBuzz.", starter:"for (let i = 1; i <= 30; i++) {\\n  // write your solution\\n}", answer:"for (let i = 1; i <= 30; i++) {\\n  if (i % 15 === 0) console.log(\"FizzBuzz\");\\n  else if (i % 3 === 0) console.log(\"Fizz\");\\n  else if (i % 5 === 0) console.log(\"Buzz\");\\n  else console.log(i);\\n}" },
  { id:"binary", title:"Binary Search", difficulty:"Medium", xp:220, lang:"javascript", prompt:"Return the index of target in a sorted array, or -1.", starter:"function binarySearch(items, target) {\\n  // write your solution\\n}", answer:"function binarySearch(items, target) {\\n  let lo = 0, hi = items.length - 1;\\n  while (lo <= hi) {\\n    const mid = Math.floor((lo + hi) / 2);\\n    if (items[mid] === target) return mid;\\n    if (items[mid] < target) lo = mid + 1;\\n    else hi = mid - 1;\\n  }\\n  return -1;\\n}" }
];

const projects = [
  { id:"todo", title:"Smart Todo App", tag:"Frontend", desc:"Build a polished todo list with filters and local persistence.", stack:["HTML","CSS","JavaScript"], difficulty:"Beginner" },
  { id:"weather", title:"Weather Dashboard", tag:"API", desc:"Create a dashboard that fetches and visualizes weather data.", stack:["JavaScript","REST API"], difficulty:"Intermediate" },
  { id:"chat", title:"AI Chat Interface", tag:"AI", desc:"Build a streaming-style chat interface around an AI backend.", stack:["React","API","UX"], difficulty:"Advanced" },
  { id:"game", title:"Browser Game", tag:"Game", desc:"Make a small interactive game with score, state and animations.", stack:["JavaScript","Canvas"], difficulty:"Intermediate" }
];

const languages = {
  javascript:{name:"JavaScript", ext:"js"},
  python:{name:"Python", ext:"py"},
  html:{name:"HTML", ext:"html"},
  css:{name:"CSS", ext:"css"},
  cpp:{name:"C++", ext:"cpp"},
  java:{name:"Java", ext:"java"}
};

const defaults = {
  javascript:'console.log("Hello, CodeVerse!");',
  python:'name = "CodeVerse"\\nprint(f"Hello, {name}!")',
  html:'<main class="card">\\n  <h1>Hello CodeVerse</h1>\\n  <p>Edit the HTML and see it live.</p>\\n</main>',
  css:'.card {\\n  font-family: system-ui;\\n  padding: 32px;\\n  border-radius: 24px;\\n  background: #151b2b;\\n  color: white;\\n}',
  cpp:'#include <iostream>\\nint main() {\\n  std::cout << "Hello, CodeVerse!";\\n  return 0;\\n}',
  java:'public class Main {\\n  public static void main(String[] args) {\\n    System.out.println("Hello, CodeVerse!");\\n  }\\n}'
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE));
    return saved || {};
  } catch { return {}; }
}

function App() {
  const saved = loadState();
  const [page,setPage] = useState(saved.page || "home");
  const [theme,setTheme] = useState(saved.theme || "dark");
  const [xp,setXp] = useState(saved.xp || 420);
  const [streak,setStreak] = useState(saved.streak || 4);
  const [completed,setCompleted] = useState(saved.completed || ["variables"]);
  const [savedProjects,setSavedProjects] = useState(saved.savedProjects || []);
  const [mobileOpen,setMobileOpen] = useState(false);
  const [selectedLesson,setSelectedLesson] = useState(saved.selectedLesson || lessons[0].id);
  const [selectedChallenge,setSelectedChallenge] = useState(saved.selectedChallenge || challenges[0].id);
  const [search,setSearch] = useState("");
  const [toast,setToast] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify({page,theme,xp,streak,completed,savedProjects,selectedLesson,selectedChallenge}));
    document.documentElement.dataset.theme = theme;
  },[page,theme,xp,streak,completed,savedProjects,selectedLesson,selectedChallenge]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(()=>setToast(""),2200);
    return ()=>clearTimeout(t);
  },[toast]);

  const finishLesson = id => {
    if (!completed.includes(id)) {
      setCompleted(v=>[...v,id]);
      const l=lessons.find(x=>x.id===id);
      setXp(v=>v+(l?.xp||50));
      setToast(`Lesson complete · +${l?.xp||50} XP`);
    } else setToast("Already completed");
  };

  const nav = [
    ["home","Home",Home],["learn","Learn",BookOpen],["playground","Playground",Terminal],
    ["visual","Visual Lab",Brain],["projects","Projects",FolderKanban],["challenges","Challenges",Target],
    ["debug","Debug Detective",Search],["career","Career",BriefcaseBusiness],["github","Git & GitHub",Github],
    ["settings","Settings",Settings]
  ];

  return <div className="app">
    <aside className={`sidebar ${mobileOpen?"open":""}`}>
      <div className="brand"><div className="brandMark"><Code2 size={19}/></div><span>CodeVerse</span><button className="iconBtn mobileClose" onClick={()=>setMobileOpen(false)}><X/></button></div>
      <div className="profileMini"><div className="avatar">CV</div><div><b>Code Explorer</b><small>Level 4 · {xp} XP</small></div></div>
      <nav>{nav.map(([id,label,Icon])=><button key={id} className={page===id?"active":""} onClick={()=>{setPage(id);setMobileOpen(false)}}><Icon size={18}/><span>{label}</span>{id==="challenges"&&<em>3</em>}</button>)}</nav>
      <div className="sidebarBottom"><div className="streak"><Flame size={17}/><b>{streak} day streak</b><small>Keep it going!</small></div></div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="iconBtn menu" onClick={()=>setMobileOpen(true)}><Menu/></button>
        <div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search lessons, projects, challenges..."/></div>
        <div className="topActions">
          <button className="iconBtn" onClick={()=>setTheme(theme==="dark"?"light":"dark")} title="Theme">{theme==="dark"?<Sun/>:<Moon/>}</button>
          <div className="xpPill"><Zap size={15}/> {xp} XP</div>
          <div className="avatar">CV</div>
        </div>
      </header>

      {page==="home" && <Home go={setPage} xp={xp} streak={streak} completed={completed} finish={finishLesson}/>}
      {page==="learn" && <Learn completed={completed} selected={selectedLesson} setSelected={setSelectedLesson} finish={finishLesson} search={search}/>}
      {page==="playground" && <Playground/>}
      {page==="visual" && <VisualLab/>}
      {page==="projects" && <Projects saved={savedProjects} setSaved={setSavedProjects} toast={setToast}/>}
      {page==="challenges" && <Challenges selected={selectedChallenge} setSelected={setSelectedChallenge} finish={finishLesson} addXp={n=>setXp(v=>v+n)} toast={setToast}/>}
      {page==="debug" && <Debug/>}
      {page==="career" && <Career/>}
      {page==="github" && <GitHubPage/>}
      {page==="settings" && <SettingsPage theme={theme} setTheme={setTheme} reset={()=>{localStorage.removeItem(STORAGE);location.reload()}}/>}
    </main>
    {toast && <div className="toast"><Check size={17}/>{toast}</div>}
  </div>
}

function PageTitle({eyebrow,title,desc,children}) {
  return <div className="pageTitle"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{desc}</p></div>{children}</div>
}

function Home({go,xp,streak,completed,finish}) {
  const next=lessons.find(l=>!completed.includes(l.id))||lessons[0];
  return <div className="content">
    <section className="hero">
      <div><span className="eyebrow"><Sparkles size={14}/> LEARNING ENGINE 2.0</span><h1>Don’t just learn code.<br/><span>See it happen.</span></h1><p>Learn programming by writing real code, watching state change, and building projects — one practical step at a time.</p><div className="heroBtns"><button className="primary" onClick={()=>go("learn")}><Play size={16}/> Continue learning</button><button className="secondary" onClick={()=>go("playground")}><Code2 size={16}/> Open playground</button></div></div>
      <div className="heroOrb"><div className="orbCore"><Code2 size={42}/></div><span className="float f1">PYTHON</span><span className="float f2">JS</span><span className="float f3">C++</span></div>
    </section>

    <div className="stats">
      <Stat icon={Zap} label="Total XP" value={xp}/>
      <Stat icon={Flame} label="Day streak" value={`${streak} days`}/>
      <Stat icon={GraduationCap} label="Lessons" value={`${completed.length}/${lessons.length}`}/>
      <Stat icon={Trophy} label="Level" value={Math.floor(xp/100)+1}/>
    </div>

    <div className="grid2">
      <section className="panel">
        <div className="panelHead"><div><span className="eyebrow">UP NEXT</span><h2>{next.title}</h2></div><span className="xpTag">+{next.xp} XP</span></div>
        <p className="muted">{next.desc}</p><div className="lessonPreview"><div className="codeLines"><i>01</i><span><b>{next.lang==="python"?"for":"function"}</b> learning() &#123;</span><i>02</i><span>  <b>practice</b>(every_day);</span><i>03</i><span>&#125;</span></div></div>
        <button className="textBtn" onClick={()=>finish(next.id)}>Mark lesson complete <ChevronRight size={16}/></button>
      </section>
      <section className="panel">
        <div className="panelHead"><div><span className="eyebrow">AI TEACHER</span><h2>What are you building?</h2></div><Bot size={24}/></div>
        <p className="muted">Describe your goal and CodeVerse can turn it into a learning path, project milestones and practice tasks.</p>
        <div className="aiPrompt"><span>“I want to build a...”</span><button onClick={()=>go("projects")}><Send size={16}/></button></div>
        <div className="suggestions"><span>🌐 Website</span><span>🤖 AI app</span><span>🎮 Game</span><span>📱 Tool</span></div>
      </section>
    </div>

    <section><div className="sectionHead"><div><span className="eyebrow">CURRICULUM</span><h2>Build your fundamentals</h2></div><button className="textBtn" onClick={()=>go("learn")}>View all <ChevronRight size={16}/></button></div>
      <div className="lessonGrid">{lessons.slice(0,4).map(l=><LessonCard key={l.id} l={l} done={completed.includes(l.id)} onClick={()=>go("learn")}/>)}</div>
    </section>
  </div>
}

function Stat({icon:Icon,label,value}) { return <div className="stat"><Icon size={19}/><div><b>{value}</b><small>{label}</small></div></div> }

function Learn({completed,selected,setSelected,finish,search}) {
  const filtered=lessons.filter(l=>`${l.title} ${l.desc}`.toLowerCase().includes(search.toLowerCase()));
  const current=lessons.find(l=>l.id===selected)||lessons[0];
  return <div className="content"><PageTitle eyebrow="CURRICULUM" title="Learn by doing" desc="Short lessons, runnable examples and visual explanations.">
    <div className="levelProgress"><small>Level progress</small><div><span style={{width:`${(xpSafe(completed.length)/6)*100}%`}}/></div></div>
  </PageTitle>
  <div className="learnLayout"><div className="lessonList">{filtered.map(l=><LessonCard key={l.id} l={l} done={completed.includes(l.id)} selected={selected===l.id} onClick={()=>setSelected(l.id)}/>)}</div>
  <LessonDetail lesson={current} done={completed.includes(current.id)} finish={finish}/></div></div>
}
function xpSafe(n){return Math.min(6,n)}

function LessonCard({l,done,selected,onClick}) {
  return <button className={`lessonCard ${selected?"selected":""}`} onClick={onClick}><div className="lessonIcon">{done?<Check/>:<BookOpen/>}</div><div className="lessonInfo"><b>{l.title}</b><p>{l.desc}</p><small>{l.level} · {l.time} · +{l.xp} XP</small></div><ChevronRight size={17}/></button>
}

function LessonDetail({lesson,done,finish}) {
  return <section className="panel lessonDetail"><div className="detailTop"><span className="eyebrow">{lesson.level.toUpperCase()} · {lesson.time}</span>{done&&<span className="done"><Check size={14}/> Completed</span>}</div><h2>{lesson.title}</h2><p>{lesson.desc}</p>
    <div className="concept"><div className="conceptIcon"><Lightbulb/></div><div><b>Core idea</b><p>Change one thing at a time, run the program, and inspect the result. The goal is not memorizing syntax — it is learning how state and decisions move through a program.</p></div></div>
    <div className="lessonCode"><div className="miniBar"><span>Example · {languages[lesson.lang]?.name}</span><span>Runnable</span></div><pre>{lesson.code}</pre></div>
    <div className="detailActions"><button className="primary" onClick={()=>finish(lesson.id)}>{done?"Completed":"Complete lesson"} <Check size={16}/></button><button className="secondary">Ask AI Teacher <Bot size={16}/></button></div>
  </section>
}

function Playground() {
  const [lang,setLang]=useState("javascript"), [code,setCode]=useState(defaults.javascript), [output,setOutput]=useState("Ready. Run your code to see output."), [tab,setTab]=useState("output"), [running,setRunning]=useState(false);
  const run=async()=>{
    setRunning(true); setOutput("Running...");
    if(lang==="javascript"){
      const lines=[];
      const original=console.log;
      console.log=(...args)=>lines.push(args.map(x=>typeof x==="object"?JSON.stringify(x):String(x)).join(" "));
      try{new Function(code)();setOutput(lines.join("\\n")||"Program finished with no console output.");}
      catch(e){setOutput(`Error: ${e.message}`)} finally{console.log=original}
    } else if(lang==="html"||lang==="css") {
      setOutput("Live preview updated.");
      setTab("preview");
    } else {
      setOutput(`${languages[lang].name} execution is ready for a secure /api/execute sandbox.\\n\\nThe browser intentionally does not execute arbitrary native-language code directly.`);
    }
    setTimeout(()=>setRunning(false),300);
  };
  return <div className="content"><PageTitle eyebrow="PLAYGROUND" title="Write. Run. Inspect." desc="A real browser editor with safe JavaScript execution and live web preview."/>
    <div className="playground"><div className="editorPanel"><div className="editorHead"><div className="langTabs">{Object.entries(languages).map(([k,v])=><button key={k} className={lang===k?"active":""} onClick={()=>{setLang(k);setCode(defaults[k])}}>{v.name}</button>)}</div><button className="runBtn" onClick={run} disabled={running}><Play size={15}/>{running?"Running":"Run"}</button></div><Editor height="470px" theme="vs-dark" language={lang==="cpp"?"cpp":lang} value={code} onChange={v=>setCode(v||"")} options={{fontSize:14,minimap:{enabled:false},padding:{top:18},automaticLayout:true}}/></div>
      <div className="outputPanel"><div className="outputTabs"><button className={tab==="output"?"active":""} onClick={()=>setTab("output")}>Output</button><button className={tab==="preview"?"active":""} onClick={()=>setTab("preview")}>Preview</button><button>State</button></div>{tab==="preview"?<Preview lang={lang} code={code}/>:<pre className="output">{output}</pre>}<div className="runMeta"><span><span className="statusDot"/> Browser sandbox</span><span>UTF-8</span></div></div></div>
    <div className="hintRow"><Lightbulb size={16}/><span><b>Learning tip:</b> change a single line, run again, then predict what changed before looking at the output.</span></div>
  </div>
}

function Preview({lang,code}) {
  if(lang==="html") return <iframe title="preview" className="previewFrame" sandbox srcDoc={`<!doctype html><html><head><style>body{font-family:system-ui;padding:30px;background:#0b0f19;color:white} ${""}</style></head><body>${code}</body></html>`}/>;
  if(lang==="css") return <iframe title="preview" className="previewFrame" sandbox srcDoc={`<style>${code}</style><div class="card"><h2>CSS Preview</h2><p>Edit your styles in the editor.</p></div>`}/>;
  return <div className="emptyPreview"><Code2 size={30}/><b>Preview is for HTML/CSS</b><span>Switch to HTML or CSS to see live browser output.</span></div>
}

function VisualLab() {
  const [values,setValues]=useState([34,72,51,91,18,64,42,83]), [target,setTarget]=useState(64), [step,setStep]=useState(-1);
  const sorted=[...values].sort((a,b)=>a-b), mid=step>=0?Math.floor(step/2):-1;
  return <div className="content"><PageTitle eyebrow="VISUAL LAB" title="See algorithms think" desc="Interactive visualizations make invisible program state visible."/>
    <div className="visualGrid"><section className="panel"><div className="panelHead"><div><span className="eyebrow">DATA STRUCTURES</span><h2>Array playground</h2></div><button className="secondary" onClick={()=>setValues(Array.from({length:8},()=>Math.floor(Math.random()*90)+10))}><RotateCcw size={15}/> Randomize</button></div><div className="bars">{values.map((v,i)=><div className="barCol" key={i}><div className="bar" style={{height:`${v*2}px`}}><span>{v}</span></div><small>[{i}]</small></div>)}</div><div className="visualExplain"><b>What you are seeing</b><p>Each bar is an array value. The index underneath is how a program locates that value in constant time.</p></div></section>
    <section className="panel"><div className="panelHead"><div><span className="eyebrow">SEARCH ALGORITHM</span><h2>Binary search</h2></div></div><div className="searchControl"><label>Target <input type="number" value={target} onChange={e=>setTarget(+e.target.value)}/></label><button className="primary" onClick={()=>setStep(0)}>Start</button></div><div className="binary">{sorted.map((v,i)=><div className={`binaryCell ${i===mid?"focus":""} ${v===target?"found":""}`} key={i}>{v}</div>)}</div><p className="muted">{step<0?"Choose a target and start the visualization.":sorted.includes(target)?`Checking the middle of the remaining range. Target ${target} is highlighted.`:`The target is not in this array.`}</p></section></div>
  </div>
}

function Projects({saved,setSaved,toast}) {
  const [active,setActive]=useState(null);
  const create=p=>{setSaved(v=>v.includes(p.id)?v:[...v,p.id]);toast(`${p.title} added to My Projects`)};
  return <div className="content"><PageTitle eyebrow="PROJECT STUDIO" title="Build something real" desc="Projects turn syntax into a portfolio. Start from a guided brief, then make it yours."/>
    <div className="projectGrid">{projects.map(p=><article className="projectCard" key={p.id}><div className="projectTop"><span className="projectTag">{p.tag}</span><span>{p.difficulty}</span></div><h2>{p.title}</h2><p>{p.desc}</p><div className="stack">{p.stack.map(s=><span key={s}>{s}</span>)}</div><button className="primary full" onClick={()=>{create(p);setActive(p)}}>{saved.includes(p.id)?<><Check size={16}/> In My Projects</>:<><Plus size={16}/> Start project</>}</button></article>)}</div>
    <section className="panel aiBuilder"><div className="aiIcon"><Sparkles/></div><div><span className="eyebrow">AI PROJECT BUILDER</span><h2>Have an idea? Turn it into milestones.</h2><p>Describe a project, and the AI layer can generate requirements, learning prerequisites, file structure, tasks and tests.</p></div><button className="secondary" onClick={()=>setActive({title:"Custom Project",desc:"AI project planning workspace"})}>Create custom <ChevronRight size={16}/></button></section>
    {active&&<div className="modalBack" onClick={()=>setActive(null)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modalClose" onClick={()=>setActive(null)}><X/></button><span className="eyebrow">PROJECT WORKSPACE</span><h2>{active.title}</h2><p>{active.desc}</p><div className="milestones"><b>1. Understand requirements</b><b>2. Build the smallest working version</b><b>3. Add tests</b><b>4. Polish UI and document it</b></div><button className="primary full" onClick={()=>setActive(null)}>Open workspace</button></div></div>}
  </div>
}

function Challenges({selected,setSelected,addXp,toast}) {
  const c=challenges.find(x=>x.id===selected)||challenges[0];
  const [code,setCode]=useState(c.starter);
  useEffect(()=>setCode(c.starter),[selected]);
  const submit=()=>{
    const good=code.replace(/\s/g,"")===c.answer.replace(/\s/g,"");
    if(good){addXp(c.xp);toast(`Challenge passed · +${c.xp} XP`)} else toast("Not quite — run the code and inspect the logic.");
  };
  return <div className="content"><PageTitle eyebrow="CHALLENGES" title="Practice under pressure" desc="Solve small problems, get immediate feedback, and earn XP."/>
    <div className="challengeLayout"><div className="challengeList">{challenges.map(x=><button className={x.id===selected?"active":""} key={x.id} onClick={()=>setSelected(x.id)}><div><b>{x.title}</b><small>{x.difficulty} · +{x.xp} XP</small></div><ChevronRight size={16}/></button>)}</div><section className="panel challengeMain"><span className="eyebrow">{c.difficulty.toUpperCase()} · {c.lang.toUpperCase()}</span><h2>{c.title}</h2><p>{c.prompt}</p><div className="challengeEditor"><Editor height="330px" theme="vs-dark" language={c.lang} value={code} onChange={v=>setCode(v||"")} options={{minimap:{enabled:false},fontSize:14}}/></div><div className="detailActions"><button className="primary" onClick={submit}><Check size={16}/> Check solution</button><button className="secondary" onClick={()=>setCode(c.starter)}><RotateCcw size={16}/> Reset</button></div></section></div>
  </div>
}

function Debug() {
  const [step,setStep]=useState(0);
  const lines=["const scores = [10, 20, 30];","let total = 0;","for (let i = 0; i <= scores.length; i++) {","  total += scores[i];","}","console.log(total);"];
  const fixes=["The loop uses <=, so it runs once after the final valid index.","At i = 3, scores[3] is undefined.","Change <= to < so i stops at 2.","Now every array access points to a real value."];
  return <div className="content"><PageTitle eyebrow="DEBUG DETECTIVE" title="Find the bug" desc="Debugging is a reasoning skill. Follow state, not guesses."/>
    <div className="debugGrid"><section className="panel bugCode"><div className="miniBar"><span>broken-example.js</span><span className="errorBadge">1 bug</span></div>{lines.map((l,i)=><div className={`debugLine ${i===2?"buggy":""}`} key={i}><i>{i+1}</i><code>{l}</code></div>)}</section><section className="panel detective"><span className="eyebrow">INVESTIGATION · {step+1}/4</span><h2>Why does the output become NaN?</h2><div className="clue"><Search/><p>{fixes[step]}</p></div><div className="debugSteps">{fixes.map((_,i)=><button className={i<=step?"done":""} key={i} onClick={()=>setStep(i)}><span>{i+1}</span>{i===step?"Current clue":"Clue "+(i+1)}</button>)}</div><button className="primary full" onClick={()=>setStep((step+1)%4)}>Next clue <ChevronRight size={16}/></button></section></div>
  </div>
}

function Career() {
  const paths=[["Frontend Engineer","HTML · CSS · JS · React","72%"],["Backend Engineer","APIs · Databases · Systems","34%"],["AI Engineer","Python · ML · LLMs","18%"]];
  return <div className="content"><PageTitle eyebrow="CAREER MODE" title="Turn learning into a direction" desc="Use skill paths and practical milestones instead of random tutorials."/>
    <div className="careerHero panel"><div className="careerIcon"><BriefcaseBusiness/></div><div><span className="eyebrow">YOUR NEXT STEP</span><h2>Frontend Engineer</h2><p>Finish JavaScript fundamentals, then build two portfolio projects.</p></div><button className="primary">Start interview <Bot size={16}/></button></div>
    <div className="pathGrid">{paths.map(p=><div className="panel path" key={p[0]}><span className="eyebrow">CAREER PATH</span><h2>{p[0]}</h2><p>{p[1]}</p><div className="progress"><span style={{width:p[2]}}/></div><b>{p[2]} complete</b><button className="textBtn">View roadmap <ChevronRight size={16}/></button></div>)}</div>
  </div>
}

function GitHubPage() {
  return <div className="content"><PageTitle eyebrow="GIT & GITHUB" title="Learn the workflow" desc="Practice version control concepts before connecting a real GitHub account."/>
    <div className="gitGrid"><div className="panel"><Github size={30}/><h2>Commit simulator</h2><p className="muted">Understand the working tree → staging → commit flow.</p><div className="gitFlow"><span>Working tree</span><ChevronRight/><span>Staged</span><ChevronRight/><span>Commit</span></div><button className="primary">Create practice commit</button></div><div className="panel"><GitBranch size={30}/><h2>Branch lab</h2><p className="muted">Experiment with feature branches, merges and conflicts in a safe learning model.</p><div className="branchGraph"><span>main</span><i/><span>feature</span></div><button className="secondary">Open branch lab</button></div></div>
    <div className="securityNote"><Github/><div><b>Real GitHub integration</b><p>For production OAuth/API access, add a backend that stores OAuth tokens securely. Never put GitHub secrets in client-side source.</p></div></div>
  </div>
}

function SettingsPage({theme,setTheme,reset}) {
  return <div className="content"><PageTitle eyebrow="SETTINGS" title="Your learning environment" desc="Control appearance and local learning data."/>
    <div className="settingsGrid"><div className="panel setting"><div><Moon/><div><b>Appearance</b><p>Switch between dark and light UI.</p></div></div><button className="switch" onClick={()=>setTheme(theme==="dark"?"light":"dark")}><span className={theme==="dark"?"on":""}/></button></div>
    <div className="panel setting"><div><RotateCcw/><div><b>Reset local progress</b><p>Clears XP, lesson completion, projects and settings on this browser.</p></div></div><button className="secondary danger" onClick={reset}>Reset data</button></div></div>
  </div>
}

createRoot(document.getElementById("root")).render(<App/>);
