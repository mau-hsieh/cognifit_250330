async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value;
  if (!message) return;

  appendMessage("You", message);
  input.value = "";

  const response = await fetch("../backend/chatgpt.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: message })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;
  appendMessage("ChatGPT", reply);
}

function appendMessage(sender, text) {
  const box = document.getElementById("chat-box");
  const msg = document.createElement("p");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

// ✅ 新增初始化檢查後端狀態
async function checkBackend() {
  try {
    const response = await fetch("../backend/chatgpt.php");
    const data = await response.json();
    if (data.status === "準備好了") {
      appendMessage("系統", "✅ 後端已啟動，準備好了");
    } else {
      appendMessage("系統", "⚠️ 無法確認後端狀態");
    }
  } catch (error) {
    appendMessage("系統", "❌ 後端無法連線或錯誤");
  }
}

window.onload = checkBackend;
