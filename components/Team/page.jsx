'use client';
import { motion } from "framer-motion";
import { Linkedin, Mail, Twitter, Github } from "lucide-react";
import Image from "next/image";
import JoinUs from "../Join Us/page.jsx";

const teamMembers = [
  {
    name: "Shailendra Sahani",
    role: "",
    image:"/Shailendra.jpg",
    linkedin: "",
    email: "mailto:shailendrasahani273209@gmail.com",
    twitter: "#",
    github: "#",
    bio: "Visionary leader passionate about transforming agriculture with technology.",
  },
  {
    name: "Aditya Kumar Ojha",
    role: "Full Stack Developer",
    image:"/Aditya.jpg",
    linkedin: "#",
    email: "mailto:aarav@example.com",
    twitter: "#",
    github: "#",
    bio: "Building scalable applications and seamless user experiences.",
  },
  {
    name: "Shreya Pandey",
    role: "UI/UX Designer",
    image: "/Shreya.jpg",
    linkedin: "#",
    email: "mailto:priya@example.com",
    twitter: "#",
    github: "#",
    bio: "Designing intuitive interfaces that connect farmers with technology.",
  },
  {
    name: "Samriddhi Srivastava",
    role: "Data Analyst",
    image: "/Samriddhi.jpg",
    linkedin: "#",
    email: "mailto:rohan@example.com",
    twitter: "#",
    github: "#",
    bio: "Turning data into actionable insights for smarter farming decisions.",
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-green-800 mb-6"
        >
          Our Team 🌱
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto"
        >
          Meet the passionate innovators behind{" "}
          <span className="font-semibold">Agriguard</span>. We combine
          technology and agriculture expertise to create sustainable solutions
          for the future.
        </motion.p>

        {/* Circular Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.08 }}
              className="flex flex-col items-center"
            >
              <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-green-200">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-800">
                {member.name}
              </h2>
              <p className="text-sm text-green-600">{member.role}</p>
              <p className="mt-2 text-sm text-gray-600 max-w-[200px]">
                {member.bio}
              </p>

              {/* Social Links */}
              <div className="flex space-x-4 mt-4">
                <a href={member.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin className="w-6 h-6 text-green-700 hover:text-green-900 transition" />
                </a>
                <a href={member.twitter} target="_blank" rel="noreferrer">
                  <Twitter className="w-6 h-6 text-blue-500 hover:text-blue-700 transition" />
                </a>
                <a href={member.github} target="_blank" rel="noreferrer">
                  <Github className="w-6 h-6 text-gray-800 hover:text-black transition" />
                </a>
                <a href={member.email}>
                  <Mail className="w-6 h-6 text-green-700 hover:text-green-900 transition" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
    <JoinUs />
      </div>
    </div>
  );
}
