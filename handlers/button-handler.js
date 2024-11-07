import { WorkflowAnalyzer } from "../WorkflowAnalyzer.js";

class ButtonHandler {
  constructor() {
    this.jsonInput = document.getElementById("json-input");
    this.analyzeButton = document.getElementById("analyze-button");
    this.resultsDiv = document.getElementById("results");
    this.analyzer = new WorkflowAnalyzer();

    this.init();
  }

  init() {
    this.jsonInput.focus();
    this.analyzeButton.addEventListener(
      "click",
      this.handleAnalyzeClick.bind(this)
    );
  }

  showMessage(message, type = "error") {
    const existingMessages = document.querySelectorAll(".message");
    existingMessages.forEach((msg) => msg.remove());

    const messageDiv = document.createElement("div");
    messageDiv.className = `message message-${type}`;
    messageDiv.innerHTML = `
            <i class="fas fa-${
              type === "error" ? "exclamation-circle" : "info-circle"
            }"></i>
            <span class="message-text">${message}</span>
            <span class="close-message">&times;</span>
        `;

    const closeBtn = messageDiv.querySelector(".close-message");
    closeBtn.onclick = () => messageDiv.remove();

    this.resultsDiv.insertBefore(messageDiv, this.resultsDiv.firstChild);
  }

  handleAnalyzeClick() {
    const jsonContent = this.jsonInput.value.trim();
    if (!jsonContent) {
      this.showMessage("Please enter JSON data first");
      return;
    }

    try {
      const results = this.analyzer.analyze(jsonContent);

      if (results.success) {
        this.resultsDiv.innerHTML = results.response;
        this.setupMoreInfoHandlers();
      } else {
        this.showMessage(results.response);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      this.showMessage("Error analyzing JSON: " + error.message);
    }
  }

  setupMoreInfoHandlers() {
    document.querySelectorAll(".more-info-toggle").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const moreInfo = toggle.nextElementSibling;
        if (moreInfo) {
          moreInfo.style.display =
            moreInfo.style.display === "block" ? "none" : "block";
        }
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ButtonHandler();
});
