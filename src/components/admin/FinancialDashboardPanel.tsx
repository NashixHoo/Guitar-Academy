import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  Banknote,
  Calendar,
  CheckCircle2,
  CreditCard,
  FileSpreadsheet,
  Lock,
  Plus,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrencyCents } from '../../services/commerceCore';
import {
  createFinancialAdjustmentAdmin,
  fetchFinancialSummaryAdmin,
  fetchPhase3OverviewAdmin,
} from '../../services/commercePhase3Service';
import type {
  CommerceCurrency,
  CommerceOrder,
  CommercePayment,
  FinancialAdjustmentRecord,
  FinancialSummaryReport,
} from '../../types/commerce';

export interface FinancialDashboardPanelProps {
  onNotify: (msg: string) => void;
}

const ADJUSTMENT_LABELS: Record<FinancialAdjustmentRecord['type'], string> = {
  reconciliation_note: 'Nota de Conciliação',
  manual_credit_note: 'Nota de Crédito Manual',
  refund_adjustment: 'Ajuste de Reembolso',
  chargeback_record: 'Registro de Contestação / Chargeback',
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

export const FinancialDashboardPanel: React.FC<FinancialDashboardPanelProps> = ({
  onNotify,
}) => {
  const { user, isAdmin } = useAuth();
  const [currency, setCurrency] = useState<CommerceCurrency>('BRL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [includeHomologation, setIncludeHomologation] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [report, setReport] = useState<FinancialSummaryReport | null>(null);
  const [orders, setOrders] = useState<CommerceOrder[]>([]);
  const [payments, setPayments] = useState<CommercePayment[]>([]);
  const [adjustments, setAdjustments] = useState<FinancialAdjustmentRecord[]>([]);

  // Formulário de ajuste financeiro auditado
  const [adjType, setAdjType] = useState<FinancialAdjustmentRecord['type']>('reconciliation_note');
  const [adjOrderId, setAdjOrderId] = useState<string>('');
  const [adjAmountReais, setAdjAmountReais] = useState<string>('0');
  const [adjJustification, setAdjJustification] = useState<string>('');

  const loadFinancialData = useCallback(async () => {
    if (!user || !isAdmin) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [summary, overview] = await Promise.all([
        fetchFinancialSummaryAdmin({
          currency,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          includeHomologation,
        }),
        fetchPhase3OverviewAdmin(),
      ]);
      setReport(summary);
      setOrders(overview.orders);
      setPayments(overview.payments);
      setAdjustments(overview.adjustments);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Erro ao carregar dados financeiros reais.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [user, isAdmin, currency, startDate, endDate, includeHomologation]);

  useEffect(() => {
    void loadFinancialData();
  }, [loadFinancialData]);

  const handleSubmitAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const parsedNum = Number(adjAmountReais.replace(',', '.'));
    if (!Number.isFinite(parsedNum)) {
      setErrorMsg('Informe um valor numérico válido (pode ser positivo, zero para nota ou negativo).');
      return;
    }
    const amountCents = Math.round(parsedNum * 100);
    if (adjJustification.trim().length < 10) {
      setErrorMsg('Justificativa administrativa obrigatória com no mínimo 10 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createFinancialAdjustmentAdmin({
        type: adjType,
        orderId: adjOrderId.trim() || null,
        amountCents,
        currency,
        justification: adjJustification.trim(),
      });
      setAdjustments((prev) => [created, ...prev]);
      setAdjAmountReais('0');
      setAdjOrderId('');
      setAdjJustification('');
      onNotify('Ajuste financeiro registrado com trilha imutável em admin_logs.');
      await loadFinancialData();
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Não foi possível registrar o ajuste financeiro.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-200 text-xs flex items-center gap-3">
        <Lock className="w-5 h-5 text-rose-400 shrink-0" />
        <span>
          Acesso restrito exclusivamente a administradores verificados. Professores e alunos não têm acesso ao módulo Financeiro.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Cabeçalho Financeiro */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-[#C5A059]" />
            <h2 className="text-xl sm:text-2xl font-display font-black text-white">
              Financeiro & Conciliação
            </h2>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Indicadores calculados exclusivamente a partir de pedidos, pagamentos, assinaturas e ajustes reais no Firestore. Nenhum dado fictício é exibido.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadFinancialData()}
          disabled={isLoading || isSubmitting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-[#E4E4E7] text-xs font-semibold border border-[#3F3F46] transition cursor-pointer disabled:opacity-50 self-start shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Atualizar Conciliação</span>
        </button>
      </div>

      {/* Banner de Transparência: Sem gateway real / Zero transações reais */}
      <div className="p-4 rounded-xl bg-[#141417] border border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-bold text-white">
              {report?.hasRealTransactions
                ? 'Transações Reais Auditadas Identificadas'
                : 'Nenhuma Transação Real Registrada — Modo Homologação / Fail-Closed'}
            </div>
            <p className="text-[#A1A1AA]">
              Nenhum gateway de pagamento real está conectado e nenhuma cobrança automática está ativa. Valores zerados refletem fielmente a ausência de vendas confirmadas em produção.
            </p>
          </div>
        </div>
        <label className="inline-flex items-center gap-2 text-xs text-[#E4E4E7] cursor-pointer shrink-0 select-none">
          <input
            type="checkbox"
            checked={includeHomologation}
            onChange={(e) => setIncludeHomologation(e.target.checked)}
            className="rounded border-[#3F3F46] bg-[#09090B]"
          />
          <span>Incluir registros de homologação</span>
        </label>
      </div>

      {/* Filtros de Moeda e Período */}
      <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-[11px] text-[#A1A1AA] mb-1">Moeda do Relatório</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CommerceCurrency)}
            className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white"
          >
            <option value="BRL">BRL (R$)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] text-[#A1A1AA] mb-1">
            <Calendar className="w-3 h-3 inline mr-1" />
            Data Inicial
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white font-mono-code"
          />
        </div>

        <div>
          <label className="block text-[11px] text-[#A1A1AA] mb-1">
            <Calendar className="w-3 h-3 inline mr-1" />
            Data Final
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white font-mono-code"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 9 Indicadores Principais */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A]">
          <span className="text-[11px] text-[#A1A1AA] block">1. Total Vendido (Pedidos Pagos)</span>
          <span className="text-2xl font-black font-mono-code text-white mt-1 block tabular-nums">
            {report ? report.totalSoldCount : 0}
          </span>
          <span className="text-[10px] text-[#71717A]">Pedidos aprovados com confirmação</span>
        </div>

        <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A]">
          <span className="text-[11px] text-[#A1A1AA] block">2. Receita Bruta ({currency})</span>
          <span className="text-2xl font-black font-mono-code text-white mt-1 block tabular-nums">
            {formatCurrencyCents(report?.grossRevenueCents ?? 0, currency)}
          </span>
          <span className="text-[10px] text-[#71717A]">
            Descontos aplicados: {formatCurrencyCents(report?.totalDiscountCents ?? 0, currency)}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A]">
          <span className="text-[11px] text-[#A1A1AA] block">3. Receita Líquida ({currency})</span>
          <span className="text-2xl font-black font-mono-code text-emerald-400 mt-1 block tabular-nums">
            {formatCurrencyCents(report?.netRevenueCents ?? 0, currency)}
          </span>
          <span className="text-[10px] text-[#71717A]">
            Após descontos, reembolsos e {report?.adjustmentsCount ?? 0} ajuste(s)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A]">
          <span className="text-[11px] text-[#A1A1AA] block">4. Pedidos Pendentes</span>
          <span className="text-xl font-black font-mono-code text-amber-400 mt-1 block tabular-nums">
            {report?.pendingOrdersCount ?? 0}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A]">
          <span className="text-[11px] text-[#A1A1AA] block">5. Pedidos Aprovados</span>
          <span className="text-xl font-black font-mono-code text-emerald-400 mt-1 block tabular-nums">
            {report?.approvedOrdersCount ?? 0}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A]">
          <span className="text-[11px] text-[#A1A1AA] block">6. Pedidos Recusados / Cancelados</span>
          <span className="text-xl font-black font-mono-code text-rose-400 mt-1 block tabular-nums">
            {report?.refusedOrdersCount ?? 0}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A]">
          <span className="text-[11px] text-[#A1A1AA] block">7. Reembolsos</span>
          <span className="text-xl font-black font-mono-code text-white mt-1 block tabular-nums">
            {report?.refundsCount ?? 0}
          </span>
          <span className="text-[10px] text-[#71717A] tabular-nums">
            Total estornado: {formatCurrencyCents(report?.refundedAmountCents ?? 0, currency)}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A]">
          <span className="text-[11px] text-[#A1A1AA] block">8. Assinaturas Ativas</span>
          <span className="text-xl font-black font-mono-code text-emerald-400 mt-1 block tabular-nums">
            {report?.activeSubscriptionsCount ?? 0}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A]">
          <span className="text-[11px] text-[#A1A1AA] block">9. Assinaturas Vencidas / Past Due</span>
          <span className="text-xl font-black font-mono-code text-amber-400 mt-1 block tabular-nums">
            {report?.overdueOrExpiredSubscriptionsCount ?? 0}
          </span>
        </div>
      </div>

      {/* 10. Vendas por Curso & 11. Vendas por Período & 12. Cupons Utilizados */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <FileSpreadsheet className="w-4 h-4 text-[#C5A059]" />
            <span>10. Vendas por Curso</span>
          </div>
          {!report || report.salesByCourse.length === 0 ? (
            <p className="text-xs text-[#71717A]">
              Nenhuma venda por curso no filtro atual.
            </p>
          ) : (
            <div className="divide-y divide-[#27272A] text-xs">
              {report.salesByCourse.map((row) => (
                <div key={row.courseId} className="py-2 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold text-white">{row.courseTitle}</div>
                    <div className="text-[10px] text-[#71717A] tabular-nums">
                      {row.ordersCount} pedido(s)
                    </div>
                  </div>
                  <div className="text-right font-mono-code tabular-nums">
                    <div className="text-emerald-400 font-bold">
                      {formatCurrencyCents(row.netCents, currency)}
                    </div>
                    <div className="text-[10px] text-[#71717A]">
                      Bruto: {formatCurrencyCents(row.grossCents, currency)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Calendar className="w-4 h-4 text-[#C5A059]" />
            <span>11. Vendas por Período (Mês)</span>
          </div>
          {!report || report.salesByPeriod.length === 0 ? (
            <p className="text-xs text-[#71717A]">
              Nenhuma venda por período no filtro atual.
            </p>
          ) : (
            <div className="divide-y divide-[#27272A] text-xs">
              {report.salesByPeriod.map((row) => (
                <div key={row.periodKey} className="py-2 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-mono-code text-white">{row.periodKey}</div>
                    <div className="text-[10px] text-[#71717A] tabular-nums">
                      {row.ordersCount} pedido(s)
                    </div>
                  </div>
                  <div className="font-mono-code font-bold text-emerald-400 tabular-nums">
                    {formatCurrencyCents(row.netCents, currency)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <CreditCard className="w-4 h-4 text-[#C5A059]" />
            <span>12. Cupons Utilizados</span>
          </div>
          {!report || report.couponUsage.length === 0 ? (
            <p className="text-xs text-[#71717A]">
              Nenhum cupom aplicado em pedidos confirmados.
            </p>
          ) : (
            <div className="divide-y divide-[#27272A] text-xs">
              {report.couponUsage.map((c) => (
                <div key={c.promotionId} className="py-2 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-mono-code font-bold text-[#C5A059]">{c.code}</div>
                    <div className="text-[10px] text-[#71717A] tabular-nums">
                      {c.usesCount} uso(s) confirmado(s)
                    </div>
                  </div>
                  <div className="font-mono-code text-rose-300 tabular-nums">
                    -{formatCurrencyCents(c.discountGrantedCents, currency)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Formulário de Ajuste Financeiro Auditado (Imutável) */}
      <form
        onSubmit={handleSubmitAdjustment}
        className="p-5 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-4"
      >
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#C5A059]" />
            <span>Registrar Ajuste Financeiro Auditado (financial_adjustments)</span>
          </h3>
          <p className="text-[11px] text-[#A1A1AA] mt-0.5">
            Ajustes não alteram pedidos históricos nem sobrescrevem valores já liquidados; cada lançamento é imutável e registrado com justificativa obrigatória em <code className="text-zinc-300">admin_logs</code>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[11px] text-[#A1A1AA] mb-1">Tipo de Ajuste</label>
            <select
              value={adjType}
              onChange={(e) => setAdjType(e.target.value as FinancialAdjustmentRecord['type'])}
              className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white"
            >
              {Object.entries(ADJUSTMENT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-[#A1A1AA] mb-1">Valor do Ajuste ({currency})</label>
            <input
              type="text"
              value={adjAmountReais}
              onChange={(e) => setAdjAmountReais(e.target.value)}
              placeholder="Ex: -49.90 ou 0.00"
              className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white font-mono-code"
            />
          </div>

          <div>
            <label className="block text-[11px] text-[#A1A1AA] mb-1">ID do Pedido (Opcional)</label>
            <input
              type="text"
              value={adjOrderId}
              onChange={(e) => setAdjOrderId(e.target.value)}
              placeholder="ord_..."
              className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white font-mono-code"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-[11px] text-[#A1A1AA] mb-1">
              Justificativa Administrativa Obrigatória (mínimo 10 caracteres)
            </label>
            <input
              type="text"
              value={adjJustification}
              onChange={(e) => setAdjJustification(e.target.value)}
              placeholder="Descreva o motivo técnico ou contábil do ajuste..."
              className="w-full h-9 px-3 rounded-lg bg-[#09090B] border border-[#27272A] text-white"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7B1E2B] hover:bg-[#962535] text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isSubmitting ? 'Registrando...' : 'Registrar Ajuste Auditado'}</span>
        </button>
      </form>

      {/* Histórico de Ajustes e Pedidos Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-3">
          <h3 className="text-xs font-bold text-white">
            Histórico de Ajustes Financeiros ({adjustments.length})
          </h3>
          {adjustments.length === 0 ? (
            <p className="text-xs text-[#71717A]">Nenhum ajuste registrado.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
              {adjustments.map((adj) => (
                <div key={adj.adjustmentId} className="p-3 rounded-lg bg-[#09090B] border border-[#27272A] space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[#C5A059]">{ADJUSTMENT_LABELS[adj.type]}</span>
                    <span className="font-mono-code text-white tabular-nums">
                      {formatCurrencyCents(adj.amountCents, adj.currency)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#E4E4E7]">{adj.justification}</p>
                  <div className="text-[10px] text-[#71717A] font-mono-code">
                    {formatDatePtBr(adj.createdAt)} • {adj.actorEmail || adj.actorUid}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl bg-[#1C1C21] border border-[#27272A] space-y-3">
          <h3 className="text-xs font-bold text-white">
            Pedidos & Pagamentos Reais ({orders.length} pedidos / {payments.length} pagamentos)
          </h3>
          {orders.length === 0 ? (
            <p className="text-xs text-[#71717A]">
              Nenhum pedido registrado no banco até o momento.
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
              {orders.slice(0, 20).map((o) => (
                <div key={o.orderId} className="p-3 rounded-lg bg-[#09090B] border border-[#27272A] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-mono-code text-white truncate">{o.orderId}</div>
                    <div className="text-[10px] text-[#71717A] truncate">
                      {o.studentEmail || o.studentUid} • {o.status}
                      {o.isHomologation ? ' • [Homologação]' : ''}
                    </div>
                  </div>
                  <div className="text-right font-mono-code tabular-nums shrink-0">
                    <div className="text-white font-bold">
                      {formatCurrencyCents(o.totalCents, o.currency)}
                    </div>
                    <div className="text-[10px] text-[#71717A]">{formatDatePtBr(o.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
