import mongoose, { Document, Schema } from 'mongoose';

interface Ride extends Document {
    customerId: Schema.Types.ObjectId; // Customer who booked the ride
    riderId?: Schema.Types.ObjectId; // Assigned rider (optional at first)
    pickupLocation: string; // Where the ride starts
    dropoffLocation: string; // Where the ride ends
    rideType: 'bike' | 'car'; // Type of ride
    status: 'Pending' | 'Assigned' | 'En Route' | 'Completed' | 'Cancelled'; // Current status of the ride
    bookedAt: Date; // When the ride was booked
    completedAt?: Date; // When the ride was completed
}

const rideSchema = new Schema<Ride>({
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    riderId: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional, can be assigned later
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    rideType: {
        type: String,
        enum: ['bike', 'car'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'En Route', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    bookedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
});

// Create the Ride model
const RideModel = mongoose.models.Ride || mongoose.model('Ride', rideSchema);
export default RideModel;
