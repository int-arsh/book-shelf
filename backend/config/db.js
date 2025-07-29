// backend/config/db.js

// Import the 'mongoose' library.
// Mongoose is a popular ODM (Object Data Modeling) library for MongoDB and Node.js.
// It provides a schema-based solution to model your application data, making it easier
// to interact with MongoDB.
const mongoose = require('mongoose');

// Define an asynchronous function to connect to the database.
// 'async' means this function will perform operations that might take some time (like connecting to a database)
// without blocking the rest of our application.
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the URI from our environment variables.
        // process.env.MONGO_URI will get the value we set in our .env file.
        // The 'await' keyword ensures that the code waits for the connection to be established
        // before moving on to the next line.
        const conn = await mongoose.connect(process.env.MONGO_URI);

        // If the connection is successful, log a message to the console.
        // 'conn.connection.host' will give us the host that we successfully connected to.
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If an error occurs during connection, log the error message.
        console.error(`Error: ${error.message}`);
        // Exit the Node.js process with a failure code (1).
        // This is important in production environments if the database connection is critical.
        process.exit(1);
    }
};

// Export the connectDB function so it can be imported and used in other files (like index.js).
module.exports = connectDB;