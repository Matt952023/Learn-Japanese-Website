// ===== quiz-inline.js =====                                             // file name: keep old code untouched

// 1) tiny utility: pick N random unique items from an array              // helper to build a quiz set
function sampleUnique(arr, n) {                                           // arr = source pool, n = desired size
  const copy = [...arr];                                                  // shallow copy so we don't mutate original
  for (let i = copy.length - 1; i > 0; i--) {                             // Fisher–Yates shuffle
    const j = Math.floor(Math.random() * (i + 1));                        // random index in [0..i]
    [copy[i], copy[j]] = [copy[j], copy[i]];                              // swap
  }
  return copy.slice(0, n);                                               // take the first n items
}

// 2) data: hirigana and katana pools                           // each item: { glyph, romanji }
const HIRAGANA_POOL = [                                         // list of basic hiragana quiz items
  { glyph: 'あ', romanji: 'a' },                                 // あ -> "a"
  { glyph: 'い', romanji: 'i' },                                 // い -> "i"
  { glyph: 'う', romanji: 'u' },                                 // う -> "u"
  { glyph: 'え', romanji: 'e' },                                 // え -> "e"
  { glyph: 'お', romanji: 'o' },                                 // お -> "o"

  { glyph: 'か', romanji: 'ka' },                                // か -> "ka"
  { glyph: 'き', romanji: 'ki' },                                // き -> "ki"
  { glyph: 'く', romanji: 'ku' },                                // く -> "ku"
  { glyph: 'け', romanji: 'ke' },                                // け -> "ke"
  { glyph: 'こ', romanji: 'ko' },                                // こ -> "ko"

  { glyph: 'さ', romanji: 'sa' },                                // さ -> "sa"
  { glyph: 'し', romanji: 'shi' },                               // し -> "shi"
  { glyph: 'す', romanji: 'su' },                                // す -> "su"
  { glyph: 'せ', romanji: 'se' },                                // せ -> "se"
  { glyph: 'そ', romanji: 'so' },                                // そ -> "so"

  { glyph: 'た', romanji: 'ta' },                                // た -> "ta"
  { glyph: 'ち', romanji: 'chi' },                               // ち -> "chi"
  { glyph: 'つ', romanji: 'tsu' },                               // つ -> "tsu"
  { glyph: 'て', romanji: 'te' },                                // て -> "te"
  { glyph: 'と', romanji: 'to' },                                // と -> "to"

  { glyph: 'な', romanji: 'na' },                                // な -> "na"
  { glyph: 'に', romanji: 'ni' },                                // に -> "ni"
  { glyph: 'ぬ', romanji: 'nu' },                                // ぬ -> "nu"
  { glyph: 'ね', romanji: 'ne' },                                // ね -> "ne"
  { glyph: 'の', romanji: 'no' },                                // の -> "no"

  { glyph: 'は', romanji: 'ha' },                                // は -> "ha"
  { glyph: 'ひ', romanji: 'hi' },                                // ひ -> "hi"
  { glyph: 'ふ', romanji: 'fu' },                                // ふ -> "fu"
  { glyph: 'へ', romanji: 'he' },                                // へ -> "he"
  { glyph: 'ほ', romanji: 'ho' },                                // ほ -> "ho"

  { glyph: 'ま', romanji: 'ma' },                                // ま -> "ma"
  { glyph: 'み', romanji: 'mi' },                                // み -> "mi"
  { glyph: 'む', romanji: 'mu' },                                // む -> "mu"
  { glyph: 'め', romanji: 'me' },                                // め -> "me"
  { glyph: 'も', romanji: 'mo' },                                // も -> "mo"

  { glyph: 'や', romanji: 'ya' },                                // や -> "ya"
  { glyph: 'ゆ', romanji: 'yu' },                                // ゆ -> "yu"
  { glyph: 'よ', romanji: 'yo' },                                // よ -> "yo"

  { glyph: 'ら', romanji: 'ra' },                                // ら -> "ra"
  { glyph: 'り', romanji: 'ri' },                                // り -> "ri"
  { glyph: 'る', romanji: 'ru' },                                // る -> "ru"
  { glyph: 'れ', romanji: 're' },                                // れ -> "re"
  { glyph: 'ろ', romanji: 'ro' },                                // ろ -> "ro"

  { glyph: 'わ', romanji: 'wa' },                                // わ -> "wa"
  { glyph: 'を', romanji: 'w/o' },                                 // を -> pronounced "o" in modern Japanese

  { glyph: 'ん', romanji: 'n' },                                 // ん -> final "n" sound
];                                                               // end of hiragana pool

