"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface DateTimePickerProps {
  value: { date: string; time: string };
  onChange: (value: { date: string; time: string }) => void;
  className?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(value.date || "");
  const [selectedTime, setSelectedTime] = useState<string>(value.time || "");

  // Generate time slots (9 AM to 6 PM)
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const today = new Date();

  const formatDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toISOString().split('T')[0];
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date < today || date.getDay() === 0 || date.getDay() === 6; // Disable weekends and past dates
  };

  const handleDateSelect = (day: number) => {
    if (isDateDisabled(day)) return;
    const dateString = formatDate(day);
    setSelectedDate(dateString);
    onChange({ date: dateString, time: selectedTime });
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onChange({ date: selectedDate, time });
  };

  const navigateMonth = (direction: 1 | -1) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  };

  const monthYear = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Date Picker */}
      <div className="bg-background/30 backdrop-blur-md border border-border/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-foreground/60" />
          <span className="text-sm font-medium text-foreground/80">Select Date</span>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth(-1)}
            className="p-1"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-medium">{monthYear}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth(1)}
            className="p-1"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-foreground/60 font-medium">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the first day of the month */}
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="p-2" />
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateString = formatDate(day);
            const isSelected = selectedDate === dateString;
            const isDisabled = isDateDisabled(day);
            
            return (
              <motion.button
                key={day}
                onClick={() => handleDateSelect(day)}
                disabled={isDisabled}
                className={`p-2 text-sm rounded-lg transition-all duration-200 ${
                  isSelected
                    ? 'bg-foreground text-background'
                    : isDisabled
                    ? 'text-foreground/30 cursor-not-allowed'
                    : 'text-foreground hover:bg-background/20'
                }`}
                whileHover={!isDisabled ? { scale: 1.05 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
              >
                {day}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Time Picker */}
      <div className="bg-background/30 backdrop-blur-md border border-border/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-foreground/60" />
          <span className="text-sm font-medium text-foreground/80">Select Time</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map(time => {
            const isSelected = selectedTime === time;
            
            return (
              <motion.button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`p-3 text-sm rounded-lg transition-all duration-200 ${
                  isSelected
                    ? 'bg-foreground text-background'
                    : 'text-foreground hover:bg-background/20 border border-border/20'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {time}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Summary */}
      {selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 backdrop-blur-md border border-primary/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="font-medium text-primary">
              Selected: {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} at {selectedTime}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};