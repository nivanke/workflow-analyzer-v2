export function analyzeProperties(workflow, details) {
  // Log the workflow object to understand its structure
  console.log("Workflow structure:", workflow);

  // Check if the necessary properties exist
  if (
    workflow &&
    workflow.workflow &&
    workflow.workflow.properties &&
    typeof workflow.workflow.properties.atomic === "object" &&
    typeof workflow.workflow.properties.atomic.is_atomic === "boolean"
  ) {
    const isAtomic = workflow.workflow.properties.atomic.is_atomic;

    details.properties.push({
      type: "info",
      title: "Definition Type",
      description: isAtomic ? "Atomic Action" : "Workflow",
      moreInfo: isAtomic
        ? "This is an atomic action, specific checks for atomic activities can be applied here."
        : "This is a normal workflow, specific checks for workflow activities can be applied here.",
    });

    if (workflow.categories && Array.isArray(workflow.categories)) {
      const categories = workflow.categories.map(
        (category) => category.name || category
      );

      details.properties.push({
        type: "info",
        title: "Categories",
        description:
          categories.length > 0
            ? categories.join(", ")
            : "This workflow doesn't have any categories",
        moreInfo: "",
      });
    } else {
      details.properties.push({
        type: "info",
        title: "Categories",
        description: "This workflow doesn't have any categories",
        moreInfo: "",
      });
    }

    return isAtomic; // Return the isAtomic status
  } else {
    console.error("Invalid workflow structure:", workflow); // Log the workflow for debugging
    throw new Error("Invalid workflow structure: 'properties' not found");
  }
}
