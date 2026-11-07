import React, { useState } from 'react';
import { StudentAnalyticsSummary } from '../../types/teacher';
import { storageService } from '../../services/storageService';
import { 
  Search, 
  User, 
  BookOpen, 
  Clock, 
  Activity, 
  ChevronRight, 
  X, 
  Calendar, 
  ShieldCheck, 
  Award,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface TeacherStudentsTabProps {
  students: StudentAnalyticsSummary[];
}

export const TeacherStudentsTab: React.FC<TeacherStudentsTabProps> = ({ students }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentUid, setSelectedStudentUid] = useState<string | null>(null);

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return s.studentName.toLowerCase().includes(q) || s.studentEmail.toLowerCase().includes(q) || s.className.toLowerCase().includes(q);
  });

  const selectedStudent = students.find((s) => s.studentUid === selectedStudentUid);
  const selectedProgress = selectedStudent ? storageService.loadProgress(selectedStudent.studentUid) : null;

  return (
    <div className="space-y-6">
      {/* Barra de Busca e Filtro de Alunos */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666672] dark:text-[#B8B3C0]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar aluno por nome, e-mail ou turma..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8F7F4] dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] text-xs text-[#1F1F24] dark:text-[#F8F7F4] focus:outline-hidden focus:ring-2 focus:ring-[#7B1E2B]/30"
          />
        </div>
        <div className="text-xs text-[#666672] dark:text-[#B8B3C0]">
          Total listado: <strong>{filteredStudents.length}</strong> {filteredStudents.length === 1 ? 'aluno' : 'alunos'}
        </div>
      </div>

      {/* Tabela de Alunos Vinculados */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933] shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E6E1] dark:border-[#422933] text-[#666672] dark:text-[#B8B3C0]">
                <th className="pb-3 font-bold">Estudante</th>
                <th className="pb-3 font-bold">Turma</th>
                <th className="pb-3 font-bold text-center">Aulas Feitas</th>
                <th className="pb-3 font-bold text-center">Tempo Total</th>
                <th className="pb-3 font-bold text-center">Tempo Verificado vs Manual</th>
                <th className="pb-3 font-bold text-center">BPM Máximo</th>
                <th className="pb-3 font-bold text-center">Habilidades Avaliadas</th>
                <th className="pb-3 font-bold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6E1] dark:divide-[#422933]">
              {filteredStudents.map((s) => {
                const totalMin = Math.round(s.totalStudyTimeSeconds / 60);
                const verifiedMin = Math.round(s.verifiedInteractiveSeconds / 60);
                const manualMin = Math.round(s.manualLoggedSeconds / 60);

                return (
                  <tr
                    key={s.studentUid}
                    onClick={() => setSelectedStudentUid(s.studentUid)}
                    className="hover:bg-[#F8F7F4] dark:hover:bg-[#251820] transition-colors cursor-pointer group"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        {s.studentPhotoUrl ? (
                          <img
                            src={s.studentPhotoUrl}
                            alt={s.studentName}
                            className="w-8 h-8 rounded-xl object-cover border border-[#C5A059]"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-[#7B1E2B] text-white font-bold text-xs flex items-center justify-center">
                            {s.studentName[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-[#1F1F24] dark:text-[#F8F7F4] block group-hover:text-[#7B1E2B] dark:group-hover:text-[#FF6B81] transition-colors">
                            {s.studentName}
                          </span>
                          <span className="text-[10px] text-[#666672] dark:text-[#B8B3C0]">
                            {s.studentEmail}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-[#666672] dark:text-[#B8B3C0] font-medium">
                      {s.className}
                    </td>
                    <td className="py-3 font-mono-code text-center font-bold text-[#1F1F24] dark:text-[#F8F7F4]">
                      {s.completedLessonsCount} / 98
                    </td>
                    <td className="py-3 font-mono-code text-center font-bold text-[#7B1E2B] dark:text-[#FF6B81]">
                      {totalMin} min
                    </td>
                    <td className="py-3 text-center">
                      <span className="text-[10px] font-mono-code text-[#16A34A] font-bold">
                        {verifiedMin}m interativo
                      </span>
                      {manualMin > 0 && (
                        <span className="text-[10px] font-mono-code text-[#D97706] block">
                          + {manualMin}m offline
                        </span>
                      )}
                    </td>
                    <td className="py-3 font-mono-code text-center text-[#1F1F24] dark:text-[#F8F7F4]">
                      {s.practicedBpmMax} BPM
                    </td>
                    <td className="py-3 text-center">
                      <span className="font-mono-code font-bold text-xs px-2 py-0.5 rounded-md bg-white dark:bg-[#1A1216] border border-[#E8E6E1] dark:border-[#422933]">
                        {s.evaluatedSkillsCount} de 21
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="p-1 rounded-lg text-[#7B1E2B] dark:text-[#FF6B81] group-hover:bg-[#FAF1F2] dark:group-hover:bg-[#381A25] transition">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Painel Individual do Aluno Selecionado (Drawer Modal) */}
      {selectedStudent && selectedProgress && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl bg-[#FAF9F6] dark:bg-[#1A1216] rounded-2xl border border-[#E8E6E1] dark:border-[#422933] shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto space-y-5 text-[#25252A] dark:text-[#F8F7F4]">
            <button
              onClick={() => setSelectedStudentUid(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#666672] dark:text-[#B8B3C0] hover:bg-[#F5E8EA] dark:hover:bg-[#381A25] hover:text-[#7B1E2B] dark:hover:text-[#FF6B81] transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cabeçalho do Aluno */}
            <div className="flex items-center gap-3.5 border-b border-[#E8E6E1] dark:border-[#422933] pb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#7B1E2B] text-white font-bold text-lg flex items-center justify-center border-2 border-[#C5A059]">
                {selectedStudent.studentName[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-[#1F1F24] dark:text-[#F8F7F4]">
                  {selectedStudent.studentName}
                </h3>
                <span className="text-xs text-[#666672] dark:text-[#B8B3C0]">
                  {selectedStudent.studentEmail} • {selectedStudent.className}
                </span>
                <span className="text-[10px] text-[#16A34A] block mt-0.5">
                  Última atividade: {selectedStudent.lastActivityAt.split('T')[0]}
                </span>
              </div>
            </div>

            {/* 4 Cards de Resumo */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933]">
                <BookOpen className="w-4 h-4 text-[#7B1E2B] mx-auto mb-1" />
                <span className="text-base font-black block">{selectedProgress.completedLessons.length}</span>
                <span className="text-[10px] text-[#666672]">Aulas Concluídas</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933]">
                <Clock className="w-4 h-4 text-[#C5A059] mx-auto mb-1" />
                <span className="text-base font-black block">{Math.round((selectedProgress.totalStudyTimeSeconds || 0) / 60)}m</span>
                <span className="text-[10px] text-[#666672]">Tempo Praticado</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933]">
                <Activity className="w-4 h-4 text-[#16A34A] mx-auto mb-1" />
                <span className="text-base font-black block">{selectedProgress.practicedBpm || 80}</span>
                <span className="text-[10px] text-[#666672]">BPM Máximo</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933]">
                <Award className="w-4 h-4 text-[#7B1E2B] mx-auto mb-1" />
                <span className="text-base font-black block">{selectedStudent.evaluatedSkillsCount} / 21</span>
                <span className="text-[10px] text-[#666672]">Habilidades</span>
              </div>
            </div>

            {/* Cursos em Andamento & Posição Atual */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] space-y-2">
              <h4 className="font-bold text-xs text-[#1F1F24] dark:text-[#F8F7F4]">Trilha e Últimas Aulas Acessadas</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#F8F7F4] dark:bg-[#1A1216]">
                  <span className="font-bold block text-[11px] text-[#7B1E2B]">Violão</span>
                  <span className="text-[10px] text-[#666672]">{selectedProgress.courseLastLesson?.violao || 'violao-lesson-1'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F8F7F4] dark:bg-[#1A1216]">
                  <span className="font-bold block text-[11px] text-[#C5A059]">Conservatório</span>
                  <span className="text-[10px] text-[#666672]">{selectedProgress.courseLastLesson?.canonical || 'lesson-1'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F8F7F4] dark:bg-[#1A1216]">
                  <span className="font-bold block text-[11px] text-[#16A34A]">Guitarra Solo</span>
                  <span className="text-[10px] text-[#666672]">{selectedProgress.courseLastLesson?.solo || 'solo-lesson-1'}</span>
                </div>
              </div>
            </div>

            {/* Histórico Recente de Prática */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] space-y-2">
              <h4 className="font-bold text-xs text-[#1F1F24] dark:text-[#F8F7F4]">Histórico de Prática e Sessões</h4>
              {selectedProgress.practiceSessions && selectedProgress.practiceSessions.length > 0 ? (
                <div className="space-y-2">
                  {selectedProgress.practiceSessions.slice(0, 4).map((sess) => (
                    <div key={sess.id} className="p-2.5 rounded-lg bg-[#F8F7F4] dark:bg-[#1A1216] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold block">{sess.recommendationGiven || 'Sessão na Central de Prática'}</span>
                        <span className="text-[10px] text-[#666672]">{sess.date} • {sess.durationPlannedMinutes} min planejados</span>
                      </div>
                      <span className="font-mono-code font-bold text-xs text-[#7B1E2B]">{sess.highestBpm || 80} BPM</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#666672] italic">Nenhuma sessão de prática interativa guiada gravada recentemente.</p>
              )}
            </div>

            {/* Evidências do Perfil Pedagógico */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#251820] border border-[#E8E6E1] dark:border-[#422933] space-y-2">
              <h4 className="font-bold text-xs text-[#1F1F24] dark:text-[#F8F7F4]">Mapa de Habilidades com Evidências Reais</h4>
              <p className="text-[11px] text-[#666672] leading-relaxed">
                Regra da Honestidade Intelectual: Habilidades sem evidência real aparecem como "Ainda não avaliado", sem pontuações estimadas.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedProgress.pedagogicalProfile?.skills &&
                  Object.entries(selectedProgress.pedagogicalProfile.skills)
                    .filter(([_, s]) => s.evidences && s.evidences.length > 0)
                    .map(([sId, s]) => (
                      <span
                        key={sId}
                        className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-md bg-[#FAF1F2] dark:bg-[#381A25] text-[#7B1E2B] dark:text-[#FF6B81] border border-[#E8D3D6] dark:border-[#522536]"
                      >
                        {sId.replace('skill-', '')}: {s.masteryScore}%
                      </span>
                    ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
