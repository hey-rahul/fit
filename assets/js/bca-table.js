 // Read the CSV file and generate the table
 async function generateTableFromCSV(file) {
    try {
        const response = await fetch(file);
        const csvData = await response.text();

        const rows = csvData.split("\n");
        const table = document.getElementById("csvTable");

        // Process rows
        rows.forEach((row, rowIndex) => {
            const cells = row.split(",");
            const tr = document.createElement("tr");

            // Process each cell
            cells.forEach((cell, cellIndex) => {
                const td = document.createElement(rowIndex === 0 ? "th" : "td");
                td.textContent = cell.trim();

                // Add the fixed-corner class to the top-left cell
                if (rowIndex === 0 && cellIndex === 0) {
                    td.classList.add("fixed-corner");
                }
                // Add the fixed-column class to the first column (except top-left)
                else if (cellIndex === 0) {
                    td.classList.add("fixed-column");
                }
                // Add the fixed-row class to the first row (except top-left)
                else if (rowIndex === 0) {
                    td.classList.add("fixed-row");
                }

                tr.appendChild(td);
            });

            table.appendChild(tr);
        });
    } catch (error) {
        console.error("Error loading CSV file:", error);
    }
}

// Call the function with the path to your CSV file
generateTableFromCSV("/assets/data/bca.csv");
