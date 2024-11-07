export function buildRow(rowType, col1, col2, moreInfo = "") {
  const icons = {
    success: "check",
    info: "info",
    error: "times",
    warning: "exclamation-triangle",
  };

  const rowIndex = getNextRowIndex();
  const moreInfoHtml =
    moreInfo.length > 0
      ? `<div id="more-info-${rowIndex}" class="more-info">${moreInfo}</div>`
      : "";
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
