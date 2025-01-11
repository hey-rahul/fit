// Function to parse the exercise code (remains the same)
function parseWorkoutCode(code) {
    const sets = code.split(';');
    const tableData = [];

    sets.forEach((set, setIndex) => {
      const subsets = set.trim().split('|');
      subsets.forEach((subset, subsetIndex) => {
        const [exercise, weight, repetitions] = subset.trim().split(',');
        tableData.push({
          set: setIndex + 1,
          subset: subsetIndex + 1,
          exercise: exercise.trim(),
          weight: weight.trim(),
          repetitions: repetitions.trim(),
        });
      });
    });

    return tableData;
  }

  // Function to create a row element (remains the same)
  function createRow(data) {
    const row = document.createElement('div');
    row.classList.add('row');

    const header = document.createElement('header');
    header.innerHTML = `<b>${data.date}</b> - ${data.title}`;
    const expandButton = document.createElement('button');
    expandButton.textContent = "Expand";
    expandButton.addEventListener('click', () => {
      row.classList.toggle('expanded');
    });
    header.appendChild(expandButton);
    row.appendChild(header);

    const details = document.createElement('div');
    details.classList.add('details');
    details.innerHTML = `
      <p><strong>Exercise Code:</strong> ${data.exercise_code}</p>
      <p><strong>Observations:</strong> ${data.observations}</p>
      <p><strong>Action Score:</strong> ${data.action_score}</p>
    `;
    row.appendChild(details);

    return row;
  }

  // Function to fetch and parse data from the Excel file
  function fetchAndDisplayWorkoutLog() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/assets/data/workout.csv', true); // Assuming the file is in the 'assets/data' folder

    xhr.onload = function() {
      if (this.status === 200) {
        // Parse the CSV data 
        const csvData = this.responseText; 
        const rows = csvData.split('\n');
        const headers = rows[0].split(',');

        const workoutLogData = rows.slice(1).map(row => {
          const values = row.split(',');
          const obj = {};
          headers.forEach((header, index) => {
            obj[header.trim()] = values[index].trim();
          });
          return obj;
        });

        // Create the workout log table
        createWorkoutLogTable(workoutLogData); 
      } else {
        console.error('Error loading workout log data:', this.status);
      }
    };

    xhr.onerror = function() {
      console.error('Error fetching workout log data:', this.statusText);
    };

    xhr.send();
  }

  // Function to create the workout log table
  function createWorkoutLogTable(data) {
    const container = document.getElementById('workoutLog');

    data.forEach(entry => {
      const row = createRow(entry);
      container.appendChild(row);

      const exerciseTable = document.createElement('table');
      const exerciseTableData = parseExerciseCode(entry.exercise_code);

      const exerciseHeaderRow = exerciseTable.insertRow();
      const exerciseHeaders = ['Set', 'Subset', 'Exercise', 'Weight', 'Repetitions'];
      exerciseHeaders.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        exerciseHeaderRow.appendChild(th);
      });

      exerciseTableData.forEach(exerciseData => {
        const row = exerciseTable.insertRow();
        Object.values(exerciseData).forEach(value => {
          const cell = row.insertCell();
          cell.textContent = value;
          row.appendChild(cell);
        });
      });

      row.querySelector('.details').appendChild(exerciseTable); 
    });
  }

  // Call the function to fetch and display the workout log
  fetchAndDisplayWorkoutLog(); 