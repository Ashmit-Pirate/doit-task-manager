const Task = require('../models/Task');

// @desc    Get all tasks for logged-in user with filters, sorting, and pagination
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const skip = (page - 1) * limit;

    const query = { userId: req.user._id };
    if (req.query.archived === 'true') {
      query.isArchived = true;
    } else {
      query.isArchived = false;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by priority
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    // Search query on title
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    // Sorting
    let sortBy = '-createdAt';
    if (req.query.sort === 'dueDate') {
      sortBy = 'dueDate';
    }

    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: 'Tasks fetched',
      data: {
        tasks,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTasks: total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    res.status(200).json({
      success: true,
      message: 'Task fetched successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  const { title, description, status, priority, dueDate } = req.body;

  try {
    if (!title) {
      res.status(400);
      throw new Error('Please add a task title');
    }

    const task = await Task.create({
      userId: req.user._id,
      title,
      description,
      status,
      priority,
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  const { title, description, priority, dueDate, status } = req.body;

  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Handle completedAt logic if status is being updated
    if (status !== undefined) {
      if (
        task.status !== 'completed' &&
        req.body.status === 'completed'
      ) {
        task.completedAt = new Date();
        task.isArchived = true;
      }

      if (
        task.status === 'completed' &&
        req.body.status !== 'completed'
      ) {
        task.completedAt = null;
        task.isArchived = false;
      }
      task.status = status;
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task status (pending → in-progress → completed → pending)
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
const toggleTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Cycle status: pending → in-progress → completed → pending
    if (task.status === 'pending') {
      task.status = 'in-progress';
    } else if (task.status === 'in-progress') {
      task.status = 'completed';
    } else {
      task.status = 'pending';
    }

    // Update completedAt based on new status
    if (task.status === 'completed') {
      task.completedAt = new Date();
      task.isArchived = true;
    } else {
      task.completedAt = null;
      task.isArchived = false;
    }

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: 'Task status toggled successfully',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Archive / Unarchive a task
// @route   PATCH /api/tasks/:id/archive
// @access  Private
const archiveTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    task.isArchived = !task.isArchived;

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: updatedTask.isArchived ? 'Task archived' : 'Task unarchived',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  archiveTask,
};
