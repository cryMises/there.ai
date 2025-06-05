const endpoint = "https://lemur-immortal-perfectly.ngrok-free.app/ask";
const chat = document.getElementById("chat");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", send);
promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") send();
});

async function send() {
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  appendMessage("user", prompt);
  promptInput.value = "";
  chat.scrollTop = chat.scrollHeight;

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
    appendMessage("bot", data.response || "[No response]");
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

