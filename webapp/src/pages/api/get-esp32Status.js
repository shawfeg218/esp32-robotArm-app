// file: webapp\src\pages\api\get-esp32Status.js

// import { getEsp32Status } from '@/lib/esp32Function';

// export default function handler(req, res) {
//   try {
//     if (req.method === 'POST') {
//       getEsp32Status(req, res);
//     } else {
//       throw new Error('Method not allowed');
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

export default async function handler(req, res) {
  // const url = 'http://localhost:5000';
  const url = process.env.NEXT_PUBLIC_SERVER_URL;
  try {
    if (req.method === 'POST') {
      const serverResponse = await fetch(`${url}/api/get-esp32Status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      if (!serverResponse.ok) {
        const serverError = await serverResponse.json();
        throw new Error(serverError.message);
      }

      const data = await serverResponse.json();
      res.status(200).json(data);
    } else {
      throw new Error('Method not allowed');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
