import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from 'react-hot-toast';
import LoginForm from "./components/LoginForm"
import SignInForm from "./components/SignInForm"


function page() {

  return (

    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Toaster reverseOrder={false} />
      {/* Login Form Container */}
      <div className="bg-white p-8 rounded-lg shadow-2xl shadow-[#18ac4e85]">
        <Tabs defaultValue="login" className="w-[250px] sm:w-[300px] md:w-[400px]  center ">
          <TabsList className='h-[45px] text-center w-full '>
            <TabsTrigger
              className='h-[40px] w-[150px] cursor-pointer' value="login">Log In</TabsTrigger>
            <TabsTrigger className='h-[40px] w-[150px] cursor-pointer' value="signUp">Sign Up</TabsTrigger>
          </TabsList>
          {/* Login */}
          <TabsContent className='w-full' value="login">
           <LoginForm />
          </TabsContent>
          {/*  Sign Up */}
         
          <TabsContent className='w-full' value="signUp">
           <SignInForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default page