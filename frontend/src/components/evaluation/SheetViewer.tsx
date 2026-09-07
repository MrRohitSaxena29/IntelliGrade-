import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, ScanEye, Layers, Eye } from 'lucide-react';
import { mockOCRPage1 } from '../../data/mockData';

interface SheetViewerProps {
  studentName: string;
  rollNumber: string;
  activeQuestionId: string;
}

export const SheetViewer: React.FC<SheetViewerProps> = ({
  studentName,
  rollNumber,
  activeQuestionId,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Top Controls Bar */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--primary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
            }}
          >
            Roll #{rollNumber}
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {studentName} — Page 1 of 3
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Toggle Bounding Boxes */}
          <button
            className={`btn btn-sm ${showBoundingBoxes ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
          >
            <ScanEye size={14} />
            <span>{showBoundingBoxes ? 'OCR Overlay ON' : 'Raw Scan'}</span>
          </button>

          {/* Zoom controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setZoom((z) => Math.max(70, z - 10))}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
            >
              <ZoomOut size={13} />
            </button>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', minWidth: 32, textAlign: 'center', color: 'var(--text-main)' }}>
              {zoom}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
            >
              <ZoomIn size={13} />
            </button>
            <button
              onClick={() => setZoom(100)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', marginLeft: 4 }}
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Scanned Document View Area */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: 20,
          background: '#070b13',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: `${(540 * zoom) / 100}px`,
            minHeight: `${(740 * zoom) / 100}px`,
            background: '#ffffff',
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0,0,0,0.85)',
            overflow: 'hidden',
            padding: `${(24 * zoom) / 100}px`,
            userSelect: 'none',
          }}
        >
          {/* Ruling margin & lines */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${(50 * zoom) / 100}px`,
              width: 1,
              backgroundColor: '#f87171',
              opacity: 0.7,
            }}
          />

          {/* Student Header on Paper */}
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 8, marginBottom: 14, display: 'flex', justifyContent: 'space-between', fontSize: `${(11 * zoom) / 100}px`, color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            <span>Name: Aarav Saxena</span>
            <span>Roll: 12044</span>
            <span>Physics XII-A</span>
          </div>

          {/* Handwriting content blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Q1 Region */}
            <div
              style={{
                position: 'relative',
                padding: '8px 12px',
                borderRadius: 4,
                border: activeQuestionId === 'q-1' ? '2px solid rgba(99, 102, 241, 0.7)' : '1px solid transparent',
                backgroundColor: activeQuestionId === 'q-1' ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              {activeQuestionId === 'q-1' && (
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: 8,
                    background: 'var(--primary)',
                    color: '#fff',
                    fontSize: `${(9 * zoom) / 100}px`,
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 3,
                  }}
                >
                  Active Grading Focus (Q1)
                </div>
              )}

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: `${(11 * zoom) / 100}px`, color: '#1e293b', fontWeight: 700, marginBottom: 4 }}>
                Ans 1.
              </div>

              <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: `${(13 * zoom) / 100}px`, color: '#0f172a', lineHeight: 1.6 }}>
                According to <strong>Biot-Savart Law</strong>, the small magnetic field dB produced by an element dl carrying current I at distance r is:
                <br />
                <span style={{ fontFamily: 'var(--font-mono)', color: '#1e3a8a', display: 'inline-block', margin: '4px 0', padding: '2px 6px', background: '#eff6ff', borderRadius: 3 }}>
                  dB = (µ₀ / 4π) · (I dl × r̂) / r²
                </span>
                <br />
                For a circular coil of radius R, the angle between dl and radius is 90°:
                <br />
                sin 90° = 1
                <br />
                Integrating over the whole circular loop:
                <br />
                <span style={{ fontFamily: 'var(--font-mono)', color: '#1e3a8a', display: 'inline-block', margin: '4px 0', padding: '2px 6px', background: '#eff6ff', borderRadius: 3 }}>
                  B = ∫ dB = (µ₀ I / 4π R²) · ∫ dl = (µ₀ I / 4π R²) · (2π R)
                </span>
                <br />
                <strong>=&gt; B = µ₀ I / (2R)</strong>
                <br />
                <span style={{ color: '#475569' }}>
                  Direction: Given by Right-Hand Thumb Rule (perpendicular to loop plane). Unit: Tesla (T).
                </span>
              </div>
            </div>

            {/* Q2 Region */}
            <div
              style={{
                position: 'relative',
                padding: '8px 12px',
                borderRadius: 4,
                border: activeQuestionId === 'q-2' ? '2px solid rgba(99, 102, 241, 0.7)' : '1px solid transparent',
                backgroundColor: activeQuestionId === 'q-2' ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              {activeQuestionId === 'q-2' && (
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: 8,
                    background: 'var(--primary)',
                    color: '#fff',
                    fontSize: `${(9 * zoom) / 100}px`,
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 3,
                  }}
                >
                  Active Grading Focus (Q2)
                </div>
              )}

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: `${(11 * zoom) / 100}px`, color: '#1e293b', fontWeight: 700, marginBottom: 4 }}>
                Ans 2.
              </div>

              <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: `${(13 * zoom) / 100}px`, color: '#0f172a', lineHeight: 1.6 }}>
                <strong>Gauss's Law Statement:</strong> The total electric flux Φ through any closed surface is equal to 1/ε₀ times the net electric charge enclosed by that surface:
                <br />
                <span style={{ fontFamily: 'var(--font-mono)', color: '#1e3a8a', display: 'inline-block', margin: '4px 0', padding: '2px 6px', background: '#eff6ff', borderRadius: 3 }}>
                  Φ = ∮ E · dA = Q_enclosed / ε₀
                </span>
                <br />
                For an enclosed electric dipole inside the cubical box:
                <br />
                Q_enclosed = (+5 µC) + (-5 µC) = 0 µC
                <br />
                <strong>Therefore, Net Electric Flux Φ = 0 / ε₀ = 0 N·m²/C.</strong>
              </div>
            </div>
          </div>

          {/* OCR Bounding Boxes Overlay (if toggled) */}
          {showBoundingBoxes && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {mockOCRPage1.bounding_boxes.map((box) => (
                <div
                  key={box.box_id}
                  style={{
                    position: 'absolute',
                    left: `${box.coordinates.x}%`,
                    top: `${box.coordinates.y}%`,
                    width: `${box.coordinates.width}%`,
                    height: `${box.coordinates.height}%`,
                    border: '1.5px dashed rgba(6, 182, 212, 0.7)',
                    backgroundColor: 'rgba(6, 182, 212, 0.05)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
