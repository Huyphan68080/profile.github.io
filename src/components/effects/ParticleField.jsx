import { useEffect, useMemo, useRef } from 'react';

const DESKTOP_PARTICLES = 88;
const MOBILE_PARTICLES = 52;
const DESKTOP_LINK_DISTANCE = 138;
const MOBILE_LINK_DISTANCE = 100;
const DESKTOP_MOUSE_RADIUS = 190;
const MOBILE_MOUSE_RADIUS = 130;
const DESKTOP_MOUSE_LINK_DISTANCE = 152;
const MOBILE_MOUSE_LINK_DISTANCE = 108;

const getMotionValue = (value) => {
  if (value && typeof value.get === 'function') return value.get();
  return 0;
};

const createParticles = (count, width, height, isMobile) => {
  const minSpeed = isMobile ? 0.08 : 0.12;
  const maxSpeed = isMobile ? 0.34 : 0.48;
  const particles = [];

  for (let index = 0; index < count; index += 1) {
    const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
    const angle = Math.random() * Math.PI * 2;
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: Math.random() * (isMobile ? 1.2 : 1.6) + 0.9,
      alpha: Math.random() * 0.45 + 0.3,
    });
  }

  return particles;
};

const ParticleField = ({ depth, theme = 'dark', isMobile = false, reduceMotion = false }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const particlesRef = useRef([]);
  const pointerRef = useRef({
    active: false,
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  const particleCount = reduceMotion ? 0 : isMobile ? MOBILE_PARTICLES : DESKTOP_PARTICLES;
  const linkDistance = isMobile ? MOBILE_LINK_DISTANCE : DESKTOP_LINK_DISTANCE;
  const mouseRadius = isMobile ? MOBILE_MOUSE_RADIUS : DESKTOP_MOUSE_RADIUS;
  const mouseLinkDistance = isMobile ? MOBILE_MOUSE_LINK_DISTANCE : DESKTOP_MOUSE_LINK_DISTANCE;
  const isDark = theme === 'dark';
  const dotRgb = isDark ? '255, 255, 255' : '122, 24, 49';
  const lineRgb = isDark ? '255, 255, 255' : '140, 38, 63';
  const mouseGlowRgb = isDark ? '255,255,255' : '151,38,66';

  const networkConfig = useMemo(
    () => ({
      particleCount,
      linkDistance,
      mouseRadius,
      mouseLinkDistance,
      maxVelocity: isMobile ? 0.9 : 1.2,
      attraction: isMobile ? 0.017 : 0.024,
      pullLerp: isMobile ? 0.12 : 0.16,
      lineAlpha: isDark ? (isMobile ? 0.2 : 0.26) : isMobile ? 0.12 : 0.16,
      dotAlpha: isDark ? (isMobile ? 0.76 : 0.82) : isMobile ? 0.52 : 0.6,
    }),
    [isDark, isMobile, linkDistance, mouseLinkDistance, mouseRadius, particleCount],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || particleCount === 0) return undefined;

    const context = canvas.getContext('2d');
    if (!context) return undefined;

    const pointer = pointerRef.current;
    const resizeCanvas = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particlesRef.current = createParticles(particleCount, width, height, isMobile);
      pointer.x = width / 2;
      pointer.y = height / 2;
      pointer.targetX = width / 2;
      pointer.targetY = height / 2;
    };

    const drawNetwork = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const parallaxX = getMotionValue(depth?.x) * (isMobile ? 8 : 14);
      const parallaxY = getMotionValue(depth?.y) * (isMobile ? 8 : 14);

      context.clearRect(0, 0, width, height);

      pointer.x += (pointer.targetX - pointer.x) * networkConfig.pullLerp;
      pointer.y += (pointer.targetY - pointer.y) * networkConfig.pullLerp;

      const particles = particlesRef.current;
      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];

        if (pointer.active) {
          const dxToMouse = pointer.x - particle.x;
          const dyToMouse = pointer.y - particle.y;
          const distanceToMouse = Math.hypot(dxToMouse, dyToMouse) || 1;

          if (distanceToMouse < networkConfig.mouseRadius) {
            const attractionForce = (1 - distanceToMouse / networkConfig.mouseRadius) * networkConfig.attraction;
            particle.vx += (dxToMouse / distanceToMouse) * attractionForce;
            particle.vy += (dyToMouse / distanceToMouse) * attractionForce;
          }
        }

        particle.vx *= 0.986;
        particle.vy *= 0.986;

        const velocity = Math.hypot(particle.vx, particle.vy);
        if (velocity > networkConfig.maxVelocity) {
          particle.vx = (particle.vx / velocity) * networkConfig.maxVelocity;
          particle.vy = (particle.vy / velocity) * networkConfig.maxVelocity;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x <= 0 || particle.x >= width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= height) particle.vy *= -1;

        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));
      }

      context.lineWidth = 1;
      for (let i = 0; i < particles.length; i += 1) {
        const particleA = particles[i];
        const pointAX = particleA.x + parallaxX;
        const pointAY = particleA.y + parallaxY;

        for (let j = i + 1; j < particles.length; j += 1) {
          const particleB = particles[j];
          const pointBX = particleB.x + parallaxX;
          const pointBY = particleB.y + parallaxY;
          const dx = pointAX - pointBX;
          const dy = pointAY - pointBY;
          const distance = Math.hypot(dx, dy);

          if (distance > networkConfig.linkDistance) continue;
          const alpha = (1 - distance / networkConfig.linkDistance) * networkConfig.lineAlpha;
          context.strokeStyle = `rgba(${lineRgb}, ${alpha.toFixed(4)})`;
          context.beginPath();
          context.moveTo(pointAX, pointAY);
          context.lineTo(pointBX, pointBY);
          context.stroke();
        }

        if (pointer.active) {
          const dxMouse = pointAX - pointer.x;
          const dyMouse = pointAY - pointer.y;
          const mouseDistance = Math.hypot(dxMouse, dyMouse);
          if (mouseDistance < networkConfig.mouseLinkDistance) {
            const mouseAlpha = (1 - mouseDistance / networkConfig.mouseLinkDistance) * 0.38;
            context.strokeStyle = `rgba(${lineRgb}, ${mouseAlpha.toFixed(4)})`;
            context.beginPath();
            context.moveTo(pointAX, pointAY);
            context.lineTo(pointer.x, pointer.y);
            context.stroke();
          }
        }
      }

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const pointX = particle.x + parallaxX;
        const pointY = particle.y + parallaxY;
        context.fillStyle = `rgba(${dotRgb}, ${(particle.alpha * networkConfig.dotAlpha).toFixed(4)})`;
        context.beginPath();
        context.arc(pointX, pointY, particle.radius, 0, Math.PI * 2);
        context.fill();
      }

      if (pointer.active) {
        const gradient = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, networkConfig.mouseRadius);
        gradient.addColorStop(0, `rgba(${mouseGlowRgb}, ${isDark ? '0.12' : '0.08'})`);
        gradient.addColorStop(1, `rgba(${mouseGlowRgb}, 0)`);
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(pointer.x, pointer.y, networkConfig.mouseRadius, 0, Math.PI * 2);
        context.fill();
      }

      rafRef.current = window.requestAnimationFrame(drawNetwork);
    };

    const handlePointerMove = (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.active = true;
      pointer.targetX = event.clientX - bounds.left;
      pointer.targetY = event.clientY - bounds.top;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    resizeCanvas();
    drawNetwork();

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('blur', handlePointerLeave);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [depth, dotRgb, isDark, isMobile, lineRgb, mouseGlowRgb, networkConfig, particleCount]);

  if (!particleCount) return null;

  return <canvas ref={canvasRef} className="particle-network-canvas absolute inset-0 h-full w-full" />;
};

export default ParticleField;
