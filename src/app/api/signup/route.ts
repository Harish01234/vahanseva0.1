import connectDb from '@/lib/dbconnect';
import UserModel from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';

connectDb();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { name, email, password, phone, role, vehicle_details, location } = reqBody;

        // Validation: Check if required fields are provided
        if (!name || !email || !password || !phone || !role) {
            return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
        }

        // Validation: Check if role is valid
        if (!['rider', 'customer'].includes(role)) {
            return NextResponse.json({ error: "Role must be either 'rider' or 'customer'." }, { status: 400 });
        }

        // If the role is 'rider', validate vehicle_details
        if (role === 'rider') {
            if (!vehicle_details || !vehicle_details.type || !vehicle_details.registration_number || !vehicle_details.model) {
                return NextResponse.json({ error: "Vehicle details are required for riders." }, { status: 400 });
            }
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists." }, { status: 409 });
        }

        // Check if location is an array of two numbers
        if (location && (!Array.isArray(location) || 
            location.length !== 2 || 
            !location.every(coord => typeof coord === 'number' && !isNaN(coord)))) {
            return NextResponse.json({ error: "Location must be an array of two numbers." }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create the new user
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            phone,
            role,
            location: location ? { type: 'Point', coordinates: location } : undefined,
            vehicle_details: role === 'rider' ? vehicle_details : undefined,
            ratings: [],
            is_active: true,
        });

        // Save the user to the database
        await newUser.save();

        return NextResponse.json({ message: "User registered successfully.", success: true }, { status: 201 });

    } catch (error: any) {
        // Enhanced error logging
        console.error("Error during user registration:", error.message || error); // Log the error message
        console.error(error.stack); // Log the stack trace for more context
        return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
    }
}
