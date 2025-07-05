// "use client";
// import React from "react";
// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { FileText, Lock, Eye, Save } from "lucide-react";
// import toast ,{Toaster} from "react-hot-toast";
// import axios from "axios";
// import { te } from "date-fns/locale";

// interface PatientNotesModalProps {
//   children: React.ReactNode;
//   patientName: string;
//   publicNotes?:string;
//   privateNotes?:string;
//   appointmentId?: string; // Optional, if needed for API calls
// }

// const PatientNotesModal = ({ children, patientName, publicNotes,privateNotes,appointmentId}: PatientNotesModalProps) => {

//   // Mock data - in real app, fetch from backend based on patientId
//   const [publicNotesToSave, setPublicNotesToSave] = useState(publicNotes);
//   const [privateNotesToSave, setPrivateNotesToSave] = useState(privateNotes);
//   const [tempPublicNotes, setTempPublicNotes] = useState(publicNotes);
//   const [tempPrivateNotes, setTempPrivateNotes] = useState(privateNotes);
//   const [loading, setLoading] = useState(false);

//   const handleSaveNotes = async () => {
//     setPublicNotesToSave(tempPublicNotes);
//     setPrivateNotesToSave(tempPrivateNotes);
//     try {
//         setLoading(true);
//         const response = await axios.post('/api/prescription/updateNotes', {
//             appointmentId: appointmentId,
//             publicNotes: publicNotesToSave,
//             privateNotes: privateNotesToSave,
//         })

//         if (response.status === 200) {
//             console.log("Notes updated successfully:", response.data);
//             toast.success("Notes updated successfully!");
//         }
//         setLoading(false);
        

        
//     } catch (error) {
        
//     }
//   };

//   const handleCancel = () => {
//     setTempPublicNotes(publicNotes);
//     setTempPrivateNotes(privateNotes);
//   };

//   return (
//     <Dialog>
//         <Toaster position="top-right" reverseOrder={false} />
//       <DialogTrigger asChild>
//         {children}
//       </DialogTrigger>
//       <DialogContent className="max-w-4xl md:min-w-6xl max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <FileText className="h-5 w-5 text-green-600" />
//             Patient Notes - {patientName}
//           </DialogTitle>
//         </DialogHeader>

//         <Tabs defaultValue="public" className="mt-2">
//           <TabsList className="grid w-full grid-cols-2  ">
//             <TabsTrigger value="public" className="flex  items-center gap-2 cursor-pointer">
//               <Eye className="h-4 w-4" />
//               Public Notes
//             </TabsTrigger>
//             <TabsTrigger value="private" className="flex items-center gap-2 cursor-pointer">
//               <Lock className="h-4 w-4" />
//               Private Notes
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="public" className="mt-2">
//             <Card className="health-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-lg">
//                   <Eye className="h-5 w-5 text-green-600" />
//                   Public Notes
//                 </CardTitle>
//                 <p className="text-sm text-muted-foreground">
//                   These notes are visible to the patient and can be shared in reports.
//                 </p>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div>
//                     <Label htmlFor="public-notes">Current Public Notes</Label>
//                     <Textarea
//                       id="public-notes"
//                       placeholder="Enter notes that are visible to the patient..."
//                       value= {tempPublicNotes}
//                       onChange={(e) => setTempPublicNotes(e.target.value)}
//                       className="min-h-[150px] mt-2"
//                     />
//                   </div>
//                   <div className="bg-green-50 p-3 rounded-lg">
//                     <p className="text-sm text-green-800">
//                       <strong>Note:</strong> These notes will be visible to the patient in their portal and may be included in medical reports.
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="private" className="mt-4">
//             <Card className="health-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-lg">
//                   <Lock className="h-5 w-5 text-red-600" />
//                   Private Notes
//                 </CardTitle>
//                 <p className="text-sm text-muted-foreground">
//                   These notes are for your personal use only and are not visible to the patient.
//                 </p>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div>
//                     <Label htmlFor="private-notes">Current Private Notes</Label>
//                     <Textarea
//                       id="private-notes"
//                       placeholder="Enter confidential notes for your personal reference..."
//                       value={tempPrivateNotes}
//                       onChange={(e) => setTempPrivateNotes(e.target.value)}
//                       className="min-h-[150px] mt-2"
//                     />
//                   </div>
//                   <div className="bg-red-50 p-3 rounded-lg">
//                     <p className="text-sm text-red-800">
//                       <strong>Confidential:</strong> These notes are strictly confidential and will never be shared with the patient or included in patient-facing reports.
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>

