// =========================================================================
// GUITAR ACADEMY — FASE 3: INTERFACE INDEPENDENTE DE GATEWAY DE PAGAMENTO
// src/services/paymentGateway.ts
// Define o contrato agnóstico de provedor (sem escolher, configurar ou
// conectar provedor real nesta fase — Fail-Closed por padrão).
// =========================================================================

import type { CommerceCurrency, PaymentStatus } from '../types/commerce';

export interface GatewayCreateChargeInput {
  orderId: string;
  studentUid: string;
  studentEmail?: string | null;
  amountCents: number;
  currency: CommerceCurrency;
  description: string;
  idempotencyKey: string;
  metadata?: Record<string, string>;
}

export interface GatewayChargeResult {
  accepted: boolean;
  provider: string;
  providerReference: string;
  status: PaymentStatus;
  checkoutUrl?: string | null;
  expiresAt?: string | null;
}

export interface GatewayStatusResult {
  provider: string;
  providerReference: string;
  status: PaymentStatus;
  amountCents: number;
  currency: CommerceCurrency;
  paidAt?: string | null;
}

export interface GatewayCancelResult {
  cancelled: boolean;
  provider: string;
  providerReference: string;
  status: PaymentStatus;
}

export interface GatewayRefundResult {
  refunded: boolean;
  provider: string;
  providerReference: string;
  refundReference: string;
  refundedAmountCents: number;
  status: PaymentStatus;
}

export interface NormalizedPaymentWebhookEvent {
  provider: string;
  providerEventId: string;
  eventType:
    | 'payment.paid'
    | 'payment.failed'
    | 'payment.cancelled'
    | 'payment.refunded'
    | 'payment.partially_refunded';
  orderId?: string | null;
  providerReference: string;
  amountCents: number;
  currency: CommerceCurrency;
  refundedAmountCents?: number;
  occurredAt: string;
  failureReason?: string | null;
}

export interface PaymentGatewayProvider {
  readonly providerId: string;
  readonly isLiveConfigured: boolean;
  createCharge(input: GatewayCreateChargeInput): Promise<GatewayChargeResult>;
  getChargeStatus(providerReference: string): Promise<GatewayStatusResult>;
  cancelCharge(providerReference: string, reason?: string): Promise<GatewayCancelResult>;
  refundCharge(
    providerReference: string,
    amountCents: number,
    reason?: string
  ): Promise<GatewayRefundResult>;
  parseWebhookEvent(payload: unknown): NormalizedPaymentWebhookEvent;
}

/**
 * Adaptador Fail-Closed padrão da Fase 3: nenhum provedor real conectado,
 * nenhuma credencial presente, nenhuma cobrança real pode ser iniciada.
 */
export const DisabledFailClosedGatewayProvider: PaymentGatewayProvider = {
  providerId: 'unconfigured_fail_closed',
  isLiveConfigured: false,

  async createCharge(): Promise<GatewayChargeResult> {
    throw new Error(
      'gateway/not-configured: Nenhum provedor de pagamento real foi conectado. Modo comercial permanece desativado.'
    );
  },

  async getChargeStatus(): Promise<GatewayStatusResult> {
    throw new Error('gateway/not-configured: Nenhum provedor de pagamento real foi conectado.');
  },

  async cancelCharge(): Promise<GatewayCancelResult> {
    throw new Error('gateway/not-configured: Nenhum provedor de pagamento real foi conectado.');
  },

  async refundCharge(): Promise<GatewayRefundResult> {
    throw new Error('gateway/not-configured: Nenhum provedor de pagamento real foi conectado.');
  },

  parseWebhookEvent(): NormalizedPaymentWebhookEvent {
    throw new Error('gateway/not-configured: Receptor de webhook real desativado nesta fase.');
  },
};
