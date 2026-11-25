import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { StudentProfile, isValidEmail, isValidBrazilianPhone } from '../../types';
import { updateStudentRegistration } from '../../services/firebase';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  user: User | null;
  studentProfile: StudentProfile | null;
  onSuccess: () => void;
}

export const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  isOpen,
  user,
  studentProfile,
  onSuccess,
}) => {
  const initialPrefs = studentProfile?.preferences || {};
  const [firstName, setFirstName] = useState(
    studentProfile?.firstName || initialPrefs.firstName || (user?.displayName ? user.displayName.split(' ')[0] : '')
  );
  const [lastName, setLastName] = useState(
    studentProfile?.lastName || initialPrefs.lastName || (user?.displayName ? user.displayName.split(' ').slice(1).join(' ') : '')
  );
  const [email, setEmail] = useState(studentProfile?.email || user?.email || '');
  const [phone, setPhone] = useState(studentProfile?.phone || initialPrefs.phone || '');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    if (!cleanFirst) {
      setError('Por favor, informe seu Nome.');
      return;
    }
    if (!cleanLast) {
      setError('Por favor, informe seu Sobrenome.');
      return;
    }
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      setError('Por favor, informe um endereço de e-mail válido.');
      return;
    }
    if (!cleanPhone || !isValidBrazilianPhone(cleanPhone)) {
      setError('Por favor, informe um número de telefone válido com DDD (ex: 11 99999-9999).');
      return;
    }

    if (!user) {
      setError('Usuário não autenticado.');
      return;
    }

    setSubmitting(true);
    try {
      await updateStudentRegistration(user.uid, {
        firstName: cleanFirst,
        lastName: cleanLast,
        email: cleanEmail,
        phone: cleanPhone,
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar cadastro. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl shadow-amber-500/10 text-slate-100">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3 text-2xl font-bold">
            🎸
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Cadastro Inicial Obrigatório</h2>
          <p className="text-sm text-slate-300 mt-1">
            Para liberar seu acesso completo à Guitar Academy, por favor preencha suas informações cadastrais.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Nome <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ex: João"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Sobrenome <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ex: Silva"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              E-mail <span className="text-amber-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Telefone / WhatsApp (com DDD) <span className="text-amber-400">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              required
            />
            <p className="text-xs text-slate-400 mt-1">Informe com DDD (mínimo 10 dígitos).</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Salvando cadastro...' : 'Concluir Cadastro e Acessar Academia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
