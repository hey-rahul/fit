function convertCodeToTable() {
    const workoutDiv = document.querySelector('.workout-view');
    const workoutCode = workoutDiv.textContent
        .split('`')[1] // Extract text between backticks
        .trim(); // Remove extra whitespace

    // Split sets by ';' and filter out empty strings
    const sets = workoutCode.split(';').map(set => set.trim()).filter(set => set);

    // Parse data and generate table rows
    const tableData = [];
    sets.forEach((set, index) => {
        const repeatedSetMatch = set.match(/, (\d+) x$/); // Matches ", 3 x" style
        const repeatCount = repeatedSetMatch ? parseInt(repeatedSetMatch[1], 10) : 1;
        const instructions = set.replace(/, \d+ x$/, '').trim(); // Remove repeat info
        const [exercise, ...details] = instructions.split(',').map(item => item.trim());

        for (let i = 1; i <= repeatCount; i++) {
            const row = { Set: tableData.length + 1, Exercise: exercise };
            details.forEach(detail => {
                if (detail.includes('kg')) row.Mass = detail;
                else if (detail.includes('rep')) row.Reps = detail.replace(' rep', '');
                else if (detail.includes('deg')) row.Inclination = detail.replace(' deg', '');
                else if (detail.includes('min') || detail.includes('s')) {
                    const durationMatch = detail.match(/(\d+)\s*min/);
                    const secondsMatch = detail.match(/(\d+)\s*s/);
                    let durationInSeconds = 0;

                    if (durationMatch) durationInSeconds += parseInt(durationMatch[1]) * 60;
                    if (secondsMatch) durationInSeconds += parseInt(secondsMatch[1]);

                    row.Duration = `${durationInSeconds} s`;
                } else if (detail.includes('pair')) {
                    row.Reps = detail.replace(' pair', ' (each side)');
                } else if (detail.match(/^\d+\s*km$/)) row.Distance = detail;
            });
            tableData.push(row);
        }
    });

    // Add warm-up, cool-down, and stretches as separate sets
    ['warm-up', 'cool-down', 'stretches'].forEach(activity => {
        tableData.push({ Set: tableData.length + 1, Exercise: activity });
    });

    // Determine which columns to include dynamically
    const columns = Object.keys(
        tableData.reduce((cols, row) => {
            Object.keys(row).forEach(key => (cols[key] = true));
            return cols;
        }, {})
    );

    // Create a table element
    const table = document.createElement('table');
    table.border = "1";
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";
    table.style.textAlign = "left";

    // Create table header
    const headerRow = document.createElement('tr');
    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column;
        th.style.padding = '8px';
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Create table rows
    tableData.forEach(row => {
        const tr = document.createElement('tr');
        columns.forEach(column => {
            const td = document.createElement('td');
            td.textContent = row[column] || ''; // Empty cell if no data
            td.style.padding = '8px';
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    // Clear and append table to the div
    workoutDiv.innerHTML = ''; // Clear innerHTML
    workoutDiv.appendChild(table);
}

// Run the conversion
convertCodeToTable();