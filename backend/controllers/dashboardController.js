const Task = require('../models/Task');

// @desc    Get dashboard metrics (stats, due soon, overdue, completion rate)
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res, next) => {
  const userId = req.user._id;

  try {
    // 1. Fetch all non-archived tasks for stats calculation
    const totalQuery = { userId, isArchived: false };
    const tasks = await Task.find(totalQuery);

    const total = tasks.length;
    let pending = 0;
    let inProgress = 0;
    let completed = 0;

    tasks.forEach(task => {
      if (task.status === 'pending') pending++;
      else if (task.status === 'in-progress') inProgress++;
      else if (task.status === 'completed') completed++;
    });

    const completionRate = total > 0 ? parseFloat(((completed / total) * 100).toFixed(1)) : 0;

    // 2. Fetch Due Soon (not completed, not archived, due in next 3 days)
    const now = new Date();
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    const dueSoon = await Task.find({
      userId,
      isArchived: false,
      status: { $ne: 'completed' },
      dueDate: { $gte: now, $lte: threeDaysFromNow }
    }).sort('dueDate');

    // 3. Fetch Overdue (not completed, not archived, due in the past)
    const overdue = await Task.find({
      userId,
      isArchived: false,
      status: { $ne: 'completed' },
      dueDate: { $lt: now }
    }).sort('dueDate');

    res.status(200).json({
      success: true,
      message: 'Dashboard data fetched',
      data: {
        stats: {
          total,
          pending,
          inProgress,
          completed
        },
        dueSoon,
        overdue,
        completionRate
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData
};
