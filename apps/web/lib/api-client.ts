const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    let errorMsg = body?.error ?? "Request failed";
    if (body?.details && Array.isArray(body.details)) {
      const detailsStr = body.details.map((d: any) => `${d.field}: ${d.message}`).join(", ");
      errorMsg = `${errorMsg} - ${detailsStr}`;
    }
    throw new Error(errorMsg);
  }
  return res.json() as Promise<T>;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function apiCheckAuth() {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    credentials: "include",
  });
  return handleResponse<{ authenticated: boolean }>(res);
}

export async function apiLogout() {
  const res = await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return handleResponse<{ success: boolean }>(res);
}

export async function apiSignup(email: string, password: string, name?: string) {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password, name }),
  });
  return handleResponse<{ success: boolean }>(res);
}

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<{ success: boolean }>(res);
}

// ── Upload ────────────────────────────────────────────────────────────────────

export async function apiSignUpload() {
  const res = await fetch(`${API_BASE}/api/upload/sign`, {
    method: "POST",
    credentials: "include",
  });
  return handleResponse<{ signature: string; timestamp: number; apiKey: string; cloudName: string }>(res);
}

// ── Items ─────────────────────────────────────────────────────────────────────

export interface Item {
  id: string;
  userId: string;
  photoUrl: string;
  category: string;
  color?: string;
  pattern?: string;
  season?: string;
  formality?: string;
  brand?: string;
  price?: number;
  purchaseDate?: string;
  source?: string;
  wearCount: number;
  lastWornAt?: string;
  costPerWear?: number;
  createdAt: string;
}

export async function apiCreateItem(data: Partial<Item>) {
  const res = await fetch(`${API_BASE}/api/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<Item>(res);
}

export async function apiAutoTagItem(photoUrl: string) {
  const res = await fetch(`${API_BASE}/api/items/auto-tag`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ photoUrl }),
  });
  return handleResponse<{ category?: string; color?: string; pattern?: string; season?: string; formality?: string }>(res);
}

export async function apiListItems() {
  const res = await fetch(`${API_BASE}/api/items`, {
    credentials: "include",
  });
  return handleResponse<Item[]>(res);
}

export async function apiGetItem(itemId: string) {
  const res = await fetch(`${API_BASE}/api/items/${itemId}`, {
    credentials: "include",
  });
  return handleResponse<Item>(res);
}

export async function apiDeleteItem(itemId: string) {
  const res = await fetch(`${API_BASE}/api/items/${itemId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse<{ success: boolean }>(res);
}

// ── Wear Logs ─────────────────────────────────────────────────────────────────

export interface WearLog {
  id: string;
  itemId: string;
  userId: string;
  occasion?: string;
  wornAt: string;
}

export async function apiLogWear(itemId: string, occasion?: string, wornAt?: string) {
  const res = await fetch(`${API_BASE}/api/items/${itemId}/wearlogs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ occasion, wornAt }),
  });
  return handleResponse<WearLog>(res);
}

export async function apiListWearLogs(itemId: string) {
  const res = await fetch(`${API_BASE}/api/items/${itemId}/wearlogs`, {
    credentials: "include",
  });
  return handleResponse<WearLog[]>(res);
}

// ── Match ─────────────────────────────────────────────────────────────────────

export async function apiMatch(query: string, limit?: number) {
  const res = await fetch(`${API_BASE}/api/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ query, limit }),
  });
  return handleResponse<{ matches: Item[] }>(res);
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export interface CostPerWearEntry {
  id: string;
  brand?: string;
  color?: string;
  category: string;
  wearCount: number;
  price?: number;
  costPerWear?: number;
}

export async function apiCostPerWear() {
  const res = await fetch(`${API_BASE}/api/analytics/cost-per-wear`, {
    credentials: "include",
  });
  return handleResponse<CostPerWearEntry[]>(res);
}

// ── Style Drift ───────────────────────────────────────────────────────────────

export interface StyleDriftEntry {
  period: string;
  categories: Record<string, number>;
  formalities: Record<string, number>;
}

export async function apiStyleDrift() {
  const res = await fetch(`${API_BASE}/api/style/drift`, {
    credentials: "include",
  });
  return handleResponse<StyleDriftEntry[]>(res);
}

// ── Image URL helper ──────────────────────────────────────────────────────────

/** Resolves a relative `/uploads/…` path to a full URL. Pass-through for absolute URLs. */
export function resolveImageUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}
