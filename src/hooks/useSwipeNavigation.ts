import { useRef, useCallback, TouchEvent } from 'react';
import { PrimaryTab, navigationService } from '../services/navigationService';

interface UseSwipeNavigationOptions {
  currentPrimaryTab: PrimaryTab;
  onNavigatePrimaryTab: (nextTab: PrimaryTab) => void;
  enabled?: boolean;
}

export function useSwipeNavigation({
  currentPrimaryTab,
  onNavigatePrimaryTab,
  enabled = true,
}: UseSwipeNavigationOptions) {
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const isGestureValidRef = useRef<boolean>(false);

  // Verifica se o elemento tocado é interativo ou possui rolagem interna
  const isInteractiveElement = (target: HTMLElement | null): boolean => {
    if (!target) return false;

    // Elementos nativos de entrada e botões
    const tagName = target.tagName.toLowerCase();
    if (['input', 'textarea', 'button', 'select', 'a', 'video', 'audio'].includes(tagName)) {
      return true;
    }

    // Sliders e controles de range / metrônomo / áudio
    if (
      target.getAttribute('role') === 'slider' ||
      target.getAttribute('type') === 'range' ||
      target.closest('input[type="range"]') ||
      target.closest('[role="slider"]')
    ) {
      return true;
    }

    // Elementos com classe de exclusão de gesto (ex: braço interativo, afinador, diagramas de acorde)
    if (
      target.closest('.no-swipe') ||
      target.closest('.interactive-fretboard') ||
      target.closest('[data-no-swipe="true"]') ||
      target.closest('.interactive-diagram')
    ) {
      return true;
    }

    // Contêineres com rolagem horizontal interna legítima
    let parent: HTMLElement | null = target;
    while (parent && parent !== document.body) {
      const overflowX = window.getComputedStyle(parent).overflowX;
      if (
        (overflowX === 'auto' || overflowX === 'scroll') &&
        parent.scrollWidth > parent.clientWidth + 10
      ) {
        return true;
      }
      parent = parent.parentElement;
    }

    return false;
  };

  const handleTouchStart = useCallback(
    (e: TouchEvent<HTMLElement>) => {
      if (!enabled) return;

      // Respeitar prefers-reduced-motion
      if (
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return;
      }

      // Apenas toques com 1 único dedo
      if (e.touches.length !== 1) {
        isGestureValidRef.current = false;
        return;
      }

      const touch = e.touches[0];
      const clientX = touch.clientX;
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400;

      // Respeitar gestos nativos de borda do iOS (margem de segurança de 24px nas bordas)
      if (clientX < 24 || clientX > screenWidth - 24) {
        isGestureValidRef.current = false;
        return;
      }

      // Verificar se o toque ocorreu sobre controles interativos
      const target = e.target as HTMLElement | null;
      if (isInteractiveElement(target)) {
        isGestureValidRef.current = false;
        return;
      }

      startXRef.current = touch.clientX;
      startYRef.current = touch.clientY;
      startTimeRef.current = Date.now();
      isGestureValidRef.current = true;
    },
    [enabled]
  );

  const handleTouchMove = useCallback((e: TouchEvent<HTMLElement>) => {
    if (!isGestureValidRef.current || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const dx = touch.clientX - startXRef.current;
    const dy = touch.clientY - startYRef.current;

    // Se o movimento vertical for predominante, cancela o gesto lateral para permitir rolagem normal suave da página
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 15) {
      isGestureValidRef.current = false;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent<HTMLElement>) => {
      if (!isGestureValidRef.current) return;
      isGestureValidRef.current = false;

      if (e.changedTouches.length === 0) return;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - startXRef.current;
      const dy = touch.clientY - startYRef.current;
      const dt = Date.now() - startTimeRef.current;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      // Não interpretar rolagem vertical como gesto lateral (proporção mínima horizontal > 1.6x vertical)
      if (absX < 1.6 * absY) {
        return;
      }

      // Limiar de distância (mínimo 50px) e velocidade (pelo menos 0.30 px/ms para swipe rápido)
      const velocity = absX / Math.max(dt, 1);
      const isDistanceMet = absX >= 55;
      const isFastFlick = absX >= 40 && velocity > 0.38;

      if (!isDistanceMet && !isFastFlick) {
        return;
      }

      // Deslizar para a esquerda (dx < 0): Próxima aba (Estudar -> Praticar -> Evoluir)
      if (dx < 0) {
        const next = navigationService.getNextPrimaryTab(currentPrimaryTab);
        if (next) {
          onNavigatePrimaryTab(next);
        }
      } 
      // Deslizar para a direita (dx > 0): Aba anterior (Evoluir -> Praticar -> Estudar)
      else if (dx > 0) {
        const prev = navigationService.getPreviousPrimaryTab(currentPrimaryTab);
        if (prev) {
          onNavigatePrimaryTab(prev);
        }
      }
    },
    [currentPrimaryTab, onNavigatePrimaryTab]
  );

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
