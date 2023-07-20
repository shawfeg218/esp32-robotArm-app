// file: webapp\src\pages\api\set-axis-angle.js

import { setAxisAngle } from '@/lib/esp32Function.js';

export default function handler(req, res) {
  try {
    if (req.method === 'POST') {
      setAxisAngle(req, res);
      // console.log('setAxisAngle');
    } else {
      throw new Error('Method not allowed');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
