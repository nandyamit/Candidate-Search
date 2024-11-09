// Nav.tsx
import { Link, useLocation } from 'react-router-dom';

const Nav = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-gray-800 p-4 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">
          Candidate Search
        </Link>
        <div className="space-x-4">
          <Link 
            to="/" 
            className={`text-white hover:text-gray-300 ${location.pathname === '/' ? 'underline' : ''}`}
          >
            Search
          </Link>
          <Link 
            to="/SavedCandidates" 
            className={`text-white hover:text-gray-300 ${location.pathname === '/SavedCandidates' ? 'underline' : ''}`}
          >
            Saved Candidates
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;