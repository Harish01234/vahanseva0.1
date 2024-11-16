import { NextRequest, NextResponse } from 'next/server';
import RideModel from '@/models/Ride'; // Assuming you have a Ride model set up

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customerId'); // Get customerId from query params

    // If no customerId is provided, return an error
    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    // Log to ensure the customerId is correctly passed
    console.log('Customer ID received:', customerId);

    // Build the query to fetch all rides for the given customerId
    const query = { customerId };

    // Fetch all rides for the given customerId
    const allRides = await RideModel.find(query);

    // Log the fetched rides to ensure correct data is coming back
    console.log('Fetched rides:', allRides);

    // Check if rides are found
    if (!allRides || allRides.length === 0) {
      console.log('No rides found for this customer.');
      return NextResponse.json({ message: 'No rides found for the customerr' }, { status: 200 });
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
