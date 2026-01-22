import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import User from '../../../../../lib/models/User';

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

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to get user' },
      { status: 500 }
    );
  }
}
