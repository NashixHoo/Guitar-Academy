import React, { useState, useEffect, useRef } from 'react';
import {
  UserProgress,
  NavigationTab,
  ProfessorMessage,
  ProfessorExercise,
  ProfessorEvaluation,
  ProfessorRecommendation,
  LevelInfo,
  Lesson,
  SkillCategory,
  SkillProfile,
  MasteryLevel,
  AdaptiveRecommendation,
} from '../../types';
import { professorService, ProfessorStatus } from '../../services/professorService';
import { storageService } from '../../services/storageService';
import { CURRICULUM_LEVELS } from '../../data/curriculum';
import {
  createInitialPedagogicalProfile,
  recordSkillEvidence,
  getAdaptiveRecommendation,
  CANONICAL_SKILLS,
} from '../../pedagogy/adaptiveEngine';
import {
  Sparkles,
  Send,
  HelpCircle,
  Award,
  BookOpen,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Zap,
  Target,
  GraduationCap,
  ListOrdered,
  History,
  ShieldCheck,
  Compass,
  RotateCcw,
  Layers,
  Calendar,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react';

interface ProfessorAiViewProps {
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

const LOCAL_FALLBACK_EXERCISES: Record<string, ProfessorExercise> = {
  'afina': {
    question: 'Qual é a sequência canônica de afinação padrão da guitarra, da 6ª corda (mais grave) para a 1ª corda (mais aguda)?',
    options: ['E - A - D - G - B - E', 'E - B - G - D - A - E', 'D - G - C - F - A - D', 'E - A - D - F# - B - E'],
    correctIndex: 0,
    explanation: 'A afinação padrão (Standard Tuning) é Mi (6ª), Lá (5ª), Ré (4ª), Sol (3ª), Si (2ª) e Mi (1ª).',
    skillEvaluated: 'Afinação Padrão e Cordas (E-A-D-G-B-E)',
  },
  'harmonia': {
    question: 'Quais notas formam a tríade de Dó Maior (C) e qual é a sua fórmula intervalar fundamental?',
    options: ['C, E, G (Tônica, 3ª Maior, 5ª Justa)', 'C, Eb, G (Tônica, 3ª Menor, 5ª Justa)', 'C, E, G# (Tônica, 3ª Maior, 5ª Aumentada)', 'C, F, G (Tônica, 4ª Justa, 5ª Justa)'],
    correctIndex: 0,
    explanation: 'A tríade maior é formada por Tônica (1), 3ª Maior (2 tons) e 5ª Justa (3,5 tons): C - E - G.',
    skillEvaluated: 'Formação de Tríades e Harmonia',
  },
  'caged': {
    question: 'No Sistema CAGED, ao montar o acorde de C Maior na 5ª casa utilizando o shape derivado de Lá (A), onde repousa a tônica principal?',
    options: ['5ª corda (Lá) na 3ª casa', '6ª corda (Mi) na 5ª casa', '4ª corda (Ré) na 3ª casa', '3ª corda (Sol) na 5ª casa'],
    correctIndex: 0,
    explanation: 'O formato do shape de Lá tem sua tônica na 5ª corda. Ao transportar a pestana para a casa 3 da 5ª corda (nota C), formamos C Maior.',
    skillEvaluated: 'Sistema CAGED e Shapes de Guitarra',
  },
  'tétrade': {
    question: 'Qual é a diferença intervalar crucial entre um acorde com sétima maior (ex: Cmaj7) e um acorde com sétima dominante (ex: C7)?',
    options: [
      'Cmaj7 possui 7ª maior (11 semitons), enquanto C7 possui 7ª menor (10 semitons)',
      'C7 possui 7ª maior e Cmaj7 possui 7ª diminuta',
      'Cmaj7 não tem quinta justa na sua formação',
      'Ambos possuem rigorosamente os mesmos intervalos'
    ],
    correctIndex: 0,
    explanation: 'Cmaj7 (C - E - G - B) possui sétima maior (B). Já C7 (C - E - G - Bb) possui sétima menor (Bb), sendo a sétima menor responsável pela tensão dominante.',
    skillEvaluated: 'Formação de Tétrades e Sétimas',
  },
  'pentat': {
    question: 'Quais graus compõem a fórmula intervalar da Escala Pentatônica Menor a partir da tônica?',
    options: ['1, b3, 4, 5, b7', '1, 2, 3, 5, 6', '1, b3, 4, b5, 5, b7', '1, 3, 4, 5, 7'],
    correctIndex: 0,
    explanation: 'A Pentatônica Menor é formada por 5 notas: Tônica (1), Terça Menor (b3), Quarta Justa (4), Quinta Justa (5) e Sétima Menor (b7).',
    skillEvaluated: 'Escala Pentatônica e Aplicação Solo',
  },
  'cifra': {
    question: 'Se uma progressão está em Sol Maior (G) com a sequência G - Em - C - D, quais serão os acordes ao transpor 1 tom acima (Lá Maior - A)?',
    options: ['A - F#m - D - E', 'A - Fm - Dm - E', 'A - Bm - D - E', 'B - G#m - E - F#'],
    correctIndex: 0,
    explanation: 'Transpondo 1 tom acima (2 semitons): G vira A (I), Em vira F#m (vi), C vira D (IV) e D vira E (V).',
    skillEvaluated: 'Leitura de Cifras e Transposição',
  },
};

export const ProfessorAiView: React.FC<ProfessorAiViewProps> = ({
  progress,
  onUpdateProgress,
  onNavigateTab,
}) => {
  // Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'exercise' | 'skills' | 'recommendation'>('chat');

  // Backend Status
  const [status, setStatus] = useState<ProfessorStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  // Chat State
  const [messages, setMessages] = useState<ProfessorMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        'Olá! Eu sou o **Professor IA** do Guitar Academy. Estou aqui para tirar suas dúvidas de harmonia, técnica biomecânica e ajudar na sua formação musical do zero ao avançado. Como posso ajudar seu treino hoje?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedAction: {
        label: 'Ver Currículo Canônico',
        tab: 'curriculum',
      },
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Exercise State
  const [selectedLevel, setSelectedLevel] = useState<number>(progress.studyPlan?.selectedLevel ?? 0);
  const [selectedTopic, setSelectedTopic] = useState<string>('Harmonia e Tríades');
  const [currentExercise, setCurrentExercise] = useState<ProfessorExercise | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [exerciseEvaluation, setExerciseEvaluation] = useState<ProfessorEvaluation | null>(null);
  const [isGeneratingExercise, setIsGeneratingExercise] = useState(false);
  const [isEvaluatingExercise, setIsEvaluatingExercise] = useState(false);

  // Recommendation State
  const [recommendation, setRecommendation] = useState<ProfessorRecommendation | null>(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);

  // Skills & Pedagogical Profile Management (Fase 3)
  const [newDifficultyInput, setNewDifficultyInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
  const [selectedSkillForEvidences, setSelectedSkillForEvidences] = useState<SkillProfile | null>(null);

  const pedagogicalProfile = progress.pedagogicalProfile || createInitialPedagogicalProfile();
  const deterministicRec = getAdaptiveRecommendation(pedagogicalProfile, progress);

  // Check backend status on mount
  useEffect(() => {
    let isMounted = true;
    professorService.checkStatus().then((s) => {
      if (isMounted) {
        setStatus(s);
        setStatusLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  // Current Lesson Info
  const currentLesson =
    CURRICULUM_LEVELS.flatMap((lvl: LevelInfo) => lvl.lessons).find((l: Lesson) => l.id === progress.currentLessonId) ||
    CURRICULUM_LEVELS[0].lessons[0];

  // Send Chat Message
  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputMessage).trim();
    if (!text || isSending) return;

    const userMsg: ProfessorMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const response = await professorService.askQuestion(text, {
        studentLevel: progress.studyPlan?.selectedLevel ?? 0,
        currentLessonTitle: currentLesson ? `${currentLesson.lessonNumber}. ${currentLesson.title}` : 'Fundamentos',
        masteredSkills: progress.completedLessons.map((id) => `Aula ${id}`),
        difficulties: Object.keys(progress.frequentErrors || {}),
      });

      const assistantMsg: ProfessorMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const isBackendUnavailable = !status?.available;
      const errorMsg: ProfessorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: isBackendUnavailable
          ? `💡 **Professor IA (Modo Resiliente Local)**: O backend de IA está em modo estático/offline. Para orientações da aula atual (*${currentLesson ? currentLesson.title : 'Fundamentos'}*), consulte as tablaturas e o diagrama de braço interativo no Currículo ou acesse o Círculo de Quintas na aba Teoria!`
          : `⚠️ Não foi possível consultar o Professor IA: ${err?.message || 'Falha na conexão com o servidor.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  // Generate Exercise
  const handleGenerateExercise = async () => {
    setIsGeneratingExercise(true);
    setCurrentExercise(null);
    setSelectedOption(null);
    setExerciseEvaluation(null);

    try {
      const ex = await professorService.generateExercise(selectedLevel, selectedTopic);
      setCurrentExercise(ex);
    } catch {
      // Fallback determinístico local resiliente (compatível com GitHub Pages / sem backend)
      const topicLower = selectedTopic.toLowerCase();
      const fallbackKey = Object.keys(LOCAL_FALLBACK_EXERCISES).find((k) => topicLower.includes(k)) || 'harmonia';
      setCurrentExercise(LOCAL_FALLBACK_EXERCISES[fallbackKey]);
    } finally {
      setIsGeneratingExercise(false);
    }
  };

  // Submit Answer with Local Objective Validation & Pedagogical Evidence (Fase 3, Regra 3)
  const handleSubmitAnswer = async () => {
    if (selectedOption === null || !currentExercise || isEvaluatingExercise) return;

    setIsEvaluatingExercise(true);

    // 1. Validação com lógica local autoritativa quando existe gabarito determinado
    const isCorrectLocally = selectedOption === currentExercise.correctIndex;

    // 2. Registra evidência imediatamente no Perfil Pedagógico Adaptativo
    let updatedProfile = progress.pedagogicalProfile || createInitialPedagogicalProfile();
    const evaluatedName = currentExercise.skillEvaluated || selectedTopic;
    const targetSkill = Object.values(updatedProfile.skills).find(
      (s) => s.name.toLowerCase().includes(evaluatedName.toLowerCase()) ||
             evaluatedName.toLowerCase().includes(s.name.toLowerCase())
    ) || (selectedLevel === 0 ? updatedProfile.skills['skill-cipher-notes'] : updatedProfile.skills['skill-triads-tetrads']) || Object.values(updatedProfile.skills)[0];

    const errorTag = !isCorrectLocally ? evaluatedName : undefined;
    updatedProfile = recordSkillEvidence(updatedProfile, targetSkill.id, {
      source: 'professor_exercise',
      score: isCorrectLocally ? 100 : 0,
      details: `Exercício do Professor IA: "${currentExercise.question}" -> ${isCorrectLocally ? 'Acerto' : 'Erro'}`,
      errorTag,
    });

    const updatedProgress: UserProgress = {
      ...progress,
      pedagogicalProfile: updatedProfile,
      achievements: isCorrectLocally && !progress.achievements.includes(targetSkill.name)
        ? [...progress.achievements, targetSkill.name]
        : progress.achievements,
      frequentErrors: errorTag
        ? { ...progress.frequentErrors, [errorTag]: (progress.frequentErrors[errorTag] || 0) + 1 }
        : progress.frequentErrors,
    };
    onUpdateProgress(updatedProgress);
    storageService.saveProgress(updatedProgress);

    // 3. Obtém parecer do Professor IA com fallback local robusto
    try {
      const evaluation = await professorService.evaluateAnswer({
        question: currentExercise.question,
        studentAnswer: currentExercise.options[selectedOption],
        correctAnswer: currentExercise.options[currentExercise.correctIndex],
        explanation: currentExercise.explanation,
        level: selectedLevel,
      });

      // Validação determinística local tem precedência absoluta no resultado booleano
      setExerciseEvaluation({
        ...evaluation,
        isCorrect: isCorrectLocally,
      });
    } catch {
      // Fallback local seguro e imediato (funciona mesmo offline ou se a IA atingir timeout)
      setExerciseEvaluation({
        isCorrect: isCorrectLocally,
        feedback: isCorrectLocally
          ? `Excelente! Sua resposta está correta. ${currentExercise.explanation}`
          : `Não foi dessa vez. A opção correta é "${currentExercise.options[currentExercise.correctIndex]}". ${currentExercise.explanation}`,
        masteredSkill: isCorrectLocally ? targetSkill.name : null,
        pointToReview: !isCorrectLocally ? evaluatedName : null,
        nextDrill: isCorrectLocally
          ? 'Pratique esta formação no Braço Interativo ou Guitar Coach por 5 minutos'
          : 'Revise este conceito no Currículo antes de avançar',
      });
    } finally {
      setIsEvaluatingExercise(false);
    }
  };

  // Generate Recommendation
  const handleFetchRecommendation = async () => {
    setIsLoadingRecommendation(true);
    try {
      const rec = await professorService.getRecommendation(progress);
      setRecommendation(rec);
    } catch {
      // Fallback determinístico local transparente (Garante funcionamento no GitHub Pages / sem backend)
      setRecommendation({
        title: deterministicRec.title,
        recommendedAction:
          deterministicRec.actionType === 'instrumental_practice'
            ? 'practice-routine'
            : deterministicRec.actionType === 'spaced_review'
            ? 'lesson'
            : 'theory',
        rationale: deterministicRec.rationale,
        suggestedDurationMinutes: deterministicRec.suggestedMinutes,
        focusAreas: [deterministicRec.targetSkillName],
        motivationalNote:
          'A consistência diária de 10 a 15 minutos com metrônomo supera horas desordenadas no final de semana. Mantenha o foco!',
      });
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

  // Add Difficulty manually
  const handleAddDifficulty = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newDifficultyInput.trim();
    if (!clean) return;

    const updated: UserProgress = {
      ...progress,
      frequentErrors: {
        ...progress.frequentErrors,
        [clean]: (progress.frequentErrors[clean] || 0) + 1,
      },
    };
    onUpdateProgress(updated);
    storageService.saveProgress(updated);
    setNewDifficultyInput('');
  };

  // Remove Difficulty
  const handleRemoveDifficulty = (key: string) => {
    const nextErrors = { ...progress.frequentErrors };
    delete nextErrors[key];
    const updated: UserProgress = {
      ...progress,
      frequentErrors: nextErrors,
    };
    onUpdateProgress(updated);
    storageService.saveProgress(updated);
  };

  // Pre-cooked question chips
  const questionSuggestions = [
    'Qual a diferença entre tríade maior e menor?',
    'Como aplicar o Sistema CAGED para achar acordes no braço?',
    'Dicas biomecânicas para pestana sem cansar o polegar',
    'Qual a regra para construir a escala pentatônica menor?',
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl border border-[#D9D9D9] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#7B1E2B]/10 via-[#B52A3A]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5E8EA] text-[#7B1E2B] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#B52A3A]" />
              <span>Mentor Musical Inteligente • Regra 6</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#25252A] tracking-tight">
              Professor IA
            </h1>

            <p className="text-sm text-[#666672] max-w-xl">
              Tire dúvidas de harmonia, pratique exercícios estruturados por nível com correção instantânea e receba orientações personalizadas baseadas no seu progresso real.
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex flex-col sm:items-end gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#E5E5E5] bg-[#F8F7F4]">
              {statusLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#666672]" />
                  <span className="text-[#666672]">Conectando...</span>
                </>
              ) : status?.available ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-700 font-bold">Gemini 3.8 Flash Ativo</span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-amber-700 font-bold">API Offline (Modo Local)</span>
                </>
              )}
            </div>

            <span className="text-[11px] text-[#8C8C9A] font-medium">
              Separação total entre IA, currículo e dados do aluno
            </span>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-[#F2F2F2] pb-2">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeSubTab === 'chat'
                ? 'bg-[#7B1E2B] text-white shadow-xs'
                : 'text-[#666672] hover:text-[#25252A] hover:bg-[#F2F2F2]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Tira-Dúvidas & Teoria</span>
          </button>

          <button
            onClick={() => setActiveSubTab('exercise')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeSubTab === 'exercise'
                ? 'bg-[#7B1E2B] text-white shadow-xs'
                : 'text-[#666672] hover:text-[#25252A] hover:bg-[#F2F2F2]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Exercícios por Nível</span>
          </button>

          <button
            onClick={() => setActiveSubTab('skills')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeSubTab === 'skills'
                ? 'bg-[#7B1E2B] text-white shadow-xs'
                : 'text-[#666672] hover:text-[#25252A] hover:bg-[#F2F2F2]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Diagnóstico & Habilidades</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('recommendation');
              if (!recommendation) {
                handleFetchRecommendation();
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
              activeSubTab === 'recommendation'
                ? 'bg-[#7B1E2B] text-white shadow-xs'
                : 'text-[#666672] hover:text-[#25252A] hover:bg-[#F2F2F2]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Recomendação de Prática</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUBTAB 1: TIRA-DÚVIDAS & TEORIA CONTEXTUALIZADA            */}
      {/* ======================================================== */}
      {activeSubTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-[#D9D9D9] shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Header Context Indicator */}
          <div className="px-6 py-3 border-b border-[#F2F2F2] bg-[#FAF9F7] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#666672]">
              <Target className="w-4 h-4 text-[#7B1E2B]" />
              <span>
                Contexto ativo: <strong>Nível {progress.studyPlan?.selectedLevel ?? 0}</strong> • {currentLesson.title}
              </span>
            </div>
            <span className="text-[11px] text-[#8C8C9A]">Respostas didáticas e biomecânicas</span>
          </div>

          {/* Messages Area */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-[#7B1E2B] text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#7B1E2B] text-white rounded-tr-none'
                        : 'bg-[#F8F7F4] text-[#25252A] border border-[#E5E5E5] rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>

                    {m.suggestedAction && (
                      <div className="mt-3 pt-2.5 border-t border-black/10 flex items-center justify-between">
                        <span className="text-[11px] font-semibold opacity-80">Ação recomendada:</span>
                        <button
                          onClick={() => onNavigateTab(m.suggestedAction!.tab)}
                          className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1 transition"
                        >
                          <span>{m.suggestedAction.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <div className="mt-1 text-[10px] opacity-60 text-right">{m.timestamp}</div>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-[#25252A] text-white flex items-center justify-center shrink-0 mt-1">
                      <span className="text-xs font-bold">EU</span>
                    </div>
                  )}
                </div>
              );
            })}

            {isSending && (
              <div className="flex gap-3 max-w-xl mr-auto">
                <div className="w-8 h-8 rounded-full bg-[#7B1E2B] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-[#F8F7F4] border border-[#E5E5E5] rounded-2xl rounded-tl-none p-4 text-xs text-[#666672] flex items-center gap-2">
                  <span className="animate-pulse">Professor IA está analisando e formulando a explicação...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chips de Dúvidas Prontas */}
          <div className="px-6 py-2 border-t border-[#F2F2F2] bg-[#FAF9F7] flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold text-[#8C8C9A] uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-[#B52A3A]" /> Dúvidas frequentes:
            </span>
            {questionSuggestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isSending}
                className="text-[11px] font-medium text-[#4D4D54] hover:text-[#7B1E2B] bg-white hover:bg-[#F5E8EA] border border-[#E5E5E5] px-2.5 py-1 rounded-lg transition shrink-0 whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-[#F2F2F2] bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ex: Como montar o acorde C7M e qual dedo usar no braço da guitarra?"
                disabled={isSending}
                className="flex-1 bg-[#F8F7F4] border border-[#D9D9D9] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#25252A] placeholder-[#8C8C9A] focus:outline-none focus:border-[#7B1E2B]"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending}
                className="px-5 py-3 rounded-xl bg-[#7B1E2B] text-white font-bold text-xs sm:text-sm hover:bg-[#5C141F] disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <span>Perguntar</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 2: EXERCÍCIOS ESTATURADOS POR NÍVEL E CORREÇÃO     */}
      {/* ======================================================== */}
      {activeSubTab === 'exercise' && (
        <div className="space-y-6">
          {/* Seletor de Nível e Tópico */}
          <div className="bg-white rounded-3xl border border-[#D9D9D9] p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#25252A] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#7B1E2B]" />
              <span>Configurar Treino com Professor IA</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#666672] uppercase tracking-wider block mb-1">
                  Nível de Dificuldade
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(Number(e.target.value))}
                  className="w-full bg-[#F8F7F4] border border-[#D9D9D9] rounded-xl px-3 py-2 text-xs font-bold text-[#25252A]"
                >
                  <option value={0}>Nível 0 — Zero Absoluto & Anatomia</option>
                  <option value={1}>Nível 1 — Primeiros Acordes e Ritmo 4/4</option>
                  <option value={2}>Nível 2 — Pestanas e Campo Harmônico Maior</option>
                  <option value={3}>Nível 3 — Pentatônicas e Sistema CAGED</option>
                  <option value={4}>Nível 4 — Modos Gregos & Arpejos</option>
                  <option value={5}>Nível 5 — Harmonia Avançada & Jazz/Fusion</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#666672] uppercase tracking-wider block mb-1">
                  Tópico de Estudo
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-[#F8F7F4] border border-[#D9D9D9] rounded-xl px-3 py-2 text-xs font-bold text-[#25252A]"
                >
                  <option value="Harmonia e Tríades">Harmonia e Tríades</option>
                  <option value="Sistema CAGED e Shapes de Guitarra">Sistema CAGED e Shapes</option>
                  <option value="Formação de Tétrades e Sétimas">Tétrades e Sétimas</option>
                  <option value="Escala Pentatônica e Aplicação Solo">Pentatônicas e Solos</option>
                  <option value="Leitura de Cifras e Transposição">Cifras e Transposição</option>
                  <option value="Afinação e Frequência das Cordas">Afinação & Cordas</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateExercise}
              disabled={isGeneratingExercise}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#7B1E2B] text-white font-bold text-xs sm:text-sm hover:bg-[#5C141F] disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {isGeneratingExercise ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gerando Exercício com Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar Exercício com Professor IA</span>
                </>
              )}
            </button>
          </div>

          {/* Exercício Gerado */}
          {currentExercise && (
            <div className="bg-white rounded-3xl border border-[#D9D9D9] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7B1E2B] bg-[#F5E8EA] px-3 py-1 rounded-full">
                  Avaliação: {currentExercise.skillEvaluated}
                </span>
                <span className="text-xs font-bold text-[#666672]">Nível {selectedLevel}</span>
              </div>

              <div className="text-base sm:text-lg font-bold text-[#25252A] leading-snug">
                {currentExercise.question}
              </div>

              {/* Opções */}
              <div className="space-y-2.5">
                {currentExercise.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentExercise.correctIndex;
                  const showResult = exerciseEvaluation !== null;

                  let borderClass = 'border-[#E5E5E5] hover:border-[#7B1E2B]';
                  let bgClass = 'bg-[#F8F7F4]';

                  if (showResult) {
                    if (isCorrect) {
                      borderClass = 'border-emerald-500 bg-emerald-50';
                    } else if (isSelected) {
                      borderClass = 'border-rose-500 bg-rose-50';
                    }
                  } else if (isSelected) {
                    borderClass = 'border-[#7B1E2B] bg-[#F5E8EA]';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !exerciseEvaluation && setSelectedOption(idx)}
                      disabled={exerciseEvaluation !== null}
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition flex items-center justify-between ${borderClass} ${bgClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-white border border-[#D9D9D9] flex items-center justify-center font-mono-code font-bold text-xs text-[#25252A]">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {showResult && isSelected && !isCorrect && <AlertTriangle className="w-5 h-5 text-rose-600" />}
                    </button>
                  );
                })}
              </div>

              {/* Botão de Enviar Resposta */}
              {!exerciseEvaluation && (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null || isEvaluatingExercise}
                  className="px-6 py-3 rounded-xl bg-[#7B1E2B] text-white font-bold text-xs sm:text-sm hover:bg-[#5C141F] disabled:opacity-40 transition flex items-center gap-2"
                >
                  {isEvaluatingExercise ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Avaliando com Professor IA...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirmar Resposta</span>
                    </>
                  )}
                </button>
              )}

              {/* Resultado & Feedback do Professor IA */}
              {exerciseEvaluation && (
                <div
                  className={`p-6 rounded-2xl border ${
                    exerciseEvaluation.isCorrect
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                      : 'border-rose-300 bg-rose-50 text-rose-950'
                  } space-y-3`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {exerciseEvaluation.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Resposta Correta! Habilidade Dominada.</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                        <span>Não foi dessa vez. Ponto adicionado para revisão.</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed">{exerciseEvaluation.feedback}</p>

                  <div className="pt-2 border-t border-black/10 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <strong className="block text-[11px] uppercase tracking-wider opacity-80">
                        Próximo Treino Rápido Recomendado:
                      </strong>
                      <span>{exerciseEvaluation.nextDrill}</span>
                    </div>

                    <button
                      onClick={handleGenerateExercise}
                      className="px-4 py-2 rounded-xl bg-white border border-[#D9D9D9] hover:bg-[#FAF9F7] text-xs font-bold text-[#25252A] flex items-center gap-1.5 transition shrink-0"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Outro Exercício</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 3: MEMÓRIA PEDAGÓGICA & DIAGNÓSTICO DO ALUNO (Fase 3) */}
      {/* ======================================================== */}
      {activeSubTab === 'skills' && (
        <div className="space-y-6">
          {/* Resumo Geral de Domínio */}
          <div className="bg-white rounded-3xl border border-[#D9D9D9] p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#F2F2F2]">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5E8EA] text-[#7B1E2B] text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B52A3A]" />
                  <span>Perfil Pedagógico Persistente • Fase 3</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#25252A]">
                  Matriz de Domínio e Evidências Reais
                </h2>
                <p className="text-xs sm:text-sm text-[#666672] max-w-xl">
                  Seu aprendizado é calculado por evidências reais comprovadas (quizzes, repetições motoras e áudio), com agendamento de repetições espaçadas.
                </p>
              </div>

              {/* Métricas Globais */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="p-3.5 rounded-2xl bg-[#F8F7F4] border border-[#E5E5E5] text-center min-w-[110px]">
                  <span className="text-[10px] font-bold text-[#8C8C9A] uppercase tracking-wider block">
                    Domínio Médio
                  </span>
                  <span className="text-2xl font-black text-[#7B1E2B]">
                    {pedagogicalProfile.overallMasteryPercent}%
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8F7F4] border border-[#E5E5E5] text-center min-w-[110px]">
                  <span className="text-[10px] font-bold text-[#8C8C9A] uppercase tracking-wider block">
                    Dominadas
                  </span>
                  <span className="text-2xl font-black text-emerald-600">
                    {Object.values(pedagogicalProfile.skills).filter((s) => s.masteryLevel === 'mastered' || s.masteryLevel === 'proficient').length}
                    <span className="text-xs text-[#8C8C9A] font-semibold">/{Object.keys(pedagogicalProfile.skills).length}</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8F7F4] border border-[#E5E5E5] text-center min-w-[110px]">
                  <span className="text-[10px] font-bold text-[#8C8C9A] uppercase tracking-wider block">
                    Revisões Espaçadas
                  </span>
                  <span className={`text-2xl font-black ${
                    deterministicRec.pendingReviewsCount > 0 ? 'text-amber-600' : 'text-[#25252A]'
                  }`}>
                    {deterministicRec.pendingReviewsCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Filtros de Categoria */}
            <div className="pt-6 space-y-3">
              <span className="text-xs font-bold text-[#666672] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Filtrar por Habilidade:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'Todas as Habilidades' },
                  { id: 'notes', label: 'Notas & Cifras' },
                  { id: 'intervals', label: 'Intervalos' },
                  { id: 'rhythm', label: 'Ritmo & Metrônomo' },
                  { id: 'chord_shapes', label: 'Acordes & Pestanas' },
                  { id: 'scales', label: 'Escalas & CAGED' },
                  { id: 'harmony', label: 'Harmonia' },
                  { id: 'ear_training', label: 'Percepção' },
                  { id: 'technique', label: 'Técnica & Postura' },
                  { id: 'improvisation', label: 'Improvisação' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedCategory === cat.id
                        ? 'bg-[#7B1E2B] text-white shadow-xs'
                        : 'bg-[#F8F7F4] hover:bg-[#F2F2F2] text-[#4D4D54] border border-[#E5E5E5]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de Habilidades com Evidências */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(pedagogicalProfile.skills)
              .filter((s) => selectedCategory === 'all' || s.category === selectedCategory)
              .map((skill) => {
                const today = new Date().toISOString().split('T')[0];
                const isReviewDue = skill.nextReviewDate && skill.nextReviewDate <= today;

                let levelBadgeColor = 'bg-gray-100 text-gray-700 border-gray-200';
                let levelLabel = 'Não Iniciado';
                if (skill.masteryLevel === 'mastered') {
                  levelBadgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
                  levelLabel = 'Dominado ✓';
                } else if (skill.masteryLevel === 'proficient') {
                  levelBadgeColor = 'bg-blue-50 text-blue-800 border-blue-300';
                  levelLabel = 'Proficiente';
                } else if (skill.masteryLevel === 'practicing') {
                  levelBadgeColor = 'bg-amber-50 text-amber-800 border-amber-300';
                  levelLabel = 'Em Prática';
                } else if (skill.masteryLevel === 'introductory') {
                  levelBadgeColor = 'bg-purple-50 text-purple-800 border-purple-300';
                  levelLabel = 'Introdutório';
                }

                return (
                  <div
                    key={skill.id}
                    className="bg-white rounded-3xl border border-[#D9D9D9] p-5 shadow-xs space-y-4 hover:border-[#7B1E2B]/50 transition flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-[#7B1E2B] uppercase tracking-wider">
                            Nível {skill.level} • {skill.category}
                          </span>
                          <h4 className="font-bold text-[#25252A] text-sm leading-snug">
                            {skill.name}
                          </h4>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${levelBadgeColor}`}>
                          {levelLabel}
                        </span>
                      </div>

                      {/* Barra de Progresso de Domínio */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-[#666672]">
                          <span>Domínio Estimado</span>
                          <span className="font-bold text-[#25252A]">{skill.masteryScore}%</span>
                        </div>
                        <div className="h-2 w-full bg-[#F2F2F2] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              skill.masteryScore >= 75
                                ? 'bg-emerald-500'
                                : skill.masteryScore >= 50
                                ? 'bg-amber-500'
                                : 'bg-[#7B1E2B]'
                            }`}
                            style={{ width: `${skill.masteryScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Métricas de Tentativas e Repetição Espaçada */}
                      <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-[#666672] border-t border-[#F2F2F2]">
                        <div>
                          <span className="block text-[10px] text-[#8C8C9A]">Tentativas Reais:</span>
                          <span className="font-bold text-[#25252A]">
                            {skill.attemptsCount} ({skill.correctCount} acertos / {skill.incorrectCount} erros)
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-[#8C8C9A]">Próxima Revisão:</span>
                          <span className={`font-bold ${isReviewDue ? 'text-amber-700' : 'text-[#25252A]'}`}>
                            {skill.nextReviewDate ? skill.nextReviewDate : 'Não agendada'}
                            {isReviewDue && ' ⚠️'}
                          </span>
                        </div>
                      </div>

                      {/* Erros Recorrentes (se houver) */}
                      {Object.keys(skill.recurringErrors).length > 0 && (
                        <div className="pt-2 border-t border-[#F2F2F2]">
                          <span className="text-[10px] font-bold text-rose-700 block mb-1">
                            Erros Registrados:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(skill.recurringErrors).map(([err, count], idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200"
                              >
                                {err} ({count}x)
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Ações da Habilidade */}
                    <div className="pt-3 border-t border-[#F2F2F2] flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedSkillForEvidences(skill)}
                        className="text-xs font-semibold text-[#666672] hover:text-[#25252A] flex items-center gap-1"
                      >
                        <Info className="w-3.5 h-3.5 text-[#7B1E2B]" />
                        <span>Evidências ({skill.evidences.length})</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedLevel(skill.level);
                          setSelectedTopic(skill.name);
                          setActiveSubTab('exercise');
                          handleGenerateExercise();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#F5E8EA] hover:bg-[#ebd3d6] text-[#7B1E2B] font-bold text-xs flex items-center gap-1 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Exercitar com IA</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Modal / Detalhe de Evidências Reais */}
          {selectedSkillForEvidences && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2F2F2]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B1E2B]">
                      Evidências Registradas
                    </span>
                    <h3 className="text-base font-bold text-[#25252A]">
                      {selectedSkillForEvidences.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedSkillForEvidences(null)}
                    className="p-1 rounded-lg text-[#666672] hover:bg-[#F2F2F2]"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  {selectedSkillForEvidences.evidences.length === 0 ? (
                    <p className="text-[#8C8C9A] p-4 text-center">
                      Nenhuma evidência registrada ainda para esta habilidade.
                    </p>
                  ) : (
                    selectedSkillForEvidences.evidences.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-3 rounded-xl bg-[#F8F7F4] border border-[#E5E5E5] space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-[11px]">
                          <span className="text-[#7B1E2B] uppercase">
                            Fonte: {ev.source.replace('_', ' ')}
                          </span>
                          <span className="text-[#666672]">{ev.date}</span>
                        </div>
                        <p className="text-[#25252A] text-xs">{ev.details}</p>
                        {ev.score !== undefined && (
                          <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Nota / Pontuação: {ev.score}%
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedSkillForEvidences(null)}
                    className="w-full py-2.5 rounded-xl bg-[#25252A] text-white font-bold text-xs"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dificuldades Livres Anotadas pelo Aluno (Preservado) */}
          <div className="bg-white rounded-3xl border border-[#D9D9D9] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#25252A] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#B52A3A]" />
                <span>Anotações Livres de Dificuldade ({Object.keys(progress.frequentErrors || {}).length})</span>
              </h3>
              <span className="text-xs font-bold text-[#7B1E2B] bg-[#F5E8EA] px-2.5 py-0.5 rounded-full">
                Personalizado
              </span>
            </div>

            {Object.keys(progress.frequentErrors || {}).length === 0 ? (
              <p className="text-xs text-[#8C8C9A]">
                Nenhuma anotação livre registrada. Adicione anotações abaixo para orientar as respostas do Professor IA.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {Object.entries(progress.frequentErrors).map(([errKey, count], idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#FFF5F5] border border-rose-200 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-rose-900">{errKey}</span>
                      <span className="text-[10px] text-rose-600 block">{count} ocorrência(s)</span>
                    </div>
                    <button
                      onClick={() => handleRemoveDifficulty(errKey)}
                      className="text-xs font-bold text-rose-700 hover:text-rose-900 px-2 py-1 rounded-lg hover:bg-rose-100"
                      title="Marcar como superado"
                    >
                      Superado ✓
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddDifficulty} className="flex gap-2 pt-2 border-t border-[#F2F2F2]">
              <input
                type="text"
                value={newDifficultyInput}
                onChange={(e) => setNewDifficultyInput(e.target.value)}
                placeholder="Ex: Pestana de F maior, troca C -> G"
                className="flex-1 bg-[#F8F7F4] border border-[#D9D9D9] rounded-xl px-3 py-1.5 text-xs text-[#25252A]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-[#25252A] text-white font-bold text-xs hover:bg-[#3E3E46] transition"
              >
                Adicionar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 4: RECOMENDAÇÃO DETERMINÍSTICA & PROFESSOR IA (Fase 3) */}
      {/* ======================================================== */}
      {activeSubTab === 'recommendation' && (
        <div className="space-y-6">
          {/* Card 1: Recomendação Determinística do Motor de Adaptação */}
          <div className="bg-white rounded-3xl border border-[#D9D9D9] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2F2F2]">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5E8EA] text-[#7B1E2B] text-xs font-bold uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Motor de Ensino Adaptativo • Algoritmo Determinístico</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#25252A]">
                  {deterministicRec.title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F8F7F4] border border-[#E5E5E5] text-[#4D4D54]">
                  ⏱️ {deterministicRec.suggestedMinutes} min
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F8F7F4] border border-[#E5E5E5] text-[#4D4D54]">
                  🎯 {deterministicRec.difficultyAdjustment === 'easier' ? 'Passo Acessível' : deterministicRec.difficultyAdjustment === 'challenging' ? 'Desafio Gradual' : 'Passo Normal'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#E5E5E5] space-y-1.5 text-xs sm:text-sm text-[#4D4D54] leading-relaxed">
                <strong className="text-[#25252A] block font-bold">
                  Justificativa Pedagógica Explícita:
                </strong>
                <p>{deterministicRec.rationale}</p>
              </div>

              {deterministicRec.pendingReviewsCount > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Você possui <strong>{deterministicRec.pendingReviewsCount} habilidade(s)</strong> prontas para revisão espaçada para consolidar a retenção motora.
                  </span>
                </div>
              )}
            </div>

            {/* Ações de Escolha do Aluno (Fase 3, Item 4) */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigateTab(deterministicRec.targetTab)}
                  className="px-6 py-3 rounded-xl bg-[#7B1E2B] text-white font-bold text-xs sm:text-sm hover:bg-[#5C141F] flex items-center gap-2 shadow-xs transition"
                >
                  <span>Seguir Recomendação ({deterministicRec.targetTab})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigateTab('curriculum')}
                  className="px-5 py-3 rounded-xl bg-[#F8F7F4] hover:bg-[#F2F2F2] text-[#25252A] font-bold text-xs sm:text-sm border border-[#D9D9D9] transition"
                >
                  <BookOpen className="w-4 h-4 text-[#666672]" />
                  <span>Escolher Livremente no Currículo</span>
                </button>
              </div>

              <button
                onClick={handleFetchRecommendation}
                disabled={isLoadingRecommendation}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#D9D9D9] text-xs font-bold text-[#7B1E2B] hover:bg-[#F5E8EA] flex items-center gap-2 transition"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isLoadingRecommendation ? 'animate-spin' : ''}`} />
                <span>Consultar Parecer com Gemini 3.8 Flash</span>
              </button>
            </div>
          </div>

          {/* Card 2: Parecer Opcional da IA (Gemini) */}
          {recommendation && (
            <div className="bg-white rounded-3xl border border-[#D9D9D9] p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#7B1E2B] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#B52A3A]" />
                <span>Parecer Didático do Mentor IA (Gemini 3.8 Flash)</span>
              </div>

              <h3 className="text-lg font-black text-[#25252A]">{recommendation.title}</h3>
              <p className="text-xs sm:text-sm text-[#4D4D54] leading-relaxed">{recommendation.rationale}</p>

              {recommendation.focusAreas?.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#666672] uppercase tracking-wider">
                    Focos de Prática Recomendados:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.focusAreas.map((f, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-[#F8F7F4] border border-[#E5E5E5] text-xs font-semibold text-[#25252A]"
                      >
                        • {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#F5E8EA] text-[#7B1E2B] text-xs font-medium italic">
                "{recommendation.motivationalNote}"
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
