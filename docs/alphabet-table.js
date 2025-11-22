// Find the <ul id="nav-tab"> that contains all tab links
const tabList = document.getElementById('nav-tab'); // grabs the tab container by its id

// Guard: if the element isn't found, do nothing to avoid errors
if (tabList) { // ensures code only runs when the element exists
  // Use a single click listener on the <ul> (event delegation)
  tabList.addEventListener('click', function (e) { // run this for any click inside the tab list
    // Only react if a real <a> tab was clicked
    const tab = e.target.closest('a[role="tab"]'); // finds the nearest anchor with role="tab"
    if (!tab) return; // if the click wasn't on a tab, exit early

    e.preventDefault(); // stop the browser from jumping to the hash immediately

    const alphabetWindow = document.querySelector('main.alphabet');           // scope to the alphabet window

    // 1) Deactivate the currently selected tab (visual + aria)
    alphabetWindow.querySelectorAll('a[role="tab"][aria-selected="true"]').forEach(a => {
      a.setAttribute('aria-selected', 'false'); // mark old tabs as not selected for accessibility
      a.parentElement.classList.remove('active'); // remove the visual active class from the <li>
    });

    // 2) Hide all panels
    document.querySelectorAll('.alphabet-content').forEach(panel => {
      panel.hidden = true; // hide every panel
    });

    // 3) Activate the clicked tab (visual + aria)
    tab.setAttribute('aria-selected', 'true'); // mark this tab as selected for accessibility
    tab.parentElement.classList.add('active'); // add the visual active class to its <li>

    // 4) Show the matching panel (id taken from the tab's href hash)
    const targetPanel = alphabetWindow.querySelector(tab.getAttribute('href')); // e.g., "#hiragana"
    if (targetPanel) {
      targetPanel.hidden = false;                                              // show the match
      targetPanel.focus?.();                                                   // optional focus move
    }
  });
}
