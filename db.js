const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from the appropriate .env file
dotenv.config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV || 'development'}`)
});

const { MongoClient } = require("mongodb");

// Check if the environment variable is correctly loaded
if (!process.env.MONGODB_URI) {
  console.error("Missing MONGODB_URI environment variable.");
  process.exit(1);
}

// Create a new MongoClient
const client = new MongoClient(process.env.MONGODB_URI);

async function start() {
  try {
    await client.connect();
    console.log(`Connected to MongoDB at ${process.env.MONGODB_URI}`);
    module.exports = client;

    // Import and start the app
    const app = require("./app");
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

start();
