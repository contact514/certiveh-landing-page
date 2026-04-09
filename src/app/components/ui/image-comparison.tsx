import { useState } from "react";
import { GripVertical } from "lucide-react";

interface ImageComparisonProps {
  beforeImage: string | any;
  afterImage: string | any;
  className?: string;
}

export function ImageComparison({ beforeImage, afterImage, className = "" }: ImageComparisonProps) {
  const [inset, setInset] = useState<number>(50);
  const [onMouseDown, setOnMouseDown] = useState<boolean>(false);

  const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!onMouseDown) return;

    const rect = e.currentTarget.getBoundingClientRect();
    let x = 0;

    if ("touches" in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
    } else if ("clientX" in e) {
      x = e.clientX - rect.left;
    }
    
    const percentage = (x / rect.width) * 100;
    setInset(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div className={className}>
      <div
        className="relative w-full h-full overflow-hidden rounded-2xl select-none"
        style={{ aspectRatio: '16/9' }}
        onMouseMove={onMouseMove}
        onMouseUp={() => setOnMouseDown(false)}
        onTouchMove={onMouseMove}
        onTouchEnd={() => setOnMouseDown(false)}
      >
        <div
          className="bg-white/90 h-full w-1 absolute z-20 top-0 select-none shadow-lg"
          style={{
            left: inset + "%",
            transform: 'translateX(-50%)'
          }}
        >
          <button
            aria-label="Deslizar para comparar imágenes"
            className="bg-white rounded-full hover:scale-110 transition-all w-10 h-10 select-none absolute top-1/2 left-1/2 z-30 cursor-ew-resize flex justify-center items-center shadow-xl border border-slate-200"
            style={{
              transform: 'translate(-50%, -50%)'
            }}
            onTouchStart={(e) => {
              setOnMouseDown(true);
              onMouseMove(e);
            }}
            onMouseDown={(e) => {
              setOnMouseDown(true);
              onMouseMove(e);
            }}
            onTouchEnd={() => setOnMouseDown(false)}
            onMouseUp={() => setOnMouseDown(false)}
          >
            <GripVertical className="h-5 w-5 select-none text-emerald-600" />
          </button>
        </div>
        <img
          src={typeof afterImage === 'string' ? afterImage : afterImage.src || afterImage}
          alt="Portal Usuario"
          loading="lazy"
          className="absolute left-0 top-0 z-10 w-full h-full rounded-2xl select-none object-cover border border-slate-200"
          style={{
            clipPath: "inset(0 0 0 " + inset + "%)",
          }}
        />
        <img
          src={typeof beforeImage === 'string' ? beforeImage : beforeImage.src || beforeImage}
          alt="Vehículo Eléctrico"
          loading="lazy"
          className="absolute left-0 top-0 w-full h-full rounded-2xl select-none object-cover border border-slate-200"
        />
      </div>
    </div>
  );
}