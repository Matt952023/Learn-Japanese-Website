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

    // 1) Deactivate the currently selected tab (visual + aria)
    tabList.querySelectorAll('a[role="tab"][aria-selected="true"]').forEach(a => {
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
    const targetId = tab.getAttribute('href').slice(1); // remove the leading '#' from href
    const targetPanel = document.getElementById(targetId); // find the panel by id
    if (targetPanel) { // guard in case of typos
      targetPanel.hidden = false; // reveal the chosen panel
      targetPanel.focus?.();      // optional: move focus for keyboard users (if focusable)
    }
  }, false); // use bubbling phase (default), false means don't capture
}
