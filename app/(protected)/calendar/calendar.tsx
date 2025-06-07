"use client";
import React, { useEffect } from "react";
// Calendar UI: https://fullcalendar.io/docs/react
// Event doc: https://fullcalendar.io/docs#toc
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
// import { Calendar } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { CalendarEvent } from "@/types/calendar";
import { useRef } from "react";
import rrulePlugin from "@fullcalendar/rrule";
import { useState } from "react";
import { EventModal } from "@/components/Calendar/EventModal";
import { getTasks } from "@/actions/calendar.actions";

// EXAMPLE EVENTS For Reference
// events={[
//   {
//     id: '1',
//     title: 'Team Meeting',
//     start: '2025-06-05T10:00:00',
// OPTIONAL PROPERTIES
//     daysOfWeek: [1, 5], // 1 = Monday, 5 = Friday
//     end: '2025-06-05T11:00:00',
//     allDay: false,
//     backgroundColor: '#3174ad',
//     rrule: {
//   freq: 'weekly',
//   interval: 5, // every 5 weeks
//   byweekday: [ 'mo', 'fr' ],
//   dtstart: '2012-02-01T10:30:00', // will also accept '20120201T103000'
//   until: '2012-06-01' // will also accept '20120201'
// }
//     extendedProps: {
//       category: 'School',
//       location: 'Conference Room A',
//       description: 'Discuss Q3 planning',
//     }
//   },
//   {
//     id: '2',
//     title: 'All-Day Hackathon',
//     start: '2025-06-06',
//     allDay: true
//   }
// ]}

export default function CustomCalendar() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [tasks, setTasks] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    getAllTasks();
  }, []);

  const getAllTasks = async () => {
    try {
      const response = await getTasks();
      if (!response.status) {
        throw new Error("Something went wrong");
      }
      if (response && response.data) {
        // Ensure we're setting an array of CalendarEvent
        const calendarEvents = Array.isArray(response.data) ? response.data : [];
        setTasks(calendarEvents);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };


  console.log(tasks)
  // Functions to handle events creation/deletion/updating/dragging
  // IMPLEMENT THESE FUNCTIONS AS NEEDED

  const calendarRef = useRef<FullCalendar>(null);
  // A Plus icon to add new event
  const handleCreate = (props: any) => {};
  // Click on an event to view it
  const handleClick = (props: any) => {
    // alert("Event: " + props.event.title);
    props.jsEvent.preventDefault();
    setSelectedEvent(props.event);
    setModalOpen(true);
  };
  // A trash icon to delete an event
  const handleDelete = (props: any) => {};
  // Click on the 3 dots of an event to update it
  const handleUpdate = (props: any) => {};

  return (
    <>
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          rrulePlugin,
        ]}
        initialView="timeGridWeek"
        selectable={true}
        events={tasks}
        eventClick={handleClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        allDaySlot={true}
        slotDuration="00:30:00"
        timeZone="local"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false
        }}
        nowIndicator={true}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false
        }}
      />
      {selectedEvent && (
        <EventModal
          isModalOpen={isModalOpen}
          event={selectedEvent}
          // rrule={selectedEvent.rrule}
          onClose={() => {
            setModalOpen(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </>
  );
}