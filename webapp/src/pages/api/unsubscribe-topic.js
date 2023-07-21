// file: webapp\src\pages\api\unsubscribe-topic.js

import { unsubscribeTopic } from '@/lib/esp32Function.js';

export default function handler(req, res) {
  try {
    if (req.method === 'POST') {
      unsubscribeTopic(req, res);
      // console.log('unsubscribeTopic');
    } else {
      throw new Error('Method not allowed');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
