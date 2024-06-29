const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from the appropriate .env file
dotenv.config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV || 'development'}`)
});

const { MongoClient } = require("mongodb");

const connectionString = process.env.MONGODB_URI;
if (!connectionString) {
  console.error("Missing MONGODB_URI environment variable.");
  process.exit(1);
}

const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db();
    console.log(`Connected to MongoDB`);
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
}

module.exports = { connectDB, getDB };

// Start the connection
connectDB().then(() => {
  // Import and start the app
  const app = require("./app");
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
