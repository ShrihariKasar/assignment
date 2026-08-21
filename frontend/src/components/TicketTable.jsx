import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { Mail, ChevronRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';

// Robust UTC Date parser for ISO strings lacking timezone designator
export const parseDate = (dateString) => {
  if (!dateString) return null;
  if (dateString instanceof Date) return dateString;
  let str = String(dateString).trim();
  if (!str) return null;
  if (str.includes('T') && !str.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(str)) {
    str += 'Z';
  } else if (!str.includes('T') && !str.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(str)) {
    str = str.replace(' ', 'T') + 'Z';
  }
  const date = new Date(str);
  return isNaN(date.getTime()) ? null : date;
};

export const formatRelativeTime = (dateString) => {
  const date = parseDate(dateString);
  if (!date) return '';
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.max(1, Math.floor(diffInSeconds / 60))}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Format full date and time helper
export const formatDateTime = (dateString) => {
  const date = parseDate(dateString);
  if (!date) return '';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const TicketTable = ({ tickets = [] }) => {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (e, ticketId) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ticketId);
    setCopiedId(ticketId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <th className="py-3 px-4">Ticket</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {tickets.map((ticket) => (
              <tr
                key={ticket.ticket_id}
                onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                {/* Ticket ID */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 font-mono text-xs text-slate-900 font-semibold">
                    <span>{ticket.ticket_id}</span>
                    <button
                      onClick={(e) => handleCopy(e, ticket.ticket_id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-700 transition-opacity"
                      title="Copy Ticket ID"
                    >
                      {copiedId === ticket.ticket_id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </td>

                {/* Customer */}
                <td className="py-3.5 px-4 max-w-[180px] truncate">
                  <div className="text-slate-900 font-medium truncate">{ticket.customer_name}</div>
                  <div className="text-slate-500 text-xs flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                    <span className="truncate">{ticket.customer_email}</span>
                  </div>
                </td>

                {/* Subject */}
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="text-slate-900 font-medium truncate group-hover:text-blue-600 transition-colors">
                    {ticket.subject}
                  </div>
                  <div className="text-slate-500 text-xs truncate max-w-sm font-normal">
                    {ticket.description}
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge status={ticket.status} />
                </td>

                {/* Priority */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <PriorityBadge priority={ticket.priority} showIcon />
                </td>

                {/* Timestamp */}
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-xs">
                  <span title={parseDate(ticket.created_at)?.toLocaleString() || ''}>
                    {formatDateTime(ticket.created_at)}
                  </span>
                </td>

                {/* Action Arrow */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all inline-block" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden divide-y divide-slate-100">
        {tickets.map((ticket) => (
          <div
            key={ticket.ticket_id}
            onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
            className="p-4 hover:bg-slate-50 transition-colors cursor-pointer space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                {ticket.ticket_id}
              </span>
              <div className="flex items-center gap-1.5">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-1">
                {ticket.subject}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{ticket.description}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-50">
              <span className="font-medium text-slate-700">{ticket.customer_name}</span>
              <span>{formatDateTime(ticket.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketTable;
