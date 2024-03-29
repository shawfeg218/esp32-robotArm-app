export default async function handler(req, res) {
  // const url = 'http://localhost:5000';
  const url = process.env.NEXT_PUBLIC_SERVER_URL;
  try {
    if (req.method === "POST") {
      const serverResponse = await fetch(`${url}/api/v1/T-set-axis-angle`, {
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

      res.status(200).json({ message: "Send T-set-axis-angle request successful" });
    } else {
      throw new Error("Method not allowed");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
