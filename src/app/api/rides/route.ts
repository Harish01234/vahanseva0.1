import { NextRequest, NextResponse } from 'next/server';
import RideModel from '@/models/Ride'; // Assuming you have a Ride model set up

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customerId'); // Get customerId from query params
    const riderId = url.searchParams.get('riderId'); // Get riderId from query params

    // If neither customerId nor riderId is provided, return an error
    if (!customerId && !riderId) {
      return NextResponse.json(
        { error: 'At least one of customerId or riderId is required' },
        { status: 400 }
      );
    }

    // Log to ensure parameters are correctly passed
    console.log('Customer ID received:', customerId);
    console.log('Rider ID received:', riderId);

    // Build the query dynamically based on the provided parameters
    const query: Record<string, string> = {};
    if (customerId) query.customerId = customerId;
    if (riderId) query.riderId = riderId;

    // Fetch all rides based on the query
    const allRides = await RideModel.find(query);

    // Log the fetched rides to ensure correct data is coming back
    console.log('Fetched rides:', allRides);

    // Check if rides are found
    if (!allRides || allRides.length === 0) {
      console.log('No rides found for the given parameters.');
      return NextResponse.json(
        { message: 'No rides found for the given parameters' },
        { status: 200 }
      );
    }

    // Return the rides in the response
    return NextResponse.json({ rides: allRides }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching rides:', error);

    // Return consistent error response
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
    }
  }
}
