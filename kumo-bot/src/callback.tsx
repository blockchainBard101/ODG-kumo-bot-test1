// src/components/Callback.tsx
import React, { useEffect } from 'react';

const Callback = () => {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.hash.substr(1));
        const jwtToken = params.get("id_token");
        if (jwtToken !== null) {
          sessionStorage.setItem("sui_jwt_token", jwtToken);
        }
        window.location.href = '/main';
      } catch (error) {
        console.error('Error handling callback:', error);
      }
    };

    handleCallback();
  }, []);

  return (
    <div>
      <p>Processing callback...</p>
    </div>
  );
};

export default Callback;
