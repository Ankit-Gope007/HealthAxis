import React from 'react'


type Medication = {
    id: string;
    name: string;
    dosage: string;
    instructions?: string;
}


const PrescribedMedcine = ({ medication }: { medication: Medication }) => {
  return (
      <div key={medication.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold text-lg">{medication.name}</h5>
                    {/* <span className="text-sm font-medium text-green-600">{medication.dosage}</span> */}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Dosage: </span>
                      <span className="font-medium">{medication.dosage}</span>
                    </div>
                    {/* <div>
                      <span className="text-muted-foreground">Duration: </span>
                      <span className="font-medium">{medication.duration}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Quantity: </span>
                      <span className="font-medium">{medication.quantity}</span>
                    </div> */}
                  </div>
                  {medication.instructions && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                      <span className="text-muted-foreground">Instructions: </span>
                      <span>{medication.instructions}</span>
                    </div>
                  )}
                </div>
  )
}

export default PrescribedMedcine