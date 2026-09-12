import "server-only";

const PAYSTACK_API = "https://api.paystack.co";

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured");
  return key;
}

interface InitializeTransactionParams {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

interface InitializeTransactionResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export async function initializeTransaction(
  params: InitializeTransactionParams,
): Promise<InitializeTransactionResult> {
  const res = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKobo,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message ?? `Paystack initialize failed with status ${res.status}`);
  }

  return {
    authorizationUrl: json.data.authorization_url,
    accessCode: json.data.access_code,
    reference: json.data.reference,
  };
}

export interface VerifyTransactionResult {
  status: "success" | "failed" | "abandoned" | "pending" | string;
  amountKobo: number;
  reference: string;
  metadata: Record<string, unknown> | null;
}

export async function verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
  const res = await fetch(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey()}` },
  });

  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message ?? `Paystack verify failed with status ${res.status}`);
  }

  return {
    status: json.data.status,
    amountKobo: json.data.amount,
    reference: json.data.reference,
    metadata: json.data.metadata ?? null,
  };
}
