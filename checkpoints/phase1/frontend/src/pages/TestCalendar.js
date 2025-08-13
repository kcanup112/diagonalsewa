import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

const TestCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Calendar Test</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a Date
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MMMM d, yyyy"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholderText="Click to select a date"
                showPopperArrow={false}
                minDate={new Date()}
              />
            </div>
            
            {selectedDate && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                  Selected Date: <span className="font-semibold">{selectedDate.toLocaleDateString()}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCalendar;
