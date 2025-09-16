let words = [];

async function loadCSV(filename) {
  const res = await fetch(`./words/${filename}`);
  const text = await res.text();
  return text.split(/\r?\n/).filter(line => line.trim()).map(line => {
    const [term, meaning] = line.split(",");
    return {
      term: term.trim(),
      meaning: meaning.split(";").map(m => m.trim())
    };
  });
}

function expandAnswers(ans) {
  let results = [ans.trim()];
  const noParen = ans.replace(/\(.*?\)/g, "").trim();
  if (noParen !== ans) results.push(noParen);
  const keepInside = ans.replace(/[()]/g, "").trim();
  if (keepInside !== ans) results.push(keepInside);
  return [...new Set(results)];
}