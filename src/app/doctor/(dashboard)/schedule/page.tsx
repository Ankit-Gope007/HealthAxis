"use client";
import React from 'react'
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  Users,
  Timer
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { color } from 'framer-motion';

const page = () => {
  const [viewMode, setViewMode] = useState<"day" | "week">("week");
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [today, setToday] = useState<Date | null>(null);


  useEffect(() => {
    setSelectedDate(new Date());
    setToday(new Date());
  }, []);

  const todayAppointments = [
    {
      id: 1,
      patient: "John Doe",
      time: "09:00 AM",
      duration: "30 min",
      type: "Follow-up",
      status: "confirmed",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 2,
      patient: "Sarah Williams",
      time: "10:30 AM",
      duration: "45 min",
      type: "Consultation",
      status: "confirmed",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c0d3?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 3,
      patient: "Mike Johnson",
      time: "02:00 PM",
      duration: "30 min",
      type: "Check-up",
      status: "pending",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 4,
      patient: "Emily Davis",
      time: "03:30 PM",
      duration: "60 min",
      type: "Treatment",
      status: "confirmed",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 5,
      patient: "John Doe",
      time: "09:00 AM",
      duration: "30 min",
      type: "Follow-up",
      status: "confirmed",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 6,
      patient: "Sarah Williams",
      time: "10:30 AM",
      duration: "45 min",
      type: "Consultation",
      status: "confirmed",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c0d3?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 7,
      patient: "Mike Johnson",
      time: "02:00 PM",
      duration: "30 min",
      type: "Check-up",
      status: "pending",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 8,
      patient: "Emily Davis",
      time: "03:30 PM",
      duration: "60 min",
      type: "Treatment",
      status: "confirmed",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 9,
      patient: "John Doe",
      time: "09:00 AM",
      duration: "30 min",
      type: "Follow-up",
      status: "confirmed",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 10,
      patient: "Sarah Williams",
      time: "10:30 AM",
      duration: "45 min",
      type: "Consultation",
      status: "confirmed",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c0d3?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 11,
      patient: "Mike Johnson",
      time: "02:00 PM",
      duration: "30 min",
      type: "Check-up",
      status: "pending",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 12,
      patient: "Emily Davis",
      time: "03:30 PM",
      duration: "60 min",
      type: "Treatment",
      status: "confirmed",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
    }
  ];

  const weekSchedule = [
    { day: "Mon", date: "15", appointments: 5 },
    { day: "Tue", date: "16", appointments: 7 },
    { day: "Wed", date: "17", appointments: 4 },
    { day: "Thu", date: "18", appointments: 6 },
    { day: "Fri", date: "19", appointments: 3 },
    { day: "Sat", date: "20", appointments: 2 },
    { day: "Sun", date: "21", appointments: 0 }
  ];

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  const totalAppointments = todayAppointments.length;
  const confirmedCount = todayAppointments.filter(a => a.status === 'confirmed').length;
  const pendingCount = todayAppointments.filter(a => a.status === 'pending').length;

  const handleNewAppointment = () => {
    toast("New appointment created successfully!")
  };

  const handleViewMode = (mode: "day" | "week") => {
    setViewMode(mode);
    toast("View mode changed to " + mode.charAt(0).toUpperCase() + mode.slice(1));
  };

  const handleDateNavigation = (direction: "prev" | "next") => {
    const currentDate = selectedDate || new Date();
    const newDate = new Date(currentDate);

    if (viewMode === "day") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    }

    setSelectedDate(newDate);
    toast("Navigated to " + newDate.toLocaleDateString());
  };

  const handleAppointmentDetails = (appointmentId: number) => {
    const appointment = todayAppointments.find(a => a.id === appointmentId);
    toast("Appointment Details:\n" +
      `Patient: ${appointment?.patient}\n` +
      `Time: ${appointment?.time}\n` +
      `Duration: ${appointment?.duration}\n` +
      `Type: ${appointment?.type}\n` +
      `Status: ${appointment?.status}\n` +
      `Image: ${appointment?.image ? appointment.image : "No image available"}`);
    // Here you can also navigate to a detailed appointment page if needed
  };

  const handleWeekDayClick = (day: { day: string; date: string; appointments: number }) => {
    toast("Selected " + day.day + ", " + day.date + " with " + day.appointments + " appointments");
  };

  const handleDateSelect = (date: Date | undefined) => {
    
    if (date) {
      setSelectedDate(date);
    }
  };

  const statsArray = [
    {
      title: "Today's Appointments",
      value: totalAppointments.toString(),
      icon: <CalendarIcon className="h-4 w-4 text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Confirmed",
      value: confirmedCount.toString(),
      icon: <Users className="h-4 w-4 text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Pending",
      value: pendingCount.toString(),
      icon: <Timer className="h-4 w-4 text-yellow-600" />,
      color: "bg-yellow-100",
    },
    {
      title: "Available Slots",
      value: (timeSlots.length - totalAppointments).toString(),
      icon: <Clock className="h-4 w-4 text-blue-600" />,
      color: "bg-blue-100",
    }
  ]

  

  return (
    <>
      {
        loading ?
          (
            <div className="w-full lg:w-[90%] lg:ml-14 h-[100vh] flex-col gap-5 center " >
              <div className="loading-animation h-12 w-12">
              </div>
              <div>
                <p className="text-muted-foreground">Loading prescription data...</p>
              </div>
            </div>
          )
          :
          (

            <div className="w-full lg:w-[90%] lg:ml-14 h-[100vh]  " >
              <header className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2">Schedule</h1>
                    <p className="text-muted-foreground">Manage your appointments and availability</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <Button
                        size="sm"
                        variant={viewMode === "day" ? "default" : "ghost"}
                        onClick={() => handleViewMode("day")}
                        className={viewMode === "day" ? "health-green h-6" : "h-6"}
                      >
                        Day
                      </Button>
                      <Button
                        size="sm"
                        variant={viewMode === "week" ? "default" : "ghost"}
                        onClick={() => handleViewMode("week")}
                        className={viewMode === "week" ? "health-green h-6" : "h-6"}
                      >
                        Week
                      </Button>
                    </div>
                    {/* <Button className="health-green h-6" onClick={handleNewAppointment}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Appointment
                    </Button> */}
                  </div>
                </div>
              </header>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {statsArray.map((stat, idx) => {
                  return (
                    <Card key={idx} className="py-2 h-fit">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                            <p className="text-2xl font-bold text-green-600">{stat.value}</p>
                          </div>
                          <div className={`${stat.color} p-2 rounded-full`}>
                            {stat.icon}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Calendar */}
                <Card className="py-2 h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 mt-2 mb-0">
                      <CalendarIcon className="h-4 w-4 text-green-600" />
                      Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>

                    <div className="w-full max-h-fit overflow-hidden rounded-lg">
                      <div className="scale-[0.9]  flex origin-top justify-center">
                        {
                          selectedDate && today && (
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={handleDateSelect}
                              // set up classname such that the selected date has the color #28A745
                              classNames={{
                                table: "w-full text-xs h-2 w-2",
                                cell: "w-4 h-4 text-xs",
                                head_row: "text-xs",
                                row: "text-xs",
                                day_selected: "bg-[#28A745] text-white hover:bg-[#218838]"
                              }}
                              modifiers={{
                                hasAppointments: (date) => {

                                  return date.getDate() >= today.getDate() && date.getDate() <= today.getDate() + 7;
                                }
                              }}
                              modifiersStyles={{
                                hasAppointments: {
                                  backgroundColor: '#dcfce7',
                                  color: '#16a34a'
                                }
                              }}
                            />
                          )
                        }

                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule View */}
                <Card className="py-2 h-fit">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 mt-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        {viewMode === "day" ? "Daily Schedule" : "Weekly Overview"}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline" className=' h-5 w-5' onClick={() => handleDateNavigation("prev")}>
                          <ChevronLeft className="h-2 w-2 p-1" />
                        </Button>
                        <span className="text-sm font-medium px-0">
                          {selectedDate ? selectedDate.toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          }) : new Date().toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <Button size="sm" variant="outline" className=' h-5 w-5' onClick={() => handleDateNavigation("next")}>
                          <ChevronRight className="h-2 w-2 p-1" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {viewMode === "day" ? (
                      <div className="space-y-2 max-h-[550px] overflow-y-auto show-scrollbar" >
                        {todayAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center h-5 justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors "
                          >
                            <div className="flex items-center gap-2 ">
                              {/* <div className="text-center">
                                <p className="text-sm font-medium">{appointment.time}</p>
                                <p className="text-xs text-muted-foreground">{appointment.duration}</p>
                              </div> */}
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={appointment.image} />
                                <AvatarFallback className="bg-green-100 text-green-700">
                                  {appointment.patient.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{appointment.patient}</p>
                                <p className=" text-xs text-muted-foreground">{appointment.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={`${appointment.status === 'confirmed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {appointment.status}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAppointmentDetails(appointment.id)}
                                className='health-green h-5 '
                              >
                                Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <p className='text-muted-foreground mb-2'> No. of Appointments each day</p>
                        <div className="grid grid-cols-7 gap-1">

                          {weekSchedule.map((day) => (


                            <div
                              key={day.day}
                              className="py-2 px-1 text-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                              onClick={() => handleWeekDayClick(day)}
                            >
                              <p className="text-sm font-medium">{day.day}</p>
                              <p className="text-lg font-bold text-green-600">{day.date}</p>
                              <p className="text-xs text-muted-foreground">
                                {day.appointments}
                              </p>
                            </div>

                          ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>)
      }
    </>

  );
};

export default page;