import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully. Session terminated.'
    });

    // Destroy session cookie by setting its maxAge to 0 and giving it an expired date
    response.cookies.set({
      name: 'admin_token',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0,
      expires: new Date(0)
    });

    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json({
      success: false,
      message: 'An internal error occurred during logout.',
      error: error.message
    }, { status: 500 });
  }
}
