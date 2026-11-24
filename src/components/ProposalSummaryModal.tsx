import React, { useEffect } from 'react';
import { CheckCircle2, Download, Printer, X } from 'lucide-react';
import { PRICING_CONFIG, ProposalState } from '../config/pricingConfig';
import { COMPARISON_EDITIONS } from '../data/geminiEditions';
import { CLOUD11_SERVICES, ENGAGEMENT_STAGES } from '../data/portalContent';
import {
  AntigravityCalculationResult,
  buildProposalSummaryText,
  formatUsd,
  PricingCalculationResult,
} from '../utils/calculators';

interface ProposalSummaryModalProps {
  open: boolean;
  onClose: () => void;
  proposal: ProposalState;
  pricing: PricingCalculationResult;
  antigravity: AntigravityCalculationResult;
  onUpdateCustomerName: (name: string) => void;
  onUpdateContactName: (name: string) => void;
}

export const ProposalSummaryModal: React.FC<ProposalSummaryModalProps> = ({
  open,
  onClose,
  proposal,
  pricing,
  antigravity,
  onUpdateCustomerName,
  onUpdateContactName,
}) => {
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('printing-proposal');
    return () => {
      document.body.classList.remove('printing-proposal');
    };
  }, [open]);

  if (!open) return null;

  const handleDownloadText = () => {
    const content = buildProposalSummaryText(proposal, pricing, antigravity);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const slug = (proposal.customerName || 'enterprise-customer')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    a.download = `cloud11-gemini-proposal-${slug}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    document.body.classList.add('printing-proposal');
    window.print();
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const activeServices =
    proposal.selectedServices.length > 0
      ? CLOUD11_SERVICES.filter((s) => proposal.selectedServices.includes(s.title))
      : CLOUD11_SERVICES.slice(0, 4);

  const activeEditionsWithSeats = pricing.breakdown.filter((b) => b.licenses > 0);
  const editionsToDisplay =
    activeEditionsWithSeats.length > 0 ? activeEditionsWithSeats : pricing.breakdown;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-5 backdrop-blur-sm print:static print:block print:bg-white print:p-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proposal-modal-title"
    >
      <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl print:max-h-none print:max-w-none print:overflow-visible print:rounded-none print:border-0 print:shadow-none">
        {/* Sticky Screen Action Bar */}
        <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-6 py-3.5 backdrop-blur-md no-print">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/Cloud-11-Logo-Header_e48843a5.png"
              alt="Cloud 11"
              className="h-7 w-auto object-contain shrink-0"
            />
            <span className="hidden h-5 w-px bg-slate-200 sm:inline-block" aria-hidden="true" />
            <div>
              <div className="text-[11px] font-semibold text-blue-700">
                Google Cloud Premier Partner
              </div>
              <h2
                id="proposal-modal-title"
                className="font-display text-sm font-bold text-slate-950 sm:text-base"
              >
                Customer Proposal Summary
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadText}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap shrink-0"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download TXT</span>
            </button>
            <button
              type="button"
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A73E8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1557B0] whitespace-nowrap shrink-0"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close proposal summary"
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modern Executive Proposal Document Canvas */}
        <div className="bg-white">
          {/* Top Brand Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#0F172A] via-[#1A73E8] to-[#06B6D4]" />

          <div className="space-y-7 p-6 sm:p-10 print:space-y-5 print:p-0 print:pt-5">
            {/* Executive Letterhead */}
            <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-start print:flex-row print:items-start">
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/aistudio/Cloud-11-Logo-Header_e48843a5.png"
                    alt="Cloud 11"
                    className="h-9 w-auto object-contain"
                  />
                  <span className="h-6 w-px bg-slate-200" aria-hidden="true" />
                  <span className="text-xs font-semibold tracking-tight text-slate-600">
                    Google Cloud Premier Partner
                  </span>
                </div>
                <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Google Gemini Enterprise
                  <span className="block text-blue-700">Executive Proposal Summary</span>
                </h1>
                <p className="mt-1.5 text-xs text-slate-500">
                  Licensing Estimate · Antigravity Pooled Quota Architecture · Cloud 11 Delivery Scope
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-4 text-xs sm:min-w-[260px]">
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  <span className="text-slate-500">Date</span>
                  <span className="font-medium text-slate-900 text-right">{formattedDate}</span>

                  <span className="text-slate-500">Currency</span>
                  <span className="font-mono font-semibold text-slate-900 text-right">USD ($)</span>

                  <span className="text-slate-500">Billing View</span>
                  <span className="font-medium capitalize text-slate-900 text-right">
                    {proposal.billingCycle}
                  </span>

                  <span className="text-slate-500">Region</span>
                  <span className="font-medium text-slate-900 text-right">EG · KSA · UAE · QA</span>
                </div>
              </div>
            </div>

            {/* Client & Stakeholder Preparation Banner */}
            <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2 print:grid-cols-2 print:bg-slate-50">
              <div>
                <label
                  htmlFor="prop-customer-name"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                >
                  Prepared For Organization
                </label>
                <input
                  id="prop-customer-name"
                  type="text"
                  value={proposal.customerName}
                  onChange={(e) => onUpdateCustomerName(e.target.value)}
                  placeholder="Enter customer organization name"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-display text-base font-bold text-slate-950 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 no-print"
                />
                <div className="mt-1 hidden font-display text-lg font-bold text-slate-950 print:block">
                  {proposal.customerName.trim() || 'Enterprise Customer Organization'}
                </div>
              </div>

              <div>
                <label
                  htmlFor="prop-contact-name"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                >
                  Executive / Technical Stakeholder
                </label>
                <input
                  id="prop-contact-name"
                  type="text"
                  value={proposal.contactName}
                  onChange={(e) => onUpdateContactName(e.target.value)}
                  placeholder="e.g., CIO / IT Director"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-semibold text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 no-print"
                />
                <div className="mt-1 hidden text-base font-semibold text-slate-900 print:block">
                  {proposal.contactName.trim() || 'Executive & IT Leadership'}
                </div>
              </div>
            </div>

            {/* Executive Snapshot Metrics */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 print:grid-cols-4 print-break-inside-avoid">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-[11px] font-medium text-slate-500">Total Licenses</div>
                <div className="mt-1 font-mono text-2xl font-bold text-slate-950 tabular-nums">
                  {pricing.totalLicenses.toLocaleString()}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500">Named enterprise seats</div>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                <div className="text-[11px] font-medium text-blue-900">Est. Monthly Spend</div>
                <div className="mt-1 font-mono text-2xl font-bold text-blue-800 tabular-nums">
                  {formatUsd(pricing.estimatedMonthlyUsd)}
                </div>
                <div className="mt-0.5 text-[11px] text-blue-800">
                  {formatUsd(pricing.blendedCostPerUserMonthlyUsd)}/user avg
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-950 p-4 text-white">
                <div className="text-[11px] font-medium text-slate-300">Est. Annual Spend</div>
                <div className="mt-1 font-mono text-2xl font-bold text-white tabular-nums">
                  {formatUsd(pricing.estimatedAnnualUsd)}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-300">12-month projection</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-[11px] font-medium text-slate-500">
                  Antigravity Included Pool
                </div>
                <div className="mt-1 font-mono text-2xl font-bold text-slate-950 tabular-nums">
                  {formatUsd(antigravity.totalIncludedQuotaUsd)}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-slate-500 tabular-nums">
                  {formatUsd(antigravity.totalWeeklyEquivalentUsd)}/wk equivalent
                </div>
              </div>
            </div>

            {/* Section 1: Selected Editions & Licensing Breakdown */}
            <div className="print-break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-base font-bold text-slate-950">
                  01. Selected Editions & Indicative Licensing Estimate
                </h3>
                <span className="text-xs text-slate-500">
                  {pricing.discountPercent > 0
                    ? `Includes ${pricing.discountPercent}% planning discount assumption`
                    : 'Indicative USD planning rates'}
                </span>
              </div>

              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                      <th className="px-4 py-3">Edition & Indexing Entitlement</th>
                      <th className="px-4 py-3 text-right">Licenses</th>
                      <th className="px-4 py-3 text-right">Rate / Mo</th>
                      <th className="px-4 py-3 text-right">Monthly Est.</th>
                      <th className="px-4 py-3 text-right">Annual Est.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {editionsToDisplay.map((row) => {
                      const meta = COMPARISON_EDITIONS[row.id];
                      return (
                        <tr key={row.id}>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-950">{row.name}</div>
                            <div className="mt-0.5 text-[11px] text-slate-500">
                              {meta.seatRule} · {meta.storageRule} indexing · Antigravity:{' '}
                              {meta.antigravityRule}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-medium tabular-nums text-slate-800">
                            {row.licenses.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700">
                            {formatUsd(row.effectiveMonthlyRateUsd)}
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums text-slate-950">
                            {formatUsd(row.monthlyTotalUsd)}
                          </td>
                          <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700">
                            {formatUsd(row.annualTotalUsd)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-slate-200 bg-slate-50 font-semibold text-slate-950">
                      <td className="px-4 py-3">Total Licensing Investment</td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums">
                        {pricing.totalLicenses.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums">
                        {formatUsd(pricing.blendedCostPerUserMonthlyUsd)} avg
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-blue-700 tabular-nums">
                        {formatUsd(pricing.estimatedMonthlyUsd)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums">
                        {formatUsd(pricing.estimatedAnnualUsd)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Section 2: Antigravity Pooled Quota & Overage Governance */}
            <div className="print-break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-base font-bold text-slate-950">
                  02. Antigravity Pooled Quota & Overage Governance
                </h3>
                <span className="text-xs text-slate-500">
                  Standard ($10/seat) and Plus ($15/seat) pools remain strictly separate
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2 print:grid-cols-2">
                {/* Standard Pool Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div>
                      <div className="text-[11px] font-semibold text-blue-700">
                        Standard Pool ($10 / license / mo)
                      </div>
                      <div className="font-display text-sm font-bold text-slate-950">
                        Gemini Enterprise Standard
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-lg font-bold text-slate-950 tabular-nums">
                        {formatUsd(antigravity.standard.includedPoolUsd)}/mo
                      </div>
                      <div className="font-mono text-[11px] text-slate-500 tabular-nums">
                        {formatUsd(antigravity.standard.weeklyEquivalentUsd)}/wk
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-slate-500">Assigned</div>
                      <div className="font-mono font-semibold text-slate-900 tabular-nums">
                        {antigravity.standard.assignedLicenses} seats
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Unassigned</div>
                      <div className="font-mono font-semibold text-blue-700 tabular-nums">
                        {antigravity.standard.unassignedLicenses} seats
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Overage Cap</div>
                      <div className="font-mono font-semibold text-amber-800 tabular-nums">
                        {formatUsd(antigravity.standard.overageBudgetUsd)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plus Pool Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-600">
                        Plus Pool ($15 / license / mo)
                      </div>
                      <div className="font-display text-sm font-bold text-slate-950">
                        Gemini Enterprise Plus
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-lg font-bold text-slate-950 tabular-nums">
                        {formatUsd(antigravity.plus.includedPoolUsd)}/mo
                      </div>
                      <div className="font-mono text-[11px] text-slate-500 tabular-nums">
                        {formatUsd(antigravity.plus.weeklyEquivalentUsd)}/wk
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-slate-500">Assigned</div>
                      <div className="font-mono font-semibold text-slate-900 tabular-nums">
                        {antigravity.plus.assignedLicenses} seats
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Unassigned</div>
                      <div className="font-mono font-semibold text-blue-700 tabular-nums">
                        {antigravity.plus.unassignedLicenses} seats
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Overage Cap</div>
                      <div className="font-mono font-semibold text-amber-800 tabular-nums">
                        {formatUsd(antigravity.plus.overageBudgetUsd)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl border border-blue-200 bg-blue-50/40 p-4 text-xs sm:grid-cols-4 print:grid-cols-4">
                <div>
                  <div className="text-slate-600">Combined Included Quota</div>
                  <div className="mt-0.5 font-mono text-sm font-bold text-slate-950 tabular-nums">
                    {formatUsd(antigravity.totalIncludedQuotaUsd)}/mo
                  </div>
                </div>
                <div>
                  <div className="text-slate-600">Weekly Equivalent (÷ 4)</div>
                  <div className="mt-0.5 font-mono text-sm font-bold text-slate-950 tabular-nums">
                    {formatUsd(antigravity.totalWeeklyEquivalentUsd)}/wk
                  </div>
                </div>
                <div>
                  <div className="text-slate-600">Admin Overage Ceiling</div>
                  <div className="mt-0.5 font-mono text-sm font-bold text-amber-800 tabular-nums">
                    {formatUsd(antigravity.totalOverageBudgetUsd)}/mo
                  </div>
                </div>
                <div>
                  <div className="text-slate-600">Max Spending Envelope</div>
                  <div className="mt-0.5 font-mono text-sm font-bold text-blue-950 tabular-nums">
                    {formatUsd(antigravity.totalSpendingEnvelopeUsd)}/mo
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Recommended Cloud 11 Services & Engagement Plan */}
            <div className="print-break-inside-avoid">
              <h3 className="font-display text-base font-bold text-slate-950">
                03. Recommended Cloud 11 Services & Delivery Approach
              </h3>

              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 print:grid-cols-2">
                {activeServices.map((svc) => (
                  <div
                    key={svc.index}
                    className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50/60 p-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                    <div>
                      <div className="text-xs font-bold text-slate-950">
                        {svc.index}. {svc.title}
                      </div>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">
                        {svc.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 5-Stage Delivery Strip */}
              <div className="mt-3 grid grid-cols-5 gap-2 rounded-xl border border-slate-200 bg-white p-3">
                {ENGAGEMENT_STAGES.map((stage) => (
                  <div key={stage.step} className="text-left">
                    <div className="font-mono text-[10px] font-semibold text-blue-700">
                      {stage.step}
                    </div>
                    <div className="font-display text-xs font-bold text-slate-950">
                      {stage.name}
                    </div>
                    <div className="mt-0.5 text-[10px] leading-snug text-slate-500">
                      {stage.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Assumptions & Governance Disclaimers */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[11px] leading-relaxed text-slate-600 print-break-inside-avoid">
              <div className="font-semibold text-slate-900">
                04. Important Commercial & Technical Assumptions
              </div>
              <ul className="mt-2 space-y-1">
                <li>• {PRICING_CONFIG.commercialDisclaimer}</li>
                <li>• {PRICING_CONFIG.weeklyAssumptionNote}</li>
                <li>
                  • Antigravity quota is pooled at the Google Cloud project level by edition; both assigned and unassigned licenses contribute to their applicable pool, while Standard and Plus pools remain strictly separate.
                </li>
                <li>
                  • Administrator-configured overage budgets act as spending ceilings to prevent developer workflow interruption—not extra free included quota—and actual consumption depends on model selection and inference workloads rather than guaranteed prompt or token counts.
                </li>
              </ul>
            </div>

            {/* Print Document Footer */}
            <div className="hidden print:flex items-center justify-between border-t border-slate-200 pt-4 text-[10px] text-slate-500">
              <span>
                Cloud 11 · Google Cloud Premier Partner · Egypt · Saudi Arabia · UAE · Qatar
              </span>
              <span>Indicative Presales Summary — Subject to Official Cloud 11 Quotation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
