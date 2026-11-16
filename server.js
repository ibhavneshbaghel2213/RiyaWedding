import express from 'express';
import { appendFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 3000;
const rsvpFile = process.env.RSVP_FILE || join(root, 'data', 'rsvps.jsonl');
const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));

app.post('/api/rsvp', async (request, response) => {
  const name = typeof request.body?.name === 'string' ? request.body.name.trim() : '';
  const guests = request.body?.guests;
  const message = typeof request.body?.message === 'string' ? request.body.message.trim() : '';
  const events = Array.isArray(request.body?.events) ? request.body.events.filter(item => typeof item === 'string') : [];

  if (name.length < 1 || name.length > 100) {
    return response.status(400).json({ error: 'Please provide a valid name.' });
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > 99) {
    return response.status(400).json({ error: 'Number of guests must be between 1 and 99.' });
  }
  if (message.length > 1000) {
    return response.status(400).json({ error: 'Message must be 1,000 characters or fewer.' });
  }

  try {
    await mkdir(dirname(rsvpFile), { recursive: true });
    await appendFile(rsvpFile, `${JSON.stringify({ name, guests, events, message, createdAt: new Date().toISOString() })}\n`, 'utf8');
    return response.status(201).json({ message: 'RSVP saved.' });
  } catch (error) {
    console.error('Could not save RSVP:', error);
    return response.status(500).json({ error: 'Could not save the RSVP right now.' });
  }
});

app.use(express.static(join(root, 'dist')));
app.use('/api', (_request, response) => response.status(404).json({ error: 'Not found.' }));
app.get('/{*path}', (_request, response) => response.sendFile(join(root, 'dist', 'app.html')));

app.listen(port, () => console.log(`Wedding invitation running at http://localhost:${port}`));
