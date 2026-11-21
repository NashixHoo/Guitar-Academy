import React, { useState } from 'react';
import { CourseVisualInfo } from '../../data/courseLessonVisuals';
import { CourseVisualBanner } from './CourseVisualBanner';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Compass, ShieldCheck } from 'lucide-react';

interface LessonVisualGuideProps {
  visual: CourseVisualInfo;
  instrumentType?: 'violao' | 'guitarra' | 'baixo' | 'teclado' | 'bateria';
  lessonTopic?: string;
}

export const LessonVisualGuide: React.FC<LessonVisualGuideProps> = ({
  visual,
  instrumentType = 'guitarra',
  lessonTopic = '',
}) => {
  const [showComparison, setShowComparison] = useState<boolean>(false);

  // Determine instrument-specific technique details
  const getTechniqueDetails = () => {
    switch (visual.assetKey) {
      case 'violao-postura':
        return {
          steps: [
            'Apoie o corpo do violão na perna direita (ou esquerda com banqueta de apoio).',
            'Mantenha a coluna ereta e os ombros relaxados, sem curvar o pescoço sobre a escala.',
            'Arqueie os dedos da mão esquerda formando um túnel sobre os trastes.',
          ],
          correctTip: 'Dedos pontiagudos pressionando próximo ao traste metálico, polegar centrado atrás do braço.',
          incorrectTip: 'Polegar pendurado por cima do braço (tensão no pulso), dedos deitado abafando as cordas vizinhas.',
        };
      case 'violao-dedilhado':
        return {
          steps: [
            'Posicione o polegar (p) nos bordões (6ª, 5ª e 4ª cordas) com movimento independente.',
            'Posicione os dedos indicador (i), médio (m) e anelar (a) nas cordas 3ª, 2ª e 1ª respectivamente.',
            'Execute o toque apoiado ou tirado com leve inclinação do pulso sobre a roseta.',
          ],
          correctTip: 'Articulação a partir da segunda falange, mantendo o som limpo sem ruído de unhas batendo.',
          incorrectTip: 'Mão muito colada ao tampo ou puxando as cordas para cima (gerando estalos indesejados).',
        };
      case 'violao-pestana':
        return {
          steps: [
            'Utilize a lateral óssea do dedo indicador (1) ligeiramente tombada para trás.',
            'Posicione o dedo indicador bem rente ao traste metálico para exigir menos força.',
            'Reforce a pinça com o polegar atrás do braço na mesma direção do indicador.',
          ],
          correctTip: 'Todas as cordas soam limpas sem trastejar, mesmo nas cordas centrais (3ª e 4ª).',
          incorrectTip: 'Dedo totalmente plano e apoiado no meio do traste, exigindo força excessiva e fadiga imediata.',
        };
      case 'guitarra-hss':
        return {
          steps: [
            'Identifique a seletora de captadores: braço (som quente/grave), meio e ponte (som agudo/ardido).',
            'Ajuste o ganho (gain) e o volume do amplificador ou interface para obter o sustain desejado.',
            'Verifique a afinação das 6 cordas utilizando o afinador de referência.',
          ],
          correctTip: 'Controle dinâmico da mão direita definindo limpo ou saturado com clareza.',
          incorrectTip: 'Excesso de ganho mascarando erros de articulação e gerando microfonia.',
        };
      case 'guitarra-palhetada':
        return {
          steps: [
            'Segure a palheta entre o polegar e a lateral da primeira falange do indicador (pinça firme).',
            'Incline a palheta em cerca de 45 graus em relação à corda para garantir ataque fluído.',
            'Alterne rigorosamente os movimentos para baixo (downstroke) e para cima (upstroke).',
          ],
          correctTip: 'Palheta percorre o mínimo espaço necessário sobre a corda, mantendo velocidade e constância.',
          incorrectTip: 'Empunhadura frouxa fazendo a palheta girar nos dedos ou ataque vertical travado.',
        };
      case 'guitarra-solo':
        return {
          steps: [
            'Utilize o dedo 3 (ou 2+3 reforçados) para executar bends precisos de 1 tom ou semitom.',
            'Empurre a corda para cima usando o peso do punho e o antebraço como alavanca.',
            'Execute o vibrato oscilando a tensão da corda com controle de afinação milimétrica.',
          ],
          correctTip: 'Nota alvo do bend atinge exatamente a afinação da casa superior sem desafinar.',
          incorrectTip: 'Bend curto (falso) ou força excessiva com o dedo isolado sem apoio dos adjacentes.',
        };
      case 'baixo-pizzicato':
        return {
          steps: [
            'Ancore o polegar no captador ou na corda superior (ex: 4ª corda) para estabilidade.',
            'Alterne os dedos indicador (i) e médio (m) com ataques firmes e paralelos ao corpo.',
            'Abafe as cordas graves não utilizadas com a lateral da mão ou dedos inativos.',
          ],
          correctTip: 'Timbre encorpado e homogêneo em todas as notas, sem oscilação de volume.',
          incorrectTip: 'Uso de um dedo só (velocidade limitada) ou unhas tocando diretamente as cordas.',
        };
      case 'baixo-slap':
        return {
          steps: [
            'Ataque a corda grave (E/A) com o lado lateral do polegar (slap) gerando som percussivo.',
            'Puxe a corda aguda (G/D) com o indicador ou médio (pop) para estalar.',
            'Mantenha o tempo rigorosamente no metrônomo (pocket rítmico).',
          ],
          correctTip: 'Contraste limpo entre o grave percussivo e o agudo estalado.',
          incorrectTip: 'Bater no braço em vez da pestana da ponte ou puxar forte demais gerando distorção.',
        };
      case 'teclado-postura':
        return {
          steps: [
            'Sente-se na metade dianteira do banco com os pés firmes no chão.',
            'Mantenha os cotovelos alinhados com a altura das teclas, punhos flexíveis e livres.',
            'Curve levemente os dedos como se segurasse uma pequena esfera invisível.',
          ],
          correctTip: 'Peso do braço transmitido naturalmente pelas pontas dos dedos.',
          incorrectTip: 'Punhos caídos abaixo do nível das teclas ou dedos esticados (tensão no túnel do carpo).',
        };
      case 'teclado-harmonia':
        return {
          steps: [
            'Distribua a fundamental na mão esquerda e as vozes do acorde (3ª, 7ª, 9ª) na mão direita.',
            'Conecte acordes mantendo notas comuns (voicings suaves).',
            'Pratique as inversões para eliminar saltos bruscos entre as posições.',
          ],
          correctTip: 'Progressão fluida com transições suaves e equilíbrio sonoro entre as vozes.',
          incorrectTip: 'Saltos desconexos com todas as vozes subindo e descendo juntas em bloco.',
        };
      case 'bateria-kit':
        return {
          steps: [
            'Ajuste a altura do banco para que as coxas fiquem paralelas ao chão.',
            'Posicione chimbal, caixa e tons em arcos naturais de alcance dos braços.',
            'Mantenha o calcanhar apoiado ou na técnica heel-down/heel-up conforme a dinâmica.',
          ],
          correctTip: 'Independência relaxada dos quatro membros com postura ergonômica.',
          incorrectTip: 'Bateria muito distante exigindo esticar os braços ou postura corcunda.',
        };
      case 'bateria-pegada':
        return {
          steps: [
            'Encontre o ponto de fulcro (equilíbrio) entre o polegar e a primeira falange do indicador.',
            'Deixe os dedos restantes envolverem o corpo da baqueta com leveza (matched grip).',
            'Permita que a baqueta rebote livremente após o impacto na pele.',
          ],
          correctTip: 'Rebote natural fluido, aproveitando a elasticidade da pele da caixa.',
          incorrectTip: 'Aperto excessivo (death grip) que trava o rebote e causa fadiga muscular imediata.',
        };
      default:
        return {
          steps: [
            'Observe atentamente o diagrama visual e a posição recomendada.',
            'Execute o exercício de forma lenta e progressiva antes de subir o andamento.',
            'Utilize o metrônomo e o afinador para garantir precisão.',
          ],
          correctTip: 'Execução limpa, relaxada e no tempo.',
          incorrectTip: 'Tensão muscular e pressa antes da assimilação motora.',
        };
    }
  };

  const details = getTechniqueDetails();

  return (
    <div className="bg-white dark:bg-[#22141A] border border-[#D9D9D9] dark:border-[#422933] rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[#F5E8EA] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81]">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#7B1E2B] dark:text-[#FF6B81] block">
              Guia Visual Didático Integrado
            </span>
            <h4 className="text-base font-black text-[#25252A] dark:text-[#F8F7F4]">
              {visual.title}
            </h4>
          </div>
        </div>

        <button
          onClick={() => setShowComparison(!showComparison)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
            showComparison
              ? 'bg-[#7B1E2B] text-white border-[#7B1E2B]'
              : 'bg-[#F8F7F4] dark:bg-[#1A1216] text-[#7B1E2B] dark:text-[#FF6B81] border-[#D9D9D9] dark:border-[#422933]'
          }`}
        >
          {showComparison ? 'Ocultar Comparação Correto vs Incorreto' : 'Comparar Correto vs Incorreto'}
        </button>
      </div>

      {/* Visual Banner Component */}
      <CourseVisualBanner visual={visual} variant="module" />

      {/* Steps List */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-[#7B1E2B] dark:text-[#FF6B81] uppercase tracking-wider block font-mono-code">
          Etapas de Execução Recomendada:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {details.steps.map((step, sIdx) => (
            <div
              key={`guide-step-${sIdx}`}
              className="bg-[#F8F7F4] dark:bg-[#1A1216] p-3.5 rounded-2xl border border-[#D9D9D9] dark:border-[#422933] space-y-1"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#7B1E2B] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  {sIdx + 1}
                </span>
                <span className="text-xs font-bold text-[#25252A] dark:text-[#F8F7F4]">Passo {sIdx + 1}</span>
              </div>
              <p className="text-xs text-[#4D4D54] dark:text-[#B8B3C0] font-medium leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Correct vs Incorrect Comparison Card */}
      {showComparison && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Correct */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Execução Correta & Recomendada</span>
            </div>
            <p className="text-xs text-emerald-900 dark:text-emerald-300 font-medium leading-relaxed">
              {details.correctTip}
            </p>
          </div>

          {/* Incorrect */}
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Erro Comum a Evitar</span>
            </div>
            <p className="text-xs text-rose-900 dark:text-rose-300 font-medium leading-relaxed">
              {details.incorrectTip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
