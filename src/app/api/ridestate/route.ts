import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/dbconnect'; // Import the connection function
import RideModel from '@/models/Ride'; // Assuming you have a Ride model set up

export async function POST(request: NextRequest) {
  try {
    console.log('Starting ride state update...');

    // Establish database connection
    await connectToDatabase();
    console.log('Database connected successfully.');

    // Get the JSON body from the request
    const { rideId, state } = await request.json();
    console.log('Received data:', { rideId, state });

    // Validate the input parameters
    if (!rideId || !state) {
      console.log('Missing rideId or state');
      return NextResponse.json(
        { error: 'Both rideId and state are required' },
        { status: 400 }
      );
    }

    // Validate the state to ensure it's one of the valid states
    const validStates = ['Assigned', 'Ongoing', 'Completed', 'Cancelled', 'En Route'];
    if (!validStates.includes(state)) {
      console.log(`Invalid state received: ${state}`);
      return NextResponse.json(
        { error: `Invalid state provided. Valid states are ${validStates.join(', ')}` },
        { status: 400 }
      );
    }

    // Find the ride by ID and update its status
    const updatedRide = await RideModel.findByIdAndUpdate(
      rideId,
      { status: state }, // Update the status field
      { new: true, runValidators: true } // Return the updated document and run validation
    );
    console.log('Updated ride data:', updatedRide);

    // If no ride was found, return an error
    if (!updatedRide) {
      console.log('No ride found with the provided rideId:', rideId);
      return NextResponse.json(
        { error: 'Ride not found' },
        { status: 404 }
      );
    }

    // Return the updated ride in the response
    console.log('Returning updated ride:', updatedRide);
    return NextResponse.json(
      { ride: updatedRide },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error updating ride state:', error);

    // Return consistent error response
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
    }
  }
}
