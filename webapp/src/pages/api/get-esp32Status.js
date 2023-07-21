// file: webapp\src\pages\api\get-esp32Status.js

import { getEsp32Status } from '@/lib/esp32Function';

export default function handler(req, res) {
  try {
    if (req.method === 'POST') {
      getEsp32Status(req, res);
    } else {
      throw new Error('Method not allowed');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
