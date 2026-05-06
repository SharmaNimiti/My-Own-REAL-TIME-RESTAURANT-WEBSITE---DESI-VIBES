const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;


// MongoDB connection string
const mongoURI =
  "mongodb://127.0.0.1:27017/restaurant_db?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.2";

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const contactUsSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  phone: String,
});

const ContactUs = mongoose.model("ContactUs", contactUsSchema, "contact_us");

// Define schema and model for 'book_table' collection
const bookTableSchema = new mongoose.Schema({
  name: String,
  email: String,
  dateTime: Date,
  message: String,
  phone: String,
});

const BookTable = mongoose.model("BookTable", bookTableSchema, "book_table");

// Define routes
app.get("/booked-tables", async (req, res) => {
  try {
    // Query the database to get all booked tables
    const bookedTables = await BookTable.find();
    res.json(bookedTables);
  } catch (err) {
    console.error("Error fetching booked tables:", err);
    res.status(500).json({ error: "Failed to fetch booked tables" });
  }
});

app.get("/contact", async (req, res) => {
  try {
    // Query the database to get all contact messages
    const contacts = await ContactUs.find();
    res.json(contacts);
  } catch (err) {
    console.error("Error fetching contact messages:", err);
    res.status(500).json({ error: "Failed to fetch contact messages" });
  }
});

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;
  
    // Create a new contact message
    const newContactMessage = new ContactUs({ name, email, message, phone });

    // Save the contact message to the database
    await newContactMessage.save();

    // Respond with a success message
    res.status(201).json({ message: "Contact message saved successfully" });
  } catch (error) {
    // If an error occurs, respond with an error message
    console.error("Error saving contact message:", error);
    res.status(500).json({ error: "Failed to save contact message" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
