const rows = document.querySelectorAll('.filter-row');
const breadcrumb = document.getElementById('breadcrumb');
const editToggle = document.getElementById('edit-mode-toggle');
let isEditMode = false;
let savedState = {}; // Store the user’s choices

// Save the original state for each row
rows.forEach(row => {
  const tabs = row.querySelectorAll('.filter-tab');
  savedState[row.id] = [...tabs].map(tab => ({
    text: tab.textContent,
    selected: tab.classList.contains('selected'),
  }));
});

// Function to update the breadcrumb
function updateBreadcrumb() {
  const selectedFilters = [...rows].map(row => 
    row.querySelector('.selected')?.textContent || ""
  ).filter(Boolean);
  breadcrumb.textContent = selectedFilters.join(' > ');
}

// Function to reset rows to their original state
function resetRows() {
  rows.forEach(row => {
    const originalTabs = row.dataset.original.split(',');
    row.innerHTML = ''; // Clear current tabs
    originalTabs.forEach(tabText => {
      const tab = document.createElement('div');
      tab.className = 'filter-tab';
      tab.textContent = tabText;
      row.appendChild(tab);
    });
  });
}

// Toggle edit mode
editToggle.addEventListener('change', () => {
  isEditMode = editToggle.checked;

  if (isEditMode) {
    // Enter edit mode: Restore all original tabs and add close buttons
    resetRows();
    rows.forEach(row => {
      const tabs = row.querySelectorAll('.filter-tab');
      tabs.forEach(tab => {
        // Add close button
        tab.classList.add('closeable');
        if (!tab.querySelector('.close-btn')) {
          const closeBtn = document.createElement('span');
          closeBtn.className = 'close-btn';
          closeBtn.textContent = 'x';
          tab.appendChild(closeBtn);

          // Close button functionality
          closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent selecting the tab
            tab.remove();
          });
        }
      });
    });
  } else {
    // Exit edit mode: Save current state
    rows.forEach(row => {
      const tabs = row.querySelectorAll('.filter-tab');
      if (tabs.length === 0) return; // Skip rows with no tabs
      savedState[row.id] = [...tabs].map((tab, index) => ({
        text: tab.textContent.replace('x', '').trim(), // Remove close button text
        selected: tab.classList.contains('selected'),
        index,
      }));
    });

    // Restore saved state
    rows.forEach(row => {
      const state = savedState[row.id];
      row.innerHTML = ''; // Clear current tabs
      state.forEach(item => {
        const tab = document.createElement('div');
        tab.className = 'filter-tab';
        tab.textContent = item.text;
        row.appendChild(tab);
      });

      // Select the appropriate tab: original selection or first tab if a selection was removed
      const restoredTabs = row.querySelectorAll('.filter-tab');
      const firstTab = restoredTabs[0];
      const selectedTab = [...restoredTabs].find(tab => state.find(s => s.text === tab.textContent && s.selected));

      if (selectedTab) {
        selectedTab.classList.add('selected');
      } else if (firstTab) {
        firstTab.classList.add('selected');
      }
    });

    // Remove all close buttons
    rows.forEach(row => {
      const tabs = row.querySelectorAll('.filter-tab');
      tabs.forEach(tab => {
        tab.classList.remove('closeable');
        const closeBtn = tab.querySelector('.close-btn');
        if (closeBtn) closeBtn.remove();
      });
    });

    updateBreadcrumb();
  }
});

// Add click event listeners for selecting tabs
rows.forEach(row => {
  row.addEventListener('click', e => {
    const target = e.target;
    if (target.classList.contains('filter-tab') && !isEditMode) {
      [...row.querySelectorAll('.filter-tab')].forEach(t => t.classList.remove('selected'));
      target.classList.add('selected');
      updateBreadcrumb();
    }
  });
});

// Initial update to show default selection
updateBreadcrumb();
