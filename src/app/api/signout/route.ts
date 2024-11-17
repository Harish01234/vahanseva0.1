import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Create the response first (but don't send it yet)
        const response = NextResponse.json({
            message: 'Logged out successfully',
            success: true,
        });

        // Clear the cookies before sending the response
        response.cookies.delete('token');
        response.cookies.delete('role');

        // Send the response after clearing cookies
        return response;
    } catch (error: any) {
        console.error("Error during logout:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
