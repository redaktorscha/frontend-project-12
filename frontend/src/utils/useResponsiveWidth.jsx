import { useEffect, useState } from 'react';

const useResponsiveWidth = () => {
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);
  const handleWindowResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const isMobile = windowWidth <= 768;

  return { isMobile };
};

export default useResponsiveWidth;
