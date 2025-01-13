// Select the workout div
const workoutDiv = document.querySelector('.workout-view');

// Extract the content within the backticks
const workoutContent = workoutDiv.innerHTML.match(/`([\s\S]*?)`/)[1].trim();

// Split the content into individual exercises
const exercises = workoutContent.split(';').map(item => item.trim()).filter(item => item);

// Define the columns and initialize the data structure
const columns = ['Set', 'Subset', 'Exercise', 'Mass', 'Reps', 'Inclination', 'Distance', 'Duration'];

// Parse each exercise into structured data
const parsedExercises = exercises.map((exercise, index) => {
    const parts = exercise.split(',').map(part => part.trim());
    const data = { Set: Math.floor(index / 3) + 1, Subset: (index % 3) + 1 };

    // Extract specific information based on patterns
    if (parts[0]) data.Exercise = parts[0];
    if (parts[1]?.match(/\d+/)) data.Mass = parts[1];
    if (parts[2]?.includes('rep')) data.Reps = parts[2];
    if (parts.some(part => part.includes('deg'))) data.Inclination = parts.find(part => part.includes('deg'));
    if (parts.some(part => part.includes('min') || part.includes('s'))) data.Duration = parts.find(part => part.includes('min') || part.includes('s'));

    return data;
});

// Filter out empty columns
const activeColumns = columns.filter(column => parsedExercises.some(row => row[column]));

// Generate the table
const table = document.createElement('table');
table.style.borderCollapse = 'collapse';
table.style.width = '100%';
table.style.border = '1px solid #ddd';

// Create table header
const thead = document.createElement('thead');
const headerRow = document.createElement('tr');
activeColumns.forEach(column => {
    const th = document.createElement('th');
    th.style.border = '1px solid #ddd';
    th.style.padding = '8px';
    th.style.textAlign = 'left';
    th.textContent = column;
    headerRow.appendChild(th);
});
thead.appendChild(headerRow);
table.appendChild(thead);

// Create table body
const tbody = document.createElement('tbody');
parsedExercises.forEach(row => {
    const tr = document.createElement('tr');
    activeColumns.forEach(column => {
        const td = document.createElement('td');
        td.style.border = '1px solid #ddd';
        td.style.padding = '8px';
        td.textContent = row[column] || ''; // Fill empty cells with an empty string
        tr.appendChild(td);
    });
    tbody.appendChild(tr);
});
table.appendChild(tbody);

// Clear the workout div and append the table
workoutDiv.innerHTML = ''; // Remove existing innerHTML
workoutDiv.appendChild(table);
