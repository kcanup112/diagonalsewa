import React, { useEffect, useState } from 'react';
// Cleaned up about team page - removed unnecessary icon imports for cleaner design

const AboutTeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/team');
        const data = await response.json();
        if (data.success) {
          setTeamMembers(data.data);
        } else {
          setError(data.message || 'Failed to fetch team members');
        }
      } catch (err) {
        setError('Failed to fetch team members');
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hidden SEO and Search Keywords for About Team */}
      <div className="sr-only" aria-hidden="true">
        {/* Team Keywords */}
        about us team Diagonal Enterprises Nepal construction team professional team
        architects engineers contractors construction professionals experienced team
        skilled workers certified professionals licensed contractors expert team
        
        {/* Professional Qualifications Keywords */}
        civil engineer architect structural engineer project manager construction supervisor
        interior designer landscape architect building contractor master craftsman
        certified builder licensed electrician professional plumber HVAC technician
        
        {/* Experience Keywords */}
        years of experience construction experience building experience
        Nepal construction expertise local knowledge industry expertise
        professional qualifications certifications licenses accreditations
        
        {/* Company Culture Keywords */}
        company culture work ethics quality commitment customer satisfaction
        professional service reliable team trustworthy professionals
        innovation excellence teamwork collaboration dedication
        
        {/* Leadership Keywords */}
        management team leadership construction management project leadership
        executive team company founders senior management experienced leadership
      </div>

      {/* Hero Section */}
      <section style={{ background: 'rgb(18, 41, 51)', color: 'white' }} className="pt-36 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Meet Our Team</h1>
          <h2 className="text-xl font-semibold mb-2">Passionate. Skilled. United.</h2>
          <p className="text-lg max-w-2xl mx-auto mb-2">
            Our team is a diverse group of professionals committed to excellence and innovation. Each member brings unique expertise and a shared dedication to our mission. Explore their roles, qualifications, and certifications to learn how we work together to achieve outstanding results.
          </p>
          <p className="text-base text-gray-200 max-w-2xl mx-auto">
            Click on any team member to view detailed information about their background and contributions.
          </p>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Expert Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the talented individuals who bring expertise and dedication to every project
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <span className="text-lg text-gray-500">Loading team members...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <span className="text-lg text-red-500">{error}</span>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full cursor-pointer" onClick={() => setSelectedMember(member)}>
      {/* Modal for full member info */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setSelectedMember(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative text-left" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold" onClick={() => setSelectedMember(null)}>&times;</button>
            <div className="flex flex-col items-start">
              <img
                src={selectedMember.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'}
                alt={selectedMember.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 shadow-md mb-4 self-center"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face';
                }}
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedMember.name}</h2>
              <p className="text-blue-600 font-semibold mb-1">{selectedMember.position}</p>
              <p className="text-gray-500 text-sm mb-2">{selectedMember.experience}</p>
              {/* Overview as bullets */}
              {selectedMember.overview && (
                <div className="mb-4 w-full">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Overview</h4>
                  <ul className="list-disc list-inside text-xs text-gray-700">
                      {selectedMember.overview.split(/\.|\n/).filter(Boolean).map((sentence, idx) => {
                        const cleanSentence = sentence.replace(/^[\s\-]+/, '').replace(/[\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+/gu, '').trim();
                          return <li key={idx}>{cleanSentence}</li>;
                      })}
                  </ul>
                </div>
              )}
              {/* Qualifications */}
              <div className="mb-2 w-full">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Qualifications</h4>
                <ul className="list-disc list-inside text-xs text-gray-700">
                  {selectedMember.qualifications && Array.isArray(selectedMember.qualifications) && selectedMember.qualifications.length > 0
                    ? selectedMember.qualifications.map((q, idx) => <li key={idx}>{q.replace(/^[\s\-]+/, '').replace(/[\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+/gu, '').trim()}</li>)
                    : <li className="text-gray-400">No qualifications listed.</li>}
                </ul>
              </div>
              {/* Certifications */}
              <div className="mb-2 w-full">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Certifications</h4>
                <ul className="list-disc list-inside text-xs text-gray-700">
                  {selectedMember.certifications && Array.isArray(selectedMember.certifications) && selectedMember.certifications.length > 0
                    ? selectedMember.certifications.map((c, idx) => <li key={idx}>{c.replace(/^[\s\-]+/, '').replace(/[\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+/gu, '').trim()}</li>)
                    : <li className="text-gray-400">No certifications listed.</li>}
                </ul>
              </div>
              {/* Work Description as bullets */}
              {selectedMember.workDescription && (
                <div className="mb-2 w-full">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1 flex items-center"><span className="mr-2">👥</span>Work Description</h4>
                  <ul className="list-disc list-inside text-xs text-gray-700">
                    {selectedMember.workDescription.split(/\.|\n/).filter(Boolean).map((sentence, idx) => (
                      <li key={idx}>{sentence.replace(/^[\s\-]+/, '').replace(/[\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+/gu, '').trim()}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Contact icons removed as requested */}
            </div>
          </div>
        </div>
      )}
                  {/* Profile Image */}
                  <div className="mb-4 flex justify-center">
                    <img
                      src={member.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-md"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face';
                      }}
                    />
                  </div>

                  {/* Member Info */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-1 truncate">
                    {member.position}
                  </p>
                  <p className="text-gray-500 text-xs mb-2">
                    {member.experience}
                  </p>

                  {/* Overview (truncated) */}
                  {member.overview && (
                    <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                      {member.overview.length > 120 ? member.overview.substring(0, 120) + '...' : member.overview}
                    </p>
                  )}

                  {/* Qualifications & Certifications */}
                  <div className="flex flex-wrap gap-2 justify-center mb-3">
                    {member.qualifications && Array.isArray(member.qualifications) && member.qualifications.length > 0 && (
                      <span className="flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                        <span className="mr-1">🎓</span>
                        {member.qualifications.slice(0,2).join(', ')}{member.qualifications.length > 2 ? ' +' + (member.qualifications.length - 2) + ' more' : ''}
                      </span>
                    )}
                    {member.certifications && Array.isArray(member.certifications) && member.certifications.length > 0 && (
                      <span className="flex items-center bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full">
                        <span className="mr-1">🏆</span>
                        {member.certifications.slice(0,2).join(', ')}{member.certifications.length > 2 ? ' +' + (member.certifications.length - 2) + ' more' : ''}
                      </span>
                    )}
                  </div>

                  {/* Work Description (truncated) */}
                  {member.workDescription && (
                    <div className="mb-2">
                      <span className="inline-flex items-center bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        <span className="mr-1">👥</span>
                        {member.workDescription.length > 60 ? member.workDescription.substring(0, 60) + '...' : member.workDescription}
                      </span>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="flex justify-center gap-4 border-t pt-3 mt-auto">
                    <a href={`mailto:${member.email}`} title="Email" className="text-blue-600 hover:text-blue-800">
                      <span className="w-5 h-5 flex items-center justify-center">✉️</span>
                    </a>
                    <a href={`tel:${member.phone}`} title="Phone" className="text-blue-600 hover:text-blue-800">
                      <span className="w-5 h-5 flex items-center justify-center">📞</span>
                    </a>
                    <a href="#" title="LinkedIn" className="text-blue-600 hover:text-blue-800">
                      <span className="w-5 h-5 flex items-center justify-center">💼</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ background: 'rgb(29, 36, 49)', color: 'white' }} className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Work With Our Team?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Get in touch with our expert team to discuss your construction and design needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="tel:+1-555-123-4567"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutTeamPage;
