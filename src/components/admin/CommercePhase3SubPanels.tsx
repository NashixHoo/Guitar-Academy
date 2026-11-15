import React, { useState } from 'react';
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  Clock,
  CreditCard,
  Eye,
  GraduationCap,
  Image as ImageIcon,
  Lock,
  Megaphone,
  Pause,
  Play,
  Plus,
  Receipt,
  RefreshCw,
  ShieldCheck,
  Upload,
  UserCheck,
  Users,
} from 'lucide-react';
import { formatCurrencyCents } from '../../services/commerceCore';
import {
  computeAvailableOfferSeats,
  createAdvertisementAdmin,
  createClassOfferAdmin,
  expireClassOfferReservationsAdmin,
  summonNextWaitlistCandidateAdmin,
  transitionSubscriptionAdmin,
  updateAdvertisementAdmin,
  updateClassOfferAdmin,
  uploadAdvertisementBannerAdmin,
} from '../../services/commercePhase3Service';
import type {
  AdvertisementPosition,
  AdvertisementStatus,
  ClassOfferStatus,
  CommerceAdvertisement,
  CommerceClassOffer,
  CommerceEligibleAudience,
  CommerceGlobalConfig,
  CommercePhase3OverviewPayload,
  CommerceProduct,
  CommerceProductPrice,
  SubscriptionStatus,
} from '../../types/commerce';

export interface CommercePhase3SubPanelsProps {
  mode: 'campaigns' | 'class_offers' | 'orders_subs';
  config: CommerceGlobalConfig;
  products: CommerceProduct[];
  prices: CommerceProductPrice[];
  phase3: CommercePhase3OverviewPayload;
  onRefresh: () => Promise<void>;
  onNotify: (msg: string) => void;
  onError: (msg: string | null) => void;
}

const AD_POSITION_LABELS: Record<AdvertisementPosition, string> = {
  home: 'Página inicial',
  courses: 'Área de cursos',
  instruments: 'Página de instrumentos',
  promotions: 'Página de promoções',
  enrollments: 'Página de matrículas',
};

const AD_STATUS_LABELS: Record<AdvertisementStatus, string> = {
  draft: 'Rascunho',
  active: 'Ativa',
  paused: 'Pausada',
  archived: 'Arquivada',
};

const OFFER_STATUS_LABELS: Record<ClassOfferStatus, string> = {
  draft: 'Rascunho',
  scheduled: 'Agendada',
  open: 'Aberta',
  closed: 'Encerrada',
  cancelled: 'Cancelada',
};

const SUB_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  trialing: 'Em avaliação',
  active: 'Ativa',
  past_due: 'Inadimplente / Vencida',
  paused: 'Pausada',
  cancelled: 'Cancelada',
  expired: 'Expirada',
};

function formatDatePtBr(iso?: string | null): string {
  if (!iso) return '—';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const CommercePhase3SubPanels: React.FC<CommercePhase3SubPanelsProps> = ({
  mode,
  config,
  products,
  prices,
  phase3,
  onRefresh,
  onNotify,
  onError,
}) => {
  const [busy, setBusy] = useState<boolean>(false);

  // Formulário de Campanha / Publicidade
  const [adTitle, setAdTitle] = useState('');
  const [adSubtitle, setAdSubtitle] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adCtaText, setAdCtaText] = useState('Conhecer Curso');
  const [adCtaDestination, setAdCtaDestination] = useState('/cursos');
  const [adProductId, setAdProductId] = useState('');
  const [adPosition, setAdPosition] = useState<AdvertisementPosition>('home');
  const [adAudience, setAdAudience] = useState<CommerceEligibleAudience>('all');
  const [adStartsAt, setAdStartsAt] = useState('');
  const [adEndsAt, setAdEndsAt] = useState('');
  const [adInitialStatus, setAdInitialStatus] = useState<AdvertisementStatus>('draft');
  const [previewAdId, setPreviewAdId] = useState<string>('');

  // Edição inline de campanha
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [editAdTitle, setEditAdTitle] = useState('');
  const [editAdSubtitle, setEditAdSubtitle] = useState('');
  const [editAdCtaText, setEditAdCtaText] = useState('');

  // Formulário de Oferta de Turma Paga
  const [offerClassId, setOfferClassId] = useState('');
  const [offerProductId, setOfferProductId] = useState('');
  const [offerPriceId, setOfferPriceId] = useState('');
  const [offerCapacity, setOfferCapacity] = useState('20');
  const [offerStartsAt, setOfferStartsAt] = useState('');
  const [offerEndsAt, setOfferEndsAt] = useState('');
  const [offerWaitlistEnabled, setOfferWaitlistEnabled] = useState(true);
  const [offerInitialStatus, setOfferInitialStatus] = useState<ClassOfferStatus>('draft');

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    onError(null);
    setBusy(true);
    try {
      const created = await createAdvertisementAdmin({
        title: adTitle,
        subtitle: adSubtitle || null,
        description: adDescription,
        ctaText: adCtaText,
        ctaDestination: adCtaDestination,
        productId: adProductId || null,
        targetAudience: adAudience,
        position: adPosition,
        startsAt: adStartsAt ? new Date(adStartsAt).toISOString() : null,
        endsAt: adEndsAt ? new Date(adEndsAt).toISOString() : null,
        status: adInitialStatus,
      });
      setAdTitle('');
      setAdSubtitle('');
      setAdDescription('');
      setPreviewAdId(created.advertisementId);
      onNotify(`Campanha "${created.title}" criada. Você já pode enviar a imagem de banner.`);
      await onRefresh();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Erro ao criar campanha.');
    } finally {
      setBusy(false);
    }
  };

  const handleUploadAdImage = async (advertisementId: string, file: File | null) => {
    if (!file) return;
    onError(null);
    setBusy(true);
    try {
      const updated = await uploadAdvertisementBannerAdmin(advertisementId, file);
      setPreviewAdId(updated.advertisementId);
      onNotify(
        `Banner v${updated.imageVersion} enviado para Storage (${updated.storagePath || 'ok'}). Versões anteriores preservadas.`
      );
      await onRefresh();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Erro no upload do banner.');
    } finally {
      setBusy(false);
    }
  };

  const handleChangeAdStatus = async (ad: CommerceAdvertisement, nextStatus: AdvertisementStatus) => {
    onError(null);
    setBusy(true);
    try {
      await updateAdvertisementAdmin(ad.advertisementId, { status: nextStatus });
      onNotify(`Campanha "${ad.title}" atualizada para "${AD_STATUS_LABELS[nextStatus]}".`);
      await onRefresh();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Erro ao atualizar status da campanha.');
    } finally {
      setBusy(false);
    }
  };

  const handleSaveAdEdits = async (adId: string) => {
    onError(null);
    setBusy(true);
    try {
      await updateAdvertisementAdmin(adId, {
        title: editAdTitle,
        subtitle: editAdSubtitle || null,
        ctaText: editAdCtaText,
      });
      setEditingAdId(null);
      onNotify('Dados da campanha atualizados com sucesso.');
      await onRefresh();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Erro ao editar campanha.');
    } finally {
      setBusy(false);
    }
  };

  const handleCreateClassOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    onError(null);
    const cap = parseInt(offerCapacity, 10);
    if (!offerClassId || !offerProductId || !offerPriceId || !Number.isInteger(cap) || cap < 1) {
      onError('Selecione uma turma existente, produto, versão de preço e capacidade válida.');
      return;
    }
    setBusy(true);
    try {
      const created = await createClassOfferAdmin({
        classId: offerClassId,
        productId: offerProductId,
        priceId: offerPriceId,
        capacity: cap,
        registrationStartsAt: offerStartsAt ? new Date(offerStartsAt).toISOString() : null,
        registrationEndsAt: offerEndsAt ? new Date(offerEndsAt).toISOString() : null,
        status: offerInitialStatus,
        waitlistEnabled: offerWaitlistEnabled,
      });
      setOfferClassId('');
      onNotify(`Oferta comercial criada para turma "${created.className || created.classId}".`);
      await onRefresh();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Erro ao criar oferta de turma.');
    } finally {
      setBusy(false);
    }
  };

  const handleOfferAction = async (
    offer: CommerceClassOffer,
    updates: Partial<CommerceClassOffer>
  ) => {
    onError(null);
    setBusy(true);
    try {
      await updateClassOfferAdmin(offer.offerId, updates);
      onNotify(`Oferta ${offer.offerId} atualizada.`);
      await onRefresh();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Erro ao atualizar oferta de turma.');
    } finally {
      setBusy(false);
    }
  };

  const handleExpireReservations = async (offerId: string) => {
    onError(null);
    setBusy(true);
    try {
      const res = await expireClassOfferReservationsAdmin(offerId);
      onNotify(`${res.expiredCount} reserva(s) expirada(s) e liberada(s) com segurança.`);
      await onRefresh();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Erro ao reconciliar reservas.');
    } finally {
      setBusy(false);
    }
  };

  const handleSummonWaitlist = async (offerId: string) => {
    onError(null);
    setBusy(true);
    try {
      const res = await summonNextWaitlistCandidateAdmin(offerId);
      onNotify(
        `Candidato #${res.summoned.priorityOrder} convocado até ${formatDatePtBr(res.summoned.responseDeadlineAt)}.`
      );
      await onRefresh();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Erro ao convocar lista de espera.');
    } finally {
      setBusy(false);
    }
  };

  const handleSubscriptionTransition = async (
    subscriptionId: string,
    status: SubscriptionStatus
  ) => {
    onError(null);
    setBusy(true);
    try {
      await transitionSubscriptionAdmin(
        subscriptionId,
        status,
        `Alteração manual pelo administrador para "${SUB_STATUS_LABELS[status]}"`
      );
      onNotify(
        `Assinatura ${subscriptionId} alterada para "${SUB_STATUS_LABELS[status]}". Progresso e concessões gratuitas da Fase 1 preservados.`
      );
      await onRefresh();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Erro ao transicionar assinatura.');
    } finally {
      setBusy(false);
    }
  };

  if (mode === 'campaigns') {
    const selectedPreviewAd =
      phase3.advertisements.find((a) => a.advertisementId === previewAdId) ||
      phase3.advertisements[0] ||
      null;

    return (
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-[#141417] border border-[#27272A] flex items-start gap-2.5 text-xs">
          <Lock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white">
              Visibilidade Pública de Anúncios: {config.commerceEnabled && config.advertisementsEnabled ? 'LIBERADA' : 'BLOQUEADA (Fail-Closed)'}
            </span>
            <p className="text-[#A1A1AA] mt-0.5">
              Enquanto <code className="text-zinc-300">advertisementsEnabled</code> estiver desligado, alunos não visualizam nem leem campanhas ou arquivos no Firebase Storage. A pré-visualização abaixo é restrita ao administrador.
            </p>
          </div>
        </div>

        {/* Formulário de Nova Campanha */}
        <form
          onSubmit={handleCreateAd}
          className="p-5 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-4"
        >
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-[#C5A059]" />
            <h3 className="text-sm font-bold text-white">Cadastrar Nova Campanha / Anúncio</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] text-[#A1A1AA] mb-1">Título *</label>
              <input
                type="text"
                value={adTitle}
                onChange={(e) => setAdTitle(e.target.value)}
                placeholder="Ex: Formação Completa de Violão Clássico"
                className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#A1A1AA] mb-1">Subtítulo</label>
              <input
                type="text"
                value={adSubtitle}
                onChange={(e) => setAdSubtitle(e.target.value)}
                placeholder="Ex: Turma com acompanhamento semanal"
                className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] text-[#A1A1AA] mb-1">Descrição</label>
              <textarea
                rows={2}
                value={adDescription}
                onChange={(e) => setAdDescription(e.target.value)}
                placeholder="Texto da campanha exibido quando publicidade estiver ativa..."
                className="w-full p-2.5 rounded-lg bg-[#09090B] border border-[#27272A] text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#A1A1AA] mb-1">Texto do Botão (CTA) *</label>
              <input
                type="text"
                value={adCtaText}
                onChange={(e) => setAdCtaText(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#A1A1AA] mb-1">Destino do Botão *</label>
              <input
                type="text"
                value={adCtaDestination}
                onChange={(e) => setAdCtaDestination(e.target.value)}
                placeholder="/cursos ou https://..."
                className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white font-mono-code"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#A1A1AA] mb-1">Posição no Aplicativo</label>
              <select
                value={adPosition}
                onChange={(e) => setAdPosition(e.target.value as AdvertisementPosition)}
                className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white"
              >
                {Object.entries(AD_POSITION_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-[#A1A1AA] mb-1">Produto Anunciado (Opcional)</label>
              <select
                value={adProductId}
                onChange={(e) => setAdProductId(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white"
              >
                <option value="">Nenhum produto vinculado</option>
                {products.map((p) => (
                  <option key={p.productId} value={p.productId}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-[#A1A1AA] mb-1">Público-Alvo</label>
              <select
                value={adAudience}
                onChange={(e) => setAdAudience(e.target.value as CommerceEligibleAudience)}
                className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white"
              >
                <option value="all">Todos os alunos</option>
                <option value="new_students">Novos alunos (sem turma)</option>
                <option value="enrolled_students">Alunos matriculados em turmas</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-[#A1A1AA] mb-1">Status Inicial</label>
              <select
                value={adInitialStatus}
                onChange={(e) => setAdInitialStatus(e.target.value as AdvertisementStatus)}
                className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white"
              >
                <option value="draft">Rascunho</option>
                <option value="active">Ativa (oculta enquanto flag desligada)</option>
                <option value="paused">Pausada</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-[#A1A1AA] mb-1">Data de Início</label>
              <input
                type="datetime-local"
                value={adStartsAt}
                onChange={(e) => setAdStartsAt(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white font-mono-code"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#A1A1AA] mb-1">Data de Término</label>
              <input
                type="datetime-local"
                value={adEndsAt}
                onChange={(e) => setAdEndsAt(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white font-mono-code"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7B1E2B] hover:bg-[#962535] text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{busy ? 'Salvando...' : 'Criar Campanha'}</span>
          </button>
        </form>

        {/* Pré-visualização Administrativa da Campanha */}
        {selectedPreviewAd && (
          <div className="p-5 rounded-xl bg-[#141417] border border-[#27272A] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059]">
                <Eye className="w-4 h-4" />
                <span>
                  Pré-visualização Administrativa ({AD_POSITION_LABELS[selectedPreviewAd.position]})
                </span>
              </div>
              <span className="text-[10px] font-mono-code text-[#71717A]">
                Versão de imagem: v{selectedPreviewAd.imageVersion}
              </span>
            </div>

            <div className="rounded-xl bg-[#09090B] border border-[#27272A] overflow-hidden grid grid-cols-1 md:grid-cols-3">
              <div className="bg-[#1C1C21] flex items-center justify-center min-h-[150px] border-b md:border-b-0 md:border-r border-[#27272A]">
                {selectedPreviewAd.imageUrl ? (
                  <img
                    src={selectedPreviewAd.imageUrl}
                    alt={selectedPreviewAd.title}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div className="text-center p-4 text-[11px] text-[#71717A] space-y-1">
                    <ImageIcon className="w-6 h-6 mx-auto" />
                    <span className="block">Nenhuma imagem enviada ainda</span>
                  </div>
                )}
              </div>
              <div className="md:col-span-2 p-5 flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono-code uppercase text-[#C5A059]">
                    {AD_POSITION_LABELS[selectedPreviewAd.position]} • {AD_STATUS_LABELS[selectedPreviewAd.status]}
                  </div>
                  <h4 className="text-base font-bold text-white">{selectedPreviewAd.title}</h4>
                  {selectedPreviewAd.subtitle && (
                    <p className="text-xs text-[#E4E4E7]">{selectedPreviewAd.subtitle}</p>
                  )}
                  <p className="text-xs text-[#A1A1AA]">{selectedPreviewAd.description}</p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#7B1E2B] text-white text-xs font-bold">
                    {selectedPreviewAd.ctaText}
                  </span>
                  <span className="text-[10px] font-mono-code text-[#71717A]">
                    Destino: {selectedPreviewAd.ctaDestination}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Campanhas + Upload de Banner (WEBP/PNG/JPEG até 5MB) */}
        <div className="p-5 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-3">
          <h3 className="text-sm font-bold text-white">
            Campanhas Cadastradas ({phase3.advertisements.length})
          </h3>
          {phase3.advertisements.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-[#09090B] border border-[#27272A] text-xs text-[#71717A]">
              Nenhuma campanha cadastrada até o momento.
            </div>
          ) : (
            <div className="space-y-3">
              {phase3.advertisements.map((ad) => (
                <div
                  key={ad.advertisementId}
                  className="p-4 rounded-xl bg-[#09090B] border border-[#27272A] space-y-3"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-white">{ad.title}</span>
                        <span className="px-2 py-0.5 rounded bg-[#27272A] text-[10px] font-mono-code text-[#E4E4E7]">
                          {AD_POSITION_LABELS[ad.position]}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#141417] border border-[#27272A] text-[10px] font-mono-code text-[#C5A059]">
                          {AD_STATUS_LABELS[ad.status]}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#A1A1AA] font-mono-code">
                        Path: {ad.storagePath || 'sem arquivo'} • Versão v{ad.imageVersion} • Preserva {ad.previousStoragePaths?.length || 0} versão(ões) anterior(es)
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewAdId(ad.advertisementId)}
                        className="px-2.5 py-1 rounded-lg bg-[#1C1C21] hover:bg-[#27272A] text-zinc-200 text-[11px] border border-[#27272A] cursor-pointer whitespace-nowrap"
                      >
                        Pré-visualizar
                      </button>

                      <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#271C1F] hover:bg-[#7B1E2B] text-[#C5A059] hover:text-white text-[11px] font-semibold border border-[#7B1E2B]/50 cursor-pointer whitespace-nowrap">
                        <Upload className="w-3 h-3" />
                        <span>Enviar/Editar Banner</span>
                        <input
                          type="file"
                          accept="image/webp,image/png,image/jpeg,.webp,.png,.jpg,.jpeg"
                          className="hidden"
                          disabled={busy}
                          onChange={(e) => {
                            const f = e.target.files?.[0] || null;
                            void handleUploadAdImage(ad.advertisementId, f);
                            e.currentTarget.value = '';
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingAdId(ad.advertisementId);
                          setEditAdTitle(ad.title);
                          setEditAdSubtitle(ad.subtitle || '');
                          setEditAdCtaText(ad.ctaText);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#1C1C21] hover:bg-[#27272A] text-zinc-200 text-[11px] border border-[#27272A] cursor-pointer whitespace-nowrap"
                      >
                        Editar texto
                      </button>

                      {ad.status !== 'active' && (
                        <button
                          type="button"
                          onClick={() => void handleChangeAdStatus(ad, 'active')}
                          disabled={busy}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 text-[11px] border border-emerald-800/60 cursor-pointer whitespace-nowrap"
                        >
                          <Play className="w-3 h-3" />
                          <span>Ativar</span>
                        </button>
                      )}
                      {ad.status === 'active' && (
                        <button
                          type="button"
                          onClick={() => void handleChangeAdStatus(ad, 'paused')}
                          disabled={busy}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 text-[11px] border border-amber-800/60 cursor-pointer whitespace-nowrap"
                        >
                          <Pause className="w-3 h-3" />
                          <span>Pausar</span>
                        </button>
                      )}
                      {ad.status !== 'archived' && (
                        <button
                          type="button"
                          onClick={() => void handleChangeAdStatus(ad, 'archived')}
                          disabled={busy}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1C1C21] hover:bg-[#27272A] text-zinc-400 text-[11px] border border-[#27272A] cursor-pointer whitespace-nowrap"
                        >
                          <Archive className="w-3 h-3" />
                          <span>Arquivar</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {editingAdId === ad.advertisementId && (
                    <div className="pt-3 border-t border-[#27272A] grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      <input
                        type="text"
                        value={editAdTitle}
                        onChange={(e) => setEditAdTitle(e.target.value)}
                        placeholder="Título"
                        className="h-8 px-2.5 rounded-lg bg-[#141417] border border-[#27272A] text-white"
                      />
                      <input
                        type="text"
                        value={editAdSubtitle}
                        onChange={(e) => setEditAdSubtitle(e.target.value)}
                        placeholder="Subtítulo"
                        className="h-8 px-2.5 rounded-lg bg-[#141417] border border-[#27272A] text-white"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editAdCtaText}
                          onChange={(e) => setEditAdCtaText(e.target.value)}
                          placeholder="Botão"
                          className="flex-1 h-8 px-2.5 rounded-lg bg-[#141417] border border-[#27272A] text-white"
                        />
                        <button
                          type="button"
                          onClick={() => void handleSaveAdEdits(ad.advertisementId)}
                          className="px-3 h-8 rounded-lg bg-[#7B1E2B] text-white font-semibold cursor-pointer"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'class_offers') {
    const activePrices = prices.filter((p) => p.status === 'active' && (!offerProductId || p.productId === offerProductId));

    return (
      <div className="space-y-6">
        {/* Criar Oferta Comercial sobre Turma Existente */}
        <form
          onSubmit={handleCreateClassOffer}
          className="p-5 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-4"
        >
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#C5A059]" />
              <span>Criar Oferta Comercial de Turma Existente (class_offers)</span>
            </h3>
            <p className="text-[11px] text-[#A1A1AA] mt-0.5">
              Reutiliza obrigatoriamente uma turma já cadastrada em <code className="text-zinc-300">classes</code> sem duplicar nem recriar o sistema acadêmico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] text-[#A1A1AA] mb-1">Turma Acadêmica Existente *</label>
              <select
                value={offerClassId}
                onChange={(e) => setOfferClassId(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white"
                required
              >
                <option value="">Selecione uma turma...</option>
                {phase3.availableClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.enrolledCount ?? 0}/{cls.maxStudents ?? '∞'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-[#A1A1AA] mb-1">Produto Vinculado *</label>
              <select
                value={offerProductId}
                onChange={(e) => {
                  setOfferProductId(e.target.value);
                  setOfferPriceId('');
                }}
                className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white"
                required
              >
                <option value="">Selecione um produto...</option>
                {products.map((p) => (
                  <option key={p.productId} value={p.productId}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-[#A1A1AA] mb-1">Versão de Preço *</label>
              <select
                value={offerPriceId}
                onChange={(e) => setOfferPriceId(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white"
                required
              >
                <option value="">Selecione um preço ativo...</option>
                {activePrices.map((pr) => (
                  <option key={pr.priceId} value={pr.priceId}>
                    {formatCurrencyCents(pr.amountCents, pr.currency)} (v{pr.version})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-[#A1A1AA] mb-1">Limite de Vagas *</label>
              <input
                type="number"
                min={1}
                max={500}
                value={offerCapacity}
                onChange={(e) => setOfferCapacity(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white font-mono-code"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#A1A1AA] mb-1">Abertura das Inscrições</label>
              <input
                type="datetime-local"
                value={offerStartsAt}
                onChange={(e) => setOfferStartsAt(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white font-mono-code"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#A1A1AA] mb-1">Encerramento das Inscrições</label>
              <input
                type="datetime-local"
                value={offerEndsAt}
                onChange={(e) => setOfferEndsAt(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white font-mono-code"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#A1A1AA] mb-1">Status Inicial</label>
              <select
                value={offerInitialStatus}
                onChange={(e) => setOfferInitialStatus(e.target.value as ClassOfferStatus)}
                className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white"
              >
                <option value="draft">Rascunho</option>
                <option value="scheduled">Agendada</option>
                <option value="open">Aberta (oculta se flag desligada)</option>
              </select>
            </div>

            <div className="flex items-end pb-1">
              <label className="inline-flex items-center gap-2 text-xs text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={offerWaitlistEnabled}
                  onChange={(e) => setOfferWaitlistEnabled(e.target.checked)}
                />
                <span>Habilitar Lista de Espera</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7B1E2B] hover:bg-[#962535] text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Criar Oferta de Turma</span>
          </button>
        </form>

        {/* Lista de Ofertas, Reservas e Lista de Espera */}
        <div className="p-5 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-4">
          <h3 className="text-sm font-bold text-white">
            Ofertas de Turmas Pagas ({phase3.classOffers.length})
          </h3>
          {phase3.classOffers.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-[#09090B] border border-[#27272A] text-xs text-[#71717A]">
              Nenhuma oferta comercial de turma cadastrada ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {phase3.classOffers.map((offer) => {
                const avail = computeAvailableOfferSeats(offer);
                const offerRes = phase3.reservations.filter((r) => r.offerId === offer.offerId);
                const offerWl = phase3.waitlist.filter((w) => w.offerId === offer.offerId);

                return (
                  <div
                    key={offer.offerId}
                    className="p-4 rounded-xl bg-[#09090B] border border-[#27272A] space-y-3"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold text-white">
                            {offer.className || offer.classId}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#27272A] text-[10px] font-mono-code text-[#C5A059]">
                            {OFFER_STATUS_LABELS[offer.status]}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono-code text-[#A1A1AA] tabular-nums">
                          Capacidade: {offer.capacity} • Confirmadas: {offer.confirmedSeats} • Reservadas (pendentes): {offer.reservedSeats} • Livres: {avail}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            void handleOfferAction(offer, {
                              waitlistEnabled: !offer.waitlistEnabled,
                            })
                          }
                          disabled={busy}
                          className="px-2.5 py-1 rounded-lg bg-[#1C1C21] hover:bg-[#27272A] text-zinc-200 text-[11px] border border-[#27272A] cursor-pointer whitespace-nowrap"
                        >
                          {offer.waitlistEnabled ? 'Desativar Espera' : 'Ativar Espera'}
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleExpireReservations(offer.offerId)}
                          disabled={busy}
                          className="px-2.5 py-1 rounded-lg bg-[#1C1C21] hover:bg-[#27272A] text-amber-300 text-[11px] border border-[#27272A] cursor-pointer whitespace-nowrap"
                        >
                          Expirar Pendentes
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleSummonWaitlist(offer.offerId)}
                          disabled={busy}
                          className="px-2.5 py-1 rounded-lg bg-[#1C1C21] hover:bg-[#27272A] text-emerald-300 text-[11px] border border-[#27272A] cursor-pointer whitespace-nowrap"
                        >
                          Convocar Espera
                        </button>
                        {offer.status !== 'open' && offer.status !== 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => void handleOfferAction(offer, { status: 'open' })}
                            disabled={busy}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 text-[11px] border border-emerald-800/60 cursor-pointer whitespace-nowrap"
                          >
                            Abrir Oferta
                          </button>
                        )}
                        {offer.status !== 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => void handleOfferAction(offer, { status: 'cancelled' })}
                            disabled={busy}
                            className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-[11px] border border-rose-800/60 cursor-pointer whitespace-nowrap"
                          >
                            Cancelar Oferta
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[#27272A] text-[11px]">
                      <div>
                        <span className="text-[#A1A1AA] font-semibold block mb-1">
                          Reservas ({offerRes.length})
                        </span>
                        {offerRes.length === 0 ? (
                          <span className="text-[#71717A]">Nenhuma reserva registrada.</span>
                        ) : (
                          <div className="space-y-1 max-h-32 overflow-y-auto font-mono-code">
                            {offerRes.map((r) => (
                              <div key={r.reservationId} className="flex justify-between text-zinc-300">
                                <span className="truncate">{r.studentEmail || r.studentUid}</span>
                                <span className="text-[#C5A059] shrink-0 ml-2">{r.status}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="text-[#A1A1AA] font-semibold block mb-1">
                          Lista de Espera ({offerWl.length})
                        </span>
                        {offerWl.length === 0 ? (
                          <span className="text-[#71717A]">Nenhum candidato em fila.</span>
                        ) : (
                          <div className="space-y-1 max-h-32 overflow-y-auto font-mono-code">
                            {offerWl
                              .slice()
                              .sort((a, b) => a.priorityOrder - b.priorityOrder)
                              .map((w) => (
                                <div key={w.waitlistId} className="flex justify-between text-zinc-300">
                                  <span className="truncate">
                                    #{w.priorityOrder} {w.studentEmail || w.studentUid}
                                  </span>
                                  <span className="text-emerald-400 shrink-0 ml-2">{w.status}</span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // mode === 'orders_subs'
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-[#141417] border border-[#27272A] flex items-start gap-2.5 text-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">
            Gateway Desacoplado (Fail-Closed) • Isolamento de Dados Sensíveis
          </span>
          <p className="text-[#A1A1AA] mt-0.5">
            Nenhum número completo de cartão, CVV ou segredo financeiro é armazenado. Pausar, cancelar ou reembolsar uma assinatura revoga apenas <code className="text-zinc-300">commerce_entitlements</code> e preserva o progresso acadêmico e concessões gratuitas da Fase 1.
          </p>
        </div>
      </div>

      {/* Pedidos & Eventos Webhook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Receipt className="w-4 h-4 text-[#C5A059]" />
            <span>Pedidos & Pagamentos ({phase3.orders.length})</span>
          </div>
          {phase3.orders.length === 0 ? (
            <div className="p-5 text-center rounded-xl bg-[#09090B] border border-[#27272A] text-xs text-[#71717A]">
              Nenhum pedido registrado.
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto text-xs">
              {phase3.orders.map((order) => (
                <div key={order.orderId} className="p-3 rounded-lg bg-[#09090B] border border-[#27272A] space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-code font-bold text-white">{order.orderId}</span>
                    <span className="font-mono-code font-bold text-emerald-400 tabular-nums">
                      {formatCurrencyCents(order.totalCents, order.currency)}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#A1A1AA] flex flex-wrap justify-between gap-1">
                    <span>{order.studentEmail || order.studentUid}</span>
                    <span className="font-mono-code text-[#C5A059]">{order.status}</span>
                  </div>
                  <div className="text-[10px] font-mono-code text-[#71717A]">
                    Snapshot preço v{order.priceSnapshot?.priceVersion} • Desconto: {formatCurrencyCents(order.discountCents, order.currency)} • Ref: {order.providerReference || '—'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <CreditCard className="w-4 h-4 text-[#C5A059]" />
            <span>Eventos Webhook Verificados ({phase3.paymentEvents.length})</span>
          </div>
          {phase3.paymentEvents.length === 0 ? (
            <div className="p-5 text-center rounded-xl bg-[#09090B] border border-[#27272A] text-xs text-[#71717A]">
              Nenhum evento webhook processado até o momento.
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto text-xs">
              {phase3.paymentEvents.map((ev) => (
                <div key={ev.eventId} className="p-3 rounded-lg bg-[#09090B] border border-[#27272A] space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-code text-white">{ev.providerEventId}</span>
                    <span className="font-mono-code text-[11px] text-emerald-400">
                      {ev.processingStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#A1A1AA]">
                    Tipo: {ev.eventType} • HMAC: {ev.signatureVerified ? 'Válida' : 'Inválida'}
                  </div>
                  {ev.rejectionReason && (
                    <div className="text-[10px] text-rose-400 font-mono-code">
                      Motivo rejeição: {ev.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gestão de Assinaturas e Direitos Comerciais */}
      <div className="p-5 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Users className="w-4 h-4 text-[#C5A059]" />
          <span>Assinaturas & Direitos Comerciais ({phase3.subscriptions.length})</span>
        </div>

        {phase3.subscriptions.length === 0 ? (
          <div className="p-5 text-center rounded-xl bg-[#09090B] border border-[#27272A] text-xs text-[#71717A]">
            Nenhuma assinatura recorrente cadastrada ainda.
          </div>
        ) : (
          <div className="space-y-3">
            {phase3.subscriptions.map((sub) => (
              <div
                key={sub.subscriptionId}
                className="p-4 rounded-xl bg-[#09090B] border border-[#27272A] flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono-code font-bold text-white">
                      {sub.subscriptionId}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#27272A] text-[10px] font-mono-code text-[#C5A059]">
                      {SUB_STATUS_LABELS[sub.status]}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#A1A1AA]">
                    Aluno: {sub.studentEmail || sub.studentUid} • Valor:{' '}
                    {formatCurrencyCents(sub.amountCents, sub.currency)} ({sub.billingInterval}) •
                    Expira: {formatDatePtBr(sub.expiresAt || sub.currentPeriodEndAt)}
                  </div>
                  <div className="text-[10px] font-mono-code text-[#71717A]">
                    Cursos: {sub.courseIds.join(', ')} • Histórico cobranças: {sub.billingHistory?.length || 0}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  {sub.status !== 'active' && (
                    <button
                      type="button"
                      onClick={() => void handleSubscriptionTransition(sub.subscriptionId, 'active')}
                      disabled={busy}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 text-[11px] border border-emerald-800/60 cursor-pointer whitespace-nowrap"
                    >
                      <UserCheck className="w-3 h-3" />
                      <span>Reativar</span>
                    </button>
                  )}
                  {sub.status !== 'paused' && sub.status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() => void handleSubscriptionTransition(sub.subscriptionId, 'paused')}
                      disabled={busy}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 text-[11px] border border-amber-800/60 cursor-pointer whitespace-nowrap"
                    >
                      <Pause className="w-3 h-3" />
                      <span>Pausar</span>
                    </button>
                  )}
                  {sub.status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() =>
                        void handleSubscriptionTransition(sub.subscriptionId, 'cancelled')
                      }
                      disabled={busy}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-[11px] border border-rose-800/60 cursor-pointer whitespace-nowrap"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>Cancelar</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
