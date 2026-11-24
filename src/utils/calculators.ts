import { EditionId, PRICING_CONFIG, ProposalState } from '../config/pricingConfig';

export interface EditionBreakdownItem {
  id: EditionId;
  name: string;
  shortName: string;
  licenses: number;
  baseMonthlyRateUsd: number;
  effectiveMonthlyRateUsd: number;
  monthlyTotalUsd: number;
  annualTotalUsd: number;
  sharePercent: number;
  color: string;
}

export interface PricingCalculationResult {
  totalLicenses: number;
  estimatedMonthlyUsd: number;
  estimatedAnnualUsd: number;
  blendedCostPerUserMonthlyUsd: number;
  billingCycle: 'monthly' | 'annual';
  discountPercent: number;
  breakdown: EditionBreakdownItem[];
}

export function calculateLicensingPricing(
  editionCounts: Record<EditionId, number>,
  customRatesUsd: Record<EditionId, number>,
  billingCycle: 'monthly' | 'annual',
  discountPercent: number
): PricingCalculationResult {
  const clampedDiscount = Math.max(0, Math.min(80, discountPercent));
  const ids: EditionId[] = ['business', 'standard', 'plus'];

  const rawItems = ids.map((id) => {
    const config = PRICING_CONFIG.editions[id];
    const licenses = Math.max(0, Math.floor(editionCounts[id] || 0));
    const baseRate = Math.max(0, Number(customRatesUsd[id] ?? config.indicativeMonthlyUsd));
    const effectiveRate = baseRate * (1 - clampedDiscount / 100);
    const monthlyTotal = licenses * effectiveRate;
    const annualTotal = monthlyTotal * PRICING_CONFIG.annualCommitmentMonths;

    return {
      id,
      name: config.name,
      shortName: config.shortName,
      licenses,
      baseMonthlyRateUsd: baseRate,
      effectiveMonthlyRateUsd: effectiveRate,
      monthlyTotalUsd: monthlyTotal,
      annualTotalUsd: annualTotal,
      color: config.accentColor,
    };
  });

  const totalLicenses = rawItems.reduce((acc, item) => acc + item.licenses, 0);
  const estimatedMonthlyUsd = rawItems.reduce((acc, item) => acc + item.monthlyTotalUsd, 0);
  const estimatedAnnualUsd = estimatedMonthlyUsd * PRICING_CONFIG.annualCommitmentMonths;
  const blendedCostPerUserMonthlyUsd =
    totalLicenses > 0 ? estimatedMonthlyUsd / totalLicenses : 0;

  const breakdown: EditionBreakdownItem[] = rawItems.map((item) => ({
    ...item,
    sharePercent:
      estimatedMonthlyUsd > 0 ? (item.monthlyTotalUsd / estimatedMonthlyUsd) * 100 : 0,
  }));

  return {
    totalLicenses,
    estimatedMonthlyUsd,
    estimatedAnnualUsd,
    blendedCostPerUserMonthlyUsd,
    billingCycle,
    discountPercent: clampedDiscount,
    breakdown,
  };
}

export interface PoolSimulation {
  editionId: 'standard' | 'plus';
  editionName: string;
  ratePerLicenseUsd: number;
  totalLicenses: number;
  assignedLicenses: number;
  unassignedLicenses: number;
  assignedContributionUsd: number;
  unassignedContributionUsd: number;
  includedPoolUsd: number;
  weeklyEquivalentUsd: number;
  overageBudgetUsd: number;
  spendingEnvelopeUsd: number;
  simulatedDemandUsd: number;
  includedConsumedUsd: number;
  includedRemainingUsd: number;
  overageConsumedUsd: number;
  uncoveredDemandUsd: number;
  isIncludedExhausted: boolean;
  isOverageExhausted: boolean;
}

export interface AntigravityCalculationResult {
  standard: PoolSimulation;
  plus: PoolSimulation;
  totalAntigravityLicenses: number;
  totalIncludedQuotaUsd: number;
  totalWeeklyEquivalentUsd: number;
  totalOverageBudgetUsd: number;
  totalSpendingEnvelopeUsd: number;
  totalSimulatedDemandUsd: number;
  totalIncludedConsumedUsd: number;
  totalOverageConsumedUsd: number;
  consumptionPercent: number;
}

