import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

type EventType = {
    title: string;
    date: string;
    status?: "available" | "pending" | "accepted" | "rejected";
};

export default function Calendar() {
    const [events, setEvents] = useState<EventType[]>([]);
    const [requests, setRequests] = useState<EventType[]>([]);

    // ✅ Add availability slot
    const handleDateClick = (info: any) => {
        setEvents((prev) => [
            ...prev,
            {
                title: "Available Slot",
                date: info.dateStr,
                status: "available",
            },
        ]);
    };

    // ✅ Modify / Delete slot
    const handleEventClick = (clickInfo: any) => {
        const action = prompt("Type 'edit' to rename or 'delete' to remove");

        if (action === "delete") {
            setEvents((prev) =>
                prev.filter((e) => e.date !== clickInfo.event.startStr)
            );
        }

        if (action === "edit") {
            const newTitle = prompt("Enter new title");
            if (newTitle) {
                setEvents((prev) =>
                    prev.map((e) =>
                        e.date === clickInfo.event.startStr
                            ? { ...e, title: newTitle }
                            : e
                    )
                );
            }
        }
    };

    // ✅ Send request
    const sendRequest = (event: EventType) => {
        setRequests((prev) => [
            ...prev,
            { ...event, status: "pending" },
        ]);
    };

    // ✅ Accept request
    const acceptRequest = (index: number) => {
        const updated = [...requests];
        updated[index].status = "accepted";
        setRequests(updated);

        const accepted = updated.filter((r) => r.status === "accepted");
        localStorage.setItem("meetings", JSON.stringify(accepted));
    };

    // ✅ Reject request
    const rejectRequest = (index: number) => {
        const updated = [...requests];
        updated[index].status = "rejected";
        setRequests(updated);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">📅 Meeting Scheduler</h2>

            {/* ✅ Calendar */}
            <div className="bg-white p-4 rounded-lg shadow">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    events={events}
                />
            </div>

            {/* ✅ Available Slots */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Available Slots</h3>

                {events.length === 0 ? (
                    <p className="text-gray-500">No slots yet</p>
                ) : (
                    <div className="space-y-2">
                        {events.map((event, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 border rounded-md"
                            >
                                <span className="text-sm font-medium">{event.date}</span>

                                <button
                                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                                    onClick={() => sendRequest(event)}
                                >
                                    Request Meeting
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ✅ Meeting Requests */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Meeting Requests</h3>

                {requests.length === 0 ? (
                    <p className="text-gray-500">No requests yet</p>
                ) : (
                    <div className="space-y-2">
                        {requests.map((req, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 border rounded-md bg-white shadow-sm"
                            >
                                <div>
                                    <p className="text-sm font-medium">{req.date}</p>

                                    {/* ✅ Status Badge */}
                                    <span
                                        className={`text-xs px-2 py-1 rounded ${req.status === "pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : req.status === "accepted"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {req.status}
                                    </span>
                                </div>

                                {/* ✅ Buttons */}
                                {req.status === "pending" && (
                                    <div>
                                        <button
                                            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition"
                                            onClick={() => acceptRequest(index)}
                                        >
                                            Accept
                                        </button>

                                        <button
                                            className="ml-2 px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
                                            onClick={() => rejectRequest(index)}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}