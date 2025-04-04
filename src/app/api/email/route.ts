// app/api/email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/db';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ message: 'Not valid email.' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('your_database_name');
    const collection = db.collection('emails');

    // Check if email already exists in db or not
    const existingEmail = await collection.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({ message: 'Your email is already registered.' }, { status: 409 });
    }

    // Save new email address
    await collection.insertOne({ email, createdAt: new Date() });

    return NextResponse.json({ message: 'Email added successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Failed to connect to the database.', error);
    return NextResponse.json({ message: 'There was a serve error.' }, { status: 500 });
  }
}
