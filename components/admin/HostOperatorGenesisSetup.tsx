"use client";

import React, { useState, useEffect, useId } from "react";

export interface HostOperatorSetupStatus {
  isConfigured: boolean;
  operatorName?: string;
  operatorEmail?: string;
  hostname: string;
  localIpv4: string;
  hasEnvKey?: boolean;
  primaryTenantId?: string;
}

export interface HostOperatorTelemetry {
  hostStorage?: {
    usedPct?: number;
    freeBytes?: number;
    totalBytes?: number;
  };
  cpuCores?: number;
  totalRamBytes?: number;
  computeHeadroomPct?: number;
}

export interface HostOperatorGenesisSetupProps {
  initialStatus?: HostOperatorSetupStatus;
  initialTelemetry?: HostOperatorTelemetry;
  suggestedKey?: string;
  port?: number;
  apiEndpoint?: string;
  onSuccess?: (result: { token?: string; operatorName: string }) => void;
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export function HostOperatorGenesisSetup({
  initialStatus = {
    isConfigured: false,
    operatorName: "Sean Halls",
    operatorEmail: "aloha@seanhalls.online",
    hostname: "bindu.local",
    localIpv4: "192.168.84.241",
  },
  initialTelemetry = {
    hostStorage: { usedPct: 60.0, freeBytes: 184.2 * 1024 * 1024 * 1024, totalBytes: 460.4 * 1024 * 1024 * 1024 },
    cpuCores: 8,
    totalRamBytes: 32 * 1024 * 1024 * 1024,
    computeHeadroomPct: 65.0,
  },
  suggestedKey = "bindu_sec_genesis_root_sovereign_key",
  port = 3033,
  apiEndpoint = "/setup/operator/genesis",
  onSuccess,
}: HostOperatorGenesisSetupProps) {
  const [operatorName, setOperatorName] = useState(initialStatus.operatorName || "Sean Halls");
  const [operatorEmail, setOperatorEmail] = useState(initialStatus.operatorEmail || "aloha@seanhalls.online");
  const [genesisKey, setGenesisKey] = useState(suggestedKey);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const nameInputId = useId();
  const emailInputId = useId();
  const keyInputId = useId();

  // Storage metric parsing
  const usedPct = initialTelemetry.hostStorage?.usedPct ?? 60.0;
  const freeDisk = initialTelemetry.hostStorage?.freeBytes
    ? formatBytes(initialTelemetry.hostStorage.freeBytes)
    : "184.2 GB";
  const totalDisk = initialTelemetry.hostStorage?.totalBytes
    ? formatBytes(initialTelemetry.hostStorage.totalBytes)
    : "460.4 GB";
  const cpuCores = initialTelemetry.cpuCores || 8;
  const totalRam = initialTelemetry.totalRamBytes
    ? formatBytes(initialTelemetry.totalRamBytes)
    : "32.0 GB";
  const headroomPct = initialTelemetry.computeHeadroomPct ?? 65.0;

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2400);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleCopyKey = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(genesisKey);
        showToast("Genesis Master Key copied to clipboard.");
      } else {
        const input = document.getElementById(keyInputId) as HTMLInputElement | null;
        if (input) {
          input.select();
          document.execCommand("copy");
          showToast("Genesis Master Key copied.");
        }
      }
    } catch {
      showToast("Press Cmd+C to copy key.");
    }
  };

  const handleRegenerateKey = () => {
    const arr = new Uint8Array(16);
    if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
      window.crypto.getRandomValues(arr);
      const hex = Array.from(arr)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setGenesisKey(`bindu_sec_${hex}`);
      showToast("Generated new cryptographic Genesis Key.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operatorName: operatorName.trim(),
          operatorEmail: operatorEmail.trim(),
          genesisKey: genesisKey.trim(),
          hostname: initialStatus.hostname || "bindu.local",
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setIsSuccess(true);
        if (onSuccess) {
          onSuccess({ token: data.data?.token, operatorName });
        } else {
          setTimeout(() => {
            window.location.href = "/?authenticated=1";
          }, 1800);
        }
      } else {
        setErrorMsg(data.error?.message || "Failed to initialize operator genesis record.");
      }
    } catch (err: any) {
      setErrorMsg(`Network communication failure: ${err.message || String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-600" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-serif">
                Host Operator Genesis Setup
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-slate-500 max-w-2xl leading-relaxed">
                Establish root administrative sovereignty, configure primary tenant credentials, and activate permanent local mDNS broadcasting for bindu.local.
              </p>
            </div>
            <div className="flex-shrink-0">
              <span
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  initialStatus.isConfigured
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                {initialStatus.isConfigured ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Operator Established
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Genesis Pending
                  </>
                )}
              </span>
            </div>
          </div>
        </section>

        {/* Existing Operator Notice Banner (if configured) */}
        {initialStatus.isConfigured && (
          <section className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Host Operator Already Active</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Node sovereignty registered to <strong className="text-slate-700">{operatorName}</strong> on{" "}
                  <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-800 text-[11px]">{initialStatus.hostname}</code>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/?authenticated=1"
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-sm transition-all"
              >
                Return to Gateway
              </a>
            </div>
          </section>
        )}

        {/* 4-Section Setup Wizard Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SECTION 1: Host Node & LAN Topology */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-3 pb-4 mb-4 border-b border-slate-100">
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600 ring-1 ring-blue-500/20">
                  Step 1
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Host Node &amp; LAN Topology</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Deterministic broadcast parameters for sovereign LAN mesh</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">Local mDNS Hostname</span>
                  <span className="font-mono font-semibold text-blue-600">{initialStatus.hostname || "bindu.local"}</span>
                </div>
                <div className="flex justify-between items-center px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">Physical Node Hostname</span>
                  <span className="font-mono font-semibold text-slate-800">{initialStatus.hostname}</span>
                </div>
                <div className="flex justify-between items-center px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">Broadcast IPv4</span>
                  <span className="font-mono font-semibold text-slate-800">{initialStatus.localIpv4}</span>
                </div>
                <div className="flex justify-between items-center px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">Listening Ports</span>
                  <span className="font-mono font-semibold text-slate-800">HTTP :{port} · HTTPS :443</span>
                </div>
                <div className="flex justify-between items-center px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">mDNS Multicast Status</span>
                  <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    224.0.0.251:5353 Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Operator Identity & Key */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-3 pb-4 mb-4 border-b border-slate-100">
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600 ring-1 ring-blue-500/20">
                  Step 2
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Operator Identity &amp; Key</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Root administrative identity and sovereign access token</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor={nameInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Operator Full Name
                  </label>
                  <input
                    id={nameInputId}
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor={emailInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Operator Notification Email
                  </label>
                  <input
                    id={emailInputId}
                    type="email"
                    value={operatorEmail}
                    onChange={(e) => setOperatorEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor={keyInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Genesis Host Master Key
                  </label>
                  <div className="flex items-stretch border border-slate-300 rounded-lg bg-white overflow-hidden focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <input
                      id={keyInputId}
                      type="text"
                      value={genesisKey}
                      onChange={(e) => setGenesisKey(e.target.value)}
                      spellCheck={false}
                      required
                      className="flex-1 px-3.5 py-2.5 font-mono text-xs text-slate-900 bg-transparent outline-none min-w-0"
                    />
                    <button
                      type="button"
                      onClick={handleRegenerateKey}
                      title="Generate new cryptographic key"
                      aria-label="Generate new cryptographic key"
                      className="px-3 border-l border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyKey}
                      title="Copy key to clipboard"
                      aria-label="Copy key to clipboard"
                      className="px-3 border-l border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Compute Swarm & Storage Probing */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-3 pb-4 mb-4 border-b border-slate-100">
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600 ring-1 ring-blue-500/20">
                  Step 3
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Compute Swarm &amp; Storage Probing</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Storage and compute capacity monitor baseline</p>
                </div>
              </div>

              {/* Modern Progress Bar */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg mb-4">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-500 font-medium">Storage Capacity</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {usedPct.toFixed(1)}% used · {freeDisk} free of {totalDisk}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, usedPct))}%` }}
                  />
                </div>
              </div>

              {/* Stat Micro-Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg flex flex-col justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Host Memory (RAM)</span>
                  <span className="font-mono text-sm font-bold text-slate-900 mt-1">{totalRam}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Physical Memory</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg flex flex-col justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">CPU Cores</span>
                  <span className="font-mono text-sm font-bold text-slate-900 mt-1">{cpuCores} Cores</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Physical / Logical</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg flex flex-col justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">GPU Provisioning</span>
                  <span className="font-mono text-sm font-bold text-slate-900 mt-1">4 Slots</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Reservable Swarm</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg flex flex-col justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Dynamic Headroom</span>
                  <span className="font-mono text-sm font-bold text-blue-600 mt-1">{headroomPct.toFixed(1)}%</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Reserved Headroom</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Genesis Activation */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-3 pb-4 mb-4 border-b border-slate-100">
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600 ring-1 ring-blue-500/20">
                  Step 4
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Genesis Activation</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Commit credentials and enforce node sovereignty</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4">
                Activating genesis writes the primary operator record into the local PostgreSQL/SQLite core, provisions the operator JWT, and enables elevated host authority across all LAN devices.
              </p>

              {errorMsg && (
                <div className="p-3.5 mb-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Initializing Genesis...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {initialStatus.isConfigured ? "Update Operator Credentials →" : "Initialize & Claim Sovereign Node →"}
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-400">
                  Local node authorization is verified via loopback socket.
                </p>
              </div>

              {isSuccess && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Node Sovereignty Established Successfully
                  </div>
                  <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                    Operator identity committed. Authentication token registered. Local mDNS active at{" "}
                    <strong className="font-mono">http://bindu.local:{port}</strong>.
                  </p>
                  <a
                    href="/?authenticated=1"
                    className="mt-3 inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
                  >
                    Enter Bindu Gateway →
                  </a>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Global Toast Pill Notification */}
        {toastMessage && (
          <aside
            role="status"
            aria-live="polite"
            className="fixed bottom-6 right-6 px-4 py-2.5 bg-slate-900 text-white rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 z-50 animate-bounce duration-300"
          >
            <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>{toastMessage}</span>
          </aside>
        )}
      </div>
    </div>
  );
}

export default HostOperatorGenesisSetup;
