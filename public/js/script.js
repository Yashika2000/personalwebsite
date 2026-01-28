// ---------- Tabs ----------
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function showTab(id){
  tabs.forEach(t => t.classList.toggle("is-active", t.dataset.tab === id));
  panels.forEach(p => p.classList.toggle("is-visible", p.id === id));
  // nice UX: focus editor when entering Write
  if (id === "write") setTimeout(() => document.getElementById("editor").focus(), 120);
}

tabs.forEach(t => t.addEventListener("click", () => showTab(t.dataset.tab)));

document.getElementById("goWrite").addEventListener("click", () => showTab("write"));

// ---------- Prompts ----------
const prompts = [
  "What do I secretly wish someone would understand about me right now?",
  "What would I do today if I trusted myself 10% more?",
  "Write a letter to your future self as if she’s already safe and thriving.",
  "What did I tolerate recently that I’m done tolerating?",
  "If my feelings were weather, what’s the forecast—and what do I need to carry?",
  "One moment I’m proud of from the last 7 days—and why it matters.",
  "What’s one belief I’m ready to release, even if slowly?",
  "Describe a life that feels soft, beautiful, and honest. What’s one step toward it?",
  "What do I want to be remembered for (by myself, not the world)?",
  "Write the truth, then write the kinder truth.",
  "What’s an ending I’m still carrying, and what closure can I give myself?",
  "Where am I overperforming to feel loved?",
  "What would ‘self-respect’ look like in one specific situation this week?"
];

function pickPrompt(){
  const p = prompts[Math.floor(Math.random() * prompts.length)];
  document.getElementById("promptValue").textContent = p;
  document.getElementById("homePrompt").textContent = `Prompt: ${p}`;
}

document.getElementById("changePrompt").addEventListener("click", pickPrompt);
document.getElementById("newPromptHome").addEventListener("click", pickPrompt);

// ---------- Timer (10 minutes) ----------
let timerTotal = 10 * 60;     // seconds
let timerLeft  = timerTotal;
let timerId = null;

const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("timerStart");
const pauseBtn = document.getElementById("timerPause");
const resetBtn = document.getElementById("timerReset");

function fmt(s){
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2,"0")}:${String(r).padStart(2,"0")}`;
}
function renderTimer(){
  timerDisplay.textContent = fmt(timerLeft);
}
function startTimer(){
  if (timerId) return;
  timerId = setInterval(() => {
    timerLeft -= 1;
    if (timerLeft <= 0){
      timerLeft = 0;
      stopTimer();
      // subtle “done” feedback
      timerDisplay.textContent = "00:00";
      document.title = "⏳ Time’s up — Journal";
      setTimeout(() => (document.title = "Yashika’s Journal"), 2500);
    } else {
      renderTimer();
    }
  }, 1000);
}
function stopTimer(){
  clearInterval(timerId);
  timerId = null;
}
function resetTimer(){
  stopTimer();
  timerLeft = timerTotal;
  renderTimer();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", resetTimer);

renderTimer();

// ---------- Calendar + Entries (localStorage) ----------
const monthTitle = document.getElementById("monthTitle");
const calendarGrid = document.getElementById("calendarGrid");
const selectedDateText = document.getElementById("selectedDateText");
const editor = document.getElementById("editor");
const saveStatus = document.getElementById("saveStatus");
const wordCount = document.getElementById("wordCount");

const KEY_PREFIX = "journal_entry_";
let viewDate = new Date();
let selectedDate = new Date();

function ymd(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}
function pretty(d){
  return d.toLocaleDateString(undefined, { weekday:"short", year:"numeric", month:"short", day:"numeric" });
}
function entryKey(d){ return KEY_PREFIX + ymd(d); }

function loadEntry(d){
  const data = localStorage.getItem(entryKey(d)) || "";
  editor.value = data;
  updateCounts();
  saveStatus.textContent = data ? `Loaded: ${ymd(d)}` : `New entry: ${ymd(d)}`;
}
function saveEntry(d){
  localStorage.setItem(entryKey(d), editor.value);
  saveStatus.textContent = `Saved ✓ ${new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}`;
}
let saveDebounce = null;
editor.addEventListener("input", () => {
  updateCounts();
  clearTimeout(saveDebounce);
  saveStatus.textContent = "Saving…";
  saveDebounce = setTimeout(() => saveEntry(selectedDate), 350);
});

function updateCounts(){
  const text = editor.value.trim();
  const wc = text ? text.split(/\s+/).length : 0;
  wordCount.textContent = `${wc} word${wc===1?"":"s"}`;
}

document.getElementById("clearEntry").addEventListener("click", () => {
  editor.value = "";
  localStorage.removeItem(entryKey(selectedDate));
  updateCounts();
  saveStatus.textContent = `Cleared: ${ymd(selectedDate)}`;
});

document.getElementById("exportTxt").addEventListener("click", () => {
  const blob = new Blob([editor.value], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `journal-${ymd(selectedDate)}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
});

function renderCalendar(){
  const y = viewDate.getFullYear();
  const m = viewDate.getMonth();
  const first = new Date(y, m, 1);
  const last  = new Date(y, m+1, 0);
  const startDow = first.getDay(); // 0 Sun
  const daysInMonth = last.getDate();

  monthTitle.textContent = first.toLocaleDateString(undefined, { month:"long", year:"numeric" });
  calendarGrid.innerHTML = "";

  // leading blanks
  for (let i=0; i<startDow; i++){
    const blank = document.createElement("div");
    blank.className = "day is-muted";
    blank.textContent = "";
    calendarGrid.appendChild(blank);
  }

  const today = new Date();
  for (let day=1; day<=daysInMonth; day++){
    const d = new Date(y, m, day);
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "day";
    cell.textContent = String(day);

    if (ymd(d) === ymd(today)) cell.classList.add("is-today");
    if (ymd(d) === ymd(selectedDate)) cell.classList.add("is-selected");

    // entry indicator (tiny glow via border)
    const hasEntry = (localStorage.getItem(entryKey(d)) || "").trim().length > 0;
    if (hasEntry) cell.style.borderColor = "rgba(248,196,46,0.65)";

    cell.addEventListener("click", () => {
      selectedDate = d;
      selectedDateText.textContent = pretty(selectedDate);
      loadEntry(selectedDate);
      renderCalendar();
    });

    calendarGrid.appendChild(cell);
  }

  selectedDateText.textContent = pretty(selectedDate);
}

document.getElementById("prevMonth").addEventListener("click", () => {
  viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth()-1, 1);
  renderCalendar();
});
document.getElementById("nextMonth").addEventListener("click", () => {
  viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 1);
  renderCalendar();
});

// ---------- Contact form (demo) ----------
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("contactNote").textContent =
    "Submitted (demo). If you want, I can wire this to EmailJS / a backend later.";
});

// ---------- Init ----------
document.getElementById("year").textContent = new Date().getFullYear();
pickPrompt();
renderCalendar();
loadEntry(selectedDate);
