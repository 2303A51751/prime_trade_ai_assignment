import React, { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/api';
import TaskForm from '../components/TaskForm';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '' });

  const loadTasks = useCallback(async (activeFilters) => {
    try {
      setLoading(true);
      const response = await taskService.getTasks(activeFilters);
      setTasks(response.data.data.tasks);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const response = await taskService.getStats();
      setStats(response.data.data.stats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  useEffect(() => {
    loadTasks(filters);
    loadStats();
  }, [filters, loadTasks, loadStats]);

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        loadTasks(filters);
        loadStats();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const handleSaveTask = () => {
    setShowForm(false);
    setEditingTask(null);
    loadTasks(filters);
    loadStats();
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#27ae60',
      medium: '#f39c12',
      high: '#e74c3c',
      critical: '#8b0000',
    };
    return colors[priority] || '#95a5a6';
  };

  const getStatusBgColor = (status) => {
    const colors = {
      pending: '#ecf0f1',
      'in-progress': '#d1ecf1',
      completed: '#d4edda',
      cancelled: '#f8d7da',
    };
    return colors[status] || '#ecf0f1';
  };

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Statistics */}
      {stats && stats.total !== undefined && (
        <div className="grid" style={{ marginBottom: '30px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#667eea' }}>{stats.total}</h3>
            <p>Total Tasks</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#27ae60' }}>{stats.completed}</h3>
            <p>Completed</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#f39c12' }}>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#e74c3c' }}>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}

      {/* Controls */}
      {!showForm && (
        <div className="card">
          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              ➕ Add New Task
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={filters.priority}
                onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      {loading && !showForm ? (
        <div className="text-center">
          <span className="loading"></span>
          <p>Loading tasks...</p>
        </div>
      ) : (
        <div>
          {tasks.length === 0 ? (
            <div className="card text-center">
              <p>No tasks found. Create one to get started! ✨</p>
            </div>
          ) : (
            <div style={{ marginTop: '20px' }}>
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="card"
                  style={{
                    borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                    backgroundColor: getStatusBgColor(task.status),
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '10px',
                    }}
                  >
                    <div>
                      <h3>{task.title}</h3>
                      {task.description && <p>{task.description}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setEditingTask(task);
                          setShowForm(true);
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '15px',
                      fontSize: '14px',
                      color: '#666',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span>
                      <strong>Status:</strong> {task.status}
                    </span>
                    <span>
                      <strong>Priority:</strong>
                      <span style={{ color: getPriorityColor(task.priority) }}>
                        {' '}
                        {task.priority}
                      </span>
                    </span>
                    {task.dueDate && (
                      <span>
                        <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {task.tags && task.tags.length > 0 && (
                      <span>
                        <strong>Tags:</strong> {task.tags.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
