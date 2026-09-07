import React, { useState } from 'react';
import { OCRBoundingBox } from '../../types';
import { mockOCRPage1 } from '../../data/mockData';
import { X, Cpu, CheckCircle2, ScanLine, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface OCRInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OCRInspectorModal: React.FC<OCRInspectorModalProps> = ({ isOpen, onClose }) => {
  const [activeBoxId, setActiveBoxId] = useState<string | null>('box-2');
  const [zoom, setZoom] = useState<number>(100);

  if (!isOpen) return null;

  const activeBox = mockOCRPage1.bounding_boxes.find((b) => b.box_id === activeBoxId);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 1100, height: '88vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
              <Cpu size={18} />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Computer Vision & PaddleOCR Bounding Box Inspector
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Page 1 of 3 • Sheet #12044 • PaddleOCR v2.6 Model Extraction
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.3)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setZoom((z) => Math.max(70, z - 15))}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', minWidth: 38, textAlign: 'center', color: 'var(--text-main)' }}>
                {zoom}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(160, z + 15))}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={() => setZoom(100)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', marginLeft: 4 }}
                title="Reset Zoom"
              >
                <RotateCcw size={12} />
              </button>
            </div>

            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 4 }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body: Split View */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', flex: 1, overflow: 'hidden' }}>
          {/* Left: Scanned Sheet with Bounding Boxes */}
          <div
            style={{
              padding: 20,
              background: '#070b13',
              borderRight: '1px solid var(--border-subtle)',
              overflow: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: `${(520 * zoom) / 100}px`,
                height: `${(700 * zoom) / 100}px`,
                background: '#ffffff',
                borderRadius: 4,
                boxShadow: '0 8px 30px rgba(0,0,0,0.8)',
                overflow: 'hidden',
                userSelect: 'none',
              }}
            >
              {/* Paper Background with subtle lines */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  opacity: 0.6,
                }}
              />

              {/* Simulated Scanned Handwriting text & boxes */}
              {mockOCRPage1.bounding_boxes.map((box) => {
                const isSelected = box.box_id === activeBoxId;
                return (
                  <div
                    key={box.box_id}
                    onClick={() => setActiveBoxId(box.box_id)}
                    style={{
                      position: 'absolute',
                      left: `${box.coordinates.x}%`,
                      top: `${box.coordinates.y}%`,
                      width: `${box.coordinates.width}%`,
                      height: `${box.coordinates.height}%`,
                      border: isSelected ? '2px solid #ef4444' : '1.5px dashed #0284c7',
                      backgroundColor: isSelected ? 'rgba(239, 68, 68, 0.18)' : 'rgba(2, 132, 199, 0.08)',
                      borderRadius: 3,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 8px',
                      zIndex: isSelected ? 15 : 5,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Comic Sans MS, Caveat, cursive, sans-serif',
                        fontSize: `${(11 * zoom) / 100}px`,
                        color: '#1e293b',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontWeight: 600,
                      }}
                    >
                      {box.detected_text}
                    </span>

                    {/* Bounding box confidence badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: -14,
                        right: 2,
                        background: isSelected ? '#ef4444' : '#0369a1',
                        color: '#fff',
                        fontSize: '0.55rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '1px 4px',
                        borderRadius: 2,
                        fontWeight: 700,
                        pointerEvents: 'none',
                      }}
                    >
                      {Math.round(box.confidence_score * 100)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Detected Tokens & Coordinate Inspector */}
          <div style={{ padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Active Box Card */}
            {activeBox && (
              <div
                className="glass-panel"
                style={{
                  padding: 16,
                  border: '1px solid var(--border-focus)',
                  background: 'rgba(99, 102, 241, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                    Inspected Bounding Box ({activeBox.box_id})
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#34d399',
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    PaddleOCR Confidence: {Math.round(activeBox.confidence_score * 100)}%
                  </span>
                </div>

                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 8, background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  "{activeBox.detected_text}"
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  <div>X: {activeBox.coordinates.x}%</div>
                  <div>Y: {activeBox.coordinates.y}%</div>
                  <div>W: {activeBox.coordinates.width}%</div>
                  <div>H: {activeBox.coordinates.height}%</div>
                </div>
              </div>
            )}

            {/* List of All OCR Lines on this page */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <ScanLine size={14} />
                <span>Extracted Handwriting Segments ({mockOCRPage1.bounding_boxes.length})</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {mockOCRPage1.bounding_boxes.map((b) => {
                  const isSelected = b.box_id === activeBoxId;
                  return (
                    <div
                      key={b.box_id}
                      onClick={() => setActiveBoxId(b.box_id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                          L{b.line_index}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: isSelected ? '#fff' : 'var(--text-muted)' }}>
                          {b.detected_text}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                        {(b.confidence_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
