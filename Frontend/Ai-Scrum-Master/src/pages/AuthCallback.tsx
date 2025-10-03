import React, { useEffect } from 'react';

const AuthCallback: React.FC = () => {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user = params.get('user');

    if (token && user) {
      localStorage.setItem('jwt', token);
      localStorage.setItem('user', user);
    }

    window.location.href = '/';
  }, []);

  return <div>Loading...</div>;
};

export default AuthCallback;
