let FILE_PATH = "sample_data.csv";

// Function to transpose the table data
function transposeData(data) {
  const transposed = data[0].map((_, colIndex) =>
    data.map((row) => row[colIndex])
  );
  return transposed;
}

function createTableFromCSV(data) {
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.fontSize = "0.6em";

  data.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");

    // Apply 'last-row' class to the last row
    if (rowIndex === data.length - 1) {
      tr.classList.add("last-row");
    }

    row.forEach((cell) => {
      const cellEl =
        rowIndex === 0
          ? document.createElement("th")
          : document.createElement("td");
      cellEl.textContent = cell;
      cellEl.style.border = "1px solid #ccc";
      cellEl.style.padding = "8px";
      cellEl.style.textAlign = "center";
      if (rowIndex === 0) cellEl.style.backgroundColor = "#f0f0f0";
      tr.appendChild(cellEl);
    });
    table.appendChild(tr);
  });

  return table;
}

document.addEventListener("DOMContentLoaded", function () {
  Papa.parse(FILE_PATH, {
    download: true,
    complete: function (results) {
      const transposedData = transposeData(results.data); // Transpose data
      const container = document.getElementById("bad-data-table");
      container.appendChild(createTableFromCSV(transposedData));
    },
  });
});
