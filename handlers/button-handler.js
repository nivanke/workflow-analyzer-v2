/**
 * ButtonHandler class to handle the workflow analysis button.
 * It binds to the button and handles the click event.
 */
import { WorkflowAnalyzer } from "../WorkflowAnalyzer.js";

class ButtonHandler {
  /**
   * Constructor for ButtonHandler.
   * Initializes the class and binds the click event listener.
   */
  constructor() {
    this.jsonInput = document.getElementById("json-input");
    this.analyzeButton = document.getElementById("analyze-button");
    this.resultsDiv = document.getElementById("results");
    this.analyzer = new WorkflowAnalyzer();

    this.init();
  }

  /**
   * Initializes the ButtonHandler class.
   * Focuses on the JSON input and adds an event listener to the button.
   */
  init() {
    this.jsonInput.focus();
    this.analyzeButton.addEventListener(
      "click",
      this.handleAnalyzeClick.bind(this)
    );
  }

  /**
   * Shows a message in the results div.
   * @param {string} message - The message to display.
   * @param {"error"|"success"} type - The type of message to display.
   */
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

  /**
   * Handles the click event on the button.
   * Analyzes the JSON and shows the results.
   */
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

  /**
   * Sets up the "more info" handlers for the analysis results.
   */
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

/**
 * Initializes the ButtonHandler class when the document is loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  new ButtonHandler();
});