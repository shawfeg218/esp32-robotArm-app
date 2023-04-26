import { getEsp32Status } from '@/controllers/esp32Controller';

export default function handler(req, res) {
  if (req.method === 'POST') {
    getEsp32Status(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
