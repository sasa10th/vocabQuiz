async function initStudy() {
  const filename = localStorage.getItem("wordSet");
  if (!filename) {
    alert("단어장 정보가 없습니다. 처음 화면으로 이동합니다.");
    location.href = "index.html";
    return;
  }

  words = await loadCSV(filename);

  let html = "<h2>단어 리스트</h2><table><tr><th>영어 단어</th><th>뜻</th></tr>";
  words.forEach(w => html += `<tr><td>${w.term}</td><td>${w.meaning.join("; ")}</td></tr>`);
  html += "</table>";
  document.getElementById("study").innerHTML = html;
}

window.addEventListener("DOMContentLoaded", initStudy);
