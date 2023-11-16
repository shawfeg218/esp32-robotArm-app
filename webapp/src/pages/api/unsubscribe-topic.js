// // file: webapp\src\pages\api\unsubscribe-topic.js

// import { unsubscribeTopic } from '@/lib/esp32Function.js';

// export default function handler(req, res) {
//   try {
//     if (req.method === 'POST') {
//       unsubscribeTopic(req, res);
//       // console.log('unsubscribeTopic');
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
    if (req.method === "POST") {
      const serverResponse = await fetch(`${url}/api/v1/unsubscribe-topic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });

      if (!serverResponse.ok) {
        const serverError = await serverResponse.json();
        throw new Error(serverError.message);
      }

      res.status(200).json({ message: "Send unsubscribe-topic request successful" });
    } else {
      throw new Error("Method not allowed");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
