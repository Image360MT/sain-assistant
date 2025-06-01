const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/chat', async (req, res) => {
  const { threadId, message } = req.body;
  console.log('Received message:', message);

  try {
    let thread = threadId;
    if (!thread) {
      const newThread = await openai.beta.threads.create();
      thread = newThread.id;
    }

    await openai.beta.threads.messages.create(thread, {
      role: 'user',
      content: message,
    });

    const run = await openai.beta.threads.runs.create(thread, {
      assistant_id: 'asst_t2iZYF5EvXlJhkVxQR842yLe',
    });

    let status;
    do {
      await new Promise(r => setTimeout(r, 1000));
      const runStatus = await openai.beta.threads.runs.retrieve(thread, run.id);
      status = runStatus.status;
    } while (status !== 'completed');

    const messages = await openai.beta.threads.messages.list(thread);
    const lastMessage = messages.data[0].content[0].text.value;

    console.log('SAIN replied:', lastMessage);
    res.json({ response: lastMessage, threadId: thread });

  } catch (error) {
    console.error('Error during OpenAI call:', error);
    res.status(500).json({ response: 'Something went wrong. Please try again later.', threadId });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
