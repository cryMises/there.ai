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
  
  promptInput.disabled = true;
  sendBtn.disabled = true;

  
  appendMessage("user", prompt);
  promptInput.value = "";
  chat.scrollTop = chat.scrollHeight;
  
  function typeMessage(text, container, sender = "AI") {
  const label = document.createElement("b");
  label.textContent = sender + ": ";
  container.appendChild(label);

  const messageNode = document.createElement("span");
  container.appendChild(messageNode);

  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      messageNode.textContent += text[i];
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
      headers: { "Content-Type": "application/json", "X-API-KEY": "d8c3800df5d17bd2e894e1b69128d679d30aedb10e62a3ef7911c0c93bd75298"},
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
    document.getElementById("typing")?.remove();
    appendMessage("bot", `Error: ${e.message}`);
  }

  promptInput.disabled = false;
  sendBtn.disabled = false;
  
  chat.scrollTop = chat.scrollHeight;
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, (tag) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag]));
}

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = sender;
  const safeText = escapeHTML(text);
  div.innerHTML = `<b>${sender === "user" ? "You" : "AI"}:</b> ${safeText}`;
  chat.appendChild(div);
}

async function loadChallenge() {
  const challengeEl = document.getElementById("daily-challenge");
  challengeEl.textContent = "Loading...";

  try {
    const res = await fetch("https://lemur-immortal-perfectly.ngrok-free.app/challenge", {method: "POST", headers: { "Content-Type": "application/json", "X-API-KEY": "385a576890192af8a9226f07247ae3525167b2bcf92afda1cb62575c7a7cb0e0"}})
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