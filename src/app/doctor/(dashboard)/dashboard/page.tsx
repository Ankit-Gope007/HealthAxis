"use client";
import React from 'react'
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, FileText, MessageSquare } from "lucide-react";

const page = () => {
  const [loading, setLoading] = useState(false);
  const stats = [
    {
      title: "Today's Appointments",
      value: "12",
      icon: <Calendar className="h-5 w-5 text-green-600" />,
      trend: "+2 from yesterday"
    },
    {
      title: "Pending Appointments",
      value: "8",
      icon: <Clock className="h-5 w-5 text-orange-600" />,
      trend: "3 urgent"
    },
    {
      title: "Patients This Week",
      value: "47",
      icon: <Users className="h-5 w-5 text-blue-600" />,
      trend: "+15% from last week"
    },
    {
      title: "Prescriptions Written",
      value: "23",
      icon: <FileText className="h-5 w-5 text-purple-600" />,
      trend: "This week"
    }
  ];

  const upcomingAppointments = [
    { id: 1, patient: "Sarah Johnson", time: "10:00 AM", condition: "Follow-up checkup", status: "confirmed" },
    { id: 2, patient: "Michael Brown", time: "10:30 AM", condition: "Chest pain consultation", status: "pending" },
    { id: 3, patient: "Emily Davis", time: "11:15 AM", condition: "Routine examination", status: "confirmed" },
    { id: 4, patient: "David Wilson", time: "2:00 PM", condition: "Blood pressure check", status: "confirmed" },
  ];

  const recentPatients = [
    { id: 1, name: "Alice Cooper", lastVisit: "2 days ago", condition: "Hypertension" },
    { id: 2, name: "Bob Thompson", lastVisit: "1 week ago", condition: "Diabetes checkup" },
    { id: 3, name: "Carol Martinez", lastVisit: "3 days ago", condition: "Cardiac consultation" },
  ];

  return (
  <>
      {
        loading ?
          (
            <div className="w-full lg:w-[90%] lg:ml-14 h-[100vh] flex-col gap-5 center " >
              <div className="loading-animation h-12 w-12">
              </div>
              <div>
                <p className="text-muted-foreground">Loading Your Dashboard data...</p>
              </div>
            </div>
          )
          :
          (
            <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh] '>
        <header className="mb-4 mt-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Good morning, Dr. Smith</h1>
          <p className="text-muted-foreground">Here's what's happening with your practice today.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="py-0">
              <CardContent className="p-2 center gap-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="">
                    {stat.icon}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-900">{stat.title}</p>
                  <p className="text-xs text-muted-foreground">{stat.trend}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Today's Schedule */}
          <Card className=" h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-1 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">{appointment.patient}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{appointment.condition}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{appointment.time}</p>
                      <Button size="sm" variant="outline" className="mt-1 h-5">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 health-green">
                View All Appointments
              </Button>
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Recent Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-1 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-medium text-sm">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.condition}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{patient.lastVisit}</p>
                      <Button size="sm" variant="outline" className="mt-1 h-5">
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 health-green">
                View All Patients
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className=" mt-4">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="health-green  py-4 flex gap-2 h-5">
                <FileText className="h-3 w-3 p-0.5" />
                Write Prescription
              </Button>
              <Button className="health-green  py-4 flex gap-2 h-5">
                <Calendar className="h-3 w-3 p-0.5" />
                Schedule Appointment
              </Button>
              <Button className="health-green  py-4 flex gap-2 h-5">
                <MessageSquare className="h-3 w-3 p-0.5" />
                Start Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>)
      }
    </>

  );
};

export default page;