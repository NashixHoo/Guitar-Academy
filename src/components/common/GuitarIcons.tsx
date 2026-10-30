import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
}

// -------------------------------------------------------------
// TRIO PRINCIPAL: ESTUDAR, PRATICAR, EVOLUIR
// Geometria calibrada com rigor óptico idêntico, 24x24 viewBox,
// mesmo peso de traço (1.75 padrão) e mesma densidade de massa.
// -------------------------------------------------------------

/**
 * Ícone Estudar — Caderno de estudo musical com pautas e detalhes de cordas/trastes.
 */
export const EstudarIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M3 5.5C3 4.4 3.9 3.5 5 3.5H10.5C11.3 3.5 12 4.2 12 5V19C12 18.2 11.3 17.5 10.5 17.5H5C3.9 17.5 3 18.4 3 19.5V5.5Z" />
    <path d="M21 5.5C21 4.4 20.1 3.5 19 3.5H13.5C12.7 3.5 12 4.2 12 5V19C12 18.2 12.7 17.5 13.5 17.5H19C20.1 17.5 21 18.4 21 19.5V5.5Z" />
    <line x1="5.5" y1="7.5" x2="9.5" y2="7.5" />
    <line x1="5.5" y1="10.5" x2="9.5" y2="10.5" />
    <line x1="5.5" y1="13.5" x2="9.5" y2="13.5" />
    <line x1="14.5" y1="7.5" x2="18.5" y2="7.5" />
    <line x1="14.5" y1="10.5" x2="17" y2="10.5" />
    <circle cx="17.75" cy="13.5" r="1" fill="currentColor" stroke="none" />
    <line x1="18.75" y1="13.5" x2="18.75" y2="10.5" />
  </svg>
);

/**
 * Ícone Praticar — Palheta de guitarra anatômica com pulso rítmico integrado.
 */
export const PraticarIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M12 21.5C8 18 4 12.5 4 7.5C4 4.5 7.5 3 12 3C16.5 3 20 4.5 20 7.5C20 12.5 16 18 12 21.5Z" />
    <path d="M8 10L9.75 7.5L11.5 13.5L13.5 8.5L16 11" />
    <circle cx="12" cy="16.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Ícone Evoluir — Degraus harmônicos da escala ascendente com estrela de conquista no ápice.
 */
export const EvoluirIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M4 19H7.5V15H11.5V11H15.5" />
    <path d="M5 14.5L10 9.5L15 4.5" />
    <path
      d="M19 2.5L19.7 4.3L21.5 5L19.7 5.7L19 7.5L18.3 5.7L16.5 5L18.3 4.3Z"
      fill="currentColor"
      stroke="none"
    />
    <line x1="3.5" y1="21" x2="20.5" y2="21" />
  </svg>
);

// -------------------------------------------------------------
// SISTEMA COMPLETO DE ÍCONES DA FORMAÇÃO MUSICAL
// -------------------------------------------------------------

/**
 * Ícone Início — Portal musical com contorno harmônico e ponte acústica.
 */
export const InicioIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M3.5 10L12 3.5L20.5 10V19.5C20.5 20.3 19.8 21 19 21H5C4.2 21 3.5 20.3 3.5 19.5V10Z" />
    <path d="M9 21V15C9 13.3 10.3 12 12 12C13.7 12 15 13.3 15 15V21" />
    <line x1="8" y1="15" x2="16" y2="15" />
  </svg>
);

/**
 * Ícone Aulas — Método e folha de aula com pautas e notação de estudo.
 */
export const AulasIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M5 3.5H14.5L19 8V20C19 20.8 18.3 21.5 17.5 21.5H5C4.2 21.5 3.5 20.8 3.5 20V5C3.5 4.2 4.2 3.5 5 3.5Z" />
    <path d="M14 3.5V8.5H19" />
    <line x1="7" y1="11.5" x2="13" y2="11.5" />
    <line x1="7" y1="15" x2="11" y2="15" />
    <circle cx="14.5" cy="17" r="1.5" fill="currentColor" stroke="none" />
    <path d="M16 17V12.5H17.5" />
  </svg>
);

/**
 * Ícone Teoria — Círculo de harmonia / quintas com feixe de colcheias teóricas.
 */
export const TeoriaIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M12 21.5C6.75 21.5 2.5 17.25 2.5 12C2.5 7.5 5.6 3.8 9.8 2.8" />
    <path d="M14.2 2.8C18.4 3.8 21.5 7.5 21.5 12C21.5 14.5 20.5 16.8 18.8 18.5" />
    <path d="M8.5 14.5V6.5L16.5 4.5V12.5" />
    <line x1="8.5" y1="9.5" x2="16.5" y2="7.5" />
    <circle cx="6.5" cy="14.5" r="2" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="12.5" r="2" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Ícone Acordes — Diagrama de acorde no braço da guitarra com pestana, trastes e digitações.
 */
