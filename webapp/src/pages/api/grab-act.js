// file: webapp\src\pages\api\grab-act.js

// import { grabAct } from '@/lib/esp32Function';

// export default function handler(req, res) {
//   try {
//     if (req.method === 'POST') {
//       grabAct(req, res);
//       // console.log('grabAct');
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
      const serverResponse = await fetch(`${url}/api/grab-act`, {
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

      res.status(200).json({ message: 'Send grab-act request successful' });
    } else {
      throw new Error('Method not allowed');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
