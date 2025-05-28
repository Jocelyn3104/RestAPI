const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // your MySQL password
  database: 'todolist_db'
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// Routes

// Get all todos
app.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add a new todo
app.post('/todos', (req, res) => {
  const { task } = req.body;
  db.query('INSERT INTO todos (task) VALUES (?)', [task], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, task, completed: false });
  });
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;            // Get the ID from the URL
  const { task, completed } = req.body; // Get task and completed from the request body

  // Update query to the database
  db.query(
    'UPDATE todos SET task = ?, completed = ? WHERE id = ?',
    [task, completed, id],
    (err, result) => {
      if (err) {
        console.log('Error updating todo:', err);  // Log any error if occurs
        return res.status(500).json({ error: 'Database error' });
      }

      // Log the result to ensure the query ran successfully
      console.log('Update successful:', result);

      // Respond with the updated data
      res.json({ id, task, completed });
    }
  );
});


// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM todos WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.json({ message: 'Deleted' });
  });
});

app.listen(3001, () => console.log("Server running on port 3001"));
