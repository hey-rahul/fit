// Add event listeners to all workout-row elements
document.querySelectorAll('.workout-row').forEach(row => {
    row.addEventListener('click', (event) => {
        // Prevent clicking on the 'view' div itself from triggering
        if (event.target.classList.contains('workout-view')) return;

        const workoutView = row.querySelector('.workout-view');
        const expandIcon = row.querySelector('.workout-expand');

        if (workoutView.style.display === 'none' || workoutView.style.display === '') {
            workoutView.style.display = 'block';
            expandIcon.innerHTML = '&#9650;'; // Up arrow
        } else {
            workoutView.style.display = 'none';
            expandIcon.innerHTML = '&#9660;'; // Down arrow
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const workoutViewDivs = document.querySelectorAll(".workout-view");
    
    workoutViewDivs.forEach(div => {
        div.innerHTML = div.innerHTML.replace(/;/g, ';<br><br>');
        div.innerHTML = div.innerHTML.replace(/`/g, '');
      
    });
});
