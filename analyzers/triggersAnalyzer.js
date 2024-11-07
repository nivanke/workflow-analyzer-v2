export function analyzeTriggers(workflow, details, isAtomic) {
  if (isAtomic) {
    // Specific logic for atomic workflows
  } else {
    // Logic for normal workflows
  }

  if ("triggers" in workflow && workflow["triggers"] != null) {
    const triggers = [];

    for (const trigger of workflow["triggers"]) {
      triggers.push(
        `${trigger.name || "Unnamed Trigger"} (${
          trigger.type || "Unknown Type"
        })`
      );
    }

    if (triggers.length === 0) {
      details.triggers.push({
        type: "info",
        title: "Triggers",
        description: "This workflow doesn't have any triggers",
        moreInfo: "",
      });
    } else {
      details.triggers.push({
        type: "info",
        title: "Triggers",
        description: triggers.join(", "),
        moreInfo: "",
      });
    }
  } else {
    details.triggers.push({
      type: "info",
      title: "Triggers",
      description: "This workflow doesn't have any triggers",
      moreInfo: "",
    });
  }
}
