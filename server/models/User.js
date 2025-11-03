const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  oauthId: { type: String, required: true, unique: true },
  provider: { type: String, required: true },
  name: String,
  email: String,
});

// Optional: Add index on oauthId for faster lookups (already unique)
userSchema.index({ oauthId: 1 });

module.exports = mongoose.model("User", userSchema);