export const AcordesIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <line x1="5" y1="4" x2="19" y2="4" strokeWidth={strokeWidth * 1.4} />
    <rect x="5.5" y="4" width="13" height="16.5" rx="1.5" />
    <line x1="5.5" y1="9.5" x2="18.5" y2="9.5" />
    <line x1="5.5" y1="15" x2="18.5" y2="15" />
    <line x1="9.8" y1="4" x2="9.8" y2="20.5" />
    <line x1="14.2" y1="4" x2="14.2" y2="20.5" />
    <circle cx="9.8" cy="12.2" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="14.2" cy="6.8" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="18.5" cy="17.8" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Ícone Metrônomo — Silhueta clássica com pêndulo e contrapeso de tempo.
 */
export const MetronomoIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M7 21L10 3.5H14L17 21Z" />
    <line x1="5" y1="21" x2="19" y2="21" />
    <line x1="12" y1="18.5" x2="16.5" y2="5.5" />
    <circle cx="15.2" cy="9.2" r="1.8" fill="currentColor" stroke="none" />
    <line x1="10" y1="13" x2="14" y2="13" />
  </svg>
);

/**
 * Ícone Afinador — Cabeçote (headstock) com 6 tarraxas e vibração acústica.
 */
export const AfinadorIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M8 21.5V9.5C8 8 9 6.2 10 5.2L12 3.5L14 5.2C15 6.2 16 8 16 9.5V21.5" />
    <line x1="5.5" y1="8" x2="8" y2="8" />
    <line x1="5.5" y1="13" x2="8" y2="13" />
    <line x1="5.5" y1="18" x2="8" y2="18" />
    <line x1="16" y1="8" x2="18.5" y2="8" />
    <line x1="16" y1="13" x2="18.5" y2="13" />
    <line x1="16" y1="18" x2="18.5" y2="18" />
    <circle cx="4" cy="8" r="1.25" fill="currentColor" stroke="none" />
    <circle cx="4" cy="13" r="1.25" fill="currentColor" stroke="none" />
    <circle cx="4" cy="18" r="1.25" fill="currentColor" stroke="none" />
    <circle cx="20" cy="8" r="1.25" fill="currentColor" stroke="none" />
    <circle cx="20" cy="13" r="1.25" fill="currentColor" stroke="none" />
    <circle cx="20" cy="18" r="1.25" fill="currentColor" stroke="none" />
    <path d="M10 2C11 1.2 13 1.2 14 2" />
  </svg>
);

/**
 * Ícone Histórico — Cronômetro de prática com linha do tempo circular.
 */
export const HistoricoIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M3.5 12C3.5 16.7 7.3 20.5 12 20.5C16.7 20.5 20.5 16.7 20.5 12C20.5 7.3 16.7 3.5 12 3.5C8.8 3.5 6 5.2 4.5 7.8" />
    <polyline points="2.5 7 5 8 5.5 4.5" />
    <polyline points="12 7.5 12 12.5 15.5 14.5" />
    <circle cx="12" cy="12.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Ícone Metas — Alvo de treinamento concêntrico com miras cardeais.
 */
export const MetasIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5.25" />
    <circle cx="12" cy="12" r="1.75" fill="currentColor" stroke="none" />
    <line x1="12" y1="2" x2="12" y2="4.5" />
    <line x1="12" y1="19.5" x2="12" y2="22" />
    <line x1="2" y1="12" x2="4.5" y2="12" />
    <line x1="19.5" y1="12" x2="22" y2="12" />
  </svg>
);

/**
 * Ícone Conquistas — Troféu refinado com alças em lira e insígnia estrelada.
 */
export const ConquistasIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M7 4H17V10C17 13 14.8 15.5 12 15.5C9.2 15.5 7 13 7 10V4Z" />
    <path d="M7 6C4.8 6 4 8.5 5.5 11C6.2 12 7 12.5 7 12.5" />
    <path d="M17 6C19.2 6 20 8.5 18.5 11C17.8 12 17 12.5 17 12.5" />
    <line x1="12" y1="15.5" x2="12" y2="18.5" />
    <path d="M8.5 21H15.5" />
    <path d="M9.5 18.5H14.5" />
    <path
      d="M12 6.5L12.5 7.8L13.8 8L12.8 9L13.1 10.3L12 9.6L10.9 10.3L11.2 9L10.2 8L11.5 7.8Z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

/**
 * Ícone Perfil — Músico minimalista com correia de guitarra.
 */
