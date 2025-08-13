import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaLinkedin, 
  FaInstagram, 
  FaPhone, 
  FaEnvelope,
  FaAward,
  FaGraduationCap,
  FaCertificate,
  FaUsers,
  FaSpinner
} from 'react-icons/fa';
import Footer from '../components/Layout/Footer';
import toast from 'react-hot-toast';

const AboutTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/team');
        const data = await response.json();

        if (data.success) {
          setTeamMembers(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch team members');
        }
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError(err.message);
        toast.error('Failed to load team members');
        
        // Fallback to default team members if API fails
        setTeamMembers([
          {
            id: 1,
            name: 'Anup KC',
            position: 'Founder & CEO',
            experience: '8+ Years',
            overview: 'Visionary leader with extensive experience in construction project management and innovative 3D architectural design solutions.',
            qualifications: [
              'Bachelor in Civil Engineering',
              'Certified Project Manager (PMP)',
              'Advanced 3D Design Certification'
            ],
            workDescription: 'Leading the company with expertise in construction management and 3D design innovation.',
            email: 'anup@diagonalenterprises.com',
            profileImage: '/images/gallery/living.jpg'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const companyStats = [
    { number: '200+', label: 'Projects Completed', icon: FaAward },
    { number: '150+', label: 'Happy Clients', icon: FaUsers },
    { number: '8+', label: 'Years Experience', icon: FaGraduationCap },
    { number: '24/7', label: 'Support Available', icon: FaCertificate }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardHover = {
    initial: { y: 0, scale: 1 },
    hover: { 
      y: -10, 
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden" style={{backgroundColor: '#013b4b'}}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container-custom">
          <motion.div 
            className="text-center space-y-6"
            {...fadeInUp}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold">
              Meet Our Expert Team
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
              Passionate professionals dedicated to bringing your construction dreams to life
            </p>
          </motion.div>

          {/* Company Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {companyStats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                variants={fadeInUp}
              >
                <div className="mb-4">
                  <stat.icon className="w-8 h-8 mx-auto text-accent-400" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-accent-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-200">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div 
            className="text-center space-y-4 mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
              Our Professional Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get to know the experts behind Diagonal Enterprises' success
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <FaSpinner className="w-8 h-8 text-primary-600 animate-spin" />
              <span className="ml-3 text-lg text-gray-600">Loading team members...</span>
            </div>
          ) : error && teamMembers.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600">Unable to load team members. Please try again later.</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {teamMembers.map((member) => (
                <motion.div 
                  key={member.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  variants={cardHover}
                  initial="initial"
                  whileHover="hover"
                >
                  {/* Member Photo */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.profileImage || '/images/gallery/living.jpg'}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/gallery/living.jpg'; // Fallback image
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>

                  {/* Member Info */}
                  <div className="p-6 space-y-4">
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-heading font-bold text-gray-900">
                        {member.name}
                      </h3>
                      <p className="text-primary-600 font-medium">{member.position}</p>
                      <div className="inline-flex items-center px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium">
                        {member.experience}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {member.overview}
                    </p>

                    {/* Qualifications */}
                    {member.qualifications && member.qualifications.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 text-sm flex items-center space-x-2">
                          <FaGraduationCap className="w-4 h-4 text-primary-500" />
                          <span>Qualifications:</span>
                        </h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {member.qualifications.map((qual, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0"></div>
                              <span>{qual}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Certifications */}
                    {member.certifications && member.certifications.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 text-sm flex items-center space-x-2">
                          <FaCertificate className="w-4 h-4 text-accent-500" />
                          <span>Certifications:</span>
                        </h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {member.certifications.map((cert, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-accent-400 rounded-full flex-shrink-0"></div>
                              <span>{cert}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Work Description */}
                    {member.workDescription && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 text-sm">Key Work:</h4>
                        <p className="text-xs text-gray-600">{member.workDescription}</p>
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FaEnvelope className="w-3 h-3 text-primary-500" />
                        <span className="break-all">{member.email}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Company Values Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div 
            className="text-center space-y-4 mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                title: 'Quality Excellence',
                description: 'We never compromise on quality. Every project reflects our commitment to excellence and attention to detail.',
                icon: FaAward
              },
              {
                title: 'Client First',
                description: 'Our clients are at the heart of everything we do. Their satisfaction and success is our primary goal.',
                icon: FaUsers
              },
              {
                title: 'Innovation',
                description: 'We embrace new technologies and innovative approaches to deliver cutting-edge construction solutions.',
                icon: FaCertificate
              },
              {
                title: 'Transparency',
                description: 'Open communication and honest dealings. We believe in building trust through transparency.',
                icon: FaGraduationCap
              },
              {
                title: 'Sustainability',
                description: 'Committed to environmentally responsible construction practices for a better future.',
                icon: FaAward
              },
              {
                title: 'Teamwork',
                description: 'Collaboration and teamwork drive our success. Together, we achieve extraordinary results.',
                icon: FaUsers
              }
            ].map((value, index) => (
              <motion.div 
                key={index}
                className="text-center space-y-4 p-6 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors duration-300"
                variants={fadeInUp}
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-900">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container-custom text-center">
          <motion.div 
            className="max-w-4xl mx-auto space-y-8"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              Ready to Work with Our Expert Team?
            </h2>
            <p className="text-xl text-gray-100">
              Let's discuss your construction project and bring your vision to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/design-construction?tab=booking"
                className="btn-secondary"
              >
                Schedule Consultation
              </a>
              <a
                href="#footer"
                className="btn-outline border-white text-white hover:bg-white hover:text-primary-600"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#footer')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Contact Us Today
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <div id="footer">
        <Footer />
      </div>
    </div>
  );
};

export default AboutTeam;
