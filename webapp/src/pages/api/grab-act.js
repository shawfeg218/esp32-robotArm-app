// file: webapp\src\pages\api\grab-act.js

import { grabAct } from '@/lib/esp32Function';

export default function handler(req, res) {
  try {
    if (req.method === 'POST') {
      grabAct(req, res);
      // console.log('grabAct');
    } else {
      throw new Error('Method not allowed');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
