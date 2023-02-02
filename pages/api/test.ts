import { NextApiRequest, NextApiResponse } from "next"


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('hellooooooooooooooooooooo')
  res.status(200).json({ name: 'John Doe' })
}
