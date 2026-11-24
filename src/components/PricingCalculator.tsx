import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { FileText, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { EditionId, PRICING_CONFIG, ProposalState } from '../config/pricingConfig';
import { formatUsd, PricingCalculationResult } from '../utils/calculators';

interface PricingCalculatorProps {
  proposal: ProposalState;
  pricing: PricingCalculationResult;
  onUpdateCounts: (edition: EditionId, count: number) => void;
  onUpdateBillingCycle: (cycle: 'monthly' | 'annual') => void;
  onUpdateRate: (edition: EditionId, rate: number) => void;
  onUpdateDiscount: (discount: number) => void;
  onResetRates: () => void;
  onOpenProposal: () => void;
  onNavigate: (id: string) => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  proposal,
  pricing,
  onUpdateCounts,
  onUpdateBillingCycle,
  onUpdateRate,
  onUpdateDiscount,
  onResetRates,
  onOpenProposal,
  onNavigate,
}) => {
  const [showAssumptions, setShowAssumptions] = useState(false);

  const chartData = pricing.breakdown.map((item) => ({
    name: item.shortName,
    monthlyUsd: Number(item.monthlyTotalUsd.toFixed(2)),
    annualUsd: Number(item.annualTotalUsd.toFixed(2)),
    color: item.color,
  }));

  const applyPresetCohort = (business: number, standard: number, plus: number) => {
    onUpdateCounts('business', business);
    onUpdateCounts('standard', standard);
    onUpdateCounts('plus', plus);
  };

  return (
    <section id="pricing" className="border-b border-slate-200 bg-slate-50/50 py-16 lg:py-20">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-blue-700">
              Cloud 11 Commercial Rates · USD per user
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Licensing & Investment Calculator
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Model single-edition or mixed-edition seat allocations. Yearly pricing requires a 12-month commitment; monthly pricing has no commitment. Standard and Plus seat counts synchronize with the Antigravity quota pool calculator below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => applyPresetCohort(0, 20, 10)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
            >
              30-Seat Pilot (20 Std / 10 Plus)
            </button>
            <button
              type="button"
              onClick={() => applyPresetCohort(100, 150, 50)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
            >
              300-Seat Enterprise Mix
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Controls */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-display text-base font-semibold text-slate-950">
                    1. License Counts by Edition
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Enter user seat quantities for each edition.
                  </p>
                </div>

                {/* Billing Duration Toggle */}
                <div
                  role="group"
                  aria-label="Billing duration"
                  className="inline-flex rounded-lg bg-slate-100 p-1"
                >
                  {(['annual', 'monthly'] as const).map((cycle) => {
                    const active = proposal.billingCycle === cycle;
                    return (
                      <button
                        key={cycle}
                        type="button"
                        onClick={() => onUpdateBillingCycle(cycle)}
                        className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-white text-slate-950 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {cycle === 'annual' ? 'Yearly · 12-month commitment' : 'Monthly · no commitment'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 space-y-5">
                {(['business', 'standard', 'plus'] as EditionId[]).map((id) => {
                  const cfg = PRICING_CONFIG.editions[id];
                  const count = proposal.editionCounts[id];
                  const customRate = proposal.customRatesUsd[id];

                  return (
                    <div
                      key={id}
                      className="rounded-lg border border-slate-200 bg-slate-50/50 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <label
                            htmlFor={`seats-${id}`}
                            className="font-display text-sm font-semibold text-slate-950"
                          >
                            {cfg.name}
                          </label>
                          <div className="mt-0.5 text-xs text-slate-500">
                            {cfg.antigravityEligible
                              ? `Includes $${cfg.antigravityMonthlyQuotaUsd}/license/mo Antigravity pool`
                              : 'Core AI edition · No Antigravity pool'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-xs font-semibold text-slate-800 tabular-nums">
                            {formatUsd(customRate)}/user/mo
                          </div>
                          <div className="text-[11px] text-slate-500">{proposal.billingCycle === 'annual' ? 'yearly commitment' : 'no commitment'}</div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <input
                          id={`seats-${id}-range`}
                          type="range"
                          min={0}
                          max={500}
                          step={5}
                          value={Math.min(500, count)}
                          onChange={(e) => onUpdateCounts(id, Number(e.target.value))}
                          aria-label={`${cfg.name} seat slider`}
                          className="h-2 flex-1 cursor-pointer accent-[#1A73E8]"
                        />
                        <input
                          id={`seats-${id}`}
                          type="number"
                          min={0}
                          max={100000}
                          value={count}
                          onChange={(e) =>
                            onUpdateCounts(id, Math.max(0, Number(e.target.value) || 0))
                          }
                          className="w-24 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-right font-mono text-sm font-semibold text-slate-900 tabular-nums focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Optional Commercial Assumptions Override */}
              <div className="mt-5 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAssumptions((prev) => !prev)}
                  className="flex w-full items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-950"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-blue-700" />
                    <span>Adjust Commercial Rates & Assumptions</span>
                  </span>
                  <span className="text-blue-700">{showAssumptions ? 'Hide' : 'Configure'}</span>
                </button>

                {showAssumptions && (
                  <div className="mt-4 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs leading-relaxed text-slate-600">
                      Adjust the Cloud 11 base rates for this proposal. The selected billing cycle determines the default rate.
                    </p>
                    <div className="grid grid-cols-3 gap-2.5">
                      {(['business', 'standard', 'plus'] as EditionId[]).map((id) => (
                        <div key={id}>
                          <label
                            htmlFor={`rate-${id}`}
                            className="block text-[11px] font-medium text-slate-600"
                          >
                            {PRICING_CONFIG.editions[id].shortName} ($/mo)
                          </label>
                          <input
                            id={`rate-${id}`}
                            type="number"
                            min={0}
                            step={0.5}
                            value={proposal.customRatesUsd[id]}
                            onChange={(e) =>
                              onUpdateRate(id, Math.max(0, Number(e.target.value) || 0))
                            }
                            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 font-mono text-xs font-semibold text-slate-900 tabular-nums"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <label
                          htmlFor="discount-pct"
                          className="block text-[11px] font-medium text-slate-600"
                        >
                          Contractual / Volume Discount (%)
                        </label>
                        <input
                          id="discount-pct"
                          type="number"
                          min={0}
                          max={80}
                          value={proposal.discountPercent}
                          onChange={(e) =>
                            onUpdateDiscount(
                              Math.max(0, Math.min(80, Number(e.target.value) || 0))
                            )
                          }
                          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-900 tabular-nums"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={onResetRates}
                        className="mt-5 inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 whitespace-nowrap shrink-0"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Output Dashboard */}
          <div className="space-y-6 lg:col-span-7">
            {/* Top KPI Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-medium text-slate-500">Total Licenses</div>
                <div className="mt-1.5 font-mono text-2xl font-bold text-slate-950 tabular-nums">
                  {pricing.totalLicenses.toLocaleString()}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">Named seats</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-medium text-slate-500">Estimated Monthly</div>
                <div className="mt-1.5 font-mono text-2xl font-bold text-blue-700 tabular-nums">
                  {formatUsd(pricing.estimatedMonthlyUsd, 0)}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">Cloud 11 rate per user/month</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-medium text-slate-500">Estimated Annual</div>
                <div className="mt-1.5 font-mono text-2xl font-bold text-slate-950 tabular-nums">
                  {formatUsd(pricing.estimatedAnnualUsd, 0)}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">12-month estimate</div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-medium text-slate-500">Cost / User / Mo</div>
                <div className="mt-1.5 font-mono text-2xl font-bold text-slate-950 tabular-nums">
                  {formatUsd(pricing.blendedCostPerUserMonthlyUsd)}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">Blended average</div>
              </div>
            </div>

            {/* Edition Breakdown Table */}
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-slate-950">
                  Edition Cost Breakdown ({proposal.billingCycle === 'annual' ? 'Annual Plan View' : 'Monthly Plan View'})
                </h3>
                <span className="text-xs text-slate-500">
                  Currency: USD · Cloud 11 supplied rates
                </span>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[540px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      <th className="py-2.5 pr-4">Edition</th>
                      <th className="px-3 py-2.5 text-right">Seats</th>
                      <th className="px-3 py-2.5 text-right">Rate / Mo</th>
                      <th className="px-3 py-2.5 text-right">Monthly Est.</th>
                      <th className="px-3 py-2.5 text-right">Annual Est.</th>
                      <th className="pl-3 py-2.5 text-right">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {pricing.breakdown.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/70">
                        <td className="py-3 pr-4 font-medium text-slate-900">
                          {row.name}
                        </td>
                        <td className="px-3 py-3 text-right font-mono tabular-nums text-slate-700">
                          {row.licenses.toLocaleString()}
                        </td>
                        <td className="px-3 py-3 text-right font-mono tabular-nums text-slate-700">
                          {formatUsd(row.effectiveMonthlyRateUsd)}
                        </td>
                        <td className="px-3 py-3 text-right font-mono font-semibold tabular-nums text-slate-950">
                          {formatUsd(row.monthlyTotalUsd)}
                        </td>
                        <td className="px-3 py-3 text-right font-mono tabular-nums text-slate-700">
                          {formatUsd(row.annualTotalUsd)}
                        </td>
                        <td className="pl-3 py-3 text-right font-mono tabular-nums text-slate-600">
                          {row.sharePercent.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Visual Cost Distribution Chart */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="mb-3 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    Monthly Spend Distribution by Edition (USD)
                  </span>
                  {pricing.discountPercent > 0 && (
                    <span className="font-mono text-emerald-700">
                      {pricing.discountPercent}% assumption discount applied
                    </span>
                  )}
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        tickFormatter={(val) => `$${val}`}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={76}
                        tick={{ fontSize: 12, fill: '#0F172A', fontWeight: 500 }}
                      />
                      <Tooltip
                        formatter={(value) => [formatUsd(Number(value ?? 0)), 'Monthly Estimate']}
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #E2E8F0',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="monthlyUsd" radius={[0, 4, 4, 0]} barSize={22}>
                        {chartData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Disclaimer + Actions */}
              <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-900">
                  Commercial Pricing:{' '}
                </span>
                {PRICING_CONFIG.commercialDisclaimer}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('antigravity')}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  Inspect Antigravity Quota Impact →
                </button>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onOpenProposal}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1A73E8] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1557B0] whitespace-nowrap shrink-0"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Generate Presales Summary</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
