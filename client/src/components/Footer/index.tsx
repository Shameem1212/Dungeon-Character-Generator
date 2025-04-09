import { useLocation, useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) { // Check if there is a previous page in the history stack
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {location.pathname !== '/' && (
          <button
            className="go-back-btn"
            onClick={handleGoBack}
          >
            &larr; Go Back
          </button>
        )}
        <h4>
          Made with{' '}
          <span
            className="emoji"
            role="img"
            aria-label="heart"
            aria-hidden="false"
          >
            ❤️
          </span>{' '}
          For Logan.
        </h4>
      </div>
    </footer>
  );
};

export default Footer;
