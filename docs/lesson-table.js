// grab the second tab bar by its unique id                          // ensures we only handle the new tabs
const learnTabList = document.getElementById('learn-tab');            // finds <ul id="learn-tab" class="nav">

// guard: if that element doesn't exist, do nothing                   // avoids errors on pages without this block
if (learnTabList) {                                                   // proceed only when the bar is present

  // add one click listener to the whole bar (event delegation)       // efficient; no per-tab listeners needed
  learnTabList.addEventListener('click', (e) => {                     // respond to clicks inside the tab bar

    // find the nearest <a role="tab"> that was actually clicked      // allows clicks on child elements inside <a>
    const tab = e.target.closest('a[role="tab"]');                    // returns null if click wasn't on a tab
    if (!tab) return;                                                 // ignore non-tab clicks and exit early

    e.preventDefault();                                               // stop default hash-jump behavior

    // scope all panel work to ONLY the .learning window               // keeps this logic independent from alphabet
    const learningWindow = learnTabList.closest('.learning');         // finds the surrounding section.window

    // 1) deactivate the currently selected tab in this bar            // visual + accessibility reset
    learnTabList                                                      // start from the bar we clicked in
      .querySelectorAll('a[role="tab"][aria-selected="true"]')        // find any tab marked selected
      .forEach(a => {                                                 // for each selected tab (usually one)
        a.setAttribute('aria-selected', 'false');                     // mark it not selected for AT
        a.parentElement.classList.remove('active');                   // remove the CSS active state on <li>
      });

    // 2) hide all tab panels in THIS window                           // ensures only one panel visible at a time
    learningWindow
      .querySelectorAll('[role="tabpanel"]')                          // every panel for this window
      .forEach(panel => { panel.hidden = true; });                    // hide them all

    // 3) activate the clicked tab                                     // visual + accessibility update
    tab.setAttribute('aria-selected', 'true');                        // now this tab is the selected one
    tab.parentElement.classList.add('active');                        // style its <li> as active

    // 4) show the matching panel by its hash (e.g., "#lesson")        // connects tab to panel
    const targetSelector = tab.getAttribute('href');                  // reads the href (must start with "#")
    const targetPanel = learningWindow.querySelector(targetSelector); // finds the panel INSIDE this window
    if (targetPanel) {                                                // guard against typos / missing ids
      targetPanel.hidden = false;                                     // reveal the chosen panel
      targetPanel.focus?.();                                          // optional: move focus for keyboard users
    }
  });
}