export const PerfilIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="7.5" r="4" />
    <path d="M4.5 20.5C4.5 16.5 7.8 14 12 14C16.2 14 19.5 16.5 19.5 20.5" />
    <line x1="8" y1="20.5" x2="15.5" y2="14.5" strokeDasharray="1.5 2" />
  </svg>
);

/**
 * Ícone Busca — Lente ótica de alta precisão com reflexo curvado.
 */
export const BuscaIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <circle cx="10.5" cy="10.5" r="7" />
    <path d="M15.5 15.5L20.5 20.5" />
    <path d="M7.8 7.8C8.5 7.1 9.5 6.7 10.5 6.7" />
  </svg>
);

/**
 * Ícone Configurações — Engrenagem mecânica calibrada de 6 dentes chanfrados.
 */
export const ConfiguracoesIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M10.3 3.2C10.6 2.5 11.3 2 12 2C12.7 2 13.4 2.5 13.7 3.2L14.2 4.3C14.7 4.5 15.2 4.8 15.6 5.1L16.8 4.7C17.5 4.5 18.3 4.8 18.7 5.4C19.1 6 19.1 6.8 18.8 7.5L18.1 8.5C18.3 9 18.5 9.5 18.6 10L19.8 10.3C20.5 10.5 21 11.2 21 12C21 12.8 20.5 13.5 19.8 13.7L18.6 14C18.5 14.5 18.3 15 18.1 15.5L18.8 16.5C19.1 17.2 19.1 18 18.7 18.6C18.3 19.2 17.5 19.5 16.8 19.3L15.6 18.9C15.2 19.2 14.7 19.5 14.2 19.7L13.7 20.8C13.4 21.5 12.7 22 12 22C11.3 22 10.6 21.5 10.3 20.8L9.8 19.7C9.3 19.5 8.8 19.2 8.4 18.9L7.2 19.3C6.5 19.5 5.7 19.2 5.3 18.6C4.9 18 4.9 17.2 5.2 16.5L5.9 15.5C5.7 15 5.5 14.5 5.4 14L4.2 13.7C3.5 13.5 3 12.8 3 12C3 11.2 3.5 10.5 4.2 10.3L5.4 10C5.5 9.5 5.7 9 5.9 8.5L5.2 7.5C4.9 6.8 4.9 6 5.3 5.4C5.7 4.8 6.5 4.5 7.2 4.7L8.4 5.1C8.8 4.8 9.3 4.5 9.8 4.3L10.3 3.2Z" />
  </svg>
);

/**
 * Ícone Voltar — Seta de retorno com desenho de alta precisão.
 */
export const VoltarIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="11 6 5 12 11 18" />
  </svg>
);

/**
 * Ícone Iniciar / Reproduzir — Triângulo dinâmico com vértices suavizados.
 */
export const IniciarIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path
      d="M6.5 4.8C6.5 3.9 7.4 3.4 8.2 3.9L18.8 11.1C19.5 11.5 19.5 12.5 18.8 12.9L8.2 20.1C7.4 20.6 6.5 20.1 6.5 19.2V4.8Z"
      fill="currentColor"
      fillOpacity={0.15}
    />
  </svg>
);

/**
 * Ícone Pausar — Barras duplas com espaçamento harmônico.
 */
export const PausarIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <rect x="6.5" y="4.5" width="3.5" height="15" rx="1.5" fill="currentColor" fillOpacity={0.15} />
    <rect x="14" y="4.5" width="3.5" height="15" rx="1.5" fill="currentColor" fillOpacity={0.15} />
  </svg>
);

/**
 * Ícone Concluído — Selo circular com visto de confirmação.
 */
export const ConcluidoIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.2L10.8 15L16.2 9" />
  </svg>
);

/**
 * Ícone Notificações — Sino acústico com ressonância.
 */
export const NotificacaoIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M6 17H18L16.8 14C16.3 12.8 16 11.4 16 10C16 7.8 14.2 6 12 6C9.8 6 8 7.8 8 10C8 11.4 7.7 12.8 7.2 14Z" />
    <path d="M10.5 4C10.8 3.4 11.4 3 12 3C12.6 3 13.2 3.4 13.5 4" />
    <path d="M10 19C10.3 20.2 11 21 12 21C13 21 13.7 20.2 14 19" />
  </svg>
);

// -------------------------------------------------------------
// ÍCONES DE MÓDULOS ESPECÍFICOS DO GUITAR ACADEMY
// -------------------------------------------------------------

/**
 * Ícone Braço da Guitarra (Fretboard)
 */
export const BracoGuitarraIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <rect x="3" y="7" width="18" height="10" rx="1.5" />
    <line x1="7" y1="7" x2="7" y2="17" />
    <line x1="11" y1="7" x2="11" y2="17" />
    <line x1="15" y1="7" x2="15" y2="17" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="3" y1="14" x2="21" y2="14" />
    <circle cx="13" cy="12" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Ícone Biblioteca de Estudos
 */
