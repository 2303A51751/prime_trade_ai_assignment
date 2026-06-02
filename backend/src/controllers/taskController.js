const Task = require('../models/Task');
const logger = require('../utils/logger');

// @desc    Get all tasks for the current user
// @route   GET /api/v1/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, sortBy = '-createdAt' } = req.query;
    const filter = { userId: req.userId };

    // Apply filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter).sort(sortBy).populate('userId', 'name email');

    res.json({
      success: true,
      data: {
        count: tasks.length,
        tasks,
      },
    });
  } catch (error) {
    logger.error(`Get tasks error: ${error.message}`);
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/v1/tasks/:id
// @access  Private
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).populate('userId', 'name email');

    if (!task) {
      logger.warn(`Task not found or unauthorized: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        code: 'TASK_NOT_FOUND',
      });
    }

    res.json({
      success: true,
      data: { task },
    });
  } catch (error) {
    logger.error(`Get task error: ${error.message}`);
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/v1/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    const taskData = {
      ...req.validatedData,
      userId: req.userId,
    };

    const task = await Task.create(taskData);
    const populatedTask = await task.populate('userId', 'name email');

    logger.info(`Task created: ${task._id}`);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task: populatedTask },
    });
  } catch (error) {
    logger.error(`Create task error: ${error.message}`);
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      logger.warn(`Task not found or unauthorized: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        code: 'TASK_NOT_FOUND',
      });
    }

    // Update fields
    Object.assign(task, req.validatedData);
    task.updatedAt = new Date();

    await task.save();
    await task.populate('userId', 'name email');

    logger.info(`Task updated: ${task._id}`);

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: { task },
    });
  } catch (error) {
    logger.error(`Update task error: ${error.message}`);
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      logger.warn(`Task not found or unauthorized: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        code: 'TASK_NOT_FOUND',
      });
    }

    logger.info(`Task deleted: ${task._id}`);

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete task error: ${error.message}`);
    next(error);
  }
};

// @desc    Get task statistics for current user
// @route   GET /api/v1/tasks/stats
// @access  Private
exports.getTaskStats = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      { $match: { userId: req.userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: { stats: stats[0] || { total: 0, completed: 0, pending: 0, inProgress: 0, cancelled: 0 } },
    });
  } catch (error) {
    logger.error(`Get stats error: ${error.message}`);
    next(error);
  }
};
