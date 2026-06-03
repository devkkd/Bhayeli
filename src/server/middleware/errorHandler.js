import { NextResponse } from 'next/server';

/**
 * Standardized API Error class for custom server errors
 */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized API Error Handler
 * Adapts Express-style error handling for Next.js Route Handlers.
 * 
 * @param {Error} error - The caught error object
 * @returns {NextResponse} Standardized Next.js JSON response
 */
export function handleApiError(error) {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'An unexpected server error occurred.';

  // Log 500+ errors as severe, 4xx as warnings to keep console clean
  if (statusCode >= 500) {
    console.error(`💥 Backend System Error (Status ${statusCode}):`, error);
  } else {
    console.warn(`⚠️ Client Request Warning (Status ${statusCode}): ${message}`);
  }

  const responseBody = {
    success: false,
    error: {
      message,
      status: statusCode,
      name: error.name || 'ServerError',
    }
  };

  // Include stack trace only in development environment
  if (process.env.NODE_ENV === 'development') {
    responseBody.error.stack = error.stack;
  }

  return NextResponse.json(responseBody, { status: statusCode });
}
