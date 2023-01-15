// nextjs api route
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    console.log('1212121212');

    return res.status(200).json({ result: 'Success' });
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}