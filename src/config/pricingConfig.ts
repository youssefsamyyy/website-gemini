export type EditionId = 'business' | 'standard' | 'plus';

export interface EditionCommercialConfig {
  id: EditionId;
  name: string;
  shortName: string;
  tagline: string;
  pricingModel: string;
  /**
   * Indicative planning assumption in USD per user per month.
   * Update this value to reflect official Cloud 11 commercial quotes without changing calculator logic.
   */
  indicativeMonthlyUsd: number;
  monthlyRateUsd: number;
  annualRateUsd: number;
  /**
   * Official Antigravity pooled AI inference quota assumption per license per month (USD).
   * Supplied project assumption: Standard = $10/license/month, Plus = $15/license/month.
   */
  antigravityMonthlyQuotaUsd: number;
  antigravityEligible: boolean;
  minimumTermMonths: number;
  accentColor: string;
}

export interface PricingConfiguration {
  currency: 'USD';
  isIndicativeBaseline: boolean;
  commercialDisclaimer: string;
  weeklyDivisor: number;
  weeklyAssumptionNote: string;
  annualCommitmentMonths: number;
  editions: Record<EditionId, EditionCommercialConfig>;
}

/**
 * Centralized commercial and Antigravity entitlement configuration.
 * Presales engineers can update indicative commercial rates here or override them live inside the UI.
 */
export const PRICING_CONFIG: PricingConfiguration = {
  currency: 'USD',
  isIndicativeBaseline: true,
  commercialDisclaimer:
    'Pricing reflects the Cloud 11 commercial rates supplied for this proposal. Standard and Plus yearly rates require a 12-month commitment; monthly rates have no commitment. Pay-as-you-go usage is billed separately at standard consumption rates.',
  weeklyDivisor: 4,
  weeklyAssumptionNote:
    'Weekly equivalent is calculated as Monthly Included Quota ÷ 4 weeks for planning clarity.',
  annualCommitmentMonths: 12,
  editions: {
    business: {
      id: 'business',
      name: 'Gemini Enterprise Business',
      shortName: 'Business',
      tagline: 'Foundational enterprise AI assistance and workplace grounding for focused teams.',
      pricingModel: 'Per-user subscription: $25 monthly with no commitment, or $21/month with a 12-month commitment',
      indicativeMonthlyUsd: 21,
      monthlyRateUsd: 25,
      annualRateUsd: 21,
      antigravityMonthlyQuotaUsd: 0,
      antigravityEligible: false,
      minimumTermMonths: 1,
      accentColor: '#475569',
    },
    standard: {
      id: 'standard',
      name: 'Gemini Enterprise Standard',
      shortName: 'Standard',
      tagline: 'Full enterprise search, custom AI agents, connectors, and Antigravity pooled inference.',
      pricingModel: 'Per-user subscription: $35 monthly with no commitment, or $30/month with a 12-month commitment',
      indicativeMonthlyUsd: 30,
      monthlyRateUsd: 35,
      annualRateUsd: 30,
      antigravityMonthlyQuotaUsd: 10,
      antigravityEligible: true,
      minimumTermMonths: 1,
      accentColor: '#1A73E8',
    },
    plus: {
      id: 'plus',
      name: 'Gemini Enterprise Plus',
      shortName: 'Plus',
      tagline: 'Maximum governance, enterprise compliance controls, and elevated Antigravity pooled quota.',
      pricingModel: 'Per-user subscription: $60 monthly with no commitment, or $50/month with a 12-month commitment',
      indicativeMonthlyUsd: 50,
      monthlyRateUsd: 60,
      annualRateUsd: 50,
      antigravityMonthlyQuotaUsd: 15,
      antigravityEligible: true,
      minimumTermMonths: 1,
      accentColor: '#0F172A',
    },
  },
};

export interface ProposalState {
  customerName: string;
  contactName: string;
  editionCounts: Record<EditionId, number>;
  billingCycle: 'monthly' | 'annual';
  customRatesUsd: Record<EditionId, number>;
  discountPercent: number;
  antigravityStandardAssigned: number;
  antigravityPlusAssigned: number;
  standardOverageBudgetUsd: number;
  plusOverageBudgetUsd: number;
  consumptionPercent: number;
  selectedServices: string[];
}
