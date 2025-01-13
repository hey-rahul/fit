const data = `
        warm-up;
        barbell row, 35 kg, 10 rep, 3 x;
        inclined dumbbell row, 10 kg pair, 10 rep, 45 deg, 3 x;
        machine row, 53 kg, 10 rep, 3 x;
        lat pull, 53 kg, 10 rep, 3 x;
        mountain climber, 20 rep pair;
        plank, 1 min + 30 s;
        russian twist, 1 min;
        leg raise and hold, 1 min;
        tuck in, 25 rep, 2 x;
    `;

    const unitConversions = {
        mass: { kg: 1, lb: 2.20462 },
        duration: { ms: 1000, s: 1, min: 1 / 60 },
        inclination: { deg: 1, rad: Math.PI / 180 },
        distance: { m: 1, km: 1 / 1000, mi: 1 / 1609.34 },
    };

    const units = {
        mass: 'kg',
        duration: 's',
        inclination: 'deg',
        distance: 'm',
    };

    function parseData(data) {
        const rows = data.trim().split(';').filter(row => row.trim() !== '');
        const tableData = [];
        let setCounter = 1;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i].trim();
            const parts = row.split(',').map(part => part.trim());

            const exercise = parts[0];
            const massMatch = parts.find(p => p.includes('kg') || p.includes('lb')) || '';
            const repsMatch = parts.find(p => p.includes('rep')) || '';
            const inclinationMatch = parts.find(p => p.includes('deg') || p.includes('rad')) || '';
            const durationMatch = parts.find(p => p.includes('min') || p.includes('s') || p.includes('ms')) || '';

            const mass = massMatch.replace(/[^0-9.]/g, '');
            const reps = repsMatch.replace(/[^0-9]/g, '') + (repsMatch.includes('pair') ? ' (pair)' : '');
            const inclination = inclinationMatch.replace(/[^0-9.]/g, '');
            const duration = calculateDuration(durationMatch);

            tableData.push({
                set: setCounter,
                exercise,
                mass: mass || '',
                reps: reps || '',
                inclination: inclination || '',
                duration: duration || '',
            });

            if (row.includes('3 x')) {
                setCounter += 2; // Adjust for repeated sets
            } else {
                setCounter++;
            }
        }
        return tableData;
    }

    function calculateDuration(duration) {
        if (duration.includes('min')) {
            const [min, sec] = duration.split('+').map(part => parseInt(part.replace(/[^0-9]/g, '')) || 0);
            return (min * 60 + sec).toString();
        }
        return duration.replace(/[^0-9]/g, '');
    }

    function generateTable(data) {
        const table = document.getElementById('workout-table');
        table.innerHTML = '';

        const headers = ['Set', 'Exercise', 'Mass', 'Reps', 'Inclination', 'Duration'];
        const headerRow = document.createElement('tr');

        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        data.forEach(row => {
            const tr = document.createElement('tr');
            Object.values(row).forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
    }

    function updateUnits() {
        const massUnit = document.getElementById('mass-unit').value;
        const durationUnit = document.getElementById('duration-unit').value;
        const inclinationUnit = document.getElementById('inclination-unit').value;

        const updatedData = parsedData.map(row => ({
            ...row,
            mass: (row.mass * unitConversions.mass[massUnit]).toFixed(2),
            duration: (row.duration * unitConversions.duration[durationUnit]).toFixed(2),
            inclination: (row.inclination * unitConversions.inclination[inclinationUnit]).toFixed(2),
        }));

        generateTable(updatedData);
    }

    const parsedData = parseData(data);
    generateTable(parsedData);

    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', updateUnits);
    });