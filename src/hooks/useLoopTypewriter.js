import { useEffect, useState } from 'react';

export const useLoopTypewriter = (
  text,
  {
    typeSpeed = 140,
    deleteSpeed = 90,
    startDelay = 380,
    pauseBeforeDelete = 1200,
    pauseBeforeType = 360,
  } = {},
) => {
  const [content, setContent] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setContent('');
    setIsDeleting(false);
  }, [text]);

  useEffect(() => {
    if (!text) return;

    let timeoutId;

    if (!isDeleting && content === text) {
      timeoutId = window.setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
      return () => window.clearTimeout(timeoutId);
    }

    if (isDeleting && content.length === 0) {
      timeoutId = window.setTimeout(() => setIsDeleting(false), pauseBeforeType);
      return () => window.clearTimeout(timeoutId);
    }

    const nextDelay =
      content.length === 0 && !isDeleting ? startDelay : isDeleting ? deleteSpeed : typeSpeed;

    timeoutId = window.setTimeout(() => {
      setContent((current) => {
        if (isDeleting) {
          return current.slice(0, -1);
        }
        return text.slice(0, current.length + 1);
      });
    }, nextDelay);

    return () => window.clearTimeout(timeoutId);
  }, [
    text,
    content,
    isDeleting,
    typeSpeed,
    deleteSpeed,
    startDelay,
    pauseBeforeDelete,
    pauseBeforeType,
  ]);

  return content;
};
