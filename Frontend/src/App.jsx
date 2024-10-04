import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', course: '' });
  const [editId, setEditId] = useState(null);

  // Fetch all students
  const fetchStudents = async () => {
    const res = await axios.get('http://localhost:5000/api/student');
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Create or update a student
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:5000/api/student/${editId}`, form);
    } else {
      await axios.post('http://localhost:5000/api/student', form);
    }
    setForm({ name: '', age: '', course: '' });
    setEditId(null);
    fetchStudents();
  };

  // Delete a student
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/student/${id}`);
    fetchStudents();
  };

  // Edit a student
  const handleEdit = (student) => {
    setForm(student);
    setEditId(student._id);
  };

  return (
    <div className="container mt-5">
      <h2>Student Management</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            className="form-control"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Course</label>
          <input
            type="text"
            className="form-control"
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editId ? 'Update Student' : 'Add Student'}
        </button>
      </form>

      <h3 className="mt-4">Student List</h3>
      <table className="table table-striped mt-2">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.course}</td>
              <td>
                <button
                  className="btn btn-warning"
                  onClick={() => handleEdit(student)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger ml-2"
                  onClick={() => handleDelete(student._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
