import React from 'react';
import type { GetServerSideProps } from 'next';

interface CallbackProps {
  errorMsg?: string;
  userProfile?: {
    name: string;
    email: string;
    deptAndTitle: string;
    bio: string;
    avatarUrl: string;
    twoFactorEnabled: boolean;
  };
}

export default function AuthCallback({ errorMsg, userProfile }: CallbackProps) {
  React.useEffect(() => {
    if (userProfile && typeof window !== 'undefined') {
      if (window.opener) {
        window.opener.postMessage({
          type: 'OAUTH_AUTH_SUCCESS',
          profile: userProfile
        }, '*');
        setTimeout(() => window.close(), 1500);
      } else {
        window.location.href = '/';
      }
    }
  }, [userProfile]);

  if (errorMsg) {
    return (
      <div style={{ fontFamily: 'sans-serif', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', margin: 0, color: '#1e293b' }}>
        <div style={{ background: 'white', padding: 30, borderRadius: 16, border: '1px solid #fee2e2', maxWidth: 400, lineHeight: 1.6, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <strong style={{ color: '#dc2626', fontSize: 15, display: 'block', marginBottom: 8 }}>Google 认证链路握手失败 (Next.js)</strong>
          <p style={{ fontSize: 12, color: '#475569', margin: '0 0 16px' }}>原因: <code>{errorMsg}</code></p>
          <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>请确保您在 AI Studio 的 Secrets 面板内正确设置了 <code>GOOGLE_CLIENT_ID</code> 与 <code>GOOGLE_CLIENT_SECRET</code>，且您的 Client App 登记了正确的回调重定向 URI。</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', margin: 0, color: '#1e293b' }}>
      <div style={{ background: 'white', padding: 30, borderRadius: 16, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', textAlign: 'center', maxWidth: 380 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 'bold', fontSize: 20 }}>G</div>
        <strong style={{ fontSize: 16, display: 'block', marginBottom: 8 }}>Google OAuth 登录成功 (Next.js)</strong>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 }}>正在调配 NextJS 底部微服务系统。此授权页将在 2 秒内关闭并自动同步状态...</p>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<CallbackProps> = async (context) => {
  const { code } = context.query;

  if (!code) {
    return {
      props: {
        errorMsg: "授权被取消或授权码不存在"
      }
    };
  }

  try {
    const proto = context.req.headers["x-forwarded-proto"] || "http";
    const host = context.req.headers.host || "localhost:3000";
    const redirectUri = `${proto}://${host}/auth/callback`;

    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: String(code),
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      throw new Error(`Google 凭证调配交换失败: ${errText}`);
    }

    const tokenData = (await tokenResponse.json()) as any;
    const accessToken = tokenData.access_token;

    // Fetch user info using token
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!profileResponse.ok) {
      throw new Error("拉取 Google 账户画像数据失败");
    }

    const googleUser = (await profileResponse.json()) as any;

    const userProfile = {
      name: googleUser.name || googleUser.given_name || "Google User",
      email: googleUser.email,
      deptAndTitle: "Google 认证协作成员",
      bio: "通过 Google 联合身份安全体系认证入驻 MarAI 系统的注册科学家。",
      avatarUrl: googleUser.picture || "https://lh3.googleusercontent.com/aida-public/AB6AXuCxTTe7PQf8lEonbOO0rq63fgAB-bM_4o4WVHz4l1fkoMJ8GiMJqwRusqCZtAJujb8nuwVoTg9AQqu06D-uKHXcMe1zzTboEroGXabDZwsFOzL3fq52St3iSF5VI_VWLB3kQmm9xj7ziZlb1EzOgLaTnac_Z869ivOO-oPJBpTXNhb2NfBKXaBUjYhX2XcynVyPwMMfGUSONldWagymXbYNSaolGciFN8XaX27RsAtCbY47sNFUH8n74Id_vP7gMumcIsjpu9pd1Q",
      twoFactorEnabled: false
    };

    return {
      props: {
        userProfile
      }
    };

  } catch (err: any) {
    console.error("Google NextJS callback exchange crashed:", err);
    return {
      props: {
        errorMsg: err.message || "未知认证断联故障"
      }
    };
  }
};
