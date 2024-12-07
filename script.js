document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.createElement("canvas");
    document.getElementById("graph-container").appendChild(ctx);

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // x-axis values
            datasets: [{
                label: 'Dynamic Data',
                data: [], // y-axis values
                borderColor: 'blue',
                borderWidth: 2,
                fill: false,
                pointRadius: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true,
                        },
                        mode: 'xy',
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'X-Axis',
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Y-Axis',
                    }
                }
            }
        }
    });

    const fileInput = document.getElementById("file-input");
    fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const xValues = jsonData.map(row => row['x']);
        const yValues = jsonData.map(row => row['y']);

        chart.data.labels = xValues;
        chart.data.datasets[0].data = yValues;
        chart.update();
    });

    const resetViewButton = document.getElementById("reset-view");
    resetViewButton.addEventListener("click", () => {
        chart.resetZoom();
    });
});


