import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, MessageSquare, Database, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState({
    stats: {
      totalInteractions: 0,
      activeAgents: 0,
      totalOrders: 0,
      systemHealth: 'Loading...'
    },
    recentAudits: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/audit/stats`);
        if (!response.ok) throw new Error('Network response was not ok');
        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Total Interactions', value: data.stats.totalInteractions.toString(), change: 'Real-time', icon: MessageSquare, color: 'text-indigo-400' },
    { label: 'Registered Users', value: data.stats.activeAgents.toString(), change: 'Real-time', icon: Users, color: 'text-purple-400' },
    { label: 'Total Orders', value: data.stats.totalOrders.toString(), change: 'Real-time', icon: Database, color: 'text-emerald-400' },
    { label: 'System Health', value: data.stats.systemHealth, change: 'Status', icon: Activity, color: data.stats.systemHealth === 'Stable' ? 'text-emerald-400' : 'text-rose-400' },
  ];
  return (
    <div className="w-full max-w-7xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">System Audit</h1>
        <p className="text-gray-400">Monitor agentic operations and API interactions in real-time.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-neutral-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-colors"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={64} className={stat.color} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${stat.color}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                    {stat.change} <ArrowUpRight size={12} />
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Audit Logs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-neutral-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
          <h2 className="text-lg font-semibold text-white">Recent Activity Logs</h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            View All Logs
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500 bg-black/10">
                <th className="p-4 font-semibold">Log ID</th>
                <th className="p-4 font-semibold">Action</th>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Time</th>
                <th className="p-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {data.recentAudits.map((log, idx) => (
                <tr key={log._id || idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-gray-300 font-mono text-xs">{log._id ? log._id.substring(18, 24) : '...'}</td>
                  <td className="p-4 font-medium text-white">{log.action}</td>
                  <td className="p-4 text-gray-400">{log.user ? log.user.email : 'guest'}</td>
                  <td className="p-4 text-gray-400">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.action !== 'AI_FAILURE' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-rose-400/10 text-rose-400 border border-rose-400/20'
                    }`}>
                      {log.action !== 'AI_FAILURE' ? 'Success' : 'Failed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
