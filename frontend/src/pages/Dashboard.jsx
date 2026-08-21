import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ticketApi } from '../services/api';
import TicketTable from '../components/TicketTable';
import { SkeletonTable } from '../components/Skeleton';
import { Ticket, Clock, CheckCircle, AlertCircle, Plus, ArrowRight } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, open: 0, in_progress: 0, closed: 0 });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsData, ticketsData] = await Promise.all([
          ticketApi.getStats(),
          ticketApi.getTickets({ limit: 6 }),
        ]);
        setStats(statsData);
        setRecentTickets(ticketsData.slice(0, 6));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Unable to load queue statistics. Please check your API connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Tickets',
      value: stats.total,
      icon: Ticket,
      bg: 'bg-slate-100 text-slate-700',
    },
    {
      title: 'Open',
      value: stats.open,
      icon: AlertCircle,
      bg: 'bg-amber-100 text-amber-800',
    },
    {
      title: 'In Progress',
      value: stats.in_progress,
      icon: Clock,
      bg: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'Closed',
      value: stats.closed,
      icon: CheckCircle,
      bg: 'bg-emerald-100 text-emerald-800',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Good morning, Support Team
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Here's what's happening with your support queue.
          </p>
        </div>
        <Link
          to="/tickets/new"
          className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-2.5 px-4 rounded-lg shadow-sm transition-all active:scale-[0.99] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </Link>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-4 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="underline font-medium hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* 4 Compact Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm hover:border-slate-300 transition-all flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  {loading ? '...' : card.value}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.bg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Tickets Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Tickets</h2>
            <p className="text-xs text-slate-500">Latest activity across active support requests</p>
          </div>
          <Link
            to="/tickets"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors"
          >
            <span>View all tickets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <SkeletonTable rows={5} />
        ) : recentTickets.length > 0 ? (
          <TicketTable tickets={recentTickets} />
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-sm">
            No support tickets in queue yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
