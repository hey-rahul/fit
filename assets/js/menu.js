
  const rows = document.querySelectorAll('.filter-row');
  const breadcrumb = document.getElementById('breadcrumb');
//   const output = document.getElementById('output');

  // Function to update the breadcrumb based on selected tabs
  function updateBreadcrumb() {
    const selectedFilters = [...rows].map(row => 
      row.querySelector('.selected')?.textContent || ""
    ).filter(Boolean);
    breadcrumb.textContent = selectedFilters.join(' > ');
    // output.textContent = "Filters applied! Displaying output.";
  }

  // Add click event listeners for all tabs
  rows.forEach(row => {
    const tabs = row.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Toggle selection
        tabs.forEach(t => t.classList.remove('selected'));
        tab.classList.add('selected');
        updateBreadcrumb();
      });
    });
  });

  // Initial update to show default selection
  updateBreadcrumb();

