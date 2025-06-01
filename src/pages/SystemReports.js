import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FiDownload, FiFilter, FiRefreshCw, FiCalendar } from 'react-icons/fi';
import '../styles/SystemReports.css';
// done

const SystemReports = () => {
  const [activeTab, setActiveTab] = useState('performance');
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('last30days');

  const performanceData = [
    { name: 'Jan', responseTime: 200, uptime: 99.5, errors: 12 },
    { name: 'Feb', responseTime: 180, uptime: 99.8, errors: 8 },
    { name: 'Mar', responseTime: 150, uptime: 99.9, errors: 5 },
    { name: 'Apr', responseTime: 142, uptime: 99.98, errors: 2 },
    { name: 'May', responseTime: 135, uptime: 99.99, errors: 1 },
    { name: 'Jun', responseTime: 130, uptime: 100, errors: 0 },
  ];

  const userActivityData = [
    { name: 'Landlords', value: 45 },
    { name: 'Tenants', value: 128 },
    { name: 'Admins', value: 3 },
  ];

  const resourceUsageData = [
    { name: 'CPU', usage: 32 },
    { name: 'Memory', usage: 45 },
    { name: 'Storage', usage: 28 },
    { name: 'Network', usage: 15 },
  ];

  const errorLogs = [
    { id: 1, timestamp: '2023-06-15 10:23:45', type: 'Database', message: 'Connection timeout', severity: 'High' },
    { id: 2, timestamp: '2023-06-14 15:12:33', type: 'API', message: 'Rate limit exceeded', severity: 'Medium' },
    { id: 3, timestamp: '2023-06-12 08:45:21', type: 'Authentication', message: 'Failed login attempt', severity: 'Low' },
    { id: 4, timestamp: '2023-06-10 22:10:05', type: 'Database', message: 'Query timeout', severity: 'High' },
    { id: 5, timestamp: '2023-06-08 11:30:15', type: 'System', message: 'Memory allocation error', severity: 'Critical' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const refreshData = () => {
    setLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="system-reports">
      <header className="reports-header">
        <h1>System Reports</h1>
        <div className="controls">
          <div className="date-range-selector">
            <FiCalendar className="calendar-icon" />
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="range-select"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <button className="refresh-btn" onClick={refreshData} disabled={loading}>
            <FiRefreshCw className={`refresh-icon ${loading ? 'spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </header>

      <div className="report-tabs">
        <button 
          className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Activity
        </button>
        <button 
          className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          Resources
        </button>
        <button 
          className={`tab-btn ${activeTab === 'errors' ? 'active' : ''}`}
          onClick={() => setActiveTab('errors')}
        >
          Error Logs
        </button>
      </div>

      <div className="report-content">
        {activeTab === 'performance' && (
          <div className="performance-reports">
            <div className="chart-container">
              <h2>Response Time (ms)</h2>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="responseTime" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-container">
              <h2>Uptime Percentage</h2>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[98, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="uptime" fill="#82ca9d" animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="user-reports">
            <div className="chart-container">
              <h2>User Distribution</h2>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={userActivityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      animationBegin={0}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    >
                      {userActivityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="user-stats-grid">
              <div className="stat-card">
                <h3>New Signups</h3>
                <p className="stat-value">24</p>
                <p className="stat-change positive">+12% from last month</p>
              </div>
              <div className="stat-card">
                <h3>Active Users</h3>
                <p className="stat-value">89</p>
                <p className="stat-change positive">+5% from last month</p>
              </div>
              <div className="stat-card">
                <h3>Avg. Session</h3>
                <p className="stat-value">4.2 min</p>
                <p className="stat-change negative">-0.3 min from last month</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="resource-reports">
            <div className="chart-container">
              <h2>Resource Usage</h2>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={resourceUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="usage" fill="#8884d8" animationDuration={1500}>
                      {resourceUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="resource-details">
              <h3>Detailed Resource Metrics</h3>
              <table className="metrics-table">
                <thead>
                  <tr>
                    <th>Resource</th>
                    <th>Current Usage</th>
                    <th>Peak Usage</th>
                    <th>Threshold</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CPU</td>
                    <td>32%</td>
                    <td>78%</td>
                    <td>85%</td>
                    <td><span className="status-badge ok">OK</span></td>
                  </tr>
                  <tr>
                    <td>Memory</td>
                    <td>45%</td>
                    <td>82%</td>
                    <td>90%</td>
                    <td><span className="status-badge ok">OK</span></td>
                  </tr>
                  <tr>
                    <td>Storage</td>
                    <td>28%</td>
                    <td>30%</td>
                    <td>95%</td>
                    <td><span className="status-badge ok">OK</span></td>
                  </tr>
                  <tr>
                    <td>Network</td>
                    <td>15%</td>
                    <td>45%</td>
                    <td>80%</td>
                    <td><span className="status-badge ok">OK</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'errors' && (
          <div className="error-reports">
            <div className="error-stats">
              <div className="stat-card">
                <h3>Total Errors</h3>
                <p className="stat-value">28</p>
                <p className="stat-change negative">+5 from last week</p>
              </div>
              <div className="stat-card">
                <h3>Critical Errors</h3>
                <p className="stat-value">3</p>
                <p className="stat-change positive">-2 from last week</p>
              </div>
              <div className="stat-card">
                <h3>Avg. Resolution Time</h3>
                <p className="stat-value">2.4 hrs</p>
                <p className="stat-change positive">-0.8 hrs from last week</p>
              </div>
            </div>

            <div className="error-logs">
              <div className="table-header">
                <h3>Error Logs</h3>
                <button className="export-btn">
                  <FiDownload className="export-icon" />
                  Export CSV
                </button>
              </div>
              <table className="error-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Type</th>
                    <th>Message</th>
                    <th>Severity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {errorLogs.map((error) => (
                    <tr key={error.id} className={`severity-${error.severity.toLowerCase()}`}>
                      <td>{error.timestamp}</td>
                      <td>{error.type}</td>
                      <td>{error.message}</td>
                      <td>
                        <span className={`severity-badge ${error.severity.toLowerCase()}`}>
                          {error.severity}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn view">View</button>
                        <button className="action-btn resolve">Resolve</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemReports;