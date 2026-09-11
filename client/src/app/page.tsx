"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaBusAlt, FaMapMarkedAlt, FaClock, FaRoute, FaArrowRight } from "react-icons/fa";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const features = [
    {
      title: "Live Tracking",
      description: "Watch your bus move in real-time on our interactive maps.",
      icon: <FaMapMarkedAlt className="text-3xl text-blue-500" />,
      color: "bg-blue-50 border-blue-100"
    },
    {
      title: "Predictive ETA",
      description: "AI-powered arrival times that adjust to live traffic conditions.",
      icon: <FaClock className="text-3xl text-purple-500" />,
      color: "bg-purple-50 border-purple-100"
    },
    {
      title: "Route Discovery",
      description: "Find the fastest path to your destination across our entire network.",
      icon: <FaRoute className="text-3xl text-indigo-500" />,
      color: "bg-indigo-50 border-indigo-100"
    },
    {
      title: "Fleet Management",
      description: "State-of-the-art dispatch and monitoring for modern transport.",
      icon: <FaBusAlt className="text-3xl text-teal-500" />,
      color: "bg-teal-50 border-teal-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans selection:bg-blue-200">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/70 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FaBusAlt className="text-white text-xl" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800 tracking-tight">
              SmartRoute
            </span>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/routes" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Routes</Link>
            <Link href="/buses" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Buses</Link>
            <Link href="/login" className="px-5 py-2.5 rounded-full font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
              Admin Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between min-h-[90vh]">
        <motion.div 
          className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold tracking-wide">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span>Live Network Active</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
            Next-Gen <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Public Transport
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-gray-600 font-medium max-w-xl leading-relaxed">
            Experience the future of mobility. Track your bus in real-time, get predictive AI arrival times, and navigate the city with unprecedented ease.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4 w-full justify-center lg:justify-start">
            <Link href="/routes" className="flex items-center justify-center px-8 py-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1">
              Explore Routes <FaArrowRight className="ml-2 text-sm" />
            </Link>
            <Link href="/buses" className="flex items-center justify-center px-8 py-4 rounded-xl text-lg font-bold text-gray-700 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
              Live Bus Map
            </Link>
          </motion.div>
        </motion.div>

        {/* Decorative Graphic */}
        <motion.div 
          className="w-full lg:w-1/2 mt-16 lg:mt-0 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative w-full aspect-square max-w-lg mx-auto">
            {/* Glowing orbs background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            
            {/* Glass Card Floating */}
            <motion.div 
              className="absolute inset-0 m-auto w-3/4 h-2/3 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl p-6 flex flex-col justify-between z-10"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Arriving In</h3>
                  <p className="text-4xl font-black text-gray-900">4 min</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaBusAlt className="text-blue-600 text-xl" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-2 w-full bg-gray-200/50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-3/4 rounded-full"></div>
                </div>
                <div className="flex justify-between text-sm font-semibold text-gray-600">
                  <span>Downtown</span>
                  <span>Central Station</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Platform Capabilities</h2>
            <p className="mt-4 text-xl text-gray-500">Everything you need for seamless city transit.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -10 }}
                className={`p-8 rounded-3xl border ${feature.color} bg-opacity-50 transition-all duration-300 hover:shadow-xl`}
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
