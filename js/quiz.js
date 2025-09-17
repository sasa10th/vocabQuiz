let currentIndex = 0;
let wrongList = [];
let mode = "en-ko";
let randomOrder = [];
let originalWords = [];
let quizWords = [];

async function initQuiz() {
  const filename = localStorage.getItem("wordSet");
  const selectedMode = localStorage.getItem("mode");
  if (!filename || !selectedMode) {
    alert("설정값이 없습니다. 처음 화면으로 이동합니다.");
    location.href = "index.html";
    return;
  }

  quizWords = await loadCSV(filename);
  originalWords = [...quizWords];

  mode = selectedMode;

  startQuiz();
}

function startQuiz() {
  currentIndex = 0;
  wrongList = [];
  randomOrder = [...Array(quizWords.length).keys()].sort(() => Math.random() - 0.5);
  showQuestion();
}

function showQuestion() {
  if (currentIndex >= quizWords.length) {
    let resultHtml = "<h2>모든 문제 완료!</h2>";
    if (wrongList.length > 0) {
      resultHtml += `<p>틀린 문제: ${wrongList.length}개</p>`;
      resultHtml += `<button onclick="startReview()">오답 복습하기</button>`;
    } else {
      resultHtml += "<p>모든 문제를 다 맞췄습니다!</p>";
    }
    document.getElementById("quiz").innerHTML = resultHtml;
    return;
  }

  const q = quizWords[randomOrder[currentIndex]];

  let currentMode = mode === "mixed"
    ? (Math.random() < 0.5 ? "en-ko" : "ko-en")
    : mode;

  const questionText = currentMode === "en-ko" ? q.term : q.meaning.join("; ");
  const answerKeys = currentMode === "en-ko" ? q.meaning : [q.term];

  document.getElementById("quiz").innerHTML = `
    <h2>문제 ${currentIndex + 1} / ${quizWords.length}</h2>
    <div class="progress-bar">
      <div class="progress" style="width:${((currentIndex + 1) / quizWords.length) * 100}%"></div>
    </div>
    <p><b>${questionText}</b> <span style="font-size:12px;opacity:.6">(${currentMode})</span></p>
    <div class="answer-wrap">
      <input type="text" id="answer" placeholder="정답 입력" enterkeyhint="done">
      <button class="check-btn" onclick='checkAnswer(${JSON.stringify(answerKeys)})'>확인</button>
    </div>
    <div id="result"></div>
  `;

  const input = document.getElementById("answer");
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") checkAnswer(answerKeys);
  });

  setTimeout(() => input.focus(), 0);
}

function checkAnswer(answerKeys) {
  const userAns = document.getElementById("answer").value.trim();
  const result = document.getElementById("result");
  const currentWord = quizWords[randomOrder[currentIndex]];
  const expandedKeys = answerKeys.flatMap(ans => expandAnswers(ans));

  if (expandedKeys.some(ans => ans.toLowerCase() === userAns.toLowerCase())) {
    result.innerHTML = "<p class='correct'>✓ 정답!</p>";
  } else {
    result.innerHTML = `<p class='wrong'>✕ 오답! 정답은 '${expandedKeys.join(", ")}'</p>`;
    wrongList.push(currentWord);
  }

  document.querySelector(".progress").style.width =
    `${((currentIndex + 1) / quizWords.length) * 100}%`;

  currentIndex++;
  setTimeout(showQuestion, 2000);
}

function startReview() {
  quizWords = wrongList;
  currentIndex = 0;
  wrongList = [];
  randomOrder = [...Array(quizWords.length).keys()].sort(() => Math.random() - 0.5);
  showQuestion();
}

window.addEventListener("DOMContentLoaded", initQuiz);
