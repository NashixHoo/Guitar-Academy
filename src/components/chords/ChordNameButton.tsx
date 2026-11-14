import React from 'react';
import { useChordModal } from '../../contexts/ChordModalContext';
import { ChordModalTriggerInput } from '../../services/chordLookupService';

interface ChordNameButtonProps {
  chord: ChordModalTriggerInput;
  label?: string;
  variant?: 'inline' | 'chip';
  className?: string;
}

export const ChordNameButton: React.FC<ChordNameButtonProps> = ({
  chord,
  label,
  variant = 'chip',
  className = '',
}) => {
  const { toggleChord, isChordOpen } = useChordModal();
  const displayLabel =
    label ||
    (typeof chord === 'string'
      ? chord
      : chord.symbol || (chord.chordData as any)?.symbol || (chord.chordData as any)?.chord || 'Acorde');
  const open = isChordOpen(chord);

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleChord(chord);
        }}
        title={`Ver diagrama ampliado do acorde ${displayLabel}`}
        className={`inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md font-mono-code font-bold text-[0.92em] transition border cursor-pointer align-baseline ${
          open
            ? 'bg-[#7B1E2B] text-white border-[#7B1E2B]'
            : 'bg-[#F5E8EA] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border-[#E8D3D6] dark:border-[#4D2830] hover:bg-[#7B1E2B] hover:text-white'
        } ${className}`}
      >
        {displayLabel}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleChord(chord);
      }}
      title={`Toque para ver ou fechar o diagrama do acorde ${displayLabel}`}
      className={`inline-flex items-center justify-center min-h-[36px] px-3 py-1.5 rounded-xl border font-mono-code font-black text-sm transition cursor-pointer shadow-2xs ${
        open
          ? 'bg-[#7B1E2B] text-white border-[#7B1E2B]'
          : 'bg-[#F8F7F4] dark:bg-[#1A1216] text-[#7B1E2B] dark:text-[#FF6B81] border-[#D9D9D9] dark:border-[#422933] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] hover:border-[#7B1E2B]'
      } ${className}`}
    >
      {displayLabel}
    </button>
  );
};
