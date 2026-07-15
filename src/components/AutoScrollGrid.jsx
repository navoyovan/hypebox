import React, { useRef, useEffect, useMemo } from 'react';

const AutoScrollGrid = () => {
  const containerRef = useRef(null);
  const colRefs = useRef([]);
  const scrollState = useRef({ current: 0, target: 0 });
  const autoSpeedRef = useRef(0.8); // px/frame constant drift

  // Generate blank placeholders
  const placeholders = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: `blank-${i}`
    }));
  }, []);

  // Duplicate placeholders to create the infinite column loop
  const infiniteCols = useMemo(() => {
    return Array.from({ length: 4 }).map((_, colIndex) => {
      const base = [...placeholders.slice(colIndex), ...placeholders.slice(0, colIndex)];
      let massiveArray = [];
      // 6 sets ensures we have plenty of offscreen elements for snapping
      for (let i = 0; i < 6; i++) massiveArray = massiveArray.concat(base);
      return massiveArray;
    });
  }, [placeholders]);

  useEffect(() => {
    const panel = containerRef.current;
    if (!panel) return;

    let animationFrame;

    const smoothScroll = () => {
      // Auto-roll drift only
      scrollState.current.current += autoSpeedRef.current;

      // Warp Loop Logic
      const firstCol = colRefs.current[0];
      if (firstCol && firstCol.scrollHeight > 0) {
        let singleSetHeight = firstCol.scrollHeight / 6;
        const totalItems = firstCol.children.length;
        if (totalItems > 0 && totalItems % 6 === 0) {
          const baseLength = totalItems / 6;
          const firstItem = firstCol.children[0];
          const nextSetItem = firstCol.children[baseLength];
          if (firstItem && nextSetItem) {
            singleSetHeight = nextSetItem.offsetTop - firstItem.offsetTop;
          }
        }
        
        const currentPx = scrollState.current.current;
        const threshold = singleSetHeight * 2;
        if (Math.abs(currentPx) > threshold) {
          const snapAmount = singleSetHeight;
          const direction = Math.sign(scrollState.current.current);
          scrollState.current.current -= direction * snapAmount;
        }
      }

      // Apply transform to all columns
      colRefs.current.forEach((col, index) => {
        if (!col) return;
        // Alternating directions
        const direction = index % 2 === 0 ? 1 : -1;
        const baseMiddle = -(col.scrollHeight / 2);
        const delta = scrollState.current.current * direction;
        col.style.transform = `translateY(${baseMiddle + delta}px)`;
      });

      animationFrame = requestAnimationFrame(smoothScroll);
    };

    smoothScroll();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative overflow-hidden pointer-events-none bg-milky-white"
    >
      <div className="flex flex-row gap-6 md:gap-8 h-full w-[110%] -ml-[5%] items-stretch transform -rotate-[3deg] origin-center py-12">
        {infiniteCols.map((colItems, colIndex) => (
          <div
            key={colIndex}
            ref={(el) => (colRefs.current[colIndex] = el)}
            className="flex-1 min-w-[150px] md:min-w-[220px] flex flex-col gap-6 md:gap-8 will-change-transform"
          >
            {colItems.map((item, i) => (
              <div 
                key={`${item.id}-${i}`} 
                className="w-full aspect-[3/4] bg-white border border-charcoal-black overflow-hidden flex items-center justify-center relative flex-shrink-0"
              >
                {/* Editorial Skeleton Inner Styling */}
                <div className="absolute inset-0 bg-black/5 border border-black/10 flex items-center justify-center overflow-hidden animate-pulse">
                  {/* Crop Marks */}
                  <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-black/30 pointer-events-none" />
                  <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-black/30 pointer-events-none" />
                  <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-black/30 pointer-events-none" />
                  <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-black/30 pointer-events-none" />
                  
                  {/* Center Crosshair */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 flex items-center justify-center pointer-events-none">
                    <div className="absolute w-full h-[1px] bg-black/20" />
                    <div className="absolute h-full w-[1px] bg-black/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Gradients to blend with section background */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-milky-white to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-milky-white to-transparent pointer-events-none" />
    </div>
  );
};

export default AutoScrollGrid;
