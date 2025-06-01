const chatbox = document.getElementById('chatbox');
const input = document.getElementById('userInput');
let threadId = null;

async function sendMessage() {
  const userText = input.value;
  if (!userText) return;

  chatbox.innerHTML += `<div class="message user">You: ${userText}</div>`;
  input.value = '';

  const response = await fetch('https://sain-assistant.onrender.com/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userText, threadId })
  });

  const data = await response.json();
  chatbox.innerHTML += `<div class="message assistant">SAIN: ${data.response}</div>`;
  threadId = data.threadId;
}
