document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".ymal2table").forEach((el) => {
    const rawYaml = el.innerText.trim();
    const columnWidthsAttr = el.getAttribute("data-col-widths");
    const columnWidths = columnWidthsAttr ? JSON.parse(columnWidthsAttr) : null;

    // Parse YAML string into a JavaScript object
    const parsedData = jsyaml.load(rawYaml);

    // Generate HTML table from parsed data
    const htmlTable = generateTable(parsedData, columnWidths);

    // Inject the generated table into the HTML
    el.innerHTML = htmlTable;
  });
});

function generateTable(data, columnWidths) {
  const grouped = {};

  // Group components by the first key in each record as the 'record_index'
  for (const key in data) {
    const comp = data[key];
    const recordIndex = Object.keys(comp)[0]; // Use the first key as record_index
    const groupKey = comp[recordIndex] || "undefined"; // Use the value of the record_index field
    if (!grouped[groupKey]) grouped[groupKey] = [];
    grouped[groupKey].push(comp);
  }

  const allHeaders = new Set();
  let firstKey = "";

  // Collect all headers excluding the first field used as 'record_index'
  Object.values(data).forEach((comp) => {
    Object.keys(comp).forEach((k, idx) => {
      if (idx !== 0) allHeaders.add(k); // Skip the first key (used as record_index)
    });
    if (!firstKey) firstKey = Object.keys(comp)[0]; // Capture the very first key
  });

  // Create the table HTML, using the first field as the record_index column header
  let table = `<table style="width: 100%; height: 100%; border-collapse: collapse;">
                    <thead>
                      <tr>
                        <th${
                          columnWidths && columnWidths[0]
                            ? ` style="width: ${columnWidths[0]}%;"`
                            : ""
                        }>${firstKey}</th>`; // Use the first key as column name

  let headerIndex = 1;
  allHeaders.forEach((h) => {
    table += `<th${
      columnWidths && columnWidths[headerIndex]
        ? ` style="width: ${columnWidths[headerIndex]}%;"`
        : ""
    }>${h}</th>`;
    headerIndex++;
  });
  table += "</tr></thead><tbody>";

  // Iterate over grouped components and generate rows
  for (const group in grouped) {
    const rows = grouped[group];
    rows.forEach((component, idx) => {
      table += "<tr>";
      if (idx === 0) {
        // Get the first key as record_index and display it in the first column
        const recordIndex = Object.keys(component)[0];
        table += `<td rowspan="${rows.length}"${
          columnWidths && columnWidths[0]
            ? ` style="width: ${columnWidths[0]}%;"`
            : ""
        }>${component[recordIndex]}</td>`; // Display the first column as record_index
      }

      let cellIndex = 1;
      const headersArray = Array.from(allHeaders); // Ensure consistent order

      headersArray.forEach((header) => {
        const value = component[header];
        const cellStyle =
          columnWidths && columnWidths[cellIndex]
            ? ` style="width: ${columnWidths[cellIndex]}%;"`
            : "";

        if (Array.isArray(value)) {
          let listItems = "";
          value.forEach((item) => {
            if (typeof item === "string") {
              listItems += `<li>${item}</li>`;
            } else if (typeof item === "object") {
              listItems += generateNestedList(item);
            }
          });
          table += `<td${cellStyle}><ul>${listItems}</ul></td>`;
        } else if (typeof value === "object" && value !== null) {
          table += `<td${cellStyle}>${generateNestedTable(value)}</td>`;
        } else if (value === null) {
          table += `<td${cellStyle}><p  style="vertical-align: middle;">-</p></td>`;
        } else {
          table += `<td${cellStyle}>${value}</td>`;
        }
        cellIndex++;
      });

      table += "</tr>";
    });
  }

  table += "</tbody></table>";
  return table;
}

function generateNestedList(data) {
  let listItems = "";
  for (const key in data) {
    listItems += `<li>${key}<ul>`;
    data[key].forEach((subItem) => {
      listItems += `<li>${subItem}</li>`;
    });
    listItems += "</ul></li>";
  }
  return listItems;
}

function generateNestedTable(data) {
  let nestedTable =
    '<table style="width: 100%; height: 100%; border-collapse: collapse;"><tbody>';
  for (const key in data) {
    nestedTable += `<tr><td>${key}</td><td>${data[key]}</td></tr>`;
  }
  nestedTable += "</tbody></table>";
  return nestedTable;
}
