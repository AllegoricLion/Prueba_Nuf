import { NextRequest, NextResponse } from 'next/server';
import { WelcomeEmailPayload } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const payload: WelcomeEmailPayload = await request.json();
    
    // Validate the webhook secret
    const webhookSecret = request.headers.get('x-webhook-secret');
    const expectedSecret = process.env.N8N_WEBHOOK_SECRET;
    
    if (webhookSecret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate payload
    if (!payload.user_id || !payload.email) {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    // Send webhook to N8N
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (!n8nWebhookUrl) {
      console.error('N8N webhook URL not configured');
      return NextResponse.json(
        { error: 'N8N webhook not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': process.env.N8N_WEBHOOK_SECRET || '',
      },
      body: JSON.stringify({
        user_id: payload.user_id,
        email: payload.email,
        name: payload.name,
        timestamp: payload.timestamp,
        event_type: 'user_login',
        source: 'mini-saas-platform',
      }),
    });

    if (!response.ok) {
      console.error('Failed to send webhook to N8N:', response.statusText);
      return NextResponse.json(
        { error: 'Failed to send webhook' },
        { status: 500 }
      );
    }

    console.log('Welcome email webhook sent successfully for user:', payload.user_id);

    return NextResponse.json({
      success: true,
      message: 'Welcome email webhook sent successfully',
    });
  } catch (error) {
    console.error('N8N webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 