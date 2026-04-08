interface Attachment {
  filename: string;
  content: string | Buffer;
}

interface SendEmailOptions {
  to_email: string;
  subject: string;
  message_html: string;
  message_text?: string;
  attachments?: Attachment[];
}

/**
 * Custom WeThinkCode_ Email API sender
 * Replaces the old Resend implementation.
 */
export async function sendEmail({
  to_email,
  subject,
  message_html,
  message_text,
  attachments,
}: SendEmailOptions) {
  const endpoint = 'https://api.lms.wethinkco.de/email/email';
  const apiKey = process.env.WTC_EMAIL_API_KEY;

  if (!apiKey) {
    throw new Error('WTC_EMAIL_API_KEY is not configured in environment variables');
  }

  const payload: any = {
    to_email,
    subject,
    message_html,
    message_text: message_text || 'Please view this email in an HTML-compatible client.',
  };

  // WARNING: If the WTC API does not natively support an "attachments" array structured like this,
  // the email containing documents (e.g. CVs from send-document) will fail or omit the attachment.
  if (attachments && attachments.length > 0) {
    payload.attachments = attachments;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorText = '';
    try {
      errorText = await response.text();
    } catch (e) {}
    throw new Error(`WeThinkCode Email API error: ${response.status} ${response.statusText} ${errorText}`);
  }

  const responseData = await response.text();
  try {
    return JSON.parse(responseData);
  } catch (e) {
    return { success: true, message: responseData };
  }
}
