// Global variables to store data
let csvData = [];
let columnNames = [];
const columnSelect = document.getElementById("column-select");
const fromDateInput = document.getElementById("from-date");
const toDateInput = document.getElementById("to-date");
const plotGraphButton = document.getElementById("plot-graph");
const graphCanvas = document.getElementById("graph");
const ctx = graphCanvas.getContext("2d");

// Load the CSV file and process it
function loadCSV() {
    // Replace with your actual CSV URL or local path
    fetch('data.csv')
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split("\n").map(row => row.split(","));
            columnNames = rows[0].map(col => col.trim());  // Extract column names from the first row
            csvData = rows.slice(1).map(row => {
                return {
                    date: parseDate(row[0]),  // Parse date from first column
                    values: row.slice(1).map(val => parseFloat(val))  // Convert the rest to numbers
                };
            });
            populateDropdown();
        })
        .catch(error => console.error("Error loading CSV:", error));
}

// Parse date in the format DD-MM-YYYY HH:MM
function parseDate(dateString) {
    const [day, month, year, hour, minute] = dateString.split(/[- :]/);
    return new Date(year, month - 1, day, hour, minute);  // Convert to Date object
}

// Populate the dropdown with available columns (excluding 'Date' column)
function populateDropdown() {
    columnSelect.innerHTML = '';  // Clear existing options
    columnNames.slice(1).forEach((column, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = column;
        columnSelect.appendChild(option);
    });
}

// Apply date range filter and return filtered data
function filterDataByDateRange(fromDate, toDate) {
    return csvData.filter(row => {
        return row.date >= fromDate && row.date <= toDate;
    });
}

// Plot the graph using Chart.js
function plotGraph() {
    const selectedColumnIndex = columnSelect.value;
    const selectedColumnName = columnNames[parseInt(selectedColumnIndex) + 1];  // Exclude Date column

    const fromDate = new Date(fromDateInput.value);
    const toDate = new Date(toDateInput.value);

    const filteredData = filterDataByDateRange(fromDate, toDate);

    if (filteredData.length === 0) {
        alert("No data available for the selected date range.");
        return;
    }

    const labels = filteredData.map(row => row.date.toLocaleDateString());
    const dataValues = filteredData.map(row => row.values[selectedColumnIndex]);

    // Clear the existing graph
    graphCanvas.width = graphCanvas.width;

    // Create new graph
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: selectedColumnName,
                data: dataValues,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: selectedColumnName } }
            }
        }
    });
}

// Initialize the page by loading CSV and setting the default date range
function initialize() {
    loadCSV();

    // Set default date range to last 3 months
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    fromDateInput.value = formatDate(threeMonthsAgo);
    toDateInput.value = formatDate(today);
}

// Format date to YYYY-MM-DD for input fields
function formatDate(date) {
    return date.toISOString().split("T")[0];
}

// Event listener for the "Plot Graph" button
plotGraphButton.addEventListener("click", plotGraph);

// Initialize when the page loads
window.onload = initialize;
