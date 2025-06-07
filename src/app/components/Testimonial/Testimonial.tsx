import React from 'react'
import { GridPattern } from '@/src/components/magicui/grid-pattern'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'


const Testimonial = () => {
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Working Professional",
            content: "HealthCheck has revolutionized how I manage my health. The convenience of video consultations saved me countless hours.",
            rating: 5,
            avatar: "https://i.pinimg.com/736x/8f/83/4d/8f834d7bb7d306f9f541514f30a290ab.jpg"
        },
        {
            name: "Dr. Michael Chen",
            role: "Cardiologist",
            content: "As a doctor, I appreciate the intuitive interface and comprehensive patient management tools. It's made my practice more efficient.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
        },
        {
            name: "Emily Rodriguez",
            role: "Mother of Two",
            content: "Being able to consult with pediatricians instantly when my kids are sick has been a game-changer for our family.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
        }
    ];
    return (
        <div className='w-full h-auto md:h-[700px] pb-5 relative flex size-full items-center justify-center flex-col overflow-hidden '>
            <GridPattern
                width={20}
                height={20}
                x={-1}
                y={-1}
                className={cn(
                    " ",
                )}
            />
            {/* heading and Tagline */}
            <div className='center flex-col mt-4'>
                <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold'>What our Users say</h1>

                <p className='text-center mt-3 text-[#4B5563] font-medium'>Don't just take our word for it. See what thousands of patients and doctors <br />have to say about their HealthCheck experience.</p>
            </div>
            {/* testimonials */}
            <div className="flex flex-col md:flex-row items-center justify-evenly w-full  mt-10 gap-4 ">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 h-[300px] w-[400px] shadow-xl hover:shadow-2xl transition-all duration-300  bg-white/80 backdrop-blur-sm">
                  <CardContent className="">
                    <div className="flex items-center ">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-3 leading-relaxed text-sm mt-3">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-8 h-8 rounded-full mr-4 object-cover border-2 border-green-200"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                        <p className="text-gray-500 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
    )
}

export default Testimonial