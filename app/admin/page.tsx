"use client";

import { useState, useCallback } from "react";
import {
  Lock,
  Package,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  FileText,
  Mic,
  Video,
  Star,
} from "lucide-react";

interface Order {
  id: string;
  reading_name: string;
  reading_slug: string;
  amount: number;
  status: string;
  preferred_format: string | null;
  client_question: string;
  delivery_time: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  created_at: string;
  customer_name: string;
  customer_email: string;
  transaction_id: string;
}

type ActiveModal =
  | { type: "deliver"; order: Order }
  | { type: "vip-summary"; order: Order }
  | null;

export default function AdminPage() {
  const [secret, setSecret] = useState<string>(
    () => (typeof window !== "undefined" ? sessionStorage.getItem("admin_secret") ?? "" : ""),
  );
  const [inputSecret, setInputSecret] = useState("");
  const [loginError, setLoginError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [actionStatus, setActionStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Deliver reading state
  const [deliveryUrl, setDeliveryUrl] = useState("");
  const [readerNotes, setReaderNotes] = useState("");
  const [isVoiceNote, setIsVoiceNote] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // VIP summary state
  const [summaryText, setSummaryText] = useState("");
  const [keyThemes, setKeyThemes] = useState("");

  // Auto-load orders once on first render if a stored secret was found
  const hasFetched = useState(false);
  const [, setHasFetched] = hasFetched;
  const didFetch = hasFetched[0];

  const fetchOrders = useCallback(
    async (token: string) => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401) {
            setSecret("");
            setLoginError("Invalid secret. Please try again.");
          }
          return;
        }
        const data = (await res.json()) as { orders: Order[] };
        setOrders(data.orders || []);
      } catch {
        setLoginError("Failed to connect. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Trigger once on mount (outside an effect) when secret is already known
  if (secret && !didFetch) {
    setHasFetched(true);
    fetchOrders(secret);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem("admin_secret", inputSecret);
    setSecret(inputSecret);
    fetchOrders(inputSecret);
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_secret");
    setSecret("");
    setOrders([]);
  }

  async function handleDeliver(e: React.FormEvent) {
    e.preventDefault();
    if (!activeModal || activeModal.type !== "deliver") return;
    setSubmitting(true);
    setActionStatus(null);
    try {
      const res = await fetch("/api/admin/deliver-reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({
          orderId: activeModal.order.id,
          deliveryUrl: deliveryUrl || undefined,
          readerNotes: readerNotes || undefined,
          isVoiceNote,
        }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string; message?: string };
      if (res.ok) {
        setActionStatus({ success: true, message: data.message || "Reading delivered!" });
        setOrders((prev) => prev.filter((o) => o.id !== activeModal.order.id));
        setTimeout(() => { setActiveModal(null); setActionStatus(null); }, 2000);
      } else {
        setActionStatus({ success: false, message: data.error || "Something went wrong." });
      }
    } catch {
      setActionStatus({ success: false, message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVIPSummary(e: React.FormEvent) {
    e.preventDefault();
    if (!activeModal || activeModal.type !== "vip-summary") return;
    setSubmitting(true);
    setActionStatus(null);
    try {
      const res = await fetch("/api/admin/send-vip-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({
          orderId: activeModal.order.id,
          summaryText,
          keyThemes: keyThemes.split("\n").filter((l) => l.trim()),
        }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string; message?: string };
      if (res.ok) {
        setActionStatus({ success: true, message: data.message || "Summary sent!" });
        setOrders((prev) => prev.filter((o) => o.id !== activeModal.order.id));
        setTimeout(() => { setActiveModal(null); setActionStatus(null); }, 2000);
      } else {
        setActionStatus({ success: false, message: data.error || "Something went wrong." });
      }
    } catch {
      setActionStatus({ success: false, message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  function openDeliver(order: Order) {
    setActiveModal({ type: "deliver", order });
    setDeliveryUrl("");
    setReaderNotes("");
    setIsVoiceNote(!order.reading_slug.includes("vip") && order.preferred_format !== "video");
    setActionStatus(null);
  }

  function openVIPSummary(order: Order) {
    setActiveModal({ type: "vip-summary", order });
    setSummaryText("");
    setKeyThemes("");
    setActionStatus(null);
  }

  const isVip = (order: Order) => order.reading_slug === "vip-session";

  // ── Login screen ─────────────────────────────────────────────────────────

  if (!secret) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Lock size={24} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="mt-1 text-sm text-muted-foreground">Karma&apos;s Apothecary — Orders</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle size={16} /> {loginError}
              </div>
            )}
            <input
              type="password"
              placeholder="Admin secret"
              value={inputSecret}
              onChange={(e) => setInputSecret(e.target.value)}
              required
              autoFocus
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Unlock
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ── Main dashboard ────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">Admin — Pending Orders</h1>
            <p className="text-xs text-muted-foreground">{orders.length} orders awaiting fulfillment</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 size={20} className="animate-spin" />
            <span className="ml-2 text-sm">Loading orders…</span>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CheckCircle2 size={48} className="text-green-500" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">All caught up!</h2>
            <p className="mt-1 text-sm text-muted-foreground">No pending orders right now.</p>
            <button
              onClick={() => fetchOrders(secret)}
              className="mt-6 rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-muted"
            >
              Refresh
            </button>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  {/* Left: order info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                        {order.reading_name}
                      </span>
                      {isVip(order) && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-700">
                          <Star size={10} /> VIP
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </span>
                    </div>

                    <h3 className="mt-2 text-base font-semibold text-foreground">{order.customer_name}</h3>
                    <p className="text-sm text-muted-foreground">{order.customer_email}</p>

                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {order.preferred_format === "video" ? <Video size={12} /> : <Mic size={12} />}
                        {order.preferred_format ?? "Voice Note"}
                      </span>
                      <span>${order.amount.toFixed(2)}</span>
                      {order.scheduled_date && (
                        <span>📅 {order.scheduled_date} {order.scheduled_time}</span>
                      )}
                    </div>

                    <div className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm text-foreground">
                      <span className="font-medium text-primary">Question: </span>
                      {order.client_question}
                    </div>
                  </div>

                  {/* Right: action buttons */}
                  <div className="flex flex-col gap-2">
                    {isVip(order) ? (
                      <button
                        onClick={() => openVIPSummary(order)}
                        className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      >
                        <FileText size={15} /> Send VIP Summary
                      </button>
                    ) : (
                      <button
                        onClick={() => openDeliver(order)}
                        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                      >
                        <Send size={15} /> Deliver Reading
                      </button>
                    )}
                    <a
                      href={`mailto:${order.customer_email}?subject=Re: Your ${encodeURIComponent(order.reading_name)}`}
                      className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      Email Client
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Deliver Reading Modal ───────────────────────────────────────── */}
      {activeModal?.type === "deliver" && (
        <ModalBackdrop onClose={() => setActiveModal(null)}>
          <h2 className="mb-1 text-lg font-bold text-foreground">Deliver Reading</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            {activeModal.order.customer_name} — {activeModal.order.reading_name}
          </p>

          <form onSubmit={handleDeliver} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Delivery Link <span className="text-muted-foreground">(Google Drive, Dropbox, etc.)</span>
              </label>
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={deliveryUrl}
                onChange={(e) => setDeliveryUrl(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Format
              </label>
              <div className="flex gap-3">
                {[
                  { value: true, label: "Voice Note 🎧" },
                  { value: false, label: "Written / Video 📄" },
                ].map(({ value, label }) => (
                  <button
                    key={String(value)}
                    type="button"
                    onClick={() => setIsVoiceNote(value)}
                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                      isVoiceNote === value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Personal note to client <span className="text-muted-foreground">(optional)</span>
              </label>
              <textarea
                placeholder="e.g. The cards were very clear for you today..."
                value={readerNotes}
                onChange={(e) => setReaderNotes(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <StatusMessage status={actionStatus} />

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {submitting ? "Sending…" : "Mark Fulfilled & Send Email"}
            </button>
          </form>
        </ModalBackdrop>
      )}

      {/* ── VIP Summary Modal ──────────────────────────────────────────── */}
      {activeModal?.type === "vip-summary" && (
        <ModalBackdrop onClose={() => setActiveModal(null)}>
          <h2 className="mb-1 text-lg font-bold text-foreground">Send VIP Session Summary</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            {activeModal.order.customer_name} — {activeModal.order.reading_name}
          </p>

          <form onSubmit={handleVIPSummary} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Key themes <span className="text-muted-foreground">(one per line, optional)</span>
              </label>
              <textarea
                placeholder={"Healing and release&#10;New love energy incoming&#10;Career pivot by Q1"}
                value={keyThemes}
                onChange={(e) => setKeyThemes(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Session Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Write the full written summary of the session here. The client will receive this exactly as typed..."
                value={summaryText}
                onChange={(e) => setSummaryText(e.target.value)}
                required
                rows={10}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <StatusMessage status={actionStatus} />

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {submitting ? "Sending…" : "Send Summary to Client"}
            </button>
          </form>
        </ModalBackdrop>
      )}
    </main>
  );
}

// ── Shared sub-components ──────────────────────────────────────────────────

function ModalBackdrop({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <Package size={20} className="text-primary" />
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function StatusMessage({ status }: { status: { success: boolean; message: string } | null }) {
  if (!status) return null;
  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
        status.success
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-600"
      }`}
    >
      {status.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {status.message}
    </div>
  );
}
