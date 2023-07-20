// pages/api/correct-act.js
import { correctAct } from '@/lib/esp32Function';

export default function handler(req, res) {
  try {
    if (req.method === 'POST') {
      correctAct(req, res);
      // console.log('correctAct');
    } else {
      throw new Error('Method not allowed');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
