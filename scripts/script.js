const endpoint = "https://lemur-immortal-perfectly.ngrok-free.app/ask";
const chat = document.getElementById("chat");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", send);
promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") send();
});

function containsXSS(input) {
  return /<script|<\/script|onerror=|onload=|javascript:|<iframe|<img|<svg/i.test(input);
}

async function send() {
  const prompt = promptInput.value.trim();
  if (!prompt) return;
  
  if (containsXSS(prompt)) {
    alert("Your input contains unsafe content and was blocked.");
    return;
  }
  
  appendMessage("user", prompt);
  promptInput.value = "";
  chat.scrollTop = chat.scrollHeight;
  
  function typeMessage(text, container, sender = "AI") {
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      container.innerHTML = `<b>${sender}:</b> ${text.slice(0, i + 1)}`;
      i++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}
  
  const typingDiv = document.createElement("div");
  typingDiv.className = "bot";
  typingDiv.id = "typing";
  typingDiv.innerHTML = `<b>AI:</b> <span class="dots"></span>`;
  chat.appendChild(typingDiv);
  chat.scrollTop = chat.scrollHeight;
  
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": "V2VkIEp1biAgNCAxMjo1NjoyNiBXSUIgMjAyNQo="},
      body: JSON.stringify({ prompt, model: "phi:2.7b" })
    });
    
    document.getElementById("typing")?.remove();
    
    if (!res.ok) {
  appendMessage("bot", `Error ${res.status}`);
  return;
}
    const data = await res.json();
    const botDiv = document.createElement("div");
botDiv.className = "bot";
chat.appendChild(botDiv);
typeMessage(data.response || "[No response]", botDiv); 
  } catch (e) {
    appendMessage("bot", `Error: ${e.message}`);
  }

  chat.scrollTop = chat.scrollHeight;
}

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = sender;
  div.innerHTML = `<b>${sender === "user" ? "You" : "AI"}:</b> ${text}`;
  chat.appendChild(div);
}

async function loadChallenge() {
  const challengeEl = document.getElementById("daily-challenge");
  challengeEl.textContent = "Loading...";

  try {
    const res = await fetch("https://lemur-immortal-perfectly.ngrok-free.app/challenge", {method: "POST", headers: { "Content-Type": "application/json", "X-API-KEY": "V2VkIEp1biAgNCAxMjo1NjoyNiBXSUIgMjAyNQo="}})
    const data = await res.json();
    challengeEl.textContent = 'Daily Prompt Challenge: ' + data.challenge;
  } catch (e) {
    challengeEl.textContent = "Failed to load challenge 😕";
    console.error("Error fetching challenge:", e);
  }
}

// Apply saved theme
const savedTheme = localStorage.getItem("thereai-theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

// Theme toggle button
const themeToggleBtn = document.getElementById("theme-toggle");
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("thereai-theme", isDark ? "dark" : "light");
  });
}

window.addEventListener("DOMContentLoaded", () => {
  loadChallenge();

  const refreshBtn = document.getElementById("refresh-challenge");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      loadChallenge();
    });
  }
});

function toggleTheme() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("thereai-theme", isDark ? "dark" : "light");
}