import { getEsp32Status } from '@/lib/esp32Function';

export default function handler(req, res) {
  if (req.method === 'POST') {
    getEsp32Status(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
