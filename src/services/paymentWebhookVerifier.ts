// =========================================================================
// GUITAR ACADEMY — FASE 3: VERIFICADOR DE ASSINATURA DE WEBHOOK (SERVER-ONLY)
// src/services/paymentWebhookVerifier.ts
// Importado exclusivamente pelo backend (server.ts) e suíte de testes Node.
// =========================================================================

import crypto from 'node:crypto';

export function computeWebhookHmacSignature(rawPayload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(rawPayload, 'utf8').digest('hex');
}

export function computePayloadSha256Digest(rawPayload: string): string {
  return crypto.createHash('sha256').update(rawPayload, 'utf8').digest('hex');
}

export function verifyWebhookHmacSignature(
  rawPayload: string,
  signatureHeader: string | undefined | null,
  secret: string | undefined | null
): boolean {
  if (!secret || !secret.trim()) return false;
  if (!signatureHeader || typeof signatureHeader !== 'string') return false;

  const cleanedHeader = signatureHeader.trim().replace(/^sha256=/i, '');
  if (!/^[a-fA-F0-9]{64}$/.test(cleanedHeader)) {
    return false;
  }

  const expectedHex = computeWebhookHmacSignature(rawPayload, secret);
  const expectedBuf = Buffer.from(expectedHex, 'hex');
  const providedBuf = Buffer.from(cleanedHeader.toLowerCase(), 'hex');

  if (expectedBuf.length !== providedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}
