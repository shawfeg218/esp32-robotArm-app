// file: webapp\src\pages\api\grab-act.js

import { grabAct } from '@/controllers/esp32Controller';

export default function handler(req, res) {
  if (req.method === 'POST') {
    grabAct(req, res);
    console.log('grabAct');
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
