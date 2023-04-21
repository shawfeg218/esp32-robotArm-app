import { wrongAct } from '@/controllers/esp32Controller';

export default function handler(req, res) {
  if (req.method === 'POST') {
    wrongAct(req, res);
    console.log('wrongAct');
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}