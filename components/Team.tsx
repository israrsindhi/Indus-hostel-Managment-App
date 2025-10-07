import React from 'react';
import { TeamMember } from '../types';

interface TeamProps {
  teamMembers: TeamMember[];
}

const TeamMemberCard: React.FC<TeamMember> = ({ name, role, imageUrl }) => (
  <div className="bg-white rounded-xl shadow-md p-6 text-center transition-transform transform hover:scale-105">
    <img src={imageUrl} alt={name} className="w-32 h-32 mx-auto rounded-full mb-4 border-4 border-secondary object-cover" />
    <h3 className="text-xl font-bold text-primary">{name}</h3>
    <p className="text-gray-600">{role}</p>
  </div>
);

export const Team: React.FC<TeamProps> = ({ teamMembers }) => {
  return (
    <div className="p-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-dark">Meet Our Team</h2>
        <p className="text-gray-500 mt-2">The dedicated individuals making your stay comfortable.</p>
      </div>

      <h3 className="text-2xl font-semibold text-dark mb-6 pl-2 border-l-4 border-primary">Management</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {teamMembers.map(member => (
          <TeamMemberCard key={member.id} {...member} />
        ))}
      </div>

       <h3 className="text-2xl font-semibold text-dark mb-6 pl-2 border-l-4 border-primary">Development</h3>
       <div className="flex justify-center">
            <div className="bg-white rounded-xl shadow-md p-6 text-center transition-transform transform hover:scale-105 w-full max-w-xs">
                <img src="https://i.postimg.cc/qMrRVdx4/Ai-Design-Two-color-black-and-white-stroke-personal-avatar-1757780311.webp" alt="App Developer" className="w-32 h-32 mx-auto rounded-full mb-4 border-4 border-secondary object-cover bg-blue-100" />
                <h3 className="text-xl font-bold text-primary">Israr Ali</h3>
                <p className="text-gray-600">Application Developer</p>
             </div>
       </div>
    </div>
  );
};