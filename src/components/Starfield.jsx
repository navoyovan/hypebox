import React, { useEffect, useRef, useState } from 'react';

const Starfield = ({ urls }) => {
  const canvasRef = useRef(null);
  const photosRef = useRef([]);
  const [cachedImages, setCachedImages] = useState([]);

  // Pre-load and cache all images to offscreen canvases for massive performance boost
  useEffect(() => {
    if (typeof window === 'undefined' || !urls || urls.length === 0) return;

    let isMounted = true;
    const MAX_HEIGHT = 100; // Cache resolution height (lowered for blurred optimization)

    const loadAndCache = async () => {
      const promises = urls.map(src => {
        return new Promise(resolve => {
          const img = new Image();
          img.onload = () => {
            // Create an offscreen canvas to cache the image
            const offscreen = document.createElement('canvas');
            // We can disable alpha for these photo canvases if they don't have transparency, boosting render speed
            const ctx = offscreen.getContext('2d', { alpha: false });
            
            const targetHeight = MAX_HEIGHT;
            const targetWidth = MAX_HEIGHT * (img.naturalWidth / img.naturalHeight);
            
            offscreen.width = targetWidth;
            offscreen.height = targetHeight;
            
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
            
            resolve({
              canvas: offscreen,
              naturalWidth: targetWidth,
              naturalHeight: targetHeight,
              complete: true
            });
          };
          img.onerror = () => resolve(null);
          img.src = src;
        });
      });

      const results = await Promise.all(promises);
      if (isMounted) {
        setCachedImages(results.filter(Boolean));
      }
    };

    loadAndCache();

    return () => { isMounted = false; };
  }, [urls]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || cachedImages.length === 0) return;
    
    // Main render context
    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const numPhotos = 15;
    const maxDepth = 1000;

    let currentFocalLength = 200;
    let currentSpeed = 1.2;
    let startFocalLength = 200;
    let startSpeed = 1.2;
    let targetFocalLength = 600;
    let targetSpeed = 2;
    
    let isTransitioning = false;
    let transitionStartTime = null;
    const transitionDuration = 1200;

    const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const transitionTimer = setTimeout(() => {
      isTransitioning = true;

      // Exactly sync the CSS cinematic bar slide with the React tween
      const topBar = document.getElementById('cinematic-top-bar');
      const bottomBar = document.getElementById('cinematic-bottom-bar');
      if (topBar) topBar.classList.add('animate-cinematic-top');
      if (bottomBar) bottomBar.classList.add('animate-cinematic-bottom');

      // Unlock scrolling once the 1200ms animation finishes
      setTimeout(() => {
        document.body.classList.remove('overflow-hidden');
      }, transitionDuration);

    }, 2000);

    const getSpawnPos = () => {
      let px, py;
      do {
        px = (Math.random() - 0.5) * 2000;
        py = (Math.random() - 0.5) * 2000;
      } while (Math.abs(px) < 400 && Math.abs(py) < 400);
      return { x: px, y: py };
    };

    // Populate initial pool
    if (photosRef.current.length < numPhotos) {
      const needed = numPhotos - photosRef.current.length;
      for (let i = 0; i < needed; i++) {
        const pos = getSpawnPos();
        const selectedImg = cachedImages[Math.floor(Math.random() * cachedImages.length)];

        photosRef.current.push({
          x: pos.x, y: pos.y, z: Math.random() * maxDepth,
          baseHeight: (350 + Math.random() * 350),
          imageObject: selectedImg
        });
      }
    }

    const render = (timestamp) => {
      if (!isVisible) return;

      if (isTransitioning) {
        if (!transitionStartTime) transitionStartTime = timestamp;
        const elapsed = timestamp - transitionStartTime;
        const progress = Math.min(elapsed / transitionDuration, 1);
        const ease = easeInOutQuad(progress);

        currentFocalLength = startFocalLength + (targetFocalLength - startFocalLength) * ease;
        currentSpeed = startSpeed + (targetSpeed - startSpeed) * ease;

        if (progress === 1) isTransitioning = false;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const currentPhotos = photosRef.current;
      currentPhotos.sort((a, b) => b.z - a.z);

      currentPhotos.forEach(photo => {
        photo.z -= currentSpeed;

        // Respawn when passed camera
        if (photo.z <= -100) {
          const pos = getSpawnPos();
          photo.x = pos.x;
          photo.y = pos.y;
          photo.z = maxDepth + (Math.random() * 150 - 50);
          photo.imageObject = cachedImages[Math.floor(Math.random() * cachedImages.length)];
          photo.baseHeight = (350 + Math.random() * 350);
        }

        const perspective = currentFocalLength / (currentFocalLength + photo.z);
        const projectedX = centerX + photo.x * perspective;
        const projectedY = centerY + photo.y * perspective;
        const scale = Math.max(0.01, perspective);

        let currentBaseHeight = photo.baseHeight || 400;
        let currentBaseWidth = currentBaseHeight * 0.75; 

        if (photo.imageObject && photo.imageObject.complete) {
          currentBaseWidth = currentBaseHeight * (photo.imageObject.naturalWidth / photo.imageObject.naturalHeight);
        }

        const scaledWidth = currentBaseWidth * scale;
        const scaledHeight = currentBaseHeight * scale;

        let opacity = 1;
        if (photo.z > maxDepth - 500) opacity = (maxDepth - photo.z) / 500;
        if (photo.z < 0) opacity *= Math.max(0, (100 + photo.z) / 100);

        // Render optimization: Culling off-screen elements
        if (
          projectedX + scaledWidth > 0 && projectedX - scaledWidth < canvas.width &&
          projectedY + scaledHeight > 0 && projectedY - scaledHeight < canvas.height
        ) {
          ctx.save();
          ctx.translate(projectedX, projectedY);
          ctx.globalAlpha = Math.max(0, opacity);
          
          if (photo.imageObject && photo.imageObject.complete) {
            // Draw from the optimized offscreen canvas instead of raw Image
            ctx.drawImage(photo.imageObject.canvas, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
          } else {
            ctx.fillStyle = '#d1cec7';
            ctx.fillRect(-scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
          }
          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            // When becoming visible again, restart the loop
            if (transitionStartTime) {
              // Reset transition start time to avoid sudden jump completion if paused mid-transition
              transitionStartTime = performance.now() - (performance.now() - transitionStartTime);
            }
            render(performance.now()); 
          }
        } else {
          isVisible = false;
        }
      });
    }, { rootMargin: '50px' });
    
    observer.observe(canvas);

    render(performance.now());

    return () => {
      clearTimeout(transitionTimer);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [cachedImages]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%', height: '100%',
        display: 'block'
      }}
    />
  );
};

export default Starfield;
