import { analyzeProperties } from "./analyzers/propertiesAnalyzer.js";
import { analyzeVariables } from "./analyzers/variablesAnalyzer.js";
import { analyzeTargets } from "./analyzers/targetsAnalyzer.js";
import { analyzeTriggers } from "./analyzers/triggersAnalyzer.js";
import { analyzeActions } from "./analyzers/actionsAnalyzer.js";

export class WorkflowAnalyzer {
  analyze(workflowJson) {
    let workflow;
    try {
      workflow = JSON.parse(workflowJson);

      const response = {
        details: {
          properties: [],
          variables: [],
          targets: [],
          triggers: [],
          activities: [],
          fun: [],
        },
        summary: {
          success: 0,
          info: 0,
          warning: 0,
          error: 0,
        },
      };

      // Log the response structure before analysis
      console.log("Initial response structure:", response);

      // Determine if the workflow is atomic and analyze properties
      const isAtomic = analyzeProperties(workflow, response.details);

      // Analyze other components
      analyzeVariables(workflow, response.details, isAtomic);
      analyzeTargets(workflow, response.details, isAtomic);
      analyzeTriggers(workflow, response.details, isAtomic);
      analyzeActions(workflow, response, isAtomic);

      // Log the response structure after analysis
      console.log("Final response structure:", response);

      // Aggregate statistics
      for (const item in response.details) {
        response.details[item].forEach((detail) => {
          if (detail.type.length > 0) {
            response.summary[detail.type]++;
          }
        });
      }

      return {
        success: true,
        response: this.formatResponse(response.details),
      };
    } catch (e) {
      console.error("Analysis error:", e);
      return {
        success: false,
        response: `Error analyzing workflow: ${e.message}`,
      };
    }
  }

  formatResponse(details) {
    const sections = [
      { title: "Workflow Properties", data: details.properties },
      { title: "Variables", data: details.variables },
      { title: "Triggers", data: details.triggers },
      { title: "Targets", data: details.targets },
      { title: "Activities", data: details.activities },
      { title: "Statistics", data: details.fun },
    ];

    return sections
      .filter((section) => section.data && section.data.length > 0)
      .map((section) => this.buildSection(section.title, section.data))
      .join("");
  }

  buildSection(title, data) {
    return `
      <div class="analysis-section">
        <h3>${title}</h3>
        <table class="analysis-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            ${data.map((item) => this.buildRow(item)).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  buildRow(item) {
    const icons = {
      success: "check",
      info: "info",
      warning: "exclamation-triangle",
      error: "times",
    };

    const moreInfoHtml = item.moreInfo
      ? `<div class="more-info">${item.moreInfo}</div>`
      : "";

    const moreInfoToggle = item.moreInfo
      ? `<span class="more-info-toggle">(details)</span>`
      : "";

    return `
      <tr>
        <td class="item-title">${item.title}</td>
        <td class="item-details ${item.type}">
          ${item.type ? `<i class="fas fa-${icons[item.type]}"></i>` : ""}
          <span>${item.description}</span>
          ${moreInfoToggle}
          ${moreInfoHtml}
        </td>
      </tr>
    `;
  }
}
