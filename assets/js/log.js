document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = function(e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
  
      renderSchedule(json);
    };
    reader.readAsArrayBuffer(file);
  });
  
  function renderSchedule(data) {
    const scheduleDiv = document.getElementById('schedule');
    scheduleDiv.innerHTML = ''; // Clear previous content
  
    // Group events by date
    const groupedData = data.reduce((acc, row) => {
      const date = row.Date;
      if (!acc[date]) acc[date] = [];
      acc[date].push({ title: row.Title, description: row.Description });
      return acc;
    }, {});
  
    // Render schedule
    Object.entries(groupedData).forEach(([date, events]) => {
      const dateRow = document.createElement('div');
      dateRow.className = 'date-row';
  
      const dateDiv = document.createElement('div');
      dateDiv.className = 'date';
      dateDiv.textContent = date;
  
      dateRow.appendChild(dateDiv);
  
      events.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event';
  
        const titleDiv = document.createElement('div');
        titleDiv.className = 'event-title';
        titleDiv.textContent = event.title;
  
        const descDiv = document.createElement('div');
        descDiv.className = 'event-description';
        descDiv.textContent = event.description;
  
        titleDiv.addEventListener('click', () => {
          descDiv.style.display = descDiv.style.display === 'none' ? 'block' : 'none';
        });
  
        eventDiv.appendChild(titleDiv);
        eventDiv.appendChild(descDiv);
        dateRow.appendChild(eventDiv);
      });
  
      scheduleDiv.appendChild(dateRow);
    });
  
    // Update header
    const month = new Date(data[0].Date).toLocaleString('default', { month: 'long' });
    document.getElementById('month-header').textContent = month;
  }
  

//   ----------------------------------------------

function parseWorkoutCode(code) {
    const sets = code.split(';');
    const tableData = [];
    let lastExercise = ''; // Track the last exercise globally across all sets
  
    sets.forEach((set, setIndex) => {
      if (!set.trim()) return; // Skip empty sets
      const subsets = set.trim().split('|');
  
      subsets.forEach((subset, subsetIndex) => {
        const parts = subset.trim().split(',').map(part => part.trim());
        
        // If an exercise is provided, update lastExercise
        let exercise = parts.length === 3 ? parts[0] : ''; 
        const weight = parts.length === 3 ? parts[1] : parts[0];
        const repetitions = parts.length === 3 ? parts[2] : parts[1];
  
        // If no exercise is provided, inherit the last one
        if (!exercise) {
          exercise = lastExercise;
        } else {
          lastExercise = exercise;
        }
  
        tableData.push({
          set: setIndex + 1,
          subset: subsetIndex + 1,
          exercise: exercise,
          weight: weight,
          repetitions: repetitions,
        });
      });
    });
  
    return tableData;
  }
  
  // Test the function
  // const workoutCode = "cable bicep curl, 10 kg, 10 rep; 15 kg, 8 rep | 10 kg, 8 rep;";
  
  
  const workoutCode = 
  `Lat pulldown wide grip, 30 kg, 12 rep, 7 rpe; 35 kg, 8 rep, 9 rpe | 25 kg, 10 rep, 10 rpe, 2 x; 
  Machine rowing, ;
  Barbell row, 35 kg, 12 rep, 3 x;
  Bicep hammer curls, 7.5 kg, 12 rep; 7.5 kg, 12 rep | 5 kg, 15 rep, 2 x;
  Bicep curls with EZ curl bar, ;
  Preacher curl with EZ curl bar;
  Running and walking, 18 min, 1.55 km;
  Dead hang, 40 s; 30 s;`;
  
  
  const tableData = parseWorkoutCode(workoutCode);
  
  // Render the table in the DOM
  const tableContainer = document.getElementById('exercise-code');
  const table = document.createElement('table');
  
  // Add table headers
  const headerRow = table.insertRow();
  const headers = ['Set', 'Subset', 'Exercise', 'Weight', 'Repetitions'];
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  
  // Add table rows
  tableData.forEach(data => {
    const row = table.insertRow();
    Object.values(data).forEach(value => {
      const cell = row.insertCell();
      cell.textContent = value;
    });
  });
  
  tableContainer.appendChild(table);
  
  
  