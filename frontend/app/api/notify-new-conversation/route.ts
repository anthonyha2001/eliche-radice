import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, customerName, customerPhone, priority } = body;

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // Send email notification
    const emailContent = `
      <h2>New Conversation Started</h2>
      <p>A new customer conversation has been created.</p>
      <ul>
        <li><strong>Conversation ID:</strong> ${conversationId}</li>
        <li><strong>Customer Name:</strong> ${customerName || 'Not provided'}</li>
        <li><strong>Customer Phone:</strong> ${customerPhone || 'Not provided'}</li>
        <li><strong>Priority:</strong> ${priority || 'normal'}</li>
      </ul>
      <p>Please check the operator dashboard to respond.</p>
    `;

    // Use environment variable for from email, or default
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const toEmail = 'anthonyhasrouny8@gmail.com';

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New Conversation: ${customerName || conversationId.substring(0, 8)}`,
      html: emailContent,
    });

    if (error) {
      console.error('❌ Failed to send email notification:', error);
      return NextResponse.json(
        { error: 'Failed to send email notification' },
        { status: 500 }
      );
    }

    console.log('✅ Email notification sent:', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('❌ Error in notify-new-conversation API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

