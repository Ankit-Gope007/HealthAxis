import React from 'react'
import { Button } from '@/components/ui/button';
import { IoAdd } from 'react-icons/io5';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const page = () => {
  return (
    <div className='w-full lg:w-[90%] lg:ml-14 h-[100vh] '>
      {/* heading  */}
      <div className='flex items-center justify-between'>
        <div className='flex flex-col items-start  p-2 '>
          <h1 className='text-3xl font-bold '>Find a Doctor</h1>
          <p className=' mt-1 text-gray-500'>Browse our network of qualified healthcare professionals</p>
        </div>
      </div>
      {/* divider */}
      <hr className='' />

      {/* Search Bar */}
      <div className='border-2 w-full mt-3'>
        {/* search */}
        <div className='flex flex-col md:flex-row items-center gap-2 p-2'>
          <input
            type="text"
            placeholder="Search for doctors, specialties, or locations"
            className="md:w-[800px] w-full h-[50px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button className='h-[50px] w-full md:w-auto bg-[#28A745] hover:bg-[#2ea728] cursor-pointer active:shadow-lg '> <IoAdd /> Search</Button>
        </div>
      </div>

      {/* filters */}

      <div className='bg-amber-200 h-full'>
        <Tabs defaultValue="account" className="h-[40px] ">
          <div className=' bg-[#F1F3F2] w-full h-[40px] mt-2  '>
            <TabsList className='h-[40px] ml-2 border-2 text-center w-full '>
              <TabsTrigger className='w-[100px]' value="all">All</TabsTrigger>
              <TabsTrigger value="cardiologist">Cardiologist</TabsTrigger>
              <TabsTrigger value="dermatologist">Dermatologist</TabsTrigger>
              <TabsTrigger value="pediatrician">Pediatrician</TabsTrigger>
              <TabsTrigger value="neurologist">Neurologist</TabsTrigger>
              <TabsTrigger value="psychiatrist">Psychiatrist</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className='h-[600px] overflow-y-auto'>
            {/* Content for All Doctors */}
            <div className='p-2'>
              <p>All doctors will be listed here.</p>
            </div>
          </TabsContent>
          <TabsContent value="cardiologist" className='h-[600px] overflow-y-auto'>
            {/* Content for Cardiologists */}
            <div className='p-2'>
              <p>Cardiologists will be listed here.</p>
            </div>
          </TabsContent>  
          <TabsContent value="dermatologist" className='h-[600px] overflow-y-auto'>
            {/* Content for Dermatologists */}
            <div className='p-2'>
              <p>Dermatologists will be listed here.</p>
            </div>
          </TabsContent>
          <TabsContent value="pediatrician" className='h-[600px] overflow-y-auto'>
            {/* Content for Pediatricians */}
            <div className='p-2'>
              <p>Pediatricians will be listed here.</p>
            </div>
          </TabsContent>
          <TabsContent value="neurologist" className='h-[600px] overflow-y-auto'>
            {/* Content for Neurologists */}
            <div className='p-2'>
              <p>Neurologists will be listed here.</p>
            </div>
          </TabsContent>
          <TabsContent value="psychiatrist" className='h-[600px] overflow-y-auto'>  
            {/* Content for Psychiatrists */}
            <div className='p-2'>
              <p>Psychiatrists will be listed here.</p>
            </div>
          </TabsContent>


        </Tabs>
      </div>


    </div>
  )
}

export default page