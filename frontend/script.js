const API_URL = "https://kalemau.synology.me:50443/chatgpt_test/backend/chatgpt.php";

window.onload = () => {
  checkBackend();
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
    appendMessage("系統", "❌ 無法連線後端123：" + err.message);
  }
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("你", message);
  input.value = "";
  showLoading();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message })
    });

    const data = await response.json();

    if (data.error) {
      appendMessage("系統", "❌ 錯誤：" + data.error);
      console.error("後端錯誤：", data);
    } else {
      const reply = data.choices?.[0]?.message?.content || "⚠️ 無回應";
      appendMessage("ChatGPT", reply);
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



// 載入 DiveLinker 並設置 DIVE linker
const diveLinker_index = new DiveLinker("index");

// 設定全域變數
let gameover;

//(1)載入完成
window.onload = function () {
    diveLinker_index.enableBlock(false);
    diveLinker_index.start();
    checkDiveLinker();
    console.log("DiveLinker is ready!");
};

//(2)確保 diveLinker 初始化
function checkDiveLinker() {
    const intervalId_index = setInterval(function () {
        if (diveLinker_index.getLoadingStatus() === true) {
            clearInterval(intervalId_index); // 停止檢查 checkDiveLinker
            enterstart();
        }
    }, 100); // 每 100 毫秒檢查一次
}

//(3)開始監測遊戲狀態
function enterstart() {
    var checkComplete_Interval = setInterval(() => {
        
        // 更新全域變數

        gameover = diveLinker_index.getAttr("869d515083374fb88f1e0bd1a21709c7");

        console.log(`gameover=${gameover}`);

        if (gameover === "1" || gameover === 1) {  // 確保 gameover 是數字或字串 "1"
            clearInterval(checkComplete_Interval); // 停止檢查
            console.log("遊戲結束，發送結果...");
            sendGameResults(); // 自動發送遊戲結果
        }
        
    }, 100); // 每 100 毫秒檢查一次
}


