import { WorkflowAnalyzer } from "./WorkflowAnalyzer";

const analyzer = new WorkflowAnalyzer();

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target.result;
      document.getElementById("analyze-button").dataset.content = content;
      document.getElementById("analyze-button").disabled = false;
    };
    reader.readAsText(file);
  }
}

function handleAnalyzeClick() {
  const content = document.getElementById("analyze-button").dataset.content;
  if (content) {
    const results = analyzer.analyze(content);
    if (results.success) {
      document.getElementById("results").innerHTML = results.response;
    } else {
      alert(results.response);
    }
  }
}

// Add event listeners
document
  .getElementById("file-input")
  .addEventListener("change", handleFileSelect);
document
  .getElementById("analyze-button")
  .addEventListener("click", handleAnalyzeClick);
