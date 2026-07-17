const terminal = document.querySelector("#terminal");
const output = document.querySelector("#output");
const form = document.querySelector("#command-form");
const input = document.querySelector("#command-input");
const statusIndicator = document.querySelector("#status-indicator");

const prompt = "welcome@alliterationlabs.com $";
const commandHistory = [];
let historyIndex = 0;

const commands = {
  help: [
    "available commands:",
    "  about      learn about alliteration",
    "  projects   view selected projects",
    "  contact    get in touch",
    "  hello      say hello",
    "  clear      reset the terminal",
  ],
  hello: ["hey there"],
  about: [
    "alliteration is a modern, independent development studio.",
    "we build considered, community-focused applications for people who gather, organize, and create together.",
  ],
  projects: [
    "our projects:",
    "  local loop      an omaha-focused local news aggregator",
    "  spirit spotter  helps families find the best holiday decorations in their communities",
    "  tile tally      keeps score in word games like scrabble",
  ],
  contact: [
    "say hello: hello@alliterationlabs.com",
    "elsewhere: @alliterationlabs",
  ],
};

function addLine(content, className = "") {
  const line = document.createElement("p");
  line.className = `terminal__line ${className}`.trim();
  line.textContent = content;
  output.append(line);
}

function runCommand(value) {
  const rawCommand = value.trim().toLowerCase();
  const command = rawCommand === "?" ? "help" : rawCommand;

  addLine(`${prompt} ${value.trim()}`, "terminal__line--command");

  if (!command) {
    return;
  }

  if (command === "clear") {
    output.replaceChildren();
    return;
  }

  if (commands[command]) {
    commands[command].forEach((line) => addLine(line));
    return;
  }

  addLine(`command not found: ${value.trim()}`, "terminal__line--muted");
  addLine("type help for available commands.", "terminal__line--muted");
}

function focusInput() {
  input.focus();
}

function syncInputWidth() {
  input.style.width = `${input.value.length}ch`;
}

function showCommandActivity() {
  statusIndicator.classList.add("status-indicator--active");
  const duration = 500 + Math.random() * 1500;

  return new Promise((resolve) => {
    window.setTimeout(() => {
      statusIndicator.classList.remove("status-indicator--active");
      resolve();
    }, duration);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const value = input.value;
  const command = value.trim().toLowerCase();

  if (value.trim()) {
    commandHistory.push(value);
  }

  if (command === "clear") {
    runCommand(value);
    historyIndex = commandHistory.length;
    input.value = "";
    syncInputWidth();
    return;
  }

  input.disabled = true;
  await showCommandActivity();
  runCommand(value);
  historyIndex = commandHistory.length;
  input.value = "";
  syncInputWidth();
  input.disabled = false;
  focusInput();
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
});

input.addEventListener("input", syncInputWidth);

input.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && commandHistory.length) {
    event.preventDefault();
    historyIndex = Math.max(0, historyIndex - 1);
    input.value = commandHistory[historyIndex];
    syncInputWidth();
  }

  if (event.key === "ArrowDown" && commandHistory.length) {
    event.preventDefault();
    historyIndex = Math.min(commandHistory.length, historyIndex + 1);
    input.value = commandHistory[historyIndex] ?? "";
    syncInputWidth();
  }
});

terminal.addEventListener("click", focusInput);
window.addEventListener("load", focusInput);
