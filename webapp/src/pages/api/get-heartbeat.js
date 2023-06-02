import { getHeartbeat } from '@/lib/esp32Function';

export default function handler(req, res) {
  if (req.method === 'POST') {
    getHeartbeat(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
