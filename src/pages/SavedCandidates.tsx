// SavedCandidates.tsx
import { useState, useEffect } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
      setSavedCandidates(Array.isArray(saved) ? saved : []);
    } catch (error) {
      console.error('Error loading saved candidates:', error);
      setSavedCandidates([]);
    }
  }, []);

  const removeCandidate = (id: number) => {
    const updatedCandidates = savedCandidates.filter(candidate => candidate.id !== id);
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
    setSavedCandidates(updatedCandidates);
  };

  if (savedCandidates.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Potential Candidates</h1>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-600">No candidates have been accepted yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Potential Candidates ({savedCandidates.length})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedCandidates.map((candidate) => (
          <div key={candidate.id} className="bg-white rounded-lg shadow-md p-4 relative">
            <button
              onClick={() => removeCandidate(candidate.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              aria-label="Remove candidate"
            >
              ✕
            </button>
            <div className="flex items-center space-x-4">
              <img 
                src={candidate.avatar_url} 
                alt={candidate.login}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="font-bold">{candidate.name || candidate.login}</h2>
                <p className="text-sm text-gray-600">@{candidate.login}</p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2 text-sm">
              {candidate.location && (
                <p><span className="font-semibold">Location:</span> {candidate.location}</p>
              )}
              {candidate.email && (
                <p><span className="font-semibold">Email:</span> {candidate.email}</p>
              )}
              {candidate.company && (
                <p><span className="font-semibold">Company:</span> {candidate.company}</p>
              )}
              <p>
                <a 
                  href={candidate.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View GitHub Profile
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedCandidates;