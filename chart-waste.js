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

    const labels = filteredData.map(row => row.date);  // Use Date objects here
    const dataValues = filteredData.map(row => row.values[selectedColumnIndex]);

    // If a chart exists, destroy it
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Create new chart
    chartInstance = new Chart(ctx, {
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
                x: {
                    type: 'time',  // Set X-axis to time scale
                    time: {
                        unit: 'day',  // Set unit to 'day' for date-based data
                        tooltipFormat: 'll',
                        displayFormats: {
                            day: 'DD-MM-YYYY',  // Display format for date labels
                        }
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: selectedColumnName
                    }
                }
            }
        }
    });
}
