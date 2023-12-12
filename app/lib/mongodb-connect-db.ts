// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from "mongodb"
import { secret } from "@aws-amplify/backend"

if (!secret('REACT_APP_MONGODB_URI')) {
    var test = process.env.REACT_APP_NEXTAUTH_URL
    console.log(`${test}`)
    var test2 = secret('REACT_APP_TEST_SECRET')
    console.log(`${test2}`)
    throw new Error('Invalid/Missing environment variable: "REACT_APP_MONGODB_URI" this is not auto generated')
}

var test2 = secret('REACT_APP_TEST_SECRET')
console.log(`${test2}`)

const uri = secret('REACT_APP_MONGODB_URI').toString()
const options = {}

let client
let clientPromise: Promise<MongoClient>

declare global {
    var _mongoClientPromise: Promise<MongoClient> | null;
}

if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options)
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise