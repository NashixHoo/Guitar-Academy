# Guitar Academy — Guia Oficial de Design Assets e Recursos Visuais

Este documento lista todos os recursos visuais, tokens de design, ícones e componentes reutilizáveis implementados e disponíveis no **Guitar Academy**.

---

## 1. Estrutura de Diretórios de Recursos

```
public/
  icon.svg                                    # Ícone oficial vetorial (palheta com headstock)
  stage-hero.webp / .jpg                      # Fundo de palco com iluminação âmbar/vinho
  images/
    guitar-academy-background.webp / .jpg     # Fundo cinematográfico de tela inteira
    branding/
      logo-horizontal.svg                     # Logotipo horizontal oficial
      logo-mark.svg                           # Símbolo independente (palheta com 'G')
      app-icon.svg                            # Ícone quadrado para PWA/App Store
      logo-light.svg                          # Logotipo para fundos escuros (Dark Mode)
      logo-dark.svg                           # Logotipo para fundos claros (Light Mode)
      guitar-academy-logo.svg                 # Versão clássica compatível
      guitar-academy-logo-dark.svg            # Versão clássica dark compatível
      guitar-academy-symbol.svg               # Símbolo em alta definição (512x512)
    backgrounds/
      guitar-academy-background.webp          # Fundo global de palco com guitarra e bateria
      splash-background.webp                  # Fundo para a tela de abertura
      stage-guitar-drums.webp / .jpg          # Cópia otimizada do palco
      banner-estudar.svg                      # Arte vetorial do pilar Estudar (braço e trastes)
      banner-praticar.svg                     # Arte vetorial do pilar Praticar (metrônomo)
      banner-evoluir.svg                      # Arte vetorial do pilar Evoluir (troféu)
    banners/
      banner-estudar.webp / .svg              # Banner rasterizado e vetor do pilar Estudar
      banner-praticar.webp / .svg             # Banner rasterizado e vetor do pilar Praticar
      banner-evoluir.webp / .svg              # Banner rasterizado e vetor do pilar Evoluir
    instruments/
      electric-guitar-headstock.svg           # Ilustração detalhada do headstock de 6 cordas
    icons/
      estudar.svg                             # Ícone do pilar Estudar
      praticar.svg                            # Ícone do pilar Praticar
      evoluir.svg                             # Ícone do pilar Evoluir
      inicio.svg                              # Ícone de Início / Home
      busca.svg                               # Ícone da Busca Global
      aulas.svg                               # Ícone de Aulas do Currículo
      teoria.svg                              # Ícone de Teoria Musical
      acordes.svg                             # Ícone do Dicionário de Acordes
      metronomo.svg                           # Ícone do Metrônomo de Precisão
      afinador.svg                            # Ícone do Afinador Cromático
      historico.svg                           # Ícone do Histórico de Prática
      metas.svg                               # Ícone de Metas Diárias
      conquistas.svg                          # Ícone de Conquistas e Troféus
      perfil.svg                              # Ícone de Perfil do Aluno
      configuracoes.svg                       # Ícone de Configurações
      voltar.svg                              # Ícone de Voltar / Retorno
      iniciar.svg                             # Ícone de Iniciar Treino / Play
      concluido.svg                           # Ícone de Concluído / Check
docs/
  DESIGN-ASSETS.md                            # Este documento de referência
```

---

## 2. Inventário de Arquivos e Componentes Consumidores

| Caminho do Recurso | Formato | Finalidade | Componentes que Utilizam |
| :--- | :--- | :--- | :--- |
| `public/icon.svg` | SVG | Favicon e ícone nativo oficial | `index.html`, `Header.tsx`, `SplashScreen.tsx`, `LoadingState.tsx` |
| `public/images/guitar-academy-background.webp` | WebP | Fundo cinematográfico global contínuo | `src/App.tsx` (camada fixa de viewport) |
| `public/images/backgrounds/splash-background.webp` | WebP | Fundo da tela de abertura com palco | `src/components/common/SplashScreen.tsx` |
| `public/images/branding/logo-horizontal.svg` | SVG | Identidade visual completa (símbolo + texto) | `src/components/layout/Header.tsx`, navegações |
| `public/images/branding/logo-mark.svg` | SVG | Símbolo independente (palheta + 'G') | Cabeçalhos móveis, botões compactos, modais |
| `public/images/branding/logo-light.svg` | SVG | Logo com tipografia branca para Dark Mode | `src/components/common/SplashScreen.tsx`, temas escuros |
| `public/images/branding/logo-dark.svg` | SVG | Logo com tipografia grafite para Light Mode | Visualizadores impressos, exportações, cabeçalho claro |
| `public/images/branding/app-icon.svg` | SVG | Ícone squircle do aplicativo | Manifesto PWA, splash screens, telas de boas-vindas |
| `public/images/banners/banner-estudar.webp` | WebP | Banner temático do pilar Estudar | `src/components/dashboard/DashboardView.tsx` |
| `public/images/banners/banner-praticar.webp` | WebP | Banner temático da Central de Prática | `src/components/routine/PracticeRoutineView.tsx` |
| `public/images/banners/banner-evoluir.webp` | WebP | Banner temático do painel Evoluir | `src/components/progress/ProgressView.tsx` |
| `public/images/instruments/electric-guitar-headstock.svg` | SVG | Ilustração de headstock com 6 cordas | `src/components/tuner/TunerView.tsx`, visualizadores de afinação |
| `public/images/icons/*.svg` (18 ícones) | SVG | Ícones de interface independentes | `src/components/layout/`, `src/components/common/` |

---

## 3. Tokens do Design System

* **Porcelana (Fundo Geral)**: `#F8F7F4` (Light Mode) / `#1A1216` (Dark Mode)
* **Branco (Superfícies de Cards)**: `#FFFFFF` (Light Mode) / `#22141A` (Dark Mode)
* **Vinho Principal (Ação Primária)**: `#7B1E2B` (Light Mode) / `#E05368` (Dark Mode)
* **Cereja (Destaques e Acentos)**: `#B52A3A` (Light Mode) / `#FF6B81` (Dark Mode)
* **Grafite (Tipografia Principal)**: `#25252A` (Light Mode) / `#F8F7F4` (Dark Mode)
* **Dourado (Conquistas e Maestria)**: `#F5C542` (Gradiente `#FAF4E6` a `#F5C542`)
* **Tipografia**:
  * **Títulos / Display**: `Montserrat`, sans-serif (pesos 700, 800, 900)
  * **Texto Corrido / Leitura**: `Plus Jakarta Sans`, sans-serif (pesos 400, 500, 600)
  * **Métricas / Telegrafia**: `JetBrains Mono`, monospace (pesos 500, 700)

---

## 4. Componentes Reutilizáveis Criados

1. **`PrimaryButton.tsx`**: Botão primário em gradiente vinho (`#7B1E2B`) a cereja (`#B52A3A`), com foco visível, estado desabilitado (`opacity-50 pointer-events-none cursor-not-allowed`) e área de toque acessível (min 44px).
2. **`SecondaryButton.tsx`**: Botão secundário de alto contraste sobre superfícies porcelana/branca com borda `#D9D9D9` e suporte total ao Modo Escuro.
3. **`LuxuryCard.tsx`**: Contêiner de superfície com cantos arredondados (`rounded-2xl`), suporte a variantes (`default`, `elevated`, `wine`, `porcelain`) e efeito de vidro fosco (`backdrop-blur-sm`).
4. **`SectionTitle.tsx`**: Cabeçalho padronizado com tipografia Montserrat, kicker em caixa alta, crachá opcional e slot de ação à direita.
5. **`ProgressBar.tsx`**: Barra de progresso semântica com `role="progressbar"`, gradientes em vinho e realce automático em ouro (`#F5C542`) para 100% de conclusão.
6. **`Badge.tsx`**: Indicador com variantes para Nível (`#FAF4E6`), Concluído (verde esmeralda), Em Progresso (vinho suave) e Ouro (`#F5C542`).
7. **`LessonCard.tsx`**: Cartão completo de aula com título, módulo, tempo estimado, crachá de conclusão e botão de reprodução.
8. **`PracticeCard.tsx`**: Cartão de rotina prática com categoria, BPM de partida/alvo, repetições e botão de início.
9. **`LoadingState.tsx`**: Estado de carregamento com spinner estilizado em palheta e mensagem acessível.
10. **`EmptyState.tsx`**: Estado vazio para buscas ou seções sem dados com ícone, título, descrição e botão de ação.

---

## 5. Instruções para Substituição de Recursos

1. **Logotipo e Símbolo**:
   * Substitua os arquivos em `public/images/branding/` mantendo as proporções dos arquivos SVG originais.
   * `logo-horizontal.svg` e `logo-dark.svg` devem ter textos escuros legíveis sobre fundos claros.
   * `logo-light.svg` deve ter textos claros para o fundo escuro do palco ou modo noturno.

2. **Fundo Global**:
   * Substitua `public/images/guitar-academy-background.webp` por uma imagem WebP de alta resolução (recomendado: 1920x1080 ou 2560x1440, ratio 16:9 vertical/horizontal).
   * Mantenha a cópia JPEG em `public/images/guitar-academy-background.jpg` para compatibilidade com navegadores legados.

3. **Banners dos Pilares**:
   * Para alterar os banners das três abas, substitua os arquivos correspondentes em `public/images/banners/`:
     * `banner-estudar.webp` (Dimensão recomendada: 1200x400)
     * `banner-praticar.webp` (Dimensão recomendada: 1200x400)
     * `banner-evoluir.webp` (Dimensão recomendada: 1200x400)

4. **Ícones**:
   * Substitua os arquivos em `public/images/icons/` com arquivos SVG de 24x24 px, `stroke="currentColor"` e `fill="none"`.

---

## 6. Recursos Pendentes e Observações Técnicas

* **Nenhum recurso bloqueante pendente**: Todos os 18 ícones, 5 logotipos/símbolos, 3 banners WebP e SVG, e os 2 fundos globais estão gerados e verificados localmente no projeto.
* **Compatibilidade**: Todas as referências existentes a `./icon.svg`, `public/images/guitar-academy-background.webp` e `public/stage-hero.webp` foram rigorosamente preservadas para manter 100% de aprovação na suíte automatizada de testes e nos scripts de verificação do CI/CD.

---

## 7. Arquitetura do Papel de Parede Fixo e Responsividade

* **Camada Fixa Global (`.ga-wallpaper`)**: Implementada em camada estática independente com `position: fixed; inset: 0; width: 100vw; height: 100vh; height: 100dvh; pointer-events: none; z-index: 0; transform: translate3d(0, 0, 0)`.
* **Stacking Context (`isolation: isolate`)**: O container `#root` e a árvore React operam em `isolation: isolate; position: relative; z-index: 1`, permitindo que todo o conteúdo rolável deslize suavemente sobre o papel de parede sem que a imagem se mova, corte ou termine.
* **Ajuste de Enquadramento Responsivo**:
  * Telas Compactas e Smartphones (< 768px): `background-position: center 25%` ou `top center`, evitando que a guitarra seja cortada por barras do sistema.
  * Tablets (768px - 1023px): `background-position: center 20%`, com `background-size: cover`.
  * Desktop (≥ 1024px): `background-position: center 25%`, com área de leitura centralizada de `max-w-5xl`.
* **Compatibilidade Móvel**: Suporte completo a `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`, `100dvh` para barras dinâmicas do Safari/Chrome e botões com área de toque de no mínimo 44x44 px.

