// pages/api/correct-act.js
// import { correctAct } from '@/lib/esp32Function';

// export default function handler(req, res) {
//   try {
//     if (req.method === 'POST') {
//       correctAct(req, res);
//       // console.log('correctAct');
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
      const serverResponse = await fetch(`${url}/api/correct-act`, {
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

      res.status(200).json({ message: 'Send correct-act request successful' });
    } else {
      throw new Error('Method not allowed');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
