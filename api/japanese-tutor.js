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
          text: `You are a friendly Japanese tutor for beginners.
                 Explain hiragana, katakana, and basic grammar clearly.
                 Redirect to Japanese if user goes off-topic.
                 Refuse harmful/explicit requests and stay on language learning.`
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
