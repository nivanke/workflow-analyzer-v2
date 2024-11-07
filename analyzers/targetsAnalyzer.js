export function analyzeTargets(workflow, details, isAtomic) {
  // Example conditional logic based on isAtomic
  if (isAtomic) {
    // Specific logic for atomic workflows
  } else {
    // Logic for normal workflows
  }

  // Existing embedded targets check
  if ("targets" in workflow && workflow["targets"] != null) {
    details.targets.push({
      type: "error",
      title: "Targets",
      description: "Failed",
      moreInfo: "Workflows should not have any hard-coded targets",
    });
  } else {
    details.targets.push({
      type: "success",
      title: "Targets",
      description: "Passed",
      moreInfo:
        "The workflow does not appear to have any targets embedded in it",
    });
  }

  // Existing embedded target groups check
  if ("target_groups" in workflow && workflow["target_groups"] != null) {
    for (const group in workflow["target_groups"]) {
      workflow["target_groups"][group]["targets"].forEach((target) => {
        if (
          "selected_target_ids" in target &&
          target["selected_target_ids"].length > 0
        ) {
          details.targets.push({
            type: "warning",
            title: `Target Group<br /><small>${workflow["target_groups"][group]["name"]}</small>`,
            description: "Should not contain manually selected targets",
            moreInfo:
              "In the target group configuration, you probably added a specific target manually. We don't recommend doing this unless you have a specific use case and suggest you consider using target group criteria instead",
          });
        }

        if (
          group === "target_group_01EJ0TQWPQWBD0qiWqClJKj9FOzwiZRfOFH" &&
          !["web-service.endpoint", "email.smtp_endpoint"].includes(
            target["data_target_type"]
          )
        ) {
          details.targets.push({
            type: "warning",
            title: `Target Group<br /><small>${workflow["target_groups"][group]["name"]}</small>`,
            description: `Non-default target type (${target["data_target_type"]})`,
            moreInfo:
              "By default, the Default TargetGroup doesn't contain target types besides HTTP Endpoint and SMTP Endpoint. If you need additional target types for your workflow, the end user may need to add them to the target group configuration before running the workflow",
          });
        }
      });
    }
  }
}
