import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer"; 
import { ShieldCheck, Users, Search, Star, MessageSquare } from "lucide-react"; 


import plumberImg from "../assets/plumber.png";
import electricianImg from "../assets/electrician.png";
import cleaningImg from "../assets/cleaning.jpeg";
import carpenterImg from "../assets/carpenter.png";
import driverImg from "../assets/driver.jpeg";
import technicianImg from "../assets/technician.jpeg";
import tutorsImg from "../assets/tutors.jpeg";
import cookImg from "../assets/cook.png";
import gardnerImg from "../assets/gardner.jpeg";
import mechanicImg from "../assets/mechanic.jpeg";
import painterImg from "../assets/painter.jpeg";
import photographerImg from "../assets/photographer.jpeg";
import plastersImg from "../assets/plasters.jpeg";
import barberImg from "../assets/barber.jpeg";
import builderImg from "../assets/builder.jpeg";
import securityImg from "../assets/security.jpeg";
import moversImg from "../assets/movers.jpeg";
import bgimg from "../assets/bgimg.png";


// Example Services Data - You can fetch this from backend if you have a service endpoint
const services = [
  { name: "Plumbers", image: plumberImg, desc: "Leak repairs & installations" },
  { name: "Electricians", image: electricianImg, desc: "Wiring & lighting fixes" },
  { name: "Cleaners", image: cleaningImg, desc: "Deep home cleaning" },
  { name: "Tutors", image: tutorsImg, desc: "Private subject help" },
  { name: "Technicians", image: technicianImg, desc: "PC & appliance repair" },
  { name: "Carpenters", image: carpenterImg, desc: "Furniture & fittings" },
  { name: "Drivers", image: driverImg, desc: "Local & outstation rides" },
  { name: "Painters", image: painterImg, desc: "House painting & decor" },
  { name: "Landscapers", image: gardnerImg, desc: "Lawn care & gardening" },
  { name: "Mechanics", image: mechanicImg, desc: "Car repair & maintenance" },
  { name: "Plasterers", image: plastersImg, desc: "Wall repairs & coatings" },
  { name: "Photographers", image: photographerImg, desc: "Professional photo sessions" },
  { name: "Cooks", image: cookImg, desc: "Private chefs & catering" },
  { name: "Builders", image: builderImg, desc: "Construction & remodeling" },
  { name: "HVAC", image: securityImg, desc: "Heating & Air Conditioning" },
  { name: "Security", image: securityImg, desc: "Home security installation" },
  { name: "Movers", image: moversImg, desc: "Moving and relocation" },
  { name: "Hair Stylists", image: barberImg, desc: "Haircuts and styling" },
];


function LandingPage() {
  const navigate = useNavigate();

  const handleExploreServices = () => {
    navigate("/services"); // Navigate to the dedicated services page
  };

  const handleJoinAsProfessional = () => {
    navigate("/register/provider"); // Navigate to provider registration
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 font-inter">
        {/* Hero Section with Background Image */}
        {/* Using a direct public domain image URL for background-image property for maximum reliability */}
        <div
          className="relative h-[70vh] md:h-[90vh] flex items-center justify-center overflow-hidden bg-cover bg-center"
          // Using a reliable public URL. Replace with your own hosted image if desired.
          style={{ backgroundImage: `url(${bgimg})` }}
          aria-label="Background image showcasing various home services and interactions"
        >
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-70 z-10"></div>
          {/* Content (Text and Buttons) */}
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-20 text-white">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-2xl"
            >
              Your Neighborhood's <br className="hidden md:block"/> Trusted Helping Hand
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto drop-shadow-lg"
            >
              Connecting you with top-rated local professionals for all your home and personal service needs.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex justify-center space-x-4"
            >
              <button
                onClick={handleExploreServices}
                className="bg-white text-indigo-700 hover:bg-gray-100 px-8 py-3 rounded-full
font-bold text-lg shadow-xl transition duration-300 transform hover:scale-105 border-2 border-transparent"
              >
                Explore Services
              </button>
              <button
                onClick={handleJoinAsProfessional}
                className="border-2 border-white text-white hover:bg-white hover:text-indigo-700
px-8 py-3 rounded-full font-bold text-lg shadow-xl transition duration-300 transform
hover:scale-105"
              >
                Join as a Professional
              </button>
            </motion.div>
          </div>
        </div>

        {/* Why Choose NeighborHelp - Customer Focused */}
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-12">Why Choose NeighborHelp?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="p-8 rounded-2xl shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50
flex flex-col items-center border border-blue-100"
                    >
                        <ShieldCheck className="w-16 h-16 text-blue-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Verified Professionals</h3>
                        <p className="text-gray-600">
                            We meticulously vet all service providers to ensure safety, reliability, and quality.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="p-8 rounded-2xl shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50
flex flex-col items-center border border-blue-100"
                    >
                        <Search className="w-16 h-16 text-indigo-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Easy Discovery</h3>
                        <p className="text-gray-600">
                            Find the right service quickly with intuitive search and filter options.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="p-8 rounded-2xl shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50
flex flex-col items-center border border-blue-100"
                    >
                        <Star className="w-16 h-16 text-yellow-500 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Transparent Reviews</h3>
                        <p className="text-gray-600">
                            Make informed decisions with real ratings and reviews from other customers.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="p-8 rounded-2xl shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50
flex flex-col items-center border border-blue-100"
                    >
                        <MessageSquare className="w-16 h-16 text-green-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Direct Communication</h3>
                        <p className="text-gray-600">
                            Communicate directly with professionals to discuss your needs and get quick responses.
                        </p>
                    </motion.div>
                     <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="p-8 rounded-2xl shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50
flex flex-col items-center border border-blue-100"
                    >
                        <Users className="w-16 h-16 text-purple-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Community Focused</h3>
                        <p className="text-gray-600">
                            Support local businesses and foster a stronger neighborhood economy.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-12">How NeighborHelp Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                className="p-8 rounded-2xl shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50
flex flex-col items-center"
              >
                <div className="text-indigo-600 mb-4 text-5xl font-extrabold">1</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Find a Service</h3>
                <p className="text-gray-600">
                  Browse a wide range of services or use our smart search to find exactly what you need.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, amount: 0.3 }}
                className="p-8 rounded-2xl shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50
