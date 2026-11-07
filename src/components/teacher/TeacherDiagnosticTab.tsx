import React from 'react';
import { PedagogicalBottleneck } from '../../types/teacher';
import { AlertTriangle, Lightbulb, Compass, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface TeacherDiagnosticTabProps {
  bottlenecks: PedagogicalBottleneck[];
}

export const TeacherDiagnosticTab: React.FC<TeacherDiagnosticTabProps> = ({ bottlenecks }) => {
  return (
    <div className="space-y-6">
      {/* Cabeçalho da Seção */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#7B1E2B] dark:text-[#FF6B81]" />
          <h2 className="font-display font-black text-lg text-[#1F1F24] dark:text-[#F8F7F4]">
            Diagnóstico Pedagógico Coletivo da Turma
          </h2>
        </div>
        <p className="text-xs text-[#666672] dark:text-[#B8B3C0] leading-relaxed">
          Esta ferramenta analisa os dados da turma para detectar padrões de aprendizagem, desequilíbrios entre teoria e prática e etapas com alta retenção. Cada diagnóstico separa claramente o fato mensurado, a hipótese didática e a recomendação de intervenção.
        </p>
      </div>

      {/* Lista de Gargalos com a Estrutura Tripla Requerida */}
      {bottlenecks.length > 0 ? (
        <div className="space-y-4">
          {bottlenecks.map((btn) => (
            <div
              key={btn.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs space-y-4"
            >
              {/* Cabeçalho do Card */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E6E1] dark:border-[#422933] pb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      btn.severity === 'high'
                        ? 'bg-[#B52A3A]'
                        : btn.severity === 'medium'
                        ? 'bg-[#C5A059]'
                        : 'bg-[#16A34A]'
                    }`}
                  />
                  <h3 className="font-display font-black text-sm text-[#1F1F24] dark:text-[#F8F7F4]">
                    {btn.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-[#FAF1F2] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#E8D3D6] dark:border-[#522536]">
                    Severidade {btn.severity === 'high' ? 'Alta' : btn.severity === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                  <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {btn.affectedStudentsCount} {btn.affectedStudentsCount === 1 ? 'aluno afetado' : 'alunos afetados'}
                  </span>
                </div>
              </div>

              {/* 3 Pilares: Fato, Hipótese, Intervenção */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* 1. Fato Observado nos Dados */}
                <div className="p-4 rounded-xl bg-[#F8F7F4] dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#7B1E2B] dark:text-[#FF6B81]">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>1. Fato Mensurado nos Dados</span>
                  </div>
                  <p className="text-[#666672] dark:text-[#B8B3C0] leading-relaxed">
                    {btn.observedFact}
                  </p>
                </div>

                {/* 2. Hipótese Pedagógica Didática */}
                <div className="p-4 rounded-xl bg-[#F8F7F4] dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#C5A059]">
                    <Lightbulb className="w-4 h-4 shrink-0" />
                    <span>2. Hipótese Pedagógica</span>
                  </div>
                  <p className="text-[#666672] dark:text-[#B8B3C0] leading-relaxed">
                    {btn.pedagogicalHypothesis}
                  </p>
                </div>

                {/* 3. Sugestão de Intervenção para o Professor */}
                <div className="p-4 rounded-xl bg-[#FAF1F2] dark:bg-[#28151D] border border-[#E8D3D6] dark:border-[#522536] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#16A34A] dark:text-[#4ADE80]">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>3. Sugestão de Intervenção</span>
                  </div>
                  <p className="text-[#1F1F24] dark:text-[#F8F7F4] font-medium leading-relaxed">
                    {btn.interventionSuggestion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-[#16A34A] mx-auto" />
          <h3 className="font-bold text-sm text-[#1F1F24] dark:text-[#F8F7F4]">
            Turma com Progressão Harmônica
          </h3>
          <p className="text-xs text-[#666672] dark:text-[#B8B3C0] max-w-md mx-auto">
            Nenhum gargalo de alta severidade foi detectado. Os alunos matriculados estão alternando satisfatoriamente entre teoria e prática instrumental.
          </p>
        </div>
      )}
    </div>
  );
};
