const API_URL = "https://kalemau.synology.me:50443/chatgpt_test/backend/chatgpt.php";

// ✅ 初始化：確認後端是否連線成功
window.onload = () => {
  checkBackend();
  initDiveLinker();  // ⬅️ 初始化 DiveLinker 一起執行
};

async function checkBackend() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    if (data.status === "準備好了") {
      appendMessage("系統", "✅ 後端連線成功，準備好了！");
    } else {
      appendMessage("系統", "⚠️ 後端狀態異常");
    }
  } catch (err) {
    appendMessage("系統", "❌ 無法連線後端：" + err.message);
  }
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  const model = document.getElementById("model-select")?.value || "gpt-3.5-turbo";

  appendMessage("你", message);
  input.value = "";
  showLoading();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        model: model
      })
    });

    const data = await response.json();

    if (data.error) {
      appendMessage("系統", "❌ 錯誤：" + data.error);
      console.error("後端錯誤：", data);
    } else {
      const reply = data.choices?.[0]?.message?.content || "⚠️ 無回應";
      const modelUsed = data.model_used || model; // 後端傳來的 model_used

      // ✅ 顯示 ChatGPT 回應 + 模型
      appendMessage("ChatGPT", reply + `<br><small style="color:gray">（模型：${modelUsed}）</small>`);

      // 🧠 判斷難度
      if (reply.includes("非常簡單") || reply.includes("初學")) {
        input_mouse_level = 0;
      } else if (reply.includes("簡單")) {
        input_mouse_level = 1;
      } else if (reply.includes("中等") || reply.includes("普通")) {
        input_mouse_level = 2;
      } else if (reply.includes("困難")) {
        input_mouse_level = 3;
      } else if (reply.includes("非常困難") || reply.includes("高手")) {
        input_mouse_level = 4;
      } else {
        input_mouse_level = 0;
      }

      console.log("🎯 ChatGPT 指定 mouse_level =", input_mouse_level);
    }
  } catch (err) {
    appendMessage("系統", "❌ 回應錯誤：" + err.message);
    console.error("fetch 錯誤：", err);
  } finally {
    hideLoading();
  }
}


function appendMessage(sender, text) {
  const box = document.getElementById("chat-box");
  const msg = document.createElement("p");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

function showLoading() {
  const box = document.getElementById("chat-box");
  const loading = document.createElement("p");
  loading.id = "loading";
  loading.innerHTML = `<em>ChatGPT 思考中...</em>`;
  box.appendChild(loading);
  box.scrollTop = box.scrollHeight;
}

function hideLoading() {
  const loading = document.getElementById("loading");
  if (loading) loading.remove();
}

// ========== 🎮 DiveLinker 整合區 ==========
const diveLinker_index = new DiveLinker("index");

let gameover;
let input_mouse_level = 0; // 🧠 預設為 0（未指定）

function initDiveLinker() {
  diveLinker_index.enableBlock(false);
  diveLinker_index.start();
  checkDiveLinker();
  console.log("✅ DiveLinker is ready");
}

function checkDiveLinker() {
  const intervalId_index = setInterval(function () {
    if (diveLinker_index.getLoadingStatus() === true) {
      clearInterval(intervalId_index); // ✅ DiveLinker 載入完成
      enterstart();
    }
  }, 100);
}

function enterstart() {
  setInterval(() => {
    gameover = diveLinker_index.getAttr("869d515083374fb88f1e0bd1a21709c7");
    diveLinker_index.setInput("dc2218204e134da59a1ce8c8f7eb074b", input_mouse_level);
    time = diveLinker_index.getAttr("76a9c6f37e4f4065babbcb3879a65e16");
    socre = diveLinker_index.getAttr("8b9828edaf8a4454a30da79f0c3ad3ba");
    console.log("🎮 遊戲時間 =", time);
    if (gameover === "1" || gameover === 1) {
      console.log("🎮 遊戲結束，送出 mouse_level =", input_mouse_level);
      window.location.href = `score.html?time=${time}&score=${socre}`;

      // 傳送 mouse_level 給遊戲
      

      // 重置狀態
      gameover = 0;
      diveLinker_index.setInput("869d515083374fb88f1e0bd1a21709c7", 0);
    }
  }, 100); // 每 100ms 檢查一次遊戲是否結束
}
// ========== 🎮 DiveLinker 整合區結束 =========
// =