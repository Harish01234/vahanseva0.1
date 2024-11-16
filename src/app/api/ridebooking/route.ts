// pages/api/rides/index.ts
import connectDb from '@/lib/dbconnect';
import RideModel from '@/models/Ride';
import { NextRequest, NextResponse } from 'next/server';

connectDb();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { customerId, pickupLocation, dropoffLocation, rideType } = reqBody;

        // Validation
        if (!customerId || !pickupLocation || !dropoffLocation || !rideType) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 } // Use 400 for bad request
            );
        }

        // Create a new ride
        const newRide = new RideModel({
            customerId,
            pickupLocation,
            dropoffLocation,
            rideType,
            status: 'Pending', // Set initial status to Pending
        });

        await newRide.save();

        return NextResponse.json({
            message: 'Ride created successfully',
            success: true,
            ride: newRide, // Return the created ride object
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error during ride creation:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}