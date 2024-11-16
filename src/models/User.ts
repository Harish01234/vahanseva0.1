import mongoose, { Document, Schema } from 'mongoose';

// Define the VehicleDetails interface
interface VehicleDetails {
    type?: 'car' | 'bike' | 'other';
    registration_number?: string;
    model?: string;
}

// Define the User interface
interface User extends Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'rider' | 'customer';
    location?: {
        type?: 'Point';
        coordinates?: [number, number];
    };
    vehicle_details?: VehicleDetails;
    ratings: number[];
    is_active: boolean;
}

// Create the User schema
const userSchema = new Schema<User>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['rider', 'customer'],
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location' must be a point
            required: false, // Location type is not required
        },
        coordinates: {
            type: [Number],
            required: false, // Coordinates are not required
        },
    },
    vehicle_details: {
        type: {
            type: String, // e.g., "car", "bike"
            enum: ['car', 'bike', 'other'],
            required: function () { return this.role === 'rider'; }, // Only required for riders
        },
        registration_number: {
            type: String,
            required: function () { return this.role === 'rider'; }, // Only required for riders
        },
        model: {
            type: String,
            required: function () { return this.role === 'rider'; }, // Only required for riders
        },
    },
    ratings: {
        type: [Number], // Array of ratings
        default: [],
    },
    is_active: {
        type: Boolean,
        default: true, // Default to active
    },
}, { timestamps: true });

// Create a geospatial index for the location field
userSchema.index({ location: '2dsphere' });

// Create the User model
const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export default UserModel;
