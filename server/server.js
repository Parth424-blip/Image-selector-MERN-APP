require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
const searchRoutes = require("./routes/search");
require("./config/passport");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Middleware Setup
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // false for HTTP, true for HTTPS production
      sameSite: "lax",
    },
  })
);

// Initialize Passport session AFTER express-session
app.use(passport.initialize());
app.use(passport.session());

// Root test route
app.get("/", (req, res) => {
  res.send("Backend is running.");
});

// OAuth Authentication routes (Google, Facebook, GitHub)
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    successRedirect: CLIENT_ORIGIN,
  })
);

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/auth/failure",
    successRedirect: CLIENT_ORIGIN,
  })
);

app.get("/auth/github", passport.authenticate("github"));
app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/auth/failure",
    successRedirect: CLIENT_ORIGIN,
  })
);

app.get("/auth/failure", (req, res) => {
  res.status(401).send("Authentication failed. Check your OAuth app callback URLs and credentials.");
});

// API route to get current user (from Passport session)
app.get("/api/current_user", (req, res) => {
  res.json(req.user || null);
});

// Logout
app.post("/api/logout", (req, res) => {
  req.logout(() => {
    res.send({ success: true });
  });
});

// Register search routes
app.use("/api", searchRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