flex flex-col items-center"
              >
                <div className="text-indigo-600 mb-4 text-5xl font-extrabold">2</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Connect & Book</h3>
                <p className="text-gray-600">
                  View detailed profiles of local professionals, compare ratings, and book directly.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true, amount: 0.3 }}
                className="p-8 rounded-2xl shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50
flex flex-col items-center"
              >
                <div className="text-indigo-600 mb-4 text-5xl font-extrabold">3</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Get It Done</h3>
                <p className="text-gray-600">
                  Relax while verified professionals deliver high-quality service right to your doorstep.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Services Section */}
        <section className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-12">Popular Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.slice(0, 8).map((service, index) => ( 
                <Link 
                  key={index}
                  to={`/service/${service.name.toLowerCase().replace(/\s/g, '-')}`} 
                  className="block" 
                >
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:translate-y-
-2 transition-all duration-300 h-full cursor-pointer" 
                  >
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{service.desc}</p>
                      
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
            <motion.button
              onClick={handleExploreServices}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true, amount: 0.5 }}
              className="mt-16 bg-indigo-600 text-white px-8 py-3 rounded-full font-bold text-lg
shadow-xl hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
            >
              See All Services
            </motion.button>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-indigo-50 p-8 rounded-2xl shadow-lg flex flex-col items-center"
              >
                <p className="text-xl text-gray-700 italic mb-6">
                  "NeighborHelp made finding a reliable electrician so easy! Quick, professional, and affordable. Highly recommend!"
                </p>
                <p className="font-semibold text-gray-800">- Sarah J.</p>
                <p className="text-sm text-gray-500">Customer</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-indigo-50 p-8 rounded-2xl shadow-lg flex flex-col items-center"
              >
                <p className="text-xl text-gray-700 italic mb-6">
                  "As a plumber, NeighborHelp has connected me with so many new clients. It's a fantastic platform for growing my business."
                </p>
                <p className="font-semibold text-gray-800">- David L.</p>
                <p className="text-sm text-gray-500">Professional</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Call to Action for Professionals */}
        <section className="py-20 bg-indigo-700 text-white text-center">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">Are You a Service Professional?</h2>
            <p className="text-lg mb-10 opacity-90">
              Expand your reach, get more clients, and manage your bookings effortlessly.
            </p>
            <motion.button
              onClick={handleJoinAsProfessional}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-700 hover:bg-gray-100 px-10 py-4 rounded-full
font-bold text-xl shadow-xl transition duration-300"
            >
              Join NeighborHelp Today!
            </motion.button>
          </div>
        </section>
      </div>
      <Footer /> {/* Include the Footer component */}
    </>
  );
}

export default LandingPage;
