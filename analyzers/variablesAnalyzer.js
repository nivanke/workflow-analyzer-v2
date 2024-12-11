/**
 * Analyze the variables in a workflow.
 *
 * @param {Object} workflow - The workflow object
 * @param {Object} details - The response object to store analysis results
 */
export function analyzeVariables(workflow, details) {
  const variablesList = workflow.workflow.variables;

  if (variablesList && Array.isArray(variablesList)) {
    variablesList.forEach((variable) => {
      const { properties } = variable;
      const {
        name: variableName,
        scope: variableScope,
        description: variableDescription,
        type: variableType,
      } = properties || {};

      try {
        if (!variableName || !variableScope || !variableDescription) {
          throw new Error("One or more required properties are undefined");
        }

        // Check if variable description is less than 10 characters for specific scopes
        const relevantScopes = ["input", "local", "static"];
        if (
          relevantScopes.includes(variableScope) &&
          (!variableDescription || variableDescription.length < 10)
        ) {
          details.variables.push({
            type: "warning",
            title: `Variable: ${variableName}`,
            description: `Variable description is too short for scope "${variableScope}" for variable: ${variableName}`,
            moreInfo:
              "The variable description should be longer than 10 characters for the following scopes: input, local, static",
            moreInfo: "",
          });
        }

        // Check naming pattern: every word should start with a capital letter
        const namingPattern = /^([A-Z][a-z]*)(\s[A-Z][a-z]*)*$/;
        if (!namingPattern.test(variableName)) {
          const suggestedName = variableName
            .split(/\s+/)
            .map((word) => {
              if (
                ["ID", "IDS", "TO", "FROM", "OF", "FOR"].includes(
                  word.toUpperCase()
                )
              ) {
                return word;
              } else {
                return (
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );
              }
            })
            .join(" ");

          if (suggestedName !== variableName) {
            details.variables.push({
              type: "warning",
              title: `Variable: ${variableName}`,
              description:
                "Variable name does not follow the naming convention. Each word should start with a capital letter.",
              moreInfo: `Current Name: ${variableName}\nSuggested Name: ${suggestedName}`,
            });
          }
        }

        // Add variable details
        details.variables.push({
          type: "info",
          title: `${variableName.replace(/^[0-9]+/, "")}`,
          description: `Type: ${variableType || "unknown"}`,
          moreInfo: `Description: ${variableDescription || "None"}\nRequired: ${
            properties.is_required ? "Yes" : "No"
          }`,
        });
      } catch (error) {
        details.variables.push({
          type: "error",
          title: "Variable Error",
          description: error.message,
          moreInfo: "",
        });
        return;
      }
    });
  } else {
    details.variables.push({
      type: "info",
      title: "Variables",
      description: "No variables defined",
      moreInfo: "",
    });
  }

  // Check for global variables
  if (
    "variables" in workflow.workflow &&
    workflow.workflow.variables === null
  ) {
    details.variables.push({
      type: "error",
      title: "Global Variables",
      description: "Failed",
      moreInfo:
        'Global variables should not be used in workflows or atomic actions meant to be shared. Instead, use a "Set Variables" activity to copy global variables to local variables within the workflow. Before exporting, simply remove the global variables so the other user can select their own',
    });
  } else {
    details.variables.push({
      type: "success",
      title: "Global Variables",
      description: "Passed",
      moreInfo: "The workflow does not appear to be using any global variables",
    });
  }
}