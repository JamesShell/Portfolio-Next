import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail,
  MessageCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { Booking } from '@/types/admin';

interface BookingCardProps {
  booking: Booking;
  onUpdateStatus: (id: string, status: Booking['status']) => void;
  statusBadge: React.ReactNode;
}

const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  onUpdateStatus, 
  statusBadge 
}) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const formatBookingDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const { date: submittedDate, time: submittedTime } = formatDate(booking.timestamp);
  
  const statusActions = {
    pending: [
      { 
        action: () => onUpdateStatus(booking.id, 'confirmed'), 
        label: 'Confirm', 
        icon: CheckCircle, 
        variant: 'default' as const 
      },
      { 
        action: () => onUpdateStatus(booking.id, 'cancelled'), 
        label: 'Cancel', 
        icon: XCircle, 
        variant: 'destructive' as const 
      }
    ],
    confirmed: [
      { 
        action: () => onUpdateStatus(booking.id, 'completed'), 
        label: 'Mark Complete', 
        icon: CheckCircle, 
        variant: 'default' as const 
      },
      { 
        action: () => onUpdateStatus(booking.id, 'cancelled'), 
        label: 'Cancel', 
        icon: XCircle, 
        variant: 'destructive' as const 
      }
    ],
    cancelled: [
      { 
        action: () => onUpdateStatus(booking.id, 'pending'), 
        label: 'Reopen', 
        icon: RotateCcw, 
        variant: 'outline' as const 
      }
    ],
    completed: [
      { 
        action: () => onUpdateStatus(booking.id, 'pending'), 
        label: 'Reopen', 
        icon: RotateCcw, 
        variant: 'outline' as const 
      }
    ]
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Call Booking - {booking.fullName}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-3 h-3" />
              Submitted {submittedDate} at {submittedTime}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {statusBadge}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Details */}
        <div className="space-y-4">
          {/* Contact Info */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Contact Information
            </h4>
            
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{booking.fullName}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <a 
                href={`mailto:${booking.email}`}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                {booking.email}
              </a>
            </div>
          </div>

          {/* Booking Time */}
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Scheduled Call
            </h4>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">{formatBookingDate(booking.date)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">{booking.time}</span>
            </div>
          </div>
        </div>

        {/* Message (if provided) */}
        <div>
          {booking.message ? (
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3">
                Additional Message
              </h4>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {booking.message}
              </p>
            </div>
          ) : (
            <div className="p-4 bg-muted/20 rounded-lg text-center">
              <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No additional message provided</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(`mailto:${booking.email}`, '_blank')}
          className="gap-2"
        >
          <ExternalLink className="w-3 h-3" />
          Email Client
        </Button>
        
        {statusActions[booking.status].map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant={action.variant}
              size="sm"
              onClick={action.action}
              className="gap-2"
            >
              <Icon className="w-3 h-3" />
              {action.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCard;