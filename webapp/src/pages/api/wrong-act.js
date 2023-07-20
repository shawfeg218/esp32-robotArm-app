import { wrongAct } from '@/lib/esp32Function';

export default function handler(req, res) {
  try {
    if (req.method === 'POST') {
      wrongAct(req, res);
      // console.log('wrongAct');
    } else {
      throw new Error('Method not allowed');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
