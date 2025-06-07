import React from 'react'
import {motion} from 'framer-motion'
import { Stethoscope, Users, Clock, Shield, Globe, ArrowRight, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import heroAnimation from '@/src/animation/DoctorPageAnimation'

const DoctorLogin = () => {
  return (
        <section className="py-5 bg-gradient-to-br from-green-50 via-white to-emerald-50 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
                {/* banner */}
              <div className="inline-flex items-center px-5 py-2 bg-green-100 rounded-full text-green-700 font-semibold mb-3 shadow-lg">
                <Stethoscope className="h-3 w-3 mr-2" />
                For Healthcare Professionals
              </div>
              {/* heading & tagline */}
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">
                Are you a <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Doctor?</span>
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Transform your practice with our advanced platform. Manage patients effortlessly, conduct seamless video consultations, and grow your reach with our comprehensive healthcare ecosystem.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                {[
                  { icon: <Users className="h-3 w-3" />, text: "Manage 1000+ patients easily", color: "from-green-500 to-green-600" },
                  { icon: <Clock className="h-3 w-3" />, text: "Flexible scheduling system", color: "from-emerald-500 to-emerald-600" },
                  { icon: <Shield className="h-3 w-3" />, text: "HIPAA-compliant security", color: "from-teal-500 to-teal-600" },
                  { icon: <Globe className="h-3 w-3" />, text: "Reach patients globally", color: "from-green-400 to-green-500" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-3 w-[250px] bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className={`bg-gradient-to-r ${item.color} p-2 rounded-xl shadow-md`}>
                      <div className="text-white">{item.icon}</div>
                    </div>
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <Button 
              
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-1 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Stethoscope className="mr-2 h-5 w-5" />
                <Link href="/doctor/signup" className="text-white">Join as Doctor</Link>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
            <div className='hidden md:block'>
                <div className="w-full h-[400px] md:h-[500px] lg:h-[600px]  ml-10">
                    {heroAnimation()}
                </div>
            </div>
            </motion.div>
          </div>
        </div>
      </section>
  )
}

export default DoctorLogin