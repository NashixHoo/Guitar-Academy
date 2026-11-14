import React, { useState } from 'react';
import { Music } from 'lucide-react';
import { VisualArtworkMeta } from '../../data/visualGallery';

interface IllustrativeCardProps {
  artwork: VisualArtworkMeta;
  variant?: 'strip' | 'banner';
  eager?: boolean;
  className?: string;
}

export const IllustrativeCard: React.FC<IllustrativeCardProps> = ({
  artwork,
  variant = 'strip',
  eager = false,
  className = '',
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  if (variant === 'banner') {
    return (
      <figure
        className={`overflow-hidden rounded-2xl border border-[#E8E6E1] dark:border-[#422933] bg-[#F8F7F4] dark:bg-[#1A1216] shadow-xs ${className}`}
      >
        <div className="relative w-full h-40 sm:h-48 overflow-hidden">
          {!imgFailed ? (
            <img
              src={artwork.src}
              alt={artwork.alt}
              loading={eager ? 'eager' : 'lazy'}
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#7B1E2B] via-[#4A0E17] to-[#25252A] flex items-center justify-center">
              <Music className="w-10 h-10 text-white/35" />
            </div>
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#F5C542] block">
              {artwork.eyebrow}
            </span>
            <h3 className="text-sm sm:text-base font-black leading-snug mt-0.5 text-white">
              {artwork.title}
            </h3>
          </div>
        </div>
        <figcaption className="px-4 py-2.5 text-xs text-[#4D4D54] dark:text-[#B8B3C0] font-medium leading-relaxed bg-white/95 dark:bg-[#22141A]">
          {artwork.caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[#E8E6E1] dark:border-[#422933] bg-[#F8F7F4] dark:bg-[#1A1216] flex flex-col sm:flex-row items-stretch shadow-xs ${className}`}
    >
      <div className="relative w-full sm:w-48 md:w-56 h-36 sm:h-auto shrink-0 overflow-hidden bg-[#25252A]">
        {!imgFailed ? (
          <img
            src={artwork.src}
            alt={artwork.alt}
            loading={eager ? 'eager' : 'lazy'}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#7B1E2B] via-[#4A0E17] to-[#25252A] flex items-center justify-center">
            <Music className="w-8 h-8 text-white/40" />
          </div>
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/10 pointer-events-none"
        />
      </div>

      <div className="p-4 flex flex-col justify-center space-y-1 flex-1 min-w-0 bg-white dark:bg-[#22141A]">
        <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#7B1E2B] dark:text-[#FF6B81]">
          {artwork.eyebrow}
        </span>
        <h3 className="text-sm sm:text-base font-black text-[#25252A] dark:text-[#F8F7F4] leading-snug">
          {artwork.title}
        </h3>
        <p className="text-xs text-[#4D4D54] dark:text-[#B8B3C0] leading-relaxed font-medium">
          {artwork.caption}
        </p>
      </div>
    </div>
  );
};
