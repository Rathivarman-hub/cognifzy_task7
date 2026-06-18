import { authApi } from '../services/authApi';

const OAuthButton = ({ provider }) => {
  const isGoogle = provider === 'google';

  const handleClick = () => {
    if (isGoogle) authApi.googleLogin();
    else authApi.githubLogin();
  };

  return (
    <button
      type="button"
      className={`oauth-btn btn w-100 d-flex align-items-center justify-content-center gap-2 ${isGoogle ? 'oauth-google' : 'oauth-github'}`}
      onClick={handleClick}
    >
      <i className={`bi bi-${isGoogle ? 'google' : 'github'}`}></i>
      Continue with {isGoogle ? 'Google' : 'GitHub'}
    </button>
  );
};

export default OAuthButton;
