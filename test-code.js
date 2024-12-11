import { WorkflowAnalyzer } from "./WorkflowAnalyzer";

const analyzer = new WorkflowAnalyzer();

/**
 * Handles the file selection event.
 * Reads the selected file and stores its content for analysis.
 * @param {Event} event - The file selection event.
 */
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

/**
 * Handles the analyze button click event.
 * Analyzes the file content and displays the results.
 */
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

// Add event listeners for file input and analyze button.
// Add event listeners
document
  .getElementById("file-input")
  .addEventListener("change", handleFileSelect);
document
  .getElementById("analyze-button")
  .addEventListener("click", handleAnalyzeClick);