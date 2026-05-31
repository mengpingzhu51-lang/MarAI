import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { origin } = req.query;
  const redirectOrigin = origin || "http://localhost:3000";
  const redirectUri = `${redirectOrigin}/auth/callback`;

  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.json({ 
      url: "", 
      mock: true,
      message: "GOOGLE_CLIENT_ID 未在系统的环境变量/密钥管理中配置。工作台即将激活沙盒多态模拟流程。"
    });
  }

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: String(redirectUri),
    response_type: "code",
    scope: "openid profile email",
    access_type: "offline",
    prompt: "consent"
  });

  res.json({ 
    url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    mock: false 
  });
}
