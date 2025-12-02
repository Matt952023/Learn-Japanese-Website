// load environment variables from .env file into process.env
import 'dotenv/config';                                   // lets us use process.env.OPENAI_API_KEY

// import Express library to create a small web server
import express from 'express';                            // backend framework for handling HTTP requests

// import Node helpers for file paths (to find the /src folder)
import path from 'path';                                  // helps build correct file paths
import { fileURLToPath } from 'url';                      // needed to emulate __dirname in ES modules

// import OpenAI client
import OpenAI from 'openai';                              // official OpenAI JavaScript SDK

// create an OpenAI client, using the API key from environment variables
const client = new OpenAI({                               // configure the OpenAI client
  apiKey: process.env.OPENAI_API_KEY,                     // NEVER hard-code the key directly in code
});

// workaround to get __dirname in ES module mode
const __filename = fileURLToPath(import.meta.url);        // file path for this server.js file
const __dirname = path.dirname(__filename);               // directory where server.js lives

// create the Express app
const app = express();                                    // this represents our backend server

// middleware: parse JSON bodies (so req.body.history works)
app.use(express.json());                                  // allows Express to read JSON from POST requests

// middleware: serve static files from the /src folder
app.use(express.static(path.join(__dirname, 'src')));     // serve index.html, CSS, JS from /src

// define a POST route for your Japanese tutor
// 'req' is the data object sent FROM the client (browser)
// 'res' is the data object sent BACK to the client (browser)
app.post('/api/japanese-tutor', async (req, res) => {     // handle POST requests to this path
  try {                                                   // wrap in try/catch to handle errors
    const history = req.body.history || [];               // read history array sent from the browser

    // build input items for the Responses API from our history
    const inputItems = [
      {
        role: 'system',                                      // system message: inital prompt that sets tutor behavior
        content: [
          {
            type: 'input_text',                              // system messages are treated as input text
            // Firstly, define the behavior of the AI: A beginner's Japanese language tutor.
            // Next, handle short greetings from the user.
            // Finally, an addendum that serves to prevent the AI from outputting harmful content
            text: `You are a friendly Japanese tutor for beginners. Explain hiragana, katakana, and basic grammar in a manner that beginners can understand.
            If the user mentions another language that is NOT Japanese, redirect back to Japanese-learning topics.
            If the user begins with a simple greeting, such as "Hi!", then return a simple one-sentence greeting and ask the user what they would like to learn.  
            If the user asks for anything hateful, illegal, or explicit, 
            refuse to answer and gently redirect back to safe Japanese-learning topics`,
          },
        ],
      },
      // spread operator, "...", used to convert the map of messages into individual
      ...history.map((m) => ({                               // convert each history entry (user or assistant)
        role: m.role,                                        // keep the same role: 'user' or 'assistant'
        content: [
          {
            // IMPORTANT: user/system --> input_text, assistant --> output_text
            type: m.role === 'assistant' ? 'output_text' : 'input_text',
            // if this message came from the model, it is "output_text" in Responses API
            // if it came from the user, it's "input_text"
            text: m.content,                                 // the actual message text
          },
        ],
      })),
    ];


    // call the OpenAI Responses API
    const response = await client.responses.create({      // create a model response
      model: 'gpt-4.1-mini',                              // small, cheaper model good for a tutor
      input: inputItems,                                  // send our list of conversation items
    });

    // get the plain text output (SDK provides output_text as a shortcut) 
    const aiText = response.output_text;                  // combined text from the model's response

    res.json({ reply: aiText });                          // send the AI's reply back to the browser
  } catch (err) {                                         // if something goes wrong...
    console.error(err);                                   // log the error on the server
    res.status(500).json({                                // send a 500 error with a safe message
      reply: 'Sorry, the tutor had a problem answering right now.',
    });
  }
});

// start the backend server on port 3000
app.listen(3000, () => {                                   // make the server start listening
  console.log('Backend running on http://localhost:3000'); // helpful message in terminal
});
