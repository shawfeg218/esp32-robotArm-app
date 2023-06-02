// file: webapp\src\pages\api\get-angles.js

import { getAngles } from '@/lib/esp32Function';

export default function handler(req, res) {
  if (req.method === 'POST') {
    getAngles(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
