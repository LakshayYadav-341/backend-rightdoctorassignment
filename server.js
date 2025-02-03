const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("Could not connect to MongoDB Atlas", err));

const PersonSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  mobile: String
});

const Person = mongoose.model("Person", PersonSchema);

// Get all people
app.get("/person", async (req, res) => {
  const people = await Person.find();
  res.json(people);
});

// Create new person
app.post("/person", async (req, res) => {
  const person = new Person(req.body);
  await person.save();
  res.status(201).json(person);
});

// Update a person
app.put("/person/:id", async (req, res) => {
  const person = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(person);
});

// Get a person
app.get("/person/:id", async (req, res) => {
  const person = await Person.findById(req.params.id);
  res.json(person);
});

// Delete a person
app.delete("/person/:id", async (req, res) => {
  await Person.findByIdAndDelete(req.params.id);
  res.json({ message: "Person deleted successfully" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
