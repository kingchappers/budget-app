import _mongoose, { connect } from "mongoose";
import { defineAuth, secret } from "@aws-amplify/backend"
import { Amplify } from "aws-amplify";

declare global {
    var mongoose: {
        promise: ReturnType<typeof connect> | null;
        conn: typeof _mongoose | null;
    };
}

const MONGODB_URI = secret('REACT_APP_MONGODB_URI').toString()
console.log("the test secret should be under here:")
// const test = secret('REACT_APP_TEST_SECRET') as unknown as string;
const test = process.env.REACT_APP_TEST_SECRET
console.log(test)


if (!MONGODB_URI || MONGODB_URI.length === 0) {
    throw new Error("Please add your MongoDB URI to .env.local");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________________________________________________________________

async function connectDB() {
    if (cached.conn) {
        console.log("🚀 Using cached connection");
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = connect(MONGODB_URI!, opts)
            .then((mongoose) => {
                console.log("✅ New connection established");
                return mongoose;
            })
            .catch((error) => {
                console.error("❌ Connection to database failed");
                throw error;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;
