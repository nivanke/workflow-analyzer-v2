export function analyzeActions(workflow, response, isAtomic) {
  const atomicActions = [];
  let actionCount = 0;
  const actionTypes = new Set();

  // Ensure response object is properly initialized
  response.details = response.details || {};
  response.details.activities = response.details.activities || [];
  response.details.atomics = response.details.atomics || [];
  response.details.fun = response.details.fun || [];

  const activityDescription = isAtomic
    ? "This is an atomic action, specific checks for atomic activities can be applied here."
    : "This is a normal workflow, specific checks for workflow activities can be applied here.";

  response.details.activities.push({
    type: "info",
    title: "Activities Overview",
    description: activityDescription,
    moreInfo: "",
  });

  function checkActions(actions) {
    actions.forEach((action, index) => {
      console.log(`Processing action ${index + 1}:`, action);
      actionCount++;
      const actionType = action.type;
      const properties = action.properties || {};
      const displayName = properties.display_name || "Unnamed Action";

      // Check if the action is a subworkflow
      if (action.base_type === "subworkflow") {
        const continueOnFailure = getAtomicsContinueOnFailureStatus(properties);

        // Log the subworkflow details
        console.log(
          `Subworkflow: ${displayName}, Continue on Failure: ${continueOnFailure}`
        );
      }

      // Account Key Configuration
      if ("runtime_user" in properties) {
        if (
          !("target_default" in properties.runtime_user) ||
          !properties.runtime_user.target_default
        ) {
          response.details.activities.push({
            type: "warning",
            title: displayName,
            description: "Account Key Configuration",
            moreInfo:
              "Most activities should have their account key set to \"Use Target's Default Account Keys.\" It's uncommon that a target's account keys should be overridden.",
          });
        }
      }

      // Special handling for web requests
      if (actionType === "web-service.http_request") {
        if (properties.continue_on_failure) {
          response.details.activities.push({
            type: "info",
            title: displayName,
            description: '"Continue Workflow Execution on Failure" is checked',
            moreInfo:
              "In most cases, you probably want \"Continue on HTTP error status code\" instead. If you're using this option intentionally, make sure you're using a Condition Block to handle failures.",
          });
        }

        if (!properties.continue_on_error_status_code) {
          response.details.activities.push({
            type: "warning",
            title: displayName,
            description: '"Continue on HTTP error status code" is not checked',
            moreInfo:
              "You should check this and use a Condition Block to handle HTTP error codes.",
          });
        }
      }
      // Special handling for JSON path query
      else if (actionType === "corejava.jsonpathquery") {
        if (!properties.continue_on_failure) {
          response.details.activities.push({
            type: "warning",
            title: displayName,
            description:
              '"Continue Workflow Execution on Failure" is not checked',
            moreInfo:
              "If the JSON path query you look for isn't found, the activity will fail and your workflow will fail with it. If you want to avoid this, you can check continue on failure and use a Condition Block to check if the path query was successful.",
          });
        } else {
          response.details.activities.push({
            type: "info",
            title: displayName,
            description: '"Continue Workflow Execution on Failure" is checked',
            moreInfo:
              "Setting continue workflow execution on failure means the workflow will continue running even if this activity fails. It's ok to use this if you're using a Condition Block to do some error handling.",
          });
        }
      }
      // General handling for other actions
      else {
        if (properties.continue_on_failure) {
          response.details.activities.push({
            type: "info",
            title: displayName,
            description: '"Continue Workflow Execution on Failure" is checked',
            moreInfo:
              "Setting continue workflow execution on failure means the workflow will continue running even if this activity fails. It's ok to use this if you're using a Condition Block to do some error handling.",
          });
        }

        if (properties.allow_auto_redirect) {
          response.details.activities.push({
            type: "warning",
            title: displayName,
            description: '"Allow Auto Redirect" is checked',
            moreInfo:
              "If you're using a web request, you should check this and use a Condition Block to handle redirects.",
          });
        }
      }

      if (properties.continue_on_error_status_code) {
        response.details.activities.push({
          type: "warning",
          title: displayName,
          description: '"Continue on HTTP error status code" is checked',
          moreInfo:
            "You should check this and use a Condition Block to handle HTTP error codes.",
        });
      }

      actionTypes.add(actionType);

      // Handle nested objects
      if (
        "blocks" in action &&
        action.blocks != null &&
        action.blocks.length > 0
      ) {
        checkActions(action.blocks);
      }

      if (
        "actions" in action &&
        action.actions != null &&
        action.actions.length > 0
      ) {
        checkActions(action.actions);
      }
    });
  }

  // Function to determine the continue on failure status
  function getAtomicsContinueOnFailureStatus(properties) {
    return properties.continue_on_failure ? "Yes" : "No";
  }

  // Parse all of the workflow's actions
  if ("actions" in workflow["workflow"]) {
    checkActions(workflow["workflow"]["actions"]);
  } else {
    response.details.activities.push({
      type: "info",
      title: "No Activities Found",
      description: "N/A",
      moreInfo: "",
    });
  }

  // Check if the workflow is using any atomics
  if (
    "atomic_workflows" in workflow &&
    workflow["atomic_workflows"].length > 0
  ) {
    workflow["atomic_workflows"].forEach((atomic) => {
      // Check if the atomic was an activity found previously
      if (atomic in atomicActions) {
        response.details.atomics.push({
          type: "info",
          title: atomicActions[atomic],
          description: "Resolved",
          moreInfo: "",
        });
      } else {
        response.details.atomics.push({
          type: "error",
          title: atomic,
          description: "Failed to Resolve",
          moreInfo: "",
        });
      }
    });
  } else {
    response.details.atomics.push({
      type: "info",
      title: "No Atomic Actions Found",
      description: "N/A",
      moreInfo: "",
    });
  }

  // Add summary statistics
  response.details.fun.push({
    type: "info",
    title: "Total Actions",
    description: actionCount.toString(),
    moreInfo: "",
  });

  response.details.fun.push({
    type: "info",
    title: "Unique Action Types",
    description: actionTypes.size.toString(),
    moreInfo: `Types: ${Array.from(actionTypes).join(", ")}`,
  });

  // Log the activities to verify they are being added
  console.log("Activities added:", response.details.activities);
}
