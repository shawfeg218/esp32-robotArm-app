import { wrongAct } from '@/lib/esp32Function';

export default function handler(req, res) {
  if (req.method === 'POST') {
    wrongAct(req, res);
    console.log('wrongAct');
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
