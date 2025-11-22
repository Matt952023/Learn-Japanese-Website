/* romanjiunciations.js — adds tiny romaji labels under each kana cell */  // file header: describes purpose

'use strict';                                                           // enable strict mode for safer JS

document.addEventListener('DOMContentLoaded', () => {                   // wait until the HTML is parsed
  const tables = document.querySelectorAll(                             // find both charts in your window
    '.alphabet .kana-chart, .alphabet .gana-chart'                      // scope: only inside .alphabet
  );

  // map of irregular readings you want to override (extend anytime)
  const irregular = new Map([                                           // start a Map of exceptions
    ['し','shi'], ['ち','chi'], ['つ','tsu'], ['ふ','fu'], ['を','w/o'], ['ん','n'],  // hiragana basics
    ['じ','ji'],  ['ず','zu'],  ['ぢ','ji'],  ['づ','zu'],                            // hiragana voiced
    ['シ','shi'], ['チ','chi'], ['ツ','tsu'], ['フ','fu'], ['ヲ','o'], ['ン','n'],    // katakana basics
    ['ジ','ji'],  ['ズ','zu'],  ['ヂ','ji'],  ['ヅ','zu']                             // katakana voiced
  ]);

  tables.forEach((table) => {                                           // process each table independently
    const headRow = table.tHead && table.tHead.rows && table.tHead.rows[0]; // first header row (a/i/u/e/o)
    if (!headRow) return;                                               // if there’s no header, bail out

    const vowels = Array.from(headRow.cells)                            // take all header cells
      .slice(1)                                                         // skip the top-left corner th
      .map(th => th.textContent);                                       // normalize to "a i u e o"

    const body = table.tBodies && table.tBodies[0];                     // get the first <tbody>
    if (!body) return;                                                  // if there’s no body, bail out

    Array.from(body.rows).forEach((row) => {                            // iterate each row in the body
      const consonant = (row.cells[0] ? row.cells[0].textContent : '')  // take the row label (k / s / ∅ …)

      for (let i = 1; i < row.cells.length; i++) {                      // iterate each data cell in the row
        const cell = row.cells[i];                                      // reference to the current <td>
        const kana = cell.textContent.trim();                           // read the kana character
        if (!kana) continue;                                            // skip empty placeholders
        if (cell.querySelector('.romanji')) continue;                   // avoid duplicating on re-runs

        let reading = irregular.get(kana);                              // check the irregulars first
        if (!reading) {                                                 // if not irregular, build C+V
          const vowel = vowels[i - 1] || '';                            // pick the column vowel (a/i/u/e/o)
          const isTopRow = consonant === '' || consonant === '∅';       // top row has no consonant
          reading = isTopRow ? vowel : consonant + vowel;               // 'a' vs 'ka', 'shi' overridden above
        }

        const small = document.createElement('small');                  // create the little label element
        small.className = 'romanji';                                    // give it the styling hook
        small.textContent = reading;                                    // set the romaji text
        cell.appendChild(small);                                        // append under the kana glyph
      }
    });
  });
});                                                                     // end DOMContentLoaded handler
