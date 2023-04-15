import { correctAct } from '@/controllers/esp32Controller';

export default function handler(req, res) {
  if (req.method === 'POST') {
    correctAct(req, res);
    console.log('correctAct');
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
