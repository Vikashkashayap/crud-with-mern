const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://vikashkashyap756:PKP18VqhQdq1Hobv@cluster1.c8qly.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define the student schema
const StudentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  course: String,
});

const Student = mongoose.model('Student', StudentSchema);

// REST API Endpoints

// Create a new student
app.post('/api/student', async (req, res) => {
  const { name, age, course } = req.body;
  try {
    const student = new Student({ name, age, course });
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all students
app.get('/api/student', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a student by id
app.get('/api/student/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a student by id
app.put('/api/student/:id', async (req, res) => {
  const { name, age, course } = req.body;
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, { name, age, course }, { new: true });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a student by id
app.delete('/api/student/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete all students
app.delete('/api/student', async (req, res) => {
  try {
    await Student.deleteMany();
    res.json({ message: 'All students deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get students by name (search by keyword)
app.get('/api/student', async (req, res) => {
  const { name } = req.query;
  try {
    const students = await Student.find({ name: { $regex: name, $options: 'i' } });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