//         <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
//           <Button variant="outline" onClick={handleCancel}>
//             Cancel
//           </Button>
//           <Button onClick={handleSaveNotes} className="health-green">
//             <Save className="h-4 w-4 mr-2" />
//             Save Notes
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default PatientNotesModal;


"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Lock, Eye, Save } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

interface PatientNotesModalProps {
  children: React.ReactNode;
  patientName: string;
  publicNotes?: string;
  privateNotes?: string;
  appointmentId?: string;
}

const PatientNotesModal = ({
  children,
  patientName,
  publicNotes,
  privateNotes,
  appointmentId,
}: PatientNotesModalProps) => {
  const [tempPublicNotes, setTempPublicNotes] = useState(publicNotes || "");
  const [tempPrivateNotes, setTempPrivateNotes] = useState(privateNotes || "");
  const [savedPublicNotes, setSavedPublicNotes] = useState(publicNotes || "");
  const [savedPrivateNotes, setSavedPrivateNotes] = useState(privateNotes || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If props change (rare, but safer)
    setTempPublicNotes(publicNotes || "");
    setTempPrivateNotes(privateNotes || "");
    setSavedPublicNotes(publicNotes || "");
    setSavedPrivateNotes(privateNotes || "");
  }, [publicNotes, privateNotes]);

  const handleSaveNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/prescription/updateNotes", {
        appointmentId,
        publicNotes: tempPublicNotes,
        privateNotes: tempPrivateNotes,
      });

      if (response.status === 200) {
        toast.success("Notes updated successfully!");
        setSavedPublicNotes(tempPublicNotes);
        setSavedPrivateNotes(tempPrivateNotes);
      } else {
        toast.error("Failed to update notes.");
      }
    } catch (error) {
      toast.error("An error occurred while saving notes.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempPublicNotes(savedPublicNotes);
    setTempPrivateNotes(savedPrivateNotes);
    toast("Changes reverted.");
  };

  return (
    <Dialog>
      <Toaster position="top-right" />
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl md:min-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Patient Notes - {patientName}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="public" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="public" className="flex items-center gap-2">
              <Eye className="h-4 w-4" /> Public Notes
            </TabsTrigger>
            <TabsTrigger value="private" className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> Private Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="public" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5 text-green-600" /> Public Notes
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  These notes are visible to the patient.
                </p>
              </CardHeader>
              <CardContent>
                <Label htmlFor="public-notes">Public Notes</Label>
                <Textarea
                  id="public-notes"
                  placeholder="Enter notes..."
                  value={tempPublicNotes}
                  onChange={(e) => setTempPublicNotes(e.target.value)}
                  className="min-h-[150px] mt-2"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="private" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lock className="h-5 w-5 text-red-600" /> Private Notes
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Private notes are confidential.
                </p>
              </CardHeader>
              <CardContent>
                <Label htmlFor="private-notes">Private Notes</Label>
                <Textarea
                  id="private-notes"
                  placeholder="Enter private notes..."
                  value={tempPrivateNotes}
                  onChange={(e) => setTempPrivateNotes(e.target.value)}
                  className="min-h-[150px] mt-2"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveNotes}
            className="health-green"
            disabled={loading}
          >
           
            {loading ? 
            (
                <div className="flex items-center gap-2">
                    <div className="loading-animation h-3 w-3">
                    </div>
                    Saving..
                </div>
            )
             : 
            (
                <div className="flex items-center gap-2">
                   <Save className="h-4 w-4 mr-2" />    
                     Save Notes
                  </div>
            )
             }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientNotesModal;