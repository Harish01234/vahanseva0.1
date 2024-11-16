import connectDb from '@/lib/dbconnect';
import UserModel from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDb();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        // Validation
        console.log(reqBody);
        const user = await UserModel.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: 'User does not exist' },
                { status: 404 } // Use 404 for user not found
            );
        }

        console.log('User exists');

        // Compare password
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json(
                { error: 'Check your credentials' },
                { status: 401 } // Use 401 for unauthorized access
            );
        }

        // Create JWT token
        const tokenData = {
            
            email: user.email,
            username: user.username,
            role: user.role, // Ensure to include the role in the token if needed
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1h' });

        const response = NextResponse.json({
            userid: user._id,
            message: 'Logged in successfully',
            success: true,
            role: user.role, // Include user role in the response
        });

        // Set the token in the cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set secure flag for production
            sameSite: 'lax',
        });

        return response;
    } catch (error: any) {
        console.error("Error during login:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
