import { getAngles } from '../../controllers/esp32Controller';

export default function handler(req, res) {
  if (req.method === 'GET') {
    getAngles(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
