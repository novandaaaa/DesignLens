import { useRef, useMemo } from 'react';

interface Pin {
  id: string;
  xPct: number;
  yPct: number;
  count?: number; // for clustered pins
}

interface ScreenshotAnnotatorProps {
  screenshotUrl: string;
  comments: any[];
  onAddPin: (xPct: number, yPct: number) => void;
  onSelectComment: (commentId: string) => void;
  selectedPinId?: string | null;
}

export default function ScreenshotAnnotator({
  screenshotUrl,
  comments,
  onAddPin,
  onSelectComment,
  selectedPinId
}: ScreenshotAnnotatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pins = useMemo(() => {
    // Extract pins from comments
    const extractedPins: Pin[] = [];
    comments.forEach(c => {
      if (c.xPct !== null && c.yPct !== null) {
        extractedPins.push({ id: c.id, xPct: c.xPct, yPct: c.yPct });
      }
    });
    
    // Simplistic clustering (if within 5% of each other)
    const clustered: Pin[] = [];
    extractedPins.forEach(p => {
      const close = clustered.find(
        c => Math.abs(c.xPct - p.xPct) < 5 && Math.abs(c.yPct - p.yPct) < 5
      );
      if (close) {
        close.count = (close.count || 1) + 1;
      } else {
        clustered.push({ ...p, count: 1 });
      }
    });

    return clustered;
  }, [comments]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;
    
    onAddPin(xPct, yPct);
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-black/50" ref={containerRef}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={screenshotUrl}
        alt="Website Screenshot"
        className="w-full h-auto cursor-crosshair"
        onClick={handleImageClick}
      />
      
      {/* Overlay Canvas for Pins */}
      {pins.map(pin => {
        const isSelected = selectedPinId === pin.id;
        return (
          <button
            key={pin.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectComment(pin.id);
            }}
            className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg transition-all ${
              isSelected 
                ? 'bg-[#8A2BE1] text-white scale-125 z-20' 
                : 'bg-white text-black hover:scale-110 z-10'
            }`}
            style={{ left: `${pin.xPct}%`, top: `${pin.yPct}%` }}
          >
            {pin.count && pin.count > 1 ? pin.count : ''}
            {(!pin.count || pin.count === 1) && (
              <div className="w-2 h-2 rounded-full bg-current" />
            )}
          </button>
        );
      })}
    </div>
  );
}
