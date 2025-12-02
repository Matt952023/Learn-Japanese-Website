// api/japanese-tutor.js

import OpenAI from 'openai';                                // import the OpenAI SDK

const client = new OpenAI({                                 // create a new OpenAI client
  apiKey: process.env.OPENAI_API_KEY                        // read secret key from env variable
});

export default async function handler(req, res) {           // main function Vercel will run
  if (req.method !== 'POST') {                              // only allow POST requests
    return res.status(405).json({ error: 'Use POST' });     // send error if not POST
  }

  const history = req.body.history || [];                   // read conversation history from client

  const inputItems = [                                      // build array for Responses API
    {
      role: 'system',                                       // first message is system prompt
      content: [                                            // system message content is a list
        {
          type: 'input_text',                               // system prompt uses input_text
          // Firstly, define the behavior of the AI: A beginner's Japanese language tutor.
          // Next, handle short greetings from the user.
          // Finally, an addendum that serves to prevent the AI from outputting harmful content
          text: `You are a friendly Japanese tutor for beginners. Explain hiragana, katakana, and basic grammar in a manner that beginners can understand.
          If the user mentions another language that is NOT Japanese, redirect back to Japanese-learning topics.
          If the user begins with a simple greeting, such as "Hi!", then return a simple one-sentence greeting and ask the user what they would like to learn.  
          If the user asks for anything hateful, illegal, or explicit, 
          refuse to answer and gently redirect back to safe Japanese-learning topics`
        }
      ]
    },
    ...history.map(m => ({                                  // convert each history item
      role: m.role,                                         // keep the same role (user/assistant)
      content: [                                            // each message has content array
        {
          type: m.role === 'assistant'                      // if model spoke last time...
            ? 'output_text'                                 // mark as output_text
            : 'input_text',                                 // otherwise it's input_text
          text: m.content                                   // actual message text
        }
      ]
    }))
  ];

  try {                                                     // wrap API call in try/catch
    const response = await client.responses.create({        // call OpenAI Responses API
      model: 'gpt-4.1-mini',                                // small tutor-friendly model
      input: inputItems                                     // send conversation array
    });

    const aiText = response.output_text;                    // get plain text reply from response

    res.status(200).json({ reply: aiText });                // send reply back as JSON
  } catch (err) {                                           // if something goes wrong...
    console.error('Tutor error:', err);                     // log error on server (Vercel logs)
    res.status(500).json({                                  // send generic error to client
      reply: 'Sorry, the tutor had a problem answering right now.'
    });
  }
}
