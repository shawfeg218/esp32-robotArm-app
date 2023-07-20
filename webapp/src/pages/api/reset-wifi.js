import { resetWifi } from '@/lib/esp32Function';

export default function handler(req, res) {
  try {
    if (req.method === 'POST') {
      resetWifi(req, res);
      console.log('resetWifi');
    } else {
      throw new Error('Method not allowed');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
