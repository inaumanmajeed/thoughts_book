import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Thought from '../../../../../lib/models/Thought';

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

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
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

    const thought = await Thought.findOne({ _id: id, user: userId });

    if (!thought) {
      return NextResponse.json(
        { message: 'Thought not found' },
        { status: 404 }
      );
    }

    thought.text = text.trim();
    await thought.save();

    return NextResponse.json(thought);
  } catch (error) {
    console.error('Update thought error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update thought' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const authHeader = request.headers.get('authorization');
    const userId = getUserIdFromToken(authHeader);

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const thought = await Thought.findOneAndDelete({ _id: id, user: userId });

    if (!thought) {
      return NextResponse.json(
        { message: 'Thought not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Thought deleted successfully' });
  } catch (error) {
    console.error('Delete thought error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to delete thought' },
      { status: 500 }
    );
  }
}
