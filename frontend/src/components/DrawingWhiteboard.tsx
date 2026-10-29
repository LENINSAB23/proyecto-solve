import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Eraser, RotateCcw, Trash2, Grid, Square, Palette } from 'lucide-react';

interface DrawingWhiteboardProps {
  initialHeight?: number;
  questionLabel?: string;
}

export const DrawingWhiteboard: React.FC<DrawingWhiteboardProps> = ({
  initialHeight = 220,
  questionLabel = 'Desarrollo del ejercicio'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#18181B');
  const [lineWidth, setLineWidth] = useState(3);
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState<ImageData[]>([]);

  // Configurar resolución de canvas con DPI correcto
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth || 600;
    const height = initialHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    // Guardar estado inicial en historial
    saveState();
  }, [initialHeight]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), imageData]); // Mantener últimos 15 estados
  };

  const undo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextHistory = [...history];
    nextHistory.pop(); // Quitar estado actual
    const previousState = nextHistory[nextHistory.length - 1];

    ctx.putImageData(previousState, 0, 0);
    setHistory(nextHistory);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  // Coordenadas relativas
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (tool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = lineWidth * 3.5;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  return (
    <div className="mt-4 border border-neutral-300 rounded-2xl overflow-hidden bg-white shadow-2xs">
      {/* Barra de herramientas del pizarrón */}
      <div className="px-3 py-2 bg-neutral-100 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-neutral-800 text-[11px] flex items-center gap-1 mr-2">
            ✏️ Pizarrón de desarrollo
          </span>

          {/* Selector de herramienta: Pluma vs Borrador */}
          <div className="flex bg-white rounded-lg p-0.5 border border-neutral-200">
            <button
              type="button"
              onClick={() => setTool('pen')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                tool === 'pen' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Lápiz de escritura"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTool('eraser')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                tool === 'eraser' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Borrador"
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Colores */}
          {tool === 'pen' && (
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-neutral-200">
              {[
                { hex: '#18181B', name: 'Grafito' },
                { hex: '#4F46E5', name: 'Índigo' },
                { hex: '#16A34A', name: 'Verde' },
                { hex: '#DC2626', name: 'Rojo' },
              ].map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                    color === c.hex ? 'scale-125 ring-1 ring-offset-1 ring-neutral-900' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}

          {/* Grosor */}
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-neutral-200">
            {[2, 4, 7].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setLineWidth(w)}
                className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-semibold cursor-pointer ${
                  lineWidth === w ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {w === 2 ? 'F' : w === 4 ? 'M' : 'G'}
              </button>
            ))}
          </div>
        </div>

        {/* Acciones del lado derecho */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
              showGrid
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
            }`}
            title="Activar o desactivar cuadrícula matemática"
          >
            <Grid className="w-3 h-3" />
            <span>Cuadrícula</span>
          </button>

          <button
            type="button"
            onClick={undo}
            disabled={history.length <= 1}
            className="p-1.5 bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 rounded-lg transition-all cursor-pointer disabled:opacity-30"
            title="Deshacer trazo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={clearCanvas}
            className="p-1.5 bg-white border border-neutral-200 text-neutral-700 hover:text-red-600 rounded-lg transition-all cursor-pointer"
            title="Limpiar pizarrón completo"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Área del Lienzo Canvas con Cuadrícula Opcional */}
      <div
        ref={containerRef}
        className={`relative w-full cursor-crosshair touch-none ${
          showGrid ? 'bg-grid-pattern' : 'bg-white'
        }`}
        style={{
          minHeight: `${initialHeight}px`,
          backgroundImage: showGrid
            ? 'linear-gradient(to right, #f1f1f4 1px, transparent 1px), linear-gradient(to bottom, #f1f1f4 1px, transparent 1px)'
            : 'none',
          backgroundSize: '24px 24px',
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="block w-full"
        />

        {/* Marca de agua sutil de orientación */}
        <div className="absolute bottom-2 right-3 pointer-events-none text-[10px] text-neutral-300 select-none font-medium">
          Dibuja o resuelve aquí usando el ratón o pantalla táctil
        </div>
      </div>
    </div>
  );
};
