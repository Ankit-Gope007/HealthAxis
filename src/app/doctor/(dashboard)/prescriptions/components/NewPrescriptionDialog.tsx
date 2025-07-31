"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useDoctorProfileStore } from "@/src/store/useDoctorProfileStore";

type AppointmentPatientData = {

    id: string;
    patientId: string;
    doctorId: string;
    date: string;
    timeSlot: string;
    reason?: string;
    status: string
    location: string

    // Relations
    patient: {
        email: string;
        patientProfile: {
            fullName: string;
            imageUrl: string;
            phone: string;
            address: string;
            dob: string; // Date of Birth
        }

    }

    doctor: {
        id: string;
        doctorProfile: {
            fullName: string;
            imageUrl: string;

        }
    }

}


interface NewPrescriptionDialogProps {
    children: React.ReactNode;
}

const NewPrescriptionDialog = ({ children }: NewPrescriptionDialogProps) => {
    const [open, setOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState("");
    const [medications, setMedications] = useState([
        { id: 1, name: "", dosage: "", instruction: "" }
    ]);
    const [notes, setNotes] = useState("");
    const [searchPatient, setSearchPatient] = useState("");
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [appointmentsData, setAppointmentsData] = useState<AppointmentPatientData[]>([]);
    const [loading, setLoading] = useState(false);
    const { profile } = useDoctorProfileStore();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (profile && profile.doctorId) {
            fetchAppointments(profile.doctorId);
        } else {
            console.warn("Profile or patientId not available yet");
        }


    }, [profile]);


    const fetchAppointments = async (id: string) => {
        try {
            setLoading(true);
            console.log("Fetching appointments for patient ID:", id);
            const response = await axios.get(`/api/appointment/getAllForDoctor?doctorId=${id}`);
            if (response.status === 200) {
                console.log("Appointments fetched successfully:", response.data);
                setAppointmentsData(response.data);
                setLoading(false);
            } else {
                console.error("Failed to fetch appointments:", response.statusText);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setLoading(false);
        }
    };

    

    const patients = appointmentsData.filter(appointment => appointment.status === "CONFIRMED").map(appointment => ({
        id: appointment.patientId,
        name: appointment.patient.patientProfile?.fullName|| "Unknown Patient",
        age: new Date().getFullYear() - new Date(appointment.patient.patientProfile?.dob).getFullYear(),
        condition: appointment.reason || "No condition specified"
    }));

    const commonMedications = [
        "Lisinopril",
        "Atorvastatin",
        "Metformin",
        "Amlodipine",
        "Omeprazole",
        "Losartan",
        "Simvastatin",
        "Levothyroxine",
        "Azithromycin",
        "Amoxicillin",
        "Hydrochlorothiazide",
        "Gabapentin",
        "Hydrocodone",
        "Sertraline",
        "Furosemide",
        "Fluticasone",
        "Acetaminophen",
        "Ibuprofen",
        "Prednisone",
        "Citalopram",
        "Alprazolam",
        "Montelukast",
        "Trazodone",
        "Pantoprazole",
        "Escitalopram",
        "Rosuvastatin",
        "Meloxicam",
        "Clopidogrel",
        "Propranolol",
        "Duloxetine",
        "Bupropion",
        "Venlafaxine",
        "Warfarin",
        "Spironolactone",
        "Ranitidine",
        "Metoprolol",
        "Carvedilol",
        "Ciprofloxacin",
        "Doxycycline",
        "Sulfamethoxazole/Trimethoprim",
        "Cephalexin",
        "Naproxen",
        "Diclofenac",
        "Methylprednisolone",
        "Insulin Glargine",
        "Insulin Aspart",
        "Lantus",
        "Januvia",
        "Glipizide",
        "Pioglitazone",
        "Sitagliptin",
        "Linagliptin",
        "Empagliflozin",
        "Canagliflozin",
        "Invokana",
        "Farxiga",
        "Xarelto",
        "Eliquis",
        "Pradaxa",
        "Methotrexate",
        "Allopurinol",
        "Colchicine",
        "Nitrofurantoin",
        "Amiodarone",
        "Atenolol",
        "Bisoprolol",
        "Enalapril",
        "Ramipril",
        "Valsartan",
        "Irbesartan",
        "Telmisartan",
        "Olmesartan",
        "Diltiazem",
        "Verapamil",
        "Nifedipine",
        "Clonidine",
        "Hydralazine",
        "Isosorbide Mononitrate",
        "Nitroglycerin",
        "Digoxin",
        "Erythromycin",
        "Clindamycin",
        "Levofloxacin",
        "Moxifloxacin",
        "Linezolid",
        "Vancomycin",
        "Rifampin",
        "Isoniazid",
        "Ethambutol",
        "Pyrazinamide",
        "Lamotrigine",
        "Valproate",
        "Topiramate",
        "Carbamazepine",
        "Phenytoin",
        "Pregabalin",
        "Zolpidem",
        "Eszopiclone",
        "Modafinil",
        "Armodafinil",
        "Mirtazapine",
        "Paroxetine",
        "Fluoxetine",
        "Nortriptyline",
        "Amitriptyline",
        "Desvenlafaxine",
        "Paliperidone",
        "Risperidone",
        "Olanzapine",
        "Quetiapine",
        "Aripiprazole",
        "Haloperidol",
        "Lithium",
        "Buspirone",
        "Prochlorperazine",
        "Ondansetron",
        "Meclizine",
        "Dicyclomine",
        "Famotidine",
        "Ranitidine",
        "Sucralfate",
        "Misoprostol",
        "Loperamide",
        "Diphenoxylate",
        "Bisacodyl",
        "Docusate",
        "Psyllium",
        "Lactulose",
        "Polyethylene Glycol",
        "Sildenafil",
        "Tadalafil",
        "Finasteride",
        "Dutasteride",
        "Alendronate",
        "Risedronate",
        "Calcitonin",
        "Raloxifene",
        "Teriparatide",
        "Denosumab",
        "Methimazole",
        "Propylthiouracil",
        "Desmopressin",
        "Octreotide",
        "Hydrocortisone",
        "Fludrocortisone",
        "Cosyntropin",
        "Levothyroxine",
        "Liothyronine",
        "Armour Thyroid",
        "Estradiol",
        "Medroxyprogesterone",
        "Norethindrone",
        "Ethinyl Estradiol",
        "Drospirenone",
        "Levonorgestrel",
        "Raloxifene",
        "Tamoxifen",
        "Letrozole",
        "Anastrozole",
        "Fulvestrant",
        "Goserelin",
        "Leuprolide",
        "Cabergoline",
        "Bromocriptine"
    ];
    
    const uniqueMedications = Array.from(new Set(commonMedications));

    const addMedication = () => {
        setMedications([...medications, {
            id: Date.now(),
            name: "",
            dosage: "",
            instruction: ""
        }]);
        toast("Medication added to prescription")
    };

    const removeMedication = (id: number) => {
        if (medications.length > 1) {
            setMedications(medications.filter(med => med.id !== id));
            toast("Medication removed from prescription")
        }
    };

    const updateMedication = (id: number, field: string, value: string) => {
        setMedications(medications.map(med =>
            med.id === id ? { ...med, [field]: value } : med
        ));
    };

    // const handleSubmit = () => {
    //     const selectedPatientData = patients.find(p => p.id === selectedPatient);

    //     if (!selectedPatient) {
    //         toast.error("Please select a patient");
    //         return;
    //     }

    //     if (medications.some(m => !m.name || !m.dosage)) {
    //         toast.error("Please fill in all medication details");
    //         return;
    //     }

    //     const newPrescription = {
    //         id: Date.now(),
    //         patient: selectedPatientData,
    //         medications: medications.filter(med => med.name),
    //         notes,
    //         dateCreated: new Date().toLocaleDateString(),
    //         status: 'Active'
    //     };

    //     setPrescriptions(prev => [...prev, newPrescription]);

    //     console.log("Creating prescription:", newPrescription);

    //     toast.success("Prescription created successfully");

    //     // Reset form
    //     setSelectedPatient("");
    //     setMedications([{ id: 1, name: "", dosage: "", instruction: "" }]);
    //     setNotes("");
    //     setSearchPatient("");
    //     setOpen(false);
    // };


    const handleSubmit = async () => {

        const selectedPatientData = patients.find(
            (p: any) => p.id === selectedPatient
        );

        if (!selectedPatient) {
            toast.error("Please select a patient");
            return;
        }

        if (medications.some((m) => !m.name || !m.dosage)) {
            toast.error("Please fill in all medication details");
            return;
        }

        const newPrescription = {
            // get the appointment Id from appointmentsData where the status is "CONFIRMED" and the patientId matches the selectedPatient
            appointmentId: appointmentsData.find(appointment => (appointment.patientId === selectedPatient && appointment.status==="CONFIRMED"))?.id || "",
            publicNotes: notes,
            privateNotes: "", // Assuming no private notes for now
            medicines: medications
                .filter((med) => med.name)
                .map((med) => ({
                    name: med.name,
                    dosage: med.dosage,
                    instruction: med.instruction
                }))
        };

        try {
            setLoading(true);
            const response = await axios.post("/api/prescription/create", newPrescription);

            if (response.status === 201) {
                toast.success("Prescription created successfully");
                console.log("Prescription created:", response.data);
                // reset
                setSelectedPatient("");
                setMedications([{ id: 1, name: "", dosage: "", instruction: "" }]);
                setNotes("");
                setSearchPatient("");
                setOpen(false);
                setLoading(false);
                window.location.reload(); // Reload to see the new prescription
            } else {
                setLoading(false);
                const errorData = response.data;
                toast.error(errorData.message || "Failed to create prescription");
            }
        } catch (err) {
            setLoading(false);
            console.error(err);
            toast.error("Something went wrong");
        }
    };


    const handleCancel = () => {
        setSelectedPatient("");
        setMedications([{ id: 1, name: "", dosage: "", instruction: "" }]);
        setNotes("");
        setSearchPatient("");
        setOpen(false);
        toast("Prescription creation cancelled");
    };

    const handlePatientSelect = (patientId: string) => {
        setSelectedPatient(patientId);
        console.log("Selected patient ID:", patientId,"And the appointmentId is:", appointmentsData.find(appointment => appointment.patientId === patientId)?.id);
        const patient = patients.find(p => p.id === patientId);
        if (patient) {
            toast(`Selected patient: ${patient.name}`);
        } else {
            toast.error("Patient not found");
        }
    };

    const filteredPatients = patients.filter(patient =>
        patient?.name.toLowerCase().includes(searchPatient.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Toaster position="top-right" />
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-4xl lg:min-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-green-800">
                        Create New Prescription
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Patient Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Select Patient</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1 h-3 w-3 text-muted-foreground" />
                            <Input
                                placeholder="Search patients..."
                                value={searchPatient}
                                onChange={(e) => setSearchPatient(e.target.value)}
                                className="pl-10 h-5"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                            {filteredPatients.map(patient => (
                                <Card
                                    key={patient.id}
                                    className={`cursor-pointer p-3 transition-colors ${selectedPatient === patient.id
                                        ? 'bg-green-50 border-green-200'
                                        : 'hover:bg-gray-50'
                                        }`}
                                    onClick={() => handlePatientSelect(patient.id)}
                                >
                                    <CardContent className="">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-sm">{patient.name}</p>
                                                <p className="text-xs text-muted-foreground">Age: {patient.age}</p>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {patient.condition}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Medications */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Medications</Label>
                            <Button onClick={addMedication} size="sm" variant="outline">
                                <Plus className="h-4 w-4 mr-1" />
                                Add Medication
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {medications.map((medication, index) => (
                                <Card key={medication.id} className="p-4">
                                    <div className="flex items-start justify-between mb-0">
                                        <h4 className="font-medium text-sm">Medication {index + 1}</h4>
                                        {medications.length > 1 && (
                                            <Button
                                                onClick={() => removeMedication(medication.id)}
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs ">Medication Name</Label>
                                            {/* <Select

                                                value={medication.name}
                                                onValueChange={(value) => updateMedication(medication.id, 'name', value)}
                                            >
                                                <SelectTrigger
                                                    className="w-full  "
                                                >
                                                    <SelectValue
                                                        className="h-5 py-0"
                                                        placeholder="Select medication" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {commonMedications.map(med => (
                                                        <SelectItem key={med} value={med}>{med}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select> */}
                                            <Select
                                                value={medication.name || ""}
                                                onValueChange={(value) => updateMedication(medication.id, 'name', value)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select medication" />

                                                </SelectTrigger>

                                                <SelectContent className="max-h-60 overflow-y-auto">
                                                    <input
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        placeholder="Search medication..."
                                                        className="w-full border p-2 mb-2 rounded"
                                                    />
                                                    {/* Add a simple search filter */}
                                                    {uniqueMedications
                                                        .filter(med =>
                                                            med.toLowerCase().includes(searchQuery.toLowerCase())
                                                        )
                                                        .map(med => (
                                                            <SelectItem key={med} value={med}>
                                                                {med}
                                                            </SelectItem>
                                                        ))}

                                                    {/* Optional: Allow manual input */}
                                                    {searchQuery && !commonMedications.some(med => med.toLowerCase() === searchQuery.toLowerCase()) && (
                                                        <SelectItem key="custom" value={searchQuery}>
                                                            Add “{searchQuery}”
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs">Dosage</Label>
                                            <Input
                                                placeholder="e.g., 10mg"
                                                value={medication.dosage}
                                                onChange={(e) => updateMedication(medication.id, 'dosage', e.target.value)}
                                            />
                                        </div>


                                        <div className="space-y-2  col-span-2">
                                            <Label className="text-xs">Instruction</Label>
                                            <Textarea
                                                className="w-full "
                                                placeholder="e.g., 7 days"
                                                value={medication.instruction}
                                                onChange={(e) => updateMedication(medication.id, 'instruction', e.target.value)}
                                            />
                                        </div>

                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <div className="gap-0">
                            <Label className="text-sm font-medium">Additional Notes</Label>
                            <p className="text-sm text-green-600 font-light">*These notes are Public and will be visible to the patient</p>
                        </div>
                        <Textarea
                            placeholder="Enter any special instructions or notes..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="health-green"
                            disabled={!selectedPatient || medications.some(m => !m.name)}
                        >
                            {
                                loading ? (
                                    <div className="flex items-center gap-2">
                                        <span className="loading-animation h-4 w-4"></span>
                                        <p>Creating...</p>
                                    </div>
                                ):(
                                    <p>Create Prescription</p>
                                )
                            }
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default NewPrescriptionDialog;