// file: webapp\src\pages\api\grab-act.js

import { grabAct } from '@/lib/esp32Function';

export default function handler(req, res) {
  if (req.method === 'POST') {
    grabAct(req, res);
    console.log('grabAct');
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
