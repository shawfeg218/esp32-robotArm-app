import { setAxisAngle } from '@/controllers/esp32Controller.js';

export default function handler(req, res) {
  if (req.method === 'POST') {
    setAxisAngle(req, res);
    console.log('setAxisAngle');
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
