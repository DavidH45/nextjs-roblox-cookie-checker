import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type Data = {
  message: string;
  validCookies?: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  if (!req.body.cookies || !Array.isArray(req.body.cookies)) {
    return res.status(400).json({ message: 'Cookies must be provided as an array.' });
  }

  const cookiesInput: string[] = req.body.cookies;

  if (cookiesInput.length === 0) {
    return res.status(400).json({ message: 'No cookies provided!' });
  }

  let validCookies: string[] = [];
  let threads = 0;
  const maxThread = 1;

  const checkCookie = async (cookie: string) => {
    threads++;
    try {
      const response = await axios.get('https://users.roblox.com/v1/users/authenticated', {
        headers: { "Cookie": `.ROBLOSECURITY=${cookie};` }
      });
      console.log("Checking cookie")
      if (response.status === 200) {
        validCookies.push(cookie);
      }
    } catch (error) {
      console.error('Error or invalid cookie:');
    }
    threads--;
  };

  const promises = cookiesInput.map(cookie => async () => {
    while (threads >= maxThread) await wait(100);
    await checkCookie(cookie);
  });

  await Promise.all(promises.map(func => func()));

  while (threads > 0) await wait(100);

  if (validCookies.length > 0) {
    res.status(200).json({
      message: 'Valid cookies found!',
      validCookies,
    });
  } else {
    res.status(404).json({
      message: 'No valid cookies were found!',
    });
  }
}
export const config = {
  api: {
      bodyParser: {
          sizeLimit: '100mb' // How much data can be sent to api from main site. 100mb should be enjough for ALOT of cookies
      }
  }
}
const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
