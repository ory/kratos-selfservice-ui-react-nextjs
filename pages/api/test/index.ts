// nextjs api route
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req);
  if (req.method === 'GET') {
    console.log('1212121212');
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}