export const BibliotecaIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" />
    <path d="M12 2V9L14.5 7L17 9V2" />
  </svg>
);

/**
 * Ícone Leitura Musical
 */
export const LeituraIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M9 18V5L20 3V16" />
    <circle cx="6" cy="18" r="3" fill="currentColor" stroke="none" />
    <circle cx="17" cy="16" r="3" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Ícone Treino Auditivo (Ouvido)
 */
export const OuvidoIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M3 14H5C6.1 14 7 14.9 7 16V18C7 19.1 6.1 20 5 20H3V14Z" />
    <path d="M21 14H19C17.9 14 17 14.9 17 16V18C17 19.1 17.9 20 19 20H21V14Z" />
    <path d="M5 14V10C5 6.1 8.1 3 12 3C15.9 3 19 6.1 19 10V14" />
    <path d="M10 11C10 9.9 10.9 9 12 9C13.1 9 14 9.9 14 11" />
  </svg>
);

/**
 * Ícone Técnica & Exercícios
 */
export const TecnicaIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

/**
 * Ícone Coach (Guitar Coach)
 */
export const CoachIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity={0.15} />
  </svg>
);

/**
 * Ícone Professor IA
 */
export const ProfessorAIIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path
      d="M12 2.5L13.2 6.8C13.5 7.9 14.1 8.5 15.2 8.8L19.5 10L15.2 11.2C14.1 11.5 13.5 12.1 13.2 13.2L12 17.5L10.8 13.2C10.5 12.1 9.9 11.5 8.8 11.2L4.5 10L8.8 8.8C9.9 8.5 10.5 7.9 10.8 6.8L12 2.5Z"
      fill="currentColor"
      fillOpacity={0.18}
    />
    <path
      d="M19 16L19.5 17.7L21.2 18.2L19.5 18.7L19 20.4L18.5 18.7L16.8 18.2L18.5 17.7L19 16Z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

/**
 * Ícone Diagnóstico do Sistema
 */
export const DiagnosticoIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M12 22S4 18 4 11V5L12 2L20 5V11C20 18 12 22 12 22Z" />
    <path d="M9 12L11 14L15 9" />
  </svg>
);

// -------------------------------------------------------------
// CATÁLOGO E DESPACHANTE CENTRALIZADO
// -------------------------------------------------------------

export type GuitarIconName =
  | 'estudar'
  | 'praticar'
  | 'evoluir'
  | 'inicio'
  | 'aulas'
  | 'teoria'
  | 'acordes'
  | 'metronomo'
  | 'afinador'
  | 'historico'
  | 'metas'
  | 'conquistas'
  | 'perfil'
  | 'busca'
  | 'configuracoes'
  | 'voltar'
  | 'iniciar'
  | 'pausar'
  | 'concluido'
  | 'notificacoes'
  | 'fretboard'
  | 'library'
  | 'reading'
  | 'ear-training'
  | 'technique'
  | 'coach'
  | 'professor-ai'
  | 'diagnostics';

export const GUITAR_ICONS_MAP: Record<GuitarIconName, React.FC<IconProps>> = {
  estudar: EstudarIcon,
  praticar: PraticarIcon,
  evoluir: EvoluirIcon,
  inicio: InicioIcon,
  aulas: AulasIcon,
  teoria: TeoriaIcon,
  acordes: AcordesIcon,
  metronomo: MetronomoIcon,
  afinador: AfinadorIcon,
  historico: HistoricoIcon,
  metas: MetasIcon,
  conquistas: ConquistasIcon,
  perfil: PerfilIcon,
  busca: BuscaIcon,
  configuracoes: ConfiguracoesIcon,
  voltar: VoltarIcon,
  iniciar: IniciarIcon,
  pausar: PausarIcon,
  concluido: ConcluidoIcon,
  notificacoes: NotificacaoIcon,
  fretboard: BracoGuitarraIcon,
  library: BibliotecaIcon,
  reading: LeituraIcon,
  'ear-training': OuvidoIcon,
  technique: TecnicaIcon,
  coach: CoachIcon,
  'professor-ai': ProfessorAIIcon,
  diagnostics: DiagnosticoIcon,
};

export interface GuitarIconProps extends IconProps {
  name: GuitarIconName;
}

/**
 * Componente despachante genérico para o sistema de ícones Guitar Academy.
 */
export const GuitarIcon: React.FC<GuitarIconProps> = ({ name, ...props }) => {
  const Component = GUITAR_ICONS_MAP[name];
  if (!Component) {
    return null;
  }
  return <Component {...props} />;
};
