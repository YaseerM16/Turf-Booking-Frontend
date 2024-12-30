import React, { useState } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles

type WorkingDay = { day: string; date: string };

interface TurfCalendarProps {
    workingDays: any[]; // List of working days
    onDaySelect: (day: string, date: any) => Promise<void>; // Callback when a day is selected
}

const TurfCalendar: React.FC<TurfCalendarProps> = ({ workingDays, onDaySelect }) => {
    console.log("Workingdays In calendar : ", workingDays);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Utility function to check if a date is a working day
    const isWorkingDay = (date: Date): boolean => {
        const dateString = date.toISOString().split('T')[0];
        return workingDays.some((dayObj) => dayObj.date === dateString);
    };

    // Handle date selection
    const handleDateClick = (value: Date | [Date | null, Date | null] | null, day: string) => {
        if (value instanceof Date) {
            const dateString = value.toISOString().split('T')[0];
            if (isWorkingDay(value)) {
                setSelectedDate(dateString);
                onDaySelect(day, dateString);
            }
        } else {
            console.warn('Range selection or invalid date selected:', value);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">Turf Calendar</h2>
            <Calendar
                onChange={(value) => {
                    if (value instanceof Date) {
                        const dayName = value.toLocaleDateString('en-US', { weekday: 'long' }); // Get the full day name
                        handleDateClick(value, dayName); // Pass both date and day to the handler
                    }
                }}
                tileClassName={({ date }) => {
                    const dateString = date.toISOString().split('T')[0];
                    if (isWorkingDay(date)) {
                        return 'bg-green-500 text-white font-bold'; // Highlight working days
                    }
                    return 'bg-gray-200 text-gray-500'; // Other days
                }}
                tileDisabled={({ date }) => !isWorkingDay(date)} // Disable non-working days
                className="react-calendar w-full"
            />
            {selectedDate && (
                <div className="mt-4 text-center">
                    <p className="text-green-700 font-medium">
                        Selected Date: {new Date(selectedDate).toLocaleDateString()}
                    </p>
                </div>
            )}
        </div>
    );
};

export default TurfCalendar;
