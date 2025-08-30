import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  User, 
  Clock, 
  Eye,
  ExternalLink 
} from 'lucide-react';
import { Message } from '@/types/admin';

interface MessageCardProps {
  message: Message;
  onMarkAsRead: (id: string) => void;
  statusBadge: React.ReactNode;
}

const MessageCard: React.FC<MessageCardProps> = ({ 
  message, 
  onMarkAsRead, 
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

  const { date, time } = formatDate(message.timestamp);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Message from {message.fullName}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-3 h-3" />
              {date} at {time}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {statusBadge}
          {!message.read && (
            <Button
              size="sm"
              onClick={() => onMarkAsRead(message.id)}
              className="gap-1"
            >
              <Eye className="w-3 h-3" />
              Mark as Read
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Contact Information
            </h4>
            
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{message.fullName}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <a 
                href={`mailto:${message.email}`}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                {message.email}
              </a>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="lg:col-span-2">
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3">
              Message
            </h4>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.message}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/50">
        <Button
          variant="default"
          size="sm"
          onClick={() => window.open(`mailto:${message.email}`, '_blank')}
          className="gap-2"
        >
          <ExternalLink className="w-3 h-3" />
          Reply via Email
        </Button>
      </div>
    </div>
  );
};

export default MessageCard;