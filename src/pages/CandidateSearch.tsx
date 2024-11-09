// CandidateSearch.tsx
import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNextCandidate = async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await searchGithub();
      if (!Array.isArray(users) || users.length === 0) {
        setError('No more candidates available');
        setCurrentCandidate(null);
        return;
      }
      const userDetails = await searchGithubUser(users[0].login);
      if (!userDetails || !userDetails.login) {
        throw new Error('Invalid user data received');
      }
      setCurrentCandidate(userDetails);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading candidate');
      setCurrentCandidate(null);
    } finally {
      setLoading(false);
    }
  };

  const saveCandidate = () => {
    if (currentCandidate) {
      const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
      if (!savedCandidates.some((c: Candidate) => c.id === currentCandidate.id)) {
        savedCandidates.push(currentCandidate);
        localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
      }
      loadNextCandidate();
    }
  };

  useEffect(() => {
    loadNextCandidate();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {currentCandidate ? (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4">
            <img 
              src={currentCandidate.avatar_url} 
              alt={currentCandidate.login}
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold">{currentCandidate.name || currentCandidate.login}</h2>
              <p className="text-gray-600">@{currentCandidate.login}</p>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            {currentCandidate.location && (
              <p><span className="font-semibold">Location:</span> {currentCandidate.location}</p>
            )}
            {currentCandidate.email && (
              <p><span className="font-semibold">Email:</span> {currentCandidate.email}</p>
            )}
            {currentCandidate.company && (
              <p><span className="font-semibold">Company:</span> {currentCandidate.company}</p>
            )}
            <p>
              <a 
                href={currentCandidate.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View GitHub Profile
              </a>
            </p>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => loadNextCandidate()}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
              aria-label="Skip candidate"
            >
              -
            </button>
            <button
              onClick={saveCandidate}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
              aria-label="Save candidate"
            >
              +
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-xl">No more candidates available</div>
      )}
    </div>
  );
};

export default CandidateSearch;