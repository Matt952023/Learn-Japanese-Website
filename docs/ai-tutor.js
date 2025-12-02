// find the chatbox <div> inside the AI Tutor section
const chatbox = document.querySelector('.ai-tutor .chatbox');  // where all messages will be shown

// find the text input where the user types their question
const messageInput = document.getElementById('message-input'); // single-line message input field

// find the "Send" button
const sendButton = document.getElementById('send-btn');        // button the user clicks to send

// keep a simple chat history for this page load
const history = [];                                            // array of { role, content } objects

// helper: convert simple markdown-style text into safe HTML for AI messages
function formatAiText(text) {                                  // text = raw string from the AI
  // 1) escape any HTML characters to avoid unwanted tags
      // '/&/g' means "find every & character"
        // '/.../' is the regex
        // 'g' means global
  let escaped = text
    .replace(/&/g, '&amp;')                                    // Replaces ampersand with HTML-safe ampersand with '&amp';
    .replace(/</g, '&lt;')                                     // < === &lt on the webpage visually;
    .replace(/>/g, '&gt;');                                    // > === &gt on the webpage visually;

  // 2) convert **bold** sections into <strong>bold</strong>
      //   \*\*
        // * is a special character in regex, so we escape it with \*.
        // \*\* means “the literal characters **”.
      // (.+?)
        // (...) === a capturing group (it grabs whatever matches inside).
        // .+? means:
          // . === any character (except newline)
          // + === one or more times
          // ? === lazy (take as few characters as needed, not as many as possible)
      // So (.+?) === “a group of 1+ characters, but the shortest that still makes the whole pattern match”.
  escaped = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // 3) make lines that start with "- " look like bullets (• item)
  escaped = escaped.replace(/^-\s+/gm, '• ');                  // at line start: "- " -> "• "

  // 4) turn newlines into <br> so line breaks are visible
  escaped = escaped.replace(/\n/g, '<br>');                     // newline -> <br>

  return escaped;                                              // final HTML string
}

// helper function: add a message to the chatbox UI
function addMessageToChatbox(sender, text) {                          // sender = 'You' or 'Tutor'
  const msg = document.createElement('div');                          // wrapper for one message

  const isUser = sender === 'You';                                    // is this from the user?
  msg.className = 'chat-message ' + (isUser ? 'from-user' : 'from-tutor');
  // Gives the message two classes, either:
  // "chat-message from-user" or "chat-message from-tutor"
  // Note: The space separates the individual classes

  const label = document.createElement('span');                       // label span: "You:" / "Tutor:"
  label.className = 'sender-label';                                   // shared label styling class
  label.textContent = `${sender}:`;                                   // actual label text

  const body = document.createElement('span');                        // span for the main message text
  body.className = 'message-text';                                    // shared message text styling

  if (isUser) {                                                       // if this is the user message...
    body.textContent = ` ${text}`;                                    // keep it as plain text
  } else {                                                            // otherwise, it's from the Tutor
    body.innerHTML = ' ' + formatAiText(text);                        // use HTML with simple formatting
  }

  msg.appendChild(label);                                             // add label into the message div
  msg.appendChild(body);                                              // add message text into the message div

  chatbox.appendChild(msg);                                           // add whole message bubble to chatbox
  chatbox.scrollTop = chatbox.scrollHeight;                           // scroll to bottom so it's visible
}


// function that runs when the user sends a message
async function handleSend() {                                  // function that sends one message
  const text = messageInput.value.trim();                      // read user text and trim spaces
  if (!text) return;                                           // do nothing if the input is empty

  history.push({ role: 'user', content: text });               // store the user message in history
  addMessageToChatbox('You', text);                            // show it in the chatbox UI
  messageInput.value = '';                                     // clear the textarea

  try {                                                        // start of error-handling block
    const response = await fetch('/api/japanese-tutor', {      // call backend on SAME origin
      method: 'POST',                                          // send data with POST
      headers: { 'Content-Type': 'application/json' },         // tell server we're sending JSON
      body: JSON.stringify({ history }),                       // send full conversation history
    });

    const data = await response.json();                        // parse JSON body from server
    const reply = data.reply;                                  // extract AI reply text

    history.push({ role: 'assistant', content: reply });       // store AI reply in history
    addMessageToChatbox('Tutor', reply);                       // show AI reply in chatbox
  } catch (err) {                                              // if network or JSON error happens...
    console.error(err);                                       // log the error in the browser console
    addMessageToChatbox('Tutor', 'Sorry, something went wrong.'); // show friendly error
  }
}

// when the user clicks the Send button, run handleSend()
sendButton.addEventListener('click', handleSend);              // connect button click to our function

// also allow pressing Enter in the input to send the message
messageInput.addEventListener('keydown', (event) => {          // listen for key presses in the input
  if (event.key === 'Enter') {                                 // if the pressed key is Enter...
    event.preventDefault();                                    // stop the default "submit" behavior
    handleSend();                                              // call our send function
  }
});
