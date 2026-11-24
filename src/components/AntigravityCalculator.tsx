import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  ArrowRight,
  Download,
  FileText,
  Info,
  Printer,
  ShieldAlert,
} from 'lucide-react';
import { PRICING_CONFIG, ProposalState } from '../config/pricingConfig';
import {
  AntigravityCalculationResult,
  formatUsd,
  PoolSimulation,
} from '../utils/calculators';

interface AntigravityCalculatorProps {
  proposal: ProposalState;
  antigravity: AntigravityCalculationResult;
  onUpdateStandardLicenses: (count: number) => void;
  onUpdatePlusLicenses: (count: number) => void;
  onUpdateStandardAssigned: (count: number) => void;
  onUpdatePlusAssigned: (count: number) => void;
  onUpdateStandardOverage: (amount: number) => void;
  onUpdatePlusOverage: (amount: number) => void;
  onUpdateConsumptionPercent: (pct: number) => void;
  onLoadReferenceExample: () => void;
  onDownloadEstimate: () => void;
  onOpenProposal: () => void;
}

const CONSUMPTION_PRESETS = [25, 50, 75, 100, 125, 150];

const PoolBreakdownCard: React.FC<{
  pool: PoolSimulation;
  accentClass: string;
  barColor: string;
}> = ({ pool, accentClass, barColor }) => {
  const envelopeMax = Math.max(pool.spendingEnvelopeUsd, pool.simulatedDemandUsd, 1);
  const includedUsedPct = Math.min(100, (pool.includedConsumedUsd / envelopeMax) * 100);
  const includedRemPct = Math.min(
    100 - includedUsedPct,
    (pool.includedRemainingUsd / envelopeMax) * 100
  );
  const overageUsedPct = Math.min(
    100 - includedUsedPct - includedRemPct,
    (pool.overageConsumedUsd / envelopeMax) * 100
  );
  const overageRemainingPct = Math.max(
    0,
    Math.min(
      100 - includedUsedPct - includedRemPct - overageUsedPct,
      ((pool.overageBudgetUsd - pool.overageConsumedUsd) / envelopeMax) * 100
    )
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3.5">
        <div>
          <span className={`text-xs font-semibold ${accentClass}`}>
            Separate Edition Pool · ${pool.ratePerLicenseUsd}/license/mo
          </span>
          <h4 className="mt-0.5 font-display text-lg font-bold text-slate-950">
            {pool.editionName} Pool
          </h4>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl font-bold text-slate-950 tabular-nums">
            {formatUsd(pool.includedPoolUsd)}
          </div>
          <div className="font-mono text-xs text-slate-500 tabular-nums">
            {formatUsd(pool.weeklyEquivalentUsd)} / week (÷ 4)
          </div>
        </div>
      </div>

      {/* Seat Pooling Breakdown: Assigned vs Unassigned */}
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
        <div>
          <div className="text-slate-500">Total Seats</div>
          <div className="mt-0.5 font-mono font-semibold text-slate-950 tabular-nums">
            {pool.totalLicenses}
          </div>
        </div>
        <div>
          <div className="text-slate-500">Assigned ({pool.assignedLicenses})</div>
          <div className="mt-0.5 font-mono font-semibold text-slate-900 tabular-nums">
            {formatUsd(pool.assignedContributionUsd)}
          </div>
        </div>
        <div>
          <div className="text-slate-500">Unassigned ({pool.unassignedLicenses})</div>
          <div className="mt-0.5 font-mono font-semibold text-blue-700 tabular-nums">
            +{formatUsd(pool.unassignedContributionUsd)}
          </div>
        </div>
      </div>

      {/* Consumption & Overage Envelope Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-700">
            Simulated Inference Demand:{' '}
            <span className="font-mono font-semibold text-slate-950 tabular-nums">
              {formatUsd(pool.simulatedDemandUsd)}
            </span>
          </span>
          <span className="font-mono text-slate-500 tabular-nums">
            Envelope: {formatUsd(pool.spendingEnvelopeUsd)}
          </span>
        </div>

        <div className="mt-2 flex h-3.5 w-full overflow-hidden rounded-md bg-slate-100">
          <div
            style={{ width: `${includedUsedPct}%`, backgroundColor: barColor }}
            title={`Included Quota Consumed: ${formatUsd(pool.includedConsumedUsd)}`}
            className="transition-all duration-200"
          />
          <div
            style={{ width: `${includedRemPct}%` }}
            title={`Included Quota Remaining: ${formatUsd(pool.includedRemainingUsd)}`}
            className="bg-blue-100 transition-all duration-200"
          />
          <div
            style={{ width: `${overageUsedPct}%` }}
            title={`Admin Overage Consumed: ${formatUsd(pool.overageConsumedUsd)}`}
            className="bg-amber-500 transition-all duration-200"
          />
          <div
            style={{ width: `${overageRemainingPct}%` }}
            title={`Remaining Admin Overage Cap: ${formatUsd(
              pool.overageBudgetUsd - pool.overageConsumedUsd
            )}`}
            className="bg-amber-100 transition-all duration-200"
          />
        </div>

        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
          <span>
            Included Consumed:{' '}
            <strong className="font-mono tabular-nums text-slate-900">
              {formatUsd(pool.includedConsumedUsd)}
            </strong>
          </span>
          <span>
            Overage Cap Used:{' '}
            <strong className="font-mono tabular-nums text-amber-800">
              {formatUsd(pool.overageConsumedUsd)} / {formatUsd(pool.overageBudgetUsd)}
            </strong>
          </span>
        </div>

        {pool.isIncludedExhausted && (
          <div
            className={`mt-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${
              pool.uncoveredDemandUsd > 0
                ? 'border-red-200 bg-red-50 text-red-900'
                : 'border-amber-200 bg-amber-50 text-amber-900'
            }`}
          >
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <div>
              {pool.overageBudgetUsd === 0 ? (
                <span>
                  Included {pool.editionName} pool is 100% exhausted with $0 overage budget configured; developer workflows may pause until quota resets or an overage cap is enabled.
                </span>
              ) : pool.uncoveredDemandUsd > 0 ? (
                <span>
                  Included pool and your {formatUsd(pool.overageBudgetUsd)} admin overage cap are both reached ({formatUsd(pool.uncoveredDemandUsd)} demand exceeds configured ceiling).
                </span>
              ) : (
                <span>
                  Included pool exhausted —{' '}
                  <strong>{formatUsd(pool.overageConsumedUsd)}</strong> absorbed by Admin-Managed Overage limit so developer workflows continue uninterrupted.
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AntigravityCalculator: React.FC<AntigravityCalculatorProps> = ({
  proposal,
  antigravity,
  onUpdateStandardLicenses,
  onUpdatePlusLicenses,
  onUpdateStandardAssigned,
  onUpdatePlusAssigned,
  onUpdateStandardOverage,
  onUpdatePlusOverage,
  onUpdateConsumptionPercent,
  onLoadReferenceExample,
  onDownloadEstimate,
  onOpenProposal,
}) => {
  const chartData = [
    {
      pool: 'Standard Pool ($10/seat)',
      includedQuota: Number(antigravity.standard.includedPoolUsd.toFixed(2)),
      overageLimit: Number(antigravity.standard.overageBudgetUsd.toFixed(2)),
      simulatedConsumption: Number(antigravity.standard.simulatedDemandUsd.toFixed(2)),
    },
    {
      pool: 'Plus Pool ($15/seat)',
      includedQuota: Number(antigravity.plus.includedPoolUsd.toFixed(2)),
      overageLimit: Number(antigravity.plus.overageBudgetUsd.toFixed(2)),
      simulatedConsumption: Number(antigravity.plus.simulatedDemandUsd.toFixed(2)),
    },
  ];

  return (
    <section id="antigravity" className="border-b border-slate-200 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-blue-700">
              Developer AI Economics · Project-Level Quota Pooling
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Antigravity Pooled Usage & Spend Calculator
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Model how Gemini Enterprise Standard ($10/license/mo) and Plus ($15/license/mo) licenses aggregate into isolated project-level Antigravity inference pools—and how administrator overage caps protect engineering velocity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onLoadReferenceExample}
              className="rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-100 whitespace-nowrap shrink-0"
            >
              Load Reference Scenario (20 Std + 10 Plus)
            </button>
          </div>
        </div>

        {/* Main Calculator Workspace */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Inputs */}
          <div className="space-y-5 lg:col-span-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-6">
              <h3 className="font-display text-base font-semibold text-slate-950">
                Pool Inputs & Overage Controls
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Both assigned and unassigned seats contribute 100% to their edition’s pool. Standard and Plus pools remain strictly separate.
              </p>

              {/* Standard Pool Controls */}
              <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="ag-std-seats"
                    className="font-display text-sm font-semibold text-slate-950"
                  >
                    Gemini Enterprise Standard Licenses
                  </label>
                  <span className="font-mono text-xs font-semibold text-blue-700">
                    $10 / license / mo
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={500}
                    value={Math.min(500, proposal.editionCounts.standard)}
                    onChange={(e) => onUpdateStandardLicenses(Number(e.target.value))}
                    aria-label="Standard license count slider"
                    className="h-2 flex-1 cursor-pointer accent-[#1A73E8]"
                  />
                  <input
                    id="ag-std-seats"
                    type="number"
                    min={0}
                    max={100000}
                    value={proposal.editionCounts.standard}
                    onChange={(e) =>
                      onUpdateStandardLicenses(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="w-24 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-right font-mono text-sm font-semibold text-slate-900 tabular-nums"
                  />
                </div>

                {/* Assigned vs Unassigned visualization */}
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Assigned vs. Unassigned Split</span>
                    <span className="font-mono tabular-nums">
                      {antigravity.standard.assignedLicenses} assigned /{' '}
                      {antigravity.standard.unassignedLicenses} unassigned
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(0, proposal.editionCounts.standard)}
                    value={antigravity.standard.assignedLicenses}
                    onChange={(e) => onUpdateStandardAssigned(Number(e.target.value))}
                    disabled={proposal.editionCounts.standard === 0}
                    aria-label="Assigned Standard seats slider"
                    className="mt-1.5 h-1.5 w-full cursor-pointer accent-slate-700 disabled:opacity-40"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <label
                    htmlFor="ag-std-overage"
                    className="text-xs font-medium text-slate-700"
                  >
                    Standard Admin Overage Cap (USD/mo)
                  </label>
                  <input
                    id="ag-std-overage"
                    type="number"
                    min={0}
                    step={25}
                    value={proposal.standardOverageBudgetUsd}
                    onChange={(e) =>
                      onUpdateStandardOverage(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="w-28 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-right font-mono text-xs font-semibold text-slate-900 tabular-nums"
                  />
                </div>
              </div>

              {/* Plus Pool Controls */}
              <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="ag-plus-seats"
                    className="font-display text-sm font-semibold text-slate-950"
                  >
                    Gemini Enterprise Plus Licenses
                  </label>
                  <span className="font-mono text-xs font-semibold text-slate-900">
                    $15 / license / mo
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={500}
                    value={Math.min(500, proposal.editionCounts.plus)}
                    onChange={(e) => onUpdatePlusLicenses(Number(e.target.value))}
                    aria-label="Plus license count slider"
                    className="h-2 flex-1 cursor-pointer accent-slate-900"
                  />
                  <input
                    id="ag-plus-seats"
                    type="number"
                    min={0}
                    max={100000}
                    value={proposal.editionCounts.plus}
                    onChange={(e) =>
                      onUpdatePlusLicenses(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="w-24 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-right font-mono text-sm font-semibold text-slate-900 tabular-nums"
                  />
                </div>

                <div className="mt-3 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Assigned vs. Unassigned Split</span>
                    <span className="font-mono tabular-nums">
                      {antigravity.plus.assignedLicenses} assigned /{' '}
                      {antigravity.plus.unassignedLicenses} unassigned
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(0, proposal.editionCounts.plus)}
                    value={antigravity.plus.assignedLicenses}
                    onChange={(e) => onUpdatePlusAssigned(Number(e.target.value))}
                    disabled={proposal.editionCounts.plus === 0}
                    aria-label="Assigned Plus seats slider"
                    className="mt-1.5 h-1.5 w-full cursor-pointer accent-slate-700 disabled:opacity-40"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <label
                    htmlFor="ag-plus-overage"
                    className="text-xs font-medium text-slate-700"
                  >
                    Plus Admin Overage Cap (USD/mo)
                  </label>
                  <input
                    id="ag-plus-overage"
                    type="number"
                    min={0}
                    step={25}
                    value={proposal.plusOverageBudgetUsd}
                    onChange={(e) =>
                      onUpdatePlusOverage(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="w-28 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-right font-mono text-xs font-semibold text-slate-900 tabular-nums"
                  />
                </div>
              </div>

              {/* Consumption Simulation */}
              <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="ag-consumption-pct"
                    className="font-display text-sm font-semibold text-slate-950"
                  >
                    Simulate Quota Consumption
                  </label>
                  <span className="font-mono text-sm font-bold text-blue-700 tabular-nums">
                    {proposal.consumptionPercent}%
                  </span>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {CONSUMPTION_PRESETS.map((pct) => {
                    const active = proposal.consumptionPercent === pct;
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => onUpdateConsumptionPercent(pct)}
                        className={`rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {pct}%
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={200}
                    step={5}
                    value={Math.min(200, proposal.consumptionPercent)}
                    onChange={(e) => onUpdateConsumptionPercent(Number(e.target.value))}
                    aria-label="Consumption percentage slider"
                    className="h-2 flex-1 cursor-pointer accent-[#1A73E8]"
                  />
                  <input
                    id="ag-consumption-pct"
                    type="number"
                    min={0}
                    max={500}
                    value={proposal.consumptionPercent}
                    onChange={(e) =>
                      onUpdateConsumptionPercent(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="w-20 rounded-md border border-slate-300 bg-white px-2 py-1 text-right font-mono text-xs font-semibold text-slate-900 tabular-nums"
                  />
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  Values above 100% simulate exceeding included monthly quota and drawing from your administrator-configured overage budget.
                </p>
              </div>
            </div>
          </div>

          {/* Right Visualization & Metrics Dashboard */}
          <div className="space-y-5 lg:col-span-7">
            {/* Top Summary Metrics */}
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-medium text-slate-500">Standard Pool</div>
                <div className="mt-1 font-mono text-xl font-bold text-blue-700 tabular-nums">
                  {formatUsd(antigravity.standard.includedPoolUsd)}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-slate-500 tabular-nums">
                  {antigravity.standard.totalLicenses} seats × $10
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-medium text-slate-500">Plus Pool</div>
                <div className="mt-1 font-mono text-xl font-bold text-slate-950 tabular-nums">
                  {formatUsd(antigravity.plus.includedPoolUsd)}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-slate-500 tabular-nums">
                  {antigravity.plus.totalLicenses} seats × $15
                </div>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
                <div className="text-xs font-medium text-blue-900">Total Included Quota</div>
                <div className="mt-1 font-mono text-xl font-bold text-blue-950 tabular-nums">
                  {formatUsd(antigravity.totalIncludedQuotaUsd)}
                </div>
                <div className="mt-0.5 text-[11px] text-blue-800">
                  Monthly sum (pools isolated)
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-medium text-slate-500">Weekly Equivalent</div>
                <div className="mt-1 font-mono text-xl font-bold text-slate-950 tabular-nums">
                  {formatUsd(antigravity.totalWeeklyEquivalentUsd)}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500">
                  Monthly quota ÷ 4 weeks
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-medium text-slate-500">Admin Overage Cap</div>
                <div className="mt-1 font-mono text-xl font-bold text-amber-800 tabular-nums">
                  {formatUsd(antigravity.totalOverageBudgetUsd)}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500">
                  Spending limit (not free quota)
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-medium text-slate-500">Max Spending Envelope</div>
                <div className="mt-1 font-mono text-xl font-bold text-slate-950 tabular-nums">
                  {formatUsd(antigravity.totalSpendingEnvelopeUsd)}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-slate-500 tabular-nums">
                  {antigravity.totalAntigravityLicenses} eligible users
                </div>
              </div>
            </div>

            {/* Isolated Standard & Plus Pool Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <PoolBreakdownCard
                pool={antigravity.standard}
                accentClass="text-blue-700"
                barColor="#1A73E8"
              />
              <PoolBreakdownCard
                pool={antigravity.plus}
                accentClass="text-slate-700"
                barColor="#0F172A"
              />
            </div>

            {/* Chart */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-display text-sm font-semibold text-slate-950">
                  Edition-Isolated Quota vs. Admin Overage Budget vs. Simulated Usage (USD)
                </h4>
                <span className="text-xs text-slate-500">
                  Pools never cross-subsidize
                </span>
              </div>
              <div className="mt-4 h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="pool" tick={{ fontSize: 12, fill: '#334155' }} />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#64748B' }}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip
                      formatter={(value) => formatUsd(Number(value ?? 0))}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar
                      dataKey="includedQuota"
                      name="Included Pool"
                      stackId="envelope"
                      fill="#1A73E8"
                      radius={[0, 0, 0, 0]}
                      barSize={44}
                    />
                    <Bar
                      dataKey="overageLimit"
                      name="Admin Overage Cap"
                      stackId="envelope"
                      fill="#F59E0B"
                      radius={[4, 4, 0, 0]}
                      barSize={44}
                    />
                    <Bar
                      dataKey="simulatedConsumption"
                      name="Simulated Demand"
                      fill="#0F172A"
                      radius={[4, 4, 0, 0]}
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Export Actions */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={onDownloadEstimate}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap shrink-0"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Usage Estimate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap shrink-0"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print / Export PDF</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={onOpenProposal}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A73E8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1557B0] whitespace-nowrap shrink-0"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Include in Proposal Summary</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Section: How Antigravity Pooled Quota Works */}
        <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-display text-xl font-bold text-slate-950">
                How Antigravity Pooled Quota Works
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Project-level pooling architecture and governance guardrails for Gemini Enterprise Standard and Plus.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {PRICING_CONFIG.weeklyAssumptionNote}
            </span>
          </div>

          {/* 5-step Visual Flow Diagram */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                step: '1',
                title: 'Licensed Seats',
                desc: 'All assigned and unassigned Standard ($10) or Plus ($15) seats count.',
              },
              {
                step: '2',
                title: 'Edition-Based Pool',
                desc: 'Quotas pool at the Google Cloud project level; Standard and Plus stay separate.',
              },
              {
                step: '3',
                title: 'Antigravity Users',
                desc: 'Each licensed developer draws inference from their edition’s shared pool.',
              },
              {
                step: '4',
                title: 'Included Quota Usage',
                desc: 'Consumption varies by selected AI model and actual inference workload.',
              },
              {
                step: '5',
                title: 'Admin-Managed Overage',
                desc: 'Optional project spending limit keeps workflows uninterrupted after pool exhaustion.',
              },
            ].map((node, i, arr) => (
              <div
                key={node.step}
                className="relative flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-blue-700">
                    <span>Step {node.step}</span>
                    {i < arr.length - 1 && (
                      <ArrowRight className="hidden h-3.5 w-3.5 text-slate-300 lg:inline" />
                    )}
                  </div>
                  <div className="mt-1.5 font-display text-sm font-bold text-slate-950">
                    {node.title}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{node.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mandatory Governance Clarifications */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-700">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <div>
                <span className="font-semibold text-slate-950">
                  Overage Budget Is a Spending Limit, Not Free Quota:{' '}
                </span>
                An administrator-configured overage cap defines the maximum additional project spend allowed once included quota reaches 100%, preventing developer interruption while preserving budget control.
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-700">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
              <div>
                <span className="font-semibold text-slate-950">
                  Inference Consumption Depends on Model Selection:{' '}
                </span>
                Included quota pools represent monthly dollar-denominated inference entitlements ($10 Standard / $15 Plus), not a guaranteed fixed count of prompts, tokens, or model requests.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
