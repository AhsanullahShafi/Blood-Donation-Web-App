const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios"); // Import axios for seedData route
const app = express();

const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For authentication (JWT)
const multer = require("multer"); // For handling file uploads
const path = require("path");
const fs = require("fs");

const port = 5000; // Or any port you prefer

// Enable CORS for cross-origin requests (adjust origin as needed)
app.use(
  cors({
    origin: "http://localhost:8080", // Or your React app's address
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files (for profile images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
const mongoURI = "mongodb://127.0.0.1:27017/donorDB"; // Replace with your MongoDB URI

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  accountType: { type: String, enum: ["donor", "recipient"], required: true },
  profileImage: { type: String }, // Store the filename/path to the image
  createdAt: { type: Date, default: Date.now },
});

const donorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Associate with User
  age: { type: String },
  bloodType: { type: String },
  lastDonation: { type: String },
  sickness: { type: String },
  medication: { type: String },
  donationType: { type: String, enum: ["paid", "unpaid"] },
  available: { type: Boolean, default: true },
  contactPhone: { type: String },
  donationNumber: { type: Number },
});

const bloodRequestSchema = new mongoose.Schema({
  organizationName: { type: String, required: true },
  bloodType: { type: String, required: true },
  location: { type: String, required: true },
  contactNumber: { type: String, required: true },
  price: { type: Number, required: true },
  urgency: { type: String, enum: ["high", "medium", "low"], required: true },
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["blood_donation", "awareness"], required: true },
  expectedAttendees: { type: Number, required: true },
});

const Event = mongoose.model("Event", eventSchema);

const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);

const User = mongoose.model("User", userSchema);
const DonorProfile = mongoose.model("DonorProfile", donorProfileSchema);

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "uploads"); // Store in 'uploads' directory
    fs.mkdirSync(uploadDir, { recursive: true }); // Ensure the directory exists
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Registration Endpoint (/api/register)
app.post("/api/register", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, password, location, accountType } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      location,
      accountType,
      profileImage: req.file ? `/uploads/${req.file.filename}` : null, // Save image path
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
});

// Login Endpoint (you'll need this)
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create and assign a JWT token (replace 'your-secret-key' with a strong secret)
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        accountType: user.accountType,
        name: user.name,
      },
      "your-secret-key"
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// API Endpoint: Get All Blood Requests
app.get("/api/blood-requests", async (req, res) => {
  try {
    const requests = await BloodRequest.find();
    res.json(requests);
  } catch (error) {
    console.error("Error fetching blood requests:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// API Endpoint: Create a Blood Request
app.post("/api/blood-requests", async (req, res) => {
  try {
    const newRequest = new BloodRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest); // Send the created request with its _id
  } catch (error) {
    console.error("Error creating blood request:", error);
    if (error.name === "ValidationError") {
      const errors = {};
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res
        .status(400)
        .json({ message: "Validation error", errors: errors });
    }
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.post("/api/donor-profile", async (req, res) => {
  try {
    const { userId, ...profileData } = req.body;

    // Check if a profile already exists for the given userId
    const existingProfile = await DonorProfile.findOne({ userId: userId });

    if (existingProfile) {
      return res.status(400).json({
        message: "Profile already exists for this user. Use PUT to update.",
      }); // IMPORTANT: Correct error
    }
    let {
      age,
      bloodType,
      lastDonation,
      sickness,
      medication,
      donationType,
      available,
      contactPhone,
      donationNumber,
    } = profileData;
    const newProfile = new DonorProfile({
      userId: userId,
      age,
      bloodType,
      lastDonation,
      sickness,
      medication,
      donationType,
      available,
      contactPhone,
      donationNumber,
    });
    await newProfile.save();
    return res
      .status(201)
      .json({ message: "Profile created successfully", profile: newProfile });
  } catch (error) {
    console.error("Error creating donor profile:", error);
    // Handle validation errors from Mongoose.  Good practice!
    if (error.name === "ValidationError") {
      const errors = {};
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res
        .status(400)
        .json({ message: "Validation error", errors: errors });
    }

    if (error.code === 11000) {
      //Duplicate key error
      return res.status(400).json({ message: "User already has a profile" });
    }

    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// API Endpoint for Donor Profile Update (PUT)
app.put("/api/donor-profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const profileData = req.body;

    const updatedProfile = await DonorProfile.findByIdAndUpdate(
      id,
      profileData,
      { new: true, runValidators: true }
    ); // runValidators!

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating donor profile:", error);
    if (error.name === "ValidationError") {
      const errors = {};
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res
        .status(400)
        .json({ message: "Validation error", errors: errors });
    }
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// API Endpoint to Get Donor Profile by User ID
app.get("/api/donor-profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await DonorProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Donor profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching donor profile:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch donor profile", error: error.message });
  }
});

// API Endpoint to Get All Donors (or filtered)
app.get("/api/donors", async (req, res) => {
  try {
    const { bloodType, availableOnly, searchTerm } = req.query;

    let query = {};

    if (bloodType && bloodType !== "all") {
      query.bloodType = bloodType;
    }

    if (availableOnly === "true") {
      query.available = true;
    }

    if (searchTerm) {
      query.$or = [
        { bloodType: { $regex: searchTerm, $options: "i" } }, // Case-insensitive search
        { location: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const donors = await DonorProfile.find(query);

    res.json(donors);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// API Endpoint: Create a New Event
app.post("/api/events", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    if (error.name === "ValidationError") {
      const errors = {};
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res
        .status(400)
        .json({ message: "Validation error", errors: errors });
    }
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
