import { resetWifi } from '@/controllers/esp32Controller';

export default function handler(req, res) {
  if (req.method === 'POST') {
    resetWifi(req, res);
    console.log('resetWifi');
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
