// ./models/Student.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE SCHEMA
// Schema - describes and enforces the structure of the documents
const studentSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  linkedinUrl: String,
  languages: Array,
  program: String,
  background: String,
  image: String,
  cohort: { type: Schema.Types.ObjectId, ref: "Cohort" },
  projects: Array,
});

// CREATE MODEL
const Student = mongoose.model("Student", studentSchema);

// EXPORT THE MODEL
module.exports = Student;
