import React, { useState } from 'react';
import { CourseVisualAssetKey, CourseVisualInfo } from '../../data/courseLessonVisuals';
import { Music } from 'lucide-react';

import violaoPosturaImg from '../../assets/images/violao_acordes_postura_1794685194461.jpg';
import violaoDedilhadoImg from '../../assets/images/violao_dedilhado_pima_1794685195462.jpg';
import violaoPestanaImg from '../../assets/images/violao_pestana_harmonia_1794685196577.jpg';
import guitarraHssImg from '../../assets/images/guitarra_hss_anatomia_1794685196028.jpg';
import guitarraPalhetadaImg from '../../assets/images/guitarra_palhetada_caged_1794685195327.jpg';
import guitarraSoloImg from '../../assets/images/guitarra_solo_bend_1794685197402.jpg';
import baixoPizzicatoImg from '../../assets/images/baixo_pizzicato_groove_1794685196724.jpg';
import baixoSlapImg from '../../assets/images/baixo_slap_braco_1794685197444.jpg';
import tecladoPosturaImg from '../../assets/images/teclado_postura_teclas_1794685198945.jpg';
import tecladoHarmoniaImg from '../../assets/images/teclado_harmonia_voicings_1794685198099.jpg';
import bateriaKitImg from '../../assets/images/bateria_kit_conservatorio_1794685198573.jpg';
import bateriaPegadaImg from '../../assets/images/bateria_pegada_baquetas_1794685198662.jpg';

const ASSET_MAP: Record<CourseVisualAssetKey, string> = {
  'violao-postura': violaoPosturaImg,
  'violao-dedilhado': violaoDedilhadoImg,
  'violao-pestana': violaoPestanaImg,
  'guitarra-hss': guitarraHssImg,
  'guitarra-palhetada': guitarraPalhetadaImg,
  'guitarra-solo': guitarraSoloImg,
  'baixo-pizzicato': baixoPizzicatoImg,
  'baixo-slap': baixoSlapImg,
  'teclado-postura': tecladoPosturaImg,
  'teclado-harmonia': tecladoHarmoniaImg,
  'bateria-kit': bateriaKitImg,
  'bateria-pegada': bateriaPegadaImg,
};

interface CourseVisualBannerProps {
  visual: CourseVisualInfo;
  variant?: 'module' | 'lesson';
}

export const CourseVisualBanner: React.FC<CourseVisualBannerProps> = ({
  visual,
  variant = 'lesson',
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const src = ASSET_MAP[visual.assetKey];

  return (
    <figure className="overflow-hidden rounded-2xl border border-[#E8E6E1] dark:border-[#422933] bg-[#F8F7F4] dark:bg-[#1A1216] shadow-xs">
      <div
        className={`relative w-full overflow-hidden ${
          variant === 'module' ? 'h-44 sm:h-52' : 'h-48 sm:h-56'
        }`}
      >
        {!imgFailed && src ? (
          <img
            src={src}
            alt={visual.alt}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#7B1E2B] via-[#4A0E17] to-[#25252A] flex items-center justify-center">
            <Music className="w-12 h-12 text-white/30" />
          </div>
        )}

        {/* Editorial gradient scrim for crisp contrast on metadata */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none"
        />

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
          <p className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#F5C542]">
            {visual.instrumentLabel} · {visual.focusLabel}
          </p>
          <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug mt-0.5 text-white">
            {visual.title}
          </h3>
        </div>
      </div>

      <figcaption className="px-4 py-3 text-xs text-[#4D4D54] dark:text-[#B8B3C0] font-medium leading-relaxed bg-white/95 dark:bg-[#22141A]">
        {visual.caption}
      </figcaption>
    </figure>
  );
};
