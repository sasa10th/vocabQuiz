let currentIndex = 0, wrongList = [], mode = "en-ko", randomOrder = [];
let originalWords = [];

async function initQuiz() {
  const filename = localStorage.getItem("wordSet");
  const selectedMode = localStorage.getItem("mode");
  if (!filename || !selectedMode) {
    alert("설정값이 없습니다. 처음 화면으로 이동합니다.");
    location.href = "index.html";
    return;
  }

  words = await loadCSV(filename);
  originalWords = [...words];

  if (selectedMode === "mixed") {
    mode = Math.random() > 0.5 ? "en-ko" : "ko-en";
  } else {
    mode = selectedMode;
  }

  startQuiz();
}

function startQuiz() {
  currentIndex = 0;
  wrongList = [];
  randomOrder = [...Array(words.length).keys()].sort(() => Math.random() - 0.5);
  showQuestion();
}

function showQuestion() {
  if (currentIndex >= words.length) {
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

  const q = words[randomOrder[currentIndex]];
  const questionText = mode === "en-ko" ? q.term : q.meaning.join("; ");
  const answerKeys = mode === "en-ko" ? q.meaning : [q.term];

  document.getElementById("quiz").innerHTML = `
  <h2>문제 ${currentIndex+1} / ${words.length}</h2>
  <div class="progress-bar"><div class="progress" style="width:${((currentIndex+1)/words.length)*100}%"></div></div>
  <p><b>${questionText}</b></p>
  <div class="answer-wrap">
    <input type="text" id="answer" placeholder="정답 입력" enterkeyhint="done">
    <button class="check-btn" onclick='checkAnswer(${JSON.stringify(answerKeys)})'>확인</button>
  </div>
  <div id="result"></div>
`;

  document.getElementById("answer").addEventListener("keypress", e => {
    if (e.key === "Enter") checkAnswer(answerKeys);
  });
  
  setTimeout(() => input.focus(), 0);
}

function checkAnswer(answerKeys) {
  const userAns = document.getElementById("answer").value.trim();
  const result = document.getElementById("result");
  const currentWord = words[randomOrder[currentIndex]];
  const expandedKeys = answerKeys.flatMap(ans => expandAnswers(ans));

  if (expandedKeys.some(ans => ans.toLowerCase() === userAns.toLowerCase())) {
    result.innerHTML = "<p class='correct'>✓ 정답!</p>";
  } else {
    result.innerHTML = `<p class='wrong'>✕ 오답! 정답은 '${expandedKeys.join(", ")}'</p>`;
    wrongList.push(currentWord);
  }

  document.querySelector(".progress").style.width = `${((currentIndex+1)/words.length)*100}%`;
  currentIndex++;
  setTimeout(showQuestion, 2000);
}

function startReview() {
  words = wrongList;
  currentIndex = 0;
  wrongList = [];
  randomOrder = [...Array(words.length).keys()].sort(() => Math.random() - 0.5);
  showQuestion();
}


window.addEventListener("DOMContentLoaded", initQuiz);


