import app from "./app";
import connectDB from "./config/db";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
// To prevent crash if no MONGO_URI is set yet, we wrap it in a simple check
if (process.env.MONGO_URI && process.env.MONGO_URI !== "your_mongodb_connection_string") {
  connectDB();
} else {
  console.log("MongoDB connection skipped. Please configure MONGO_URI in .env");
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
