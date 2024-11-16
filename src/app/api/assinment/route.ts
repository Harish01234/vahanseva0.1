// pages/api/rides/assign.ts
import connectDb from '@/lib/dbconnect';
import RideModel from '@/models/Ride';
import UserModel from '@/models/User';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const getLocationCoordinates = async (location: string) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;

    try {
        console.log(`Fetching coordinates for location: ${location}`);
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'YourAppName/1.0' // Nominatim requires a User-Agent header
            }
        });

        const data = response.data;
        if (data.length > 0) {
            const { lat, lon } = data[0];
            console.log(`Coordinates found: latitude ${lat}, longitude ${lon}`);
            return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
        } else {
            throw new Error("Location not found");
        }
    } catch (error) {
        console.error("Error fetching location:", error);
        throw new Error("Could not fetch location coordinates");
    }
};

// Function to calculate distance (Haversine formula)
const haversineDistance = (coords1: number[], coords2: number[]) => {
    console.log(`Calculating distance between ${coords1} and ${coords2}`);
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km

    // Correct order: latitudes first, longitudes second
    const lat1 = toRad(coords1[0]);  // latitude of first point
    const lon1 = toRad(coords1[1]);  // longitude of first point
    const lat2 = toRad(coords2[0]);  // latitude of second point
    const lon2 = toRad(coords2[1]);  // longitude of second point

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    console.log(`Distance calculated: ${distance} km`);
    return distance;
};

export async function POST(request: NextRequest) {
    try {
        console.log('Connecting to the database...');
        await connectDb();
        console.log('Database connection successful.');

        const { rideId } = await request.json();
        console.log(`Received rideId: ${rideId}`);

        // Validate input
        if (!rideId) {
            console.log('No rideId provided.');
            return NextResponse.json(
                { error: 'rideId is required' },
                { status: 400 }
            );
        }

        // Find the ride
        console.log(`Finding ride with ID: ${rideId}`);
        const ride = await RideModel.findById(rideId);
        if (!ride) {
            console.log('Ride not found.');
            return NextResponse.json(
                { error: 'Ride not found' },
                { status: 404 }
            );
        }
        console.log(`Ride found with status: ${ride.status}`);
        if (ride.status !== 'Pending') {
            console.log(`Ride is not in pending state: ${ride.status}`);
            return NextResponse.json(
                { error: 'Ride is not in pending state' },
                { status: 400 }
            );
        }

        // Get pickup location coordinates
        console.log(`Fetching coordinates for pickup location: ${ride.pickupLocation}`);
        const pickupCoordinates = await getLocationCoordinates(ride.pickupLocation);

        // Fetch all active riders
        console.log('Fetching all active riders...');
        const riders = await UserModel.find({ role: 'rider', is_active: true });
        console.log(`Found ${riders.length} active riders.`);

        // Find the nearest rider based on coordinates
        console.log('Finding the nearest rider...');
        const closestRider = riders
            .map(rider => {
                const riderCoords = rider.location?.coordinates;
                if (riderCoords) {
                    console.log(`Calculating distance for rider: ${rider._id}`);
                    const distance = haversineDistance(
                        [pickupCoordinates.latitude, pickupCoordinates.longitude], // Pickup location (latitude first, longitude second)
                        [riderCoords[0], riderCoords[1]] // Rider coordinates (latitude first, longitude second) -> Corrected
                    );
                    return { rider, distance };
                }
                return null;
            })
            .filter(item => item !== null)
            .sort((a, b) => a!.distance - b!.distance) // Sort by distance
            .shift(); // Get the closest rider (first one)

        if (!closestRider) {
            console.log('No available riders found.');
            return NextResponse.json(
                { error: 'No available riders found' },
                { status: 404 }
            );
        }

        console.log(`Closest rider found: ${closestRider.rider._id}, distance: ${closestRider.distance} km`);
            //update
          await RideModel.findByIdAndUpdate(rideId, { riderId: closestRider.rider._id, status: 'Assigned' });  
        return NextResponse.json({
            message: 'Closest rider fetched successfully',
            rider: closestRider.rider,
            pickupCoordinates, // Optionally return pickup coordinates
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error assigning rider:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
