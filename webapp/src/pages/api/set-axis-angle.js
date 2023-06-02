// file: webapp\src\pages\api\set-axis-angle.js

import { setAxisAngle } from '@/lib/esp32Function.js';

export default function handler(req, res) {
  if (req.method === 'POST') {
    setAxisAngle(req, res);
    console.log('setAxisAngle');
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