const KATAKANA_POOL = [                                         // list of basic katakana quiz items
  { glyph: 'ア', romanji: 'a' },                                 // ア -> "a"
  { glyph: 'イ', romanji: 'i' },                                 // イ -> "i"
  { glyph: 'ウ', romanji: 'u' },                                 // ウ -> "u"
  { glyph: 'エ', romanji: 'e' },                                 // エ -> "e"
  { glyph: 'オ', romanji: 'o' },                                 // オ -> "o"

  { glyph: 'カ', romanji: 'ka' },                                // カ -> "ka"
  { glyph: 'キ', romanji: 'ki' },                                // キ -> "ki"
  { glyph: 'ク', romanji: 'ku' },                                // ク -> "ku"
  { glyph: 'ケ', romanji: 'ke' },                                // ケ -> "ke"
  { glyph: 'コ', romanji: 'ko' },                                // コ -> "ko"

  { glyph: 'サ', romanji: 'sa' },                                // サ -> "sa"
  { glyph: 'シ', romanji: 'shi' },                               // シ -> "shi"
  { glyph: 'ス', romanji: 'su' },                                // ス -> "su"
  { glyph: 'セ', romanji: 'se' },                                // セ -> "se"
  { glyph: 'ソ', romanji: 'so' },                                // ソ -> "so"

  { glyph: 'タ', romanji: 'ta' },                                // タ -> "ta"
  { glyph: 'チ', romanji: 'chi' },                               // チ -> "chi"
  { glyph: 'ツ', romanji: 'tsu' },                               // ツ -> "tsu"
  { glyph: 'テ', romanji: 'te' },                                // テ -> "te"
  { glyph: 'ト', romanji: 'to' },                                // ト -> "to"

  { glyph: 'ナ', romanji: 'na' },                                // ナ -> "na"
  { glyph: 'ニ', romanji: 'ni' },                                // ニ -> "ni"
  { glyph: 'ヌ', romanji: 'nu' },                                // ヌ -> "nu"
  { glyph: 'ネ', romanji: 'ne' },                                // ネ -> "ne"
  { glyph: 'ノ', romanji: 'no' },                                // ノ -> "no"

  { glyph: 'ハ', romanji: 'ha' },                                // ハ -> "ha"
  { glyph: 'ヒ', romanji: 'hi' },                                // ヒ -> "hi"
  { glyph: 'フ', romanji: 'fu' },                                // フ -> "fu"
  { glyph: 'ヘ', romanji: 'he' },                                // ヘ -> "he"
  { glyph: 'ホ', romanji: 'ho' },                                // ホ -> "ho"

  { glyph: 'マ', romanji: 'ma' },                                // マ -> "ma"
  { glyph: 'ミ', romanji: 'mi' },                                // ミ -> "mi"
  { glyph: 'ム', romanji: 'mu' },                                // ム -> "mu"
  { glyph: 'メ', romanji: 'me' },                                // メ -> "me"
  { glyph: 'モ', romanji: 'mo' },                                // モ -> "mo"

  { glyph: 'ヤ', romanji: 'ya' },                                // ヤ -> "ya"
  { glyph: 'ユ', romanji: 'yu' },                                // ユ -> "yu"
  { glyph: 'ヨ', romanji: 'yo' },                                // ヨ -> "yo"

  { glyph: 'ラ', romanji: 'ra' },                                // ラ -> "ra"
  { glyph: 'リ', romanji: 'ri' },                                // リ -> "ri"
  { glyph: 'ル', romanji: 'ru' },                                // ル -> "ru"
  { glyph: 'レ', romanji: 're' },                                // レ -> "re"
  { glyph: 'ロ', romanji: 'ro' },                                // ロ -> "ro"

  { glyph: 'ワ', romanji: 'wa' },                                // ワ -> "wa"
  { glyph: 'ヲ', romanji: 'w/o' },                                 // ヲ -> pronounced "o" in modern Japanese

  { glyph: 'ン', romanji: 'n' },                                 // ン -> final "n" sound
];                                                               // end of katakana pool


// (Optional advanced) You can also **derive** these pools from your existing tables instead of hardcoding.
// For example, query the cells in #hiragana / #katakana and map glyph → romaji via your romanji.js mapping.

