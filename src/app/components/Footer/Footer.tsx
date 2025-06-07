import React from 'react'
import { Phone, Mail, Globe } from 'lucide-react';
import { FaHandHoldingMedical } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b  from-gray-900 to-black py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_center,#10b981_1px,transparent_1px)] bg-[length:30px_30px] opacity-20" />
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-4 ">
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white h-6 w-6 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg">
                                <FaHandHoldingMedical  />
                            </div>
                            <span className="font-bold text-2xl text-white">HealthAxis</span>
                        </div>
                        <p className="text-gray-400 mb-4 max-w-md leading-relaxed">
                            Revolutionizing healthcare through technology. Connect with top doctors, manage your health, and experience the future of medical care.
                        </p>
                        <div className="flex space-x-4">
                            <div className="bg-gray-800 p-1 rounded-xl hover:bg-green-600 transition-colors cursor-pointer">
                                <Phone className="h-3 w-3 text-gray-400 hover:text-white" />
                            </div>
                            <div className="bg-gray-800 p-1 rounded-xl hover:bg-green-600 transition-colors cursor-pointer">
                                <Mail className="h-3 w-3 text-gray-400 hover:text-white" />
                            </div>
                            <div className="bg-gray-800 p-1 rounded-xl hover:bg-green-600 transition-colors cursor-pointer">
                                <Globe className="h-3 w-3 text-gray-400 hover:text-white" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-1 text-lg">Quick Links</h4>
                        <ul className="space-y-1">
                            <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">About Us</a></li>
                            <li><a href="#features" className="text-gray-400 hover:text-green-400 transition-colors">Features</a></li>
                            <li><a href="#doctors" className="text-gray-400 hover:text-green-400 transition-colors">For Doctors</a></li>
                            <li><a href="#testimonials" className="text-gray-400 hover:text-green-400 transition-colors">Reviews</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Help Center</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-1 text-lg">Legal + Support</h4>
                        <ul className="space-y-1">
                            <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">HIPAA Compliance</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Contact Support</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Security</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 mb-4 md:mb-0">
                            © {new Date().getFullYear()} HealthAxis. All rights reserved. Made with ❤️ for better healthcare.
                        </p>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-400 text-sm">🔒 HIPAA Compliant</span>
                            <span className="text-gray-400 text-sm">🛡️ SSL Secured</span>
                            <span className="text-gray-400 text-sm">⚡ 99.9% Uptime</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer