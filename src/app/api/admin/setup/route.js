import { NextResponse } from 'next/server';
import { Admin } from '../../../../server/models/Admin.js';
import { hashPassword } from '../../../../server/utils/auth.js';
import dbConnect from '../../../../server/config/db.js';

export async function GET() {
  try {
    // Attempt database connection
    const conn = await dbConnect();
    const isMock = !conn;

    // Check if an admin already exists
    const admins = await Admin.find({});
    
    if (admins.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Database is already initialized. Seeding blocked for security reasons.',
        details: 'Admin accounts already exist in the system.'
      }, { status: 403 });
    }

    // Default seed credentials
    const defaultUsername = 'admin';
    const defaultPassword = 'bhayeliAdmin123';
    const hashedPassword = hashPassword(defaultPassword);

    // Create default admin
    const seededAdmin = await Admin.create({
      username: defaultUsername,
      password: hashedPassword,
      role: 'admin'
    });

    return NextResponse.json({
      success: true,
      message: 'Admin database initialized successfully!',
      database: isMock ? 'Fallback Local In-Memory DB' : 'MongoDB Atlas Database',
      credentials: {
        username: defaultUsername,
        password: defaultPassword,
        role: seededAdmin.role
      },
      securityTip: 'Please change these default credentials when in a production environment.'
    }, { status: 201 });

  } catch (error) {
    console.error('Setup seeding error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to initialize admin database setup.',
      error: error.message
    }, { status: 500 });
  }
}
