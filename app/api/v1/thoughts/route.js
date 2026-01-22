import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Thought from '../../../../lib/models/Thought';

function getUserIdFromToken(token) {
  try {
    if (!token || !token.startsWith('Bearer ')) {
      return null;
    }
    const tokenValue = token.replace('Bearer ', '');
    const decoded = JSON.parse(Buffer.from(tokenValue, 'base64').toString());
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const authHeader = request.headers.get('authorization');
    const userId = getUserIdFromToken(authHeader);

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const thoughts = await Thought.find({ user: userId }).sort({ createdAt: -1 });

    return NextResponse.json(thoughts);
  } catch (error) {
    console.error('Get thoughts error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch thoughts' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const authHeader = request.headers.get('authorization');
    const userId = getUserIdFromToken(authHeader);

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { text } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { message: 'Text is required' },
        { status: 400 }
      );
    }

    const thought = await Thought.create({
      text: text.trim(),
      user: userId,
    });

    return NextResponse.json(thought, { status: 201 });
  } catch (error) {
    console.error('Create thought error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create thought' },
      { status: 500 }
    );
  }
}