function buildPoolSimulation(
  editionId: 'standard' | 'plus',
  licenses: number,
  assignedInput: number,
  overageBudgetInput: number,
  consumptionPercent: number
): PoolSimulation {
  const cfg = PRICING_CONFIG.editions[editionId];
  const totalLicenses = Math.max(0, Math.floor(licenses));
  const assignedLicenses = Math.max(0, Math.min(totalLicenses, Math.floor(assignedInput)));
  const unassignedLicenses = Math.max(0, totalLicenses - assignedLicenses);
  const rate = cfg.antigravityMonthlyQuotaUsd;

  const assignedContributionUsd = assignedLicenses * rate;
  const unassignedContributionUsd = unassignedLicenses * rate;
  const includedPoolUsd = totalLicenses * rate;
  const weeklyEquivalentUsd = includedPoolUsd / PRICING_CONFIG.weeklyDivisor;
  const overageBudgetUsd = Math.max(0, Number(overageBudgetInput) || 0);
  const spendingEnvelopeUsd = includedPoolUsd + overageBudgetUsd;

  const demandMultiplier = Math.max(0, consumptionPercent) / 100;
  const simulatedDemandUsd = includedPoolUsd * demandMultiplier;
  const includedConsumedUsd = Math.min(simulatedDemandUsd, includedPoolUsd);
  const includedRemainingUsd = Math.max(0, includedPoolUsd - includedConsumedUsd);
  const rawOverageNeeded = Math.max(0, simulatedDemandUsd - includedPoolUsd);
  const overageConsumedUsd = Math.min(rawOverageNeeded, overageBudgetUsd);
  const uncoveredDemandUsd = Math.max(0, rawOverageNeeded - overageBudgetUsd);

  return {
    editionId,
    editionName: cfg.name,
    ratePerLicenseUsd: rate,
    totalLicenses,
    assignedLicenses,
    unassignedLicenses,
    assignedContributionUsd,
    unassignedContributionUsd,
    includedPoolUsd,
    weeklyEquivalentUsd,
    overageBudgetUsd,
    spendingEnvelopeUsd,
    simulatedDemandUsd,
    includedConsumedUsd,
    includedRemainingUsd,
    overageConsumedUsd,
    uncoveredDemandUsd,
    isIncludedExhausted: includedPoolUsd > 0 && simulatedDemandUsd >= includedPoolUsd,
    isOverageExhausted:
      overageBudgetUsd > 0 && rawOverageNeeded > overageBudgetUsd,
  };
}

export function calculateAntigravityPools(params: {
  standardLicenses: number;
  plusLicenses: number;
  standardAssigned: number;
  plusAssigned: number;
  standardOverageBudgetUsd: number;
  plusOverageBudgetUsd: number;
  consumptionPercent: number;
}): AntigravityCalculationResult {
  const standard = buildPoolSimulation(
    'standard',
    params.standardLicenses,
    params.standardAssigned,
    params.standardOverageBudgetUsd,
    params.consumptionPercent
  );
  const plus = buildPoolSimulation(
    'plus',
    params.plusLicenses,
    params.plusAssigned,
    params.plusOverageBudgetUsd,
    params.consumptionPercent
  );

  const totalAntigravityLicenses = standard.totalLicenses + plus.totalLicenses;
  const totalIncludedQuotaUsd = standard.includedPoolUsd + plus.includedPoolUsd;
  const totalWeeklyEquivalentUsd = totalIncludedQuotaUsd / PRICING_CONFIG.weeklyDivisor;
  const totalOverageBudgetUsd = standard.overageBudgetUsd + plus.overageBudgetUsd;
  const totalSpendingEnvelopeUsd = totalIncludedQuotaUsd + totalOverageBudgetUsd;

  return {
    standard,
    plus,
    totalAntigravityLicenses,
    totalIncludedQuotaUsd,
    totalWeeklyEquivalentUsd,
    totalOverageBudgetUsd,
    totalSpendingEnvelopeUsd,
    totalSimulatedDemandUsd: standard.simulatedDemandUsd + plus.simulatedDemandUsd,
    totalIncludedConsumedUsd: standard.includedConsumedUsd + plus.includedConsumedUsd,
    totalOverageConsumedUsd: standard.overageConsumedUsd + plus.overageConsumedUsd,
    consumptionPercent: params.consumptionPercent,
  };
}