// 3) quiz builder: creates a 10-question inline quiz UI inside .quiz-host
function makeQuiz(container, pool) {                                     // container = <div.quiz-host>, pool = items
  const QUESTIONS = sampleUnique(pool, Math.min(10, pool.length));       // up to 10 unique questions
  let index = 0;                                                         // current question index
  let score = 0;                                                         // correct answers count

  // create a root element to hold the quiz UI
  const root = document.createElement('div');                            // outer wrapper
  root.className = 'inline-quiz';                                        // styling hook
  container.replaceChildren(root);                                       // clear host, insert quiz

  // reusable sub-elements
  const qTitle = document.createElement('h3');                           // question title
  const qGlyph = document.createElement('div');                          // big glyph display
  const choices = document.createElement('div');                         // choice buttons container
  const status = document.createElement('div');                          // per-question feedback
  const nextBtn = document.createElement('button');                      // next question button
  const finish = document.createElement('div');                          // final score area

  qGlyph.style.fontSize = '5rem';                                        // make the kana large
  qGlyph.style.textAlign = 'center';                                     // center it visually
  choices.className = 'choices';                                         // grid of answer buttons
  status.className = 'status';                                           // message area
  nextBtn.textContent = 'Next';                                          // label for advancing
  nextBtn.disabled = true;                                               // disabled until a choice is picked
  nextBtn.type = 'button';                                               // avoid form submits

  // append the static pieces once
  root.appendChild(qTitle);                                              // add question title
  root.appendChild(qGlyph);                                              // add glyph display
  root.appendChild(choices);                                             // add choices grid
  root.appendChild(status);                                              // add feedback area
  root.appendChild(nextBtn);                                             // add next button
  root.appendChild(finish);                                              // add final score area (initially empty)

  // render a single question (index-th)
  function renderQuestion() {                                            // draws the current question
    const current = QUESTIONS[index];                                    // item with {glyph, romanji}
    qTitle.textContent = `Question ${index + 1} of ${QUESTIONS.length}`; // update title
    qGlyph.textContent = current.glyph;                                  // show the kana to identify
    status.textContent = '';                                             // clear feedback
    finish.textContent = '';                                             // ensure final score is empty
    nextBtn.disabled = true;                                             // wait until a choice is clicked
    nextBtn.className = 'next';
    choices.replaceChildren();                                           // clear old choice buttons

    // build 3 distractors (wrong answers) + 1 correct, then shuffle
    const distractors = sampleUnique(                                    // pull wrong romanji labels
      pool.filter(x => x.romanji !== current.romanji),                   // anything not the answer
      Math.min(3, pool.length - 1)                                       // up to 3 wrongs
    ).map(x => x.romanji);                                               // keep only romanji text

    const options = [...distractors, current.romanji];                   // make a 4-option set
    // shuffle options in-place (small Fisher–Yates)
    for (let i = options.length - 1; i > 0; i--) {                       // from end to start
      const j = Math.floor(Math.random() * (i + 1));                     // random index
      [options[i], options[j]] = [options[j], options[i]];               // swap
    }

    // create a button for each option
    options.forEach(label => {                                           // iterate all labels
      const btn = document.createElement('button');                      // make a choice button
      btn.type = 'button';                                               // not a submit
      btn.className = 'choice';                                          // style hook
      btn.textContent = label;                                           // show the romanji text
      btn.addEventListener('click', () => {                              // handle selection
        const correct = (label === current.romanji);                     // check correctness
        if (correct) {                                                   // if correct
          score++;                                                       // increment score
          status.textContent = '✅ Correct!';                            // feedback
        } else {                                                         // wrong answer
          status.textContent = `❌ Incorrect. Correct answer: ${current.romanji}`; // feedback
        }
        // disable all buttons after one choice
        [...choices.children].forEach(b => (b.disabled = true));         // prevent re-clicking
        nextBtn.disabled = false;                                        // allow moving forward
      });
      choices.appendChild(btn);                                          // place the button in the grid
    });
  }

  // move to the next question or show final score
  nextBtn.addEventListener('click', () => {                              // on Next click
    index++;                                                             // advance index
    if (index < QUESTIONS.length) {                                      // if more remain
      renderQuestion();                                                  // draw next
    } else {                                                             // quiz finished
      choices.replaceChildren();                                         // clear choices
      qGlyph.textContent = '🎉';                                         // celebratory marker
      qTitle.textContent = 'Finished!';                                  // heading
      status.textContent = '';                                           // clear feedback
      nextBtn.disabled = true;                                           // no more next
      finish.innerHTML = `<div class="score">Your score: ${score} / ${QUESTIONS.length}</div>`; // show score
    }
  });

  // initial render
  renderQuestion();                                                       // start with question 1
}

// 4) attach to “Start Quiz” buttons (in the .learning window only)       // keeps logic modular
const learningWindow = document.querySelector('.learning');              // find the learning section
if (learningWindow) {                                                    // guard if not present
  learningWindow.addEventListener('click', (e) => {                      // delegate clicks in the window
    const btn = e.target.closest('button.start-quiz');                   // look for a Start button
    if (!btn) return;                                                    // ignore other clicks

    const rawMode = btn.getAttribute('data-mode');        // read the value from data-mode (e.g. "hiragana")
    const mode = (rawMode || '').trim().toLowerCase();   // handle null, trim spaces, and lowercase it
    const host = btn.parentElement.querySelector('.quiz-host');          // the div where we inject UI
    let pool;                                               // will hold the chosen question set
    if (mode === 'katakana') {                              // if the button says "katakana"
      pool = KATAKANA_POOL;                                 // use the katakana data array
    } else if (mode === 'hiragana') {                       // if the button says "hiragana"
      pool = HIRAGANA_POOL;                                 // use the hiragana data array
    } else {                                                // anything else is unexpected
      console.warn('Unknown quiz mode:', rawMode);          // log a warning in the browser console
      return;                                               // stop here so we don’t run a broken quiz
    }

    // open the details block (so the quiz is visible)
    const details = btn.closest('details');                              // find wrapping <details>
    if (details && !details.open) details.open = true;                   // ensure it’s open

    // build and render the quiz in-place
    makeQuiz(host, pool);                                                // create a fresh 10-question quiz
  });
}
