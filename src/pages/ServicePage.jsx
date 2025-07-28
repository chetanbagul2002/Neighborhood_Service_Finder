import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/ui/Navbar";
import Input from "../components/ui/Input";
import { Search } from "lucide-react";

// Image imports
import plumberImg from "../assets/plumber.png";
import electricianImg from "../assets/electrician.png";
import cleaningImg from "../assets/cleaning.jpeg";
import carpenterImg from "../assets/carpenter.png";
import cookImg from "../assets/cook.png";
import gardnerImg from "../assets/gardner.jpeg";
import mechanicImg from "../assets/mechanic.jpeg";
import painterImg from "../assets/painter.jpeg";
import photographerImg from "../assets/photographer.jpeg";
import plastersImg from "../assets/plasters.jpeg";
import barberImg from "../assets/barber.jpeg";
import builderImg from "../assets/builder.jpeg";
import driverImg from "../assets/driver.jpeg";
import securityImg from "../assets/security.jpeg";
import moversImg from "../assets/movers.jpeg";
import technicianImg from "../assets/technician.jpeg";
import tutorsImg from "../assets/tutors.jpeg";

const serviceCategories = [
  { name: "Plumbers", image: plumberImg },
  { name: "Electricians", image: electricianImg },
  { name: "Cleaners", image: cleaningImg },
  { name: "Tutors", image: tutorsImg },
  { name: "Technicians", image: technicianImg },
  { name: "Carpenters", image: carpenterImg },
  { name: "Drivers", image: driverImg },
  { name: "Painters", image: painterImg },
  { name: "Landscapers", image: gardnerImg },
  { name: "Mechanics", image: mechanicImg },
  { name: "Plasterers", image: plastersImg },
  { name: "Photographers", image: photographerImg },
  { name: "Cooks", image: cookImg },
  { name: "Builders", image: builderImg },
  { name: "HVAC", image: securityImg },
  { name: "Security", image: securityImg },
  { name: "Cleaning", image: cleaningImg },
  { name: "IT Support", image: technicianImg },
  { name: "Movers", image: moversImg },
  { name: "Hair Stylists", image: barberImg },
];

function ServicePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setSearchTerm(text);
    const filtered = serviceCategories.filter((cat) =>
      cat.name.toLowerCase().includes(text.toLowerCase())
    );
    setSuggestions(text ? filtered : []);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const matchedCategory = serviceCategories.find(cat => cat.name.toLowerCase() === searchTerm.toLowerCase());
      if (matchedCategory) {
        navigate(`/service/${matchedCategory.name.toLowerCase()}`);
      } else {
        navigate(`/services?q=${encodeURIComponent(searchTerm)}`);
      }
      setSearchTerm("");
      setSuggestions([]);
    }
  };
  return (
    <>
      <Navbar />
      <div className="bg-white text-gray-800">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-r from-indigo-600 to-blue-700 text-white text-center relative">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-5xl font-bold mb-6">Find Trusted Local Services Instantly</h1>
            <p className="text-lg mb-8 opacity-90">
              Search, compare, and book verified professionals near you
            </p>
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="flex justify-center relative max-w-2xl mx-auto">
              <div className="flex w-full bg-white rounded-full shadow-lg overflow-hidden">
                <Input
                  value={searchTerm}
                  onChange={handleInputChange}
                  placeholder="Search services like 'plumber', 'electrician', etc."
                  className="flex-1 px-6 py-4 rounded-full focus:outline-none text-gray-900"
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6
py-4 flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute w-full max-w-2xl mx-auto left-0 right-0 mt-2 bg-white
rounded-lg shadow-lg z-10 overflow-hidden text-gray-800">
                {suggestions.map((s, i) => (
                  <Link
                    key={i}
                    to={`/service/${s.name.toLowerCase().replace(/\s/g, '-')}`} // Ensure URL friendly slug
                    className="block px-6 py-3 hover:bg-indigo-50 border-b last:border-0 text-left"
                    onClick={() => {
                      setSearchTerm(""); // Clear search term
                      setSuggestions([]); // Clear suggestions
                    }}
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
        {/* Popular Services */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12">Popular Service Categories</h2>
            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {serviceCategories.map((cat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-2xl overflow-hidden shadow-lg bg-white transition"
                >
                  <img src={cat.image} alt={cat.name} className="w-full h-40 object-cover" />
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-indigo-700">{cat.name}</h3>
                    <p className="text-sm text-gray-600 mt-2">{cat.description}</p>
                    <Link
                      to={`/service/${cat.name.toLowerCase().replace(/\s/g, '-')}`} // Ensure URL friendly slug
                      className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-500 text-white
rounded-full px-5 py-2 transition"
                    >
                      Explore
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ServicePage;
