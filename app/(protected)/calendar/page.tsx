"use client";
import React from "react";
// Calendar UI: https://fullcalendar.io/docs/react
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import CustomCalendar from "./calendar";
import TagSelect from "@/components/Shared/TagSelect";
import { Categories } from "@/types/category";
import { AddEvent } from "@/components/Calendar/AddEvent";

export default function Dashboard() {
  // Mock categories for filtering
  const mockCategories: Categories = [
    {
      id: "1",
      category: "Work",
      color: "#1E90FF", // Dodger Blue
    },
    {
      id: "2",
      category: "Personal",
      color: "#32CD32", // Lime Green
    },
    {
      id: "3",
      category: "Fitness",
      color: "#FF4500", // Orange Red
    },
    {
      id: "4",
      category: "Study",
      color: "#FFD700", // Gold
    },
    {
      id: "5",
      category: "Shopping",
      color: "#FF69B4", // Hot Pink
    },
  ];
  
  const [groupSelected, setGroupSelected] = React.useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  // Function to refresh calendar when new event is added
  const handleEventAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Get selected category names for filtering
  const selectedCategoryNames = mockCategories
    .filter(cat => cat.id && groupSelected.includes(cat.id))
    .map(cat => cat.category);

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <TagSelect
          categories={mockCategories}
          groupSelected={groupSelected}
          setGroupSelected={setGroupSelected}
        />
        
        {groupSelected.length > 0 && (
          <p className="ml-1 text-default-500 text-sm">
            Showing events for: {selectedCategoryNames.join(", ")}
          </p>
        )}
        
        <AddEvent onEventAdded={handleEventAdded} />
      </div>
      
      <div className="mt-6">
        <CustomCalendar 
        />
      </div>
    </div>
  );
}