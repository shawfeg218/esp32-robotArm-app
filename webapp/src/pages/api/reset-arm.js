import { resetArm } from '@/lib/esp32Function';

export default function handler(req, res) {
  if (req.method === 'POST') {
    resetArm(req, res);
    console.log('resetArm');
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
