function goQuiz() {
  const filename = document.getElementById("wordSet").value;
  const enko = document.getElementById("mode-enko").checked;
  const koen = document.getElementById("mode-koen").checked;

  if (!enko && !koen) {
    alert("적어도 하나의 모드를 선택하세요!");
    return;
  }

  localStorage.setItem("wordSet", filename);
  localStorage.setItem("mode", enko && koen ? "mixed" : (enko ? "en-ko" : "ko-en"));
  location.href = "quiz.html";
}

function goStudy() {
  const filename = document.getElementById("wordSet").value;
  localStorage.setItem("wordSet", filename);
  location.href = "study.html";
}
