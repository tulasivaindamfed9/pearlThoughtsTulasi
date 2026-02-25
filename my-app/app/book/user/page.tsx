"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/ReduxStore/hooks";
import { fetchDoctors } from "@/ReduxSlices/doctorSlice";
import {
  fetchAppointments,
  updateAppointment,
} from "@/ReduxSlices/appointmentSlice";
import jsPDF from "jspdf";

import hospitalImage from "@/public/doclogo.png";

export default function UserPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { doctors } = useAppSelector((state) => state.doctors);
  const { list: appointments } = useAppSelector((state) => state.appointments);

  const [previewAppointment, setPreviewAppointment] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [rescheduleId, setRescheduleId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
  ];

  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchAppointments());
  }, [dispatch]);

  // ✅ Auto move past appointments to completed
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    appointments.forEach((a: any) => {
      if (a.status === "upcoming" && a.date < today) {
        dispatch(updateAppointment({ ...a, status: "completed" }));
      }
    });
  }, [appointments, dispatch]);

  const handleCancel = (appointment: any) => {
    dispatch(
      updateAppointment({
        ...appointment,
        status: "cancelled",
      }),
    );
  };

  const handleComplete = (appointment: any) => {
    dispatch(
      updateAppointment({
        ...appointment,
        status: "completed",
      }),
    );
  };

  const handleReschedule = (appointment: any) => {
    if (!newDate || !newSlot) return;

    dispatch(
      updateAppointment({
        ...appointment,
        date: newDate,
        slot: newSlot,
      }),
    );

    setRescheduleId(null);
    setNewDate("");
    setNewSlot("");
  };

  const downloadPDF = (appointment: any) => {
    const doc = new jsPDF();

    const imgData = hospitalImage.src;
    doc.addImage(imgData, "PNG", 10, 10, 30, 30);
    doc.text("Appointment Details", 20, 20);
    doc.text(`Doctor: ${appointment.doctorName}`, 20, 40);
    doc.text(`Date: ${appointment.date}`, 20, 50);
    doc.text(`Time: ${appointment.slot}`, 20, 60);
    doc.text(`Patient: ${appointment.patientName}`, 20, 70);
    doc.text(`Age: ${appointment.age}`, 20, 80);
    doc.text(`Phone: ${appointment.phone}`, 20, 90);
    doc.text(`Status: ${appointment.status}`, 20, 80);
    doc.text(`Reason: ${appointment.reason}`, 20, 90);
    doc.text(`Relationship: ${appointment.relationship}`, 20, 100);

    doc.save("appointment.pdf");
  };

  // ✅ Search + Filter
  const filteredAppointments = appointments
    .filter((a: any) => a.status === activeTab)
    .filter(
      (a: any) =>
        a.doctorName?.toLowerCase().includes(search.toLowerCase()) ||
        a.patientName?.toLowerCase().includes(search.toLowerCase()),
    );

  // ✅ Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAppointments.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4 pt-24 pb-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-blue-800">My Appointments</h1>

        {/* Search */}
        <Input
          placeholder="Search doctor or patient"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Tabs */}
        <div className="flex gap-4 font-medium">
          {["upcoming", "completed", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl capitalize ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border border-blue-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {paginatedData.length === 0 ? (
          <Card className="p-10 text-center">
            <p>No {activeTab} appointments</p>
          </Card>
        ) : (
          paginatedData.map((appointment: any) => {
            const doctor = doctors.find(
              (doc) => doc.id === appointment.doctorId,
            );

            return (
              <Card
                key={appointment.id}
                className="rounded-2xl shadow-lg border border-blue-100"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-5">
                    <Avatar className="h-20 w-20 border-4 border-blue-200">
                      <AvatarImage src="https://i.pravatar.cc/150?img=12" />
                      <AvatarFallback>DR</AvatarFallback>
                    </Avatar>

                    <div>
                      <h2 className="text-xl font-bold text-blue-800">
                        {doctor?.name || appointment.doctorName}
                      </h2>
                      <p className="text-gray-600">
                        {appointment.date} at {appointment.slot}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Patient: {appointment.patientName}
                      </p>
                    </div>
                  </div>

                  {activeTab === "upcoming" && (
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => setConfirmId(appointment.id)}
                        className="bg-red-500 text-white"
                      >
                        Cancel
                      </Button>

                      <Button
                        onClick={() => {
                          setRescheduleId(appointment.id);
                          setNewDate(appointment.date);
                          setNewSlot(appointment.slot);
                        }}
                        className="bg-yellow-500 text-white"
                      >
                        Reschedule
                      </Button>

                      <Button
                        onClick={() => handleComplete(appointment)}
                        className="bg-green-500 text-white"
                      >
                        Mark Completed
                      </Button>

                      <Button
                        onClick={() => setPreviewAppointment(appointment)}
                        className="bg-blue-600 text-white"
                      >
                        Download PDF
                      </Button>
                    </div>
                  )}

                  {rescheduleId === appointment.id && (
                    <div className="space-y-3 bg-blue-50 p-4 rounded-xl">
                      <Input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                      />

                      <div className="flex gap-2 flex-wrap">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setNewSlot(slot)}
                            className={`px-3 py-1 rounded-lg border ${
                              newSlot === slot
                                ? "bg-blue-600 text-white"
                                : "bg-white"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>

                      <Button
                        onClick={() => handleReschedule(appointment)}
                        className="bg-blue-600 text-white"
                      >
                        Confirm Reschedule
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}

        {/* Pagination */}
        <div className="flex gap-2 mt-4">
          {Array.from({
            length: Math.ceil(filteredAppointments.length / itemsPerPage),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className="px-3 py-1 border rounded"
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Confirmation Modal */}
        {confirmId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl space-y-4">
              <p>Are you sure you want to cancel?</p>

              <Button
                onClick={() => {
                  const appointment = appointments.find(
                    (a: any) => a.id === confirmId,
                  );
                  handleCancel(appointment);
                  setConfirmId(null);
                }}
                className="bg-red-500 text-white"
              >
                Yes Cancel
              </Button>

              <Button onClick={() => setConfirmId(null)}>No</Button>
            </div>
          </div>
        )}

        {/* PDF Preview Modal */}
        {previewAppointment && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-md border">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 rounded-t-xl">
                <h2 className="text-xl font-semibold text-white text-center">
                  Appointment Preview
                </h2>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 text-lg text-gray-700">
                {/* Doctor Info */}
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">
                    Dr. {previewAppointment.doctorName}
                  </p>
                  <p>
                    {previewAppointment.date} | {previewAppointment.slot}
                  </p>
                  <p className="capitalize">
                    Status:
                    <span
                      className={`ml-1 font-medium ${
                        previewAppointment.status === "upcoming"
                          ? "text-blue-600"
                          : previewAppointment.status === "completed"
                            ? "text-green-600"
                            : "text-red-600"
                      }`}
                    >
                      {previewAppointment.status}
                    </span>
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t"></div>

                {/* Patient Info */}
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Patient:</span>{" "}
                    {previewAppointment.patientName}
                  </p>
                  <p>
                    <span className="font-medium">Age:</span>{" "}
                    {previewAppointment.age}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {previewAppointment.phone}
                  </p>
                  <p>
                    <span className="font-medium">Relationship:</span>{" "}
                    {previewAppointment.relationship}
                  </p>
                  <p>
                    <span className="font-medium">Reason:</span>{" "}
                    {previewAppointment.reason}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t flex justify-end gap-3 ">
                <Button
                  onClick={() => {
                    downloadPDF(previewAppointment);
                    setPreviewAppointment(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-md py-2 px-4 rounded-xl"
                >
                  Confirm & Download
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setPreviewAppointment(null)}
                  className="bg-white text-blue-600 hover:bg-blue-50 border border-blue-600 py-2 px-4 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
