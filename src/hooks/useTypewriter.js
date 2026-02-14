import { useEffect, useState } from 'react';

export const useTypewriter = (text, speed = 46, startDelay = 360) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    let timeoutId;

    const tick = (index) => {
      if (index > text.length) return;
      setContent(text.slice(0, index));
      timeoutId = window.setTimeout(() => tick(index + 1), speed);
    };

    timeoutId = window.setTimeout(() => tick(1), startDelay);

    return () => window.clearTimeout(timeoutId);
  }, [text, speed, startDelay]);

  return content;
};
