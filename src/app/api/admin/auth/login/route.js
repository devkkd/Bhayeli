import { NextResponse } from 'next/server';
import { Admin } from '../../../../../server/models/Admin.js';
import { verifyPassword } from '../../../../../server/utils/auth.js';
import { signToken } from '../../../../../server/utils/token.js';

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // 1. Basic field validation
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: 'Username and password are required.'
      }, { status: 400 });
    }

    // 2. Fetch admin user from Mongoose/Mock database
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials. User not found.'
      }, { status: 401 });
    }

    // 3. Verify password
    const isPasswordValid = verifyPassword(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials. Password incorrect.'
      }, { status: 401 });
    }

    // 4. Generate signed session token
    const token = await signToken({
      adminId: admin._id,
      username: admin.username,
      role: admin.role
    }, 24); // 24 hours lifespan

    // 5. Create successful response and set HttpOnly session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully. Welcome back!',
      user: {
        username: admin.username,
        role: admin.role
      }
    });

    const isProd = process.env.NODE_ENV === 'production';
    
    // Set admin_token cookie
    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours in seconds
    });

    return response;

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({
      success: false,
      message: 'An internal error occurred during login verification.',
      error: error.message
    }, { status: 500 });
  }
}