export function formatUsd(amount: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function buildProposalSummaryText(
  proposal: ProposalState,
  pricing: PricingCalculationResult,
  antigravity: AntigravityCalculationResult
): string {
  const lines = [
    'CLOUD 11 | GEMINI ENTERPRISE PRESALES SUMMARY',
    'Google Cloud Premier Partner',
    '====================================================================',
    `Prepared For: ${proposal.customerName || 'Prospective Enterprise Customer'}`,
    `Primary Contact: ${proposal.contactName || 'Decision Maker / IT Leadership'}`,
    `Generated Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    '',
    '1. LICENSING & COMMERCIAL INVESTMENT ESTIMATE (USD)',
    '--------------------------------------------------------------------',
    ...pricing.breakdown.map(
      (b) =>
        `- ${b.name}: ${b.licenses} licenses @ ${formatUsd(b.effectiveMonthlyRateUsd)}/user/mo = ${formatUsd(b.monthlyTotalUsd)}/mo (${formatUsd(b.annualTotalUsd)}/yr)`
    ),
    `Total Licenses: ${pricing.totalLicenses}`,
    `Estimated Monthly Total: ${formatUsd(pricing.estimatedMonthlyUsd)}`,
    `Estimated Annual Total: ${formatUsd(pricing.estimatedAnnualUsd)}`,
    `Blended Cost per User: ${formatUsd(pricing.blendedCostPerUserMonthlyUsd)}/mo`,
    '',
    '2. ANTIGRAVITY POOLED AI USAGE ENTITLEMENT',
    '--------------------------------------------------------------------',
    `Standard Pool (${antigravity.standard.totalLicenses} licenses x $10/mo): ${formatUsd(antigravity.standard.includedPoolUsd)}/mo (${formatUsd(antigravity.standard.weeklyEquivalentUsd)}/wk)`,
    `  - Assigned: ${antigravity.standard.assignedLicenses} | Unassigned: ${antigravity.standard.unassignedLicenses} (both contribute to pool)`,
    `  - Standard Admin Overage Budget: ${formatUsd(antigravity.standard.overageBudgetUsd)}/mo`,
    `Plus Pool (${antigravity.plus.totalLicenses} licenses x $15/mo): ${formatUsd(antigravity.plus.includedPoolUsd)}/mo (${formatUsd(antigravity.plus.weeklyEquivalentUsd)}/wk)`,
    `  - Assigned: ${antigravity.plus.assignedLicenses} | Unassigned: ${antigravity.plus.unassignedLicenses} (both contribute to pool)`,
    `  - Plus Admin Overage Budget: ${formatUsd(antigravity.plus.overageBudgetUsd)}/mo`,
    `Combined Included Monthly Quota: ${formatUsd(antigravity.totalIncludedQuotaUsd)}/mo (Standard & Plus pools remain separate)`,
    `Weekly Equivalent (Monthly ÷ 4): ${formatUsd(antigravity.totalWeeklyEquivalentUsd)}/wk`,
    `Combined Admin Overage Cap: ${formatUsd(antigravity.totalOverageBudgetUsd)}/mo`,
    `Total Maximum Spending Envelope (Included + Overage Cap): ${formatUsd(antigravity.totalSpendingEnvelopeUsd)}/mo`,
    '',
    '3. RECOMMENDED CLOUD 11 SERVICES',
    '--------------------------------------------------------------------',
    ...(proposal.selectedServices.length > 0
      ? proposal.selectedServices.map((s) => `- ${s}`)
      : ['- Gemini Enterprise Licensing & Consultation', '- Enterprise AI Architecture']),
    '',
    '4. IMPORTANT ASSUMPTIONS & DISCLAIMERS',
    '--------------------------------------------------------------------',
    `- ${PRICING_CONFIG.commercialDisclaimer}`,
    `- ${PRICING_CONFIG.weeklyAssumptionNote}`,
    '- Antigravity quota pools are aggregated at the Google Cloud project level and strictly separated by edition (Standard vs. Plus).',
    '- Administrator-configured overage budgets act as spending limits to prevent workflow interruption; they are NOT extra free included quota.',
    '- Quota estimates do not guarantee a fixed number of prompts, tokens, or model requests; actual consumption depends on model selection and inference usage.',
  ];
  return lines.join('\n');
}
