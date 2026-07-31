const { Todo } = require('../models');

// Fetch all todos from the database
const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

// Create a new todo
const createTodo = async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    
    // Sequelize model validations will automatically handle empty titles, 
    // but catching it early is also a good practice.
    const newTodo = await Todo.create({ title, description, completed });
    
    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

// Update an existing todo by ID
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const todo = await Todo.findByPk(id);

    // If no todo matches the given ID, return 404 Not Found
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Update fields if they were provided in the request
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;

    // Save changes to the database
    await todo.save();

    res.status(200).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

// Delete a todo by ID
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByPk(id);

    // If no todo matches the given ID, return 404 Not Found
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Remove the todo from the database
    await todo.destroy();

    res.status(200).json({ message: 'Todo successfully deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo
};
