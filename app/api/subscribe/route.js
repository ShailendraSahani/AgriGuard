import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { sendEmail } from '@/lib/mailer';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const { db } = await connectDB();

    // Check if email already exists
    const existingSubscription = await db.collection('subscriptions').findOne({ email });
    if (existingSubscription) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
    }

    // Save subscription
    await db.collection('subscriptions').insertOne({
      email,
      subscribedAt: new Date(),
      active: true
    });

    // Send confirmation email
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to AgriGuard Newsletter!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #16a34a;">Welcome to AgriGuard!</h1>
            <p>Thank you for subscribing to our newsletter. You'll receive the latest updates on:</p>
            <ul>
              <li>Agricultural innovations</li>
              <li>Farming tips and techniques</li>
              <li>Market trends</li>
              <li>Exclusive offers</li>
            </ul>
            <p>Stay connected with us for sustainable farming solutions!</p>
            <p>Best regards,<br>The AgriGuard Team</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({ message: 'Successfully subscribed' }, { status: 200 });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
