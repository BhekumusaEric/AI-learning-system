const PLATFORM_META: Record<string, { name: string; loginUrl: string; description: string }> = {
  dip: {
    name: 'IDC SEF Digital Inclusion Program',
    loginUrl: 'https://ai-learning-system-ten.vercel.app/dip/login',
    description: 'an AI-powered learning platform designed to build your digital skills',
  },
  saaio: {
    name: 'SAAIO Training Grounds',
    loginUrl: 'https://ai-learning-system-ten.vercel.app/saaio/login',
    description: 'a training platform for the International Olympiad in Artificial Intelligence',
  },
  wrp: {
    name: 'WeThinkCode_ Work Readiness Program',
    loginUrl: 'https://ai-learning-system-ten.vercel.app/wrp/login',
    description: 'a work readiness program to prepare you for the tech industry',
  },
};

export function buildCredentialsEmail({
  full_name,
  login_id,
  password,
  platform,
  isReset = false,
}: {
  full_name: string;
  login_id: string;
  password: string;
  platform: string;
  isReset?: boolean;
}): { subject: string; html: string } {
  const meta = PLATFORM_META[platform] ?? PLATFORM_META['saaio'];

  const subject = isReset
    ? `Your password has been reset — ${meta.name}`
    : `Welcome to ${meta.name} — Your Login Credentials`;

  const greeting = isReset
    ? `Hi ${full_name},<br/><br/>Your password has been reset by an administrator. Use the credentials below to log back in.`
    : `Hi ${full_name},<br/><br/>Welcome to <strong style="color:#00ff9d;">${meta.name}</strong> — ${meta.description}.<br/><br/>Your account is ready. Here are your login credentials:`;

  const steps = isReset ? '' : `
    <div style="margin-bottom:28px;">
      <p style="color:#b0b0b0;font-size:13px;margin:0 0 10px 0;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Getting Started</p>
      <ol style="color:#b0b0b0;font-size:14px;margin:0;padding-left:20px;line-height:2;">
        <li>Click the <strong style="color:#fff;">Login</strong> button below</li>
        <li>Enter your <strong style="color:#fff;">Login ID</strong> and <strong style="color:#fff;">Password</strong></li>
        <li>Start learning at your own pace</li>
      </ol>
    </div>`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0a0a0a;">
  <div style="font-family:'Courier New',Courier,monospace;max-width:520px;margin:40px auto;background:#000;border:1px solid #222;border-radius:12px;overflow:hidden;">

    <!-- Header -->
    <div style="background:#0d0d0d;border-bottom:1px solid #1a1a1a;padding:24px 32px;">
      <p style="margin:0;color:#00ff9d;font-size:11px;letter-spacing:3px;text-transform:uppercase;">● ${meta.name}</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <p style="color:#e0e0e0;font-size:15px;line-height:1.7;margin:0 0 24px 0;">${greeting}</p>

      <!-- Credentials Box -->
      <div style="background:#111;border:1px solid #2a2a2a;border-radius:10px;padding:24px;margin-bottom:28px;">
        <p style="color:#555;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px 0;">Your Credentials</p>
        <div style="margin-bottom:16px;">
          <p style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:0 0 4px 0;">Login ID</p>
          <p style="color:#00ff9d;font-size:24px;font-weight:bold;letter-spacing:3px;margin:0;">${login_id}</p>
        </div>
        <div style="border-top:1px solid #1e1e1e;padding-top:16px;">
          <p style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:0 0 4px 0;">Password</p>
          <p style="color:#ffb86b;font-size:24px;font-weight:bold;letter-spacing:4px;margin:0;">${password}</p>
        </div>
      </div>

      ${steps}

      <!-- CTA -->
      <a href="${meta.loginUrl}" style="display:block;background:#00ff9d;color:#000;text-align:center;padding:14px 24px;border-radius:8px;font-weight:bold;font-size:15px;text-decoration:none;letter-spacing:1px;margin-bottom:28px;">
        Go to Login Page →
      </a>

      <!-- Security note -->
      <div style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:8px;padding:16px;">
        <p style="color:#555;font-size:12px;margin:0;line-height:1.6;">
          🔒 <strong style="color:#666;">Keep these credentials private.</strong> Do not share your password with anyone.
          ${isReset ? 'If you did not request this reset, please contact your program administrator immediately.' : 'You can change your password after logging in.'}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#0d0d0d;border-top:1px solid #1a1a1a;padding:20px 32px;">
      <p style="color:#444;font-size:12px;margin:0;line-height:1.6;">
        Need help? Contact your program administrator.<br/>
        This is an automated message — please do not reply directly to this email.
      </p>
    </div>

  </div>
</body>
</html>`;

  return { subject, html };
}

export function adminForwardSubject(subject: string, recipientEmail: string) {
  return `[FORWARD TO ${recipientEmail}] ${subject}`;
}
