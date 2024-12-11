/**
 * Generates an HTML table row with specified content and styling.
 *
 * @param {string} rowType - The type of row (e.g., "success", "info", "error", "warning").
 * @param {string} col1 - The content for the first column.
 * @param {string} col2 - The content for the second column.
 * @param {string} [moreInfo=""] - Additional information to be displayed in a collapsible section.
 * @returns {string} - The HTML string for the table row.
 */
export function buildRow(rowType, col1, col2, moreInfo = "") {
  const icons = {
    success: "check",
    info: "info",
    error: "times",
    warning: "exclamation-triangle",
  };

  // Generate a unique index for the row
  const rowIndex = getNextRowIndex();

  // Create the HTML for the more-info section, if applicable
  const moreInfoHtml =
    moreInfo.length > 0
      ? `<div id="more-info-${rowIndex}" class="more-info">${moreInfo}</div>`
      : "";

  // Create the toggle icon for the more-info section, if applicable
  const moreInfoIcon =
    moreInfo.length > 0
      ? `<small><a class="more-info-toggle" data-index="${rowIndex}">(details)</a></small>`
      : "";

  return `
    <tr>
      <td class="item-row">${col1}</td>
      <td class="analyzer-row ${rowType}">
        ${rowType ? `<i class="fa fa-fw fa-${icons[rowType]} mr-1"></i>` : ""}
        ${col2} ${moreInfoIcon} ${moreInfoHtml}
      </td>
    </tr>
  `;
}

let rowIndex = 1;
export function getNextRowIndex() {
  return rowIndex++;
}

/**
 * Returns the next unique row index.
 *
 * @returns {number} - The next row index.
 */