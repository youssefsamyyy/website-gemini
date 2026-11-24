import { EditionId } from '../config/pricingConfig';

export type ComparisonEditionId =
  | 'business'
  | 'standard'
  | 'plus'
  | 'payg'
  | 'frontline';

export type EntitlementStatus = 'included' | 'not_included' | 'spec';

export type ComparisonCategory =
  | 'All'
  | 'Seats & Storage'
  | 'Data & Search'
  | 'AI Models & Media'
  | 'Agents & Skills'
  | 'Notebooks & Insights'
  | 'Security & Admin'
  | 'Developer & Console';

export interface ComparisonCell {
  status: EntitlementStatus;
  label: string;
  footnote?: string;
}

export interface ComparisonRow {
  id: string;
  feature: string;
  category: Exclude<ComparisonCategory, 'All'>;
  footnoteRef?: string;
  business: ComparisonCell;
  standard: ComparisonCell;
  plus: ComparisonCell;
  payg: ComparisonCell;
  frontline: ComparisonCell;
}

export interface ComparisonEditionMeta {
  id: ComparisonEditionId;
  name: string;
  shortName: string;
  segment: string;
  summary: string;
  seatRule: string;
  storageRule: string;
  antigravityRule: string;
  pricingLabel: string;
}

export const COMPARISON_EDITIONS: Record<ComparisonEditionId, ComparisonEditionMeta> = {
  business: {
    id: 'business',
    name: 'Gemini Enterprise Business',
    shortName: 'Business',
    segment: 'Small & Midsize Teams',
    summary: 'Core AI search, media, notebooks, Deep Research, and no-code agent authoring for 1–500 users.',
    seatRule: '1–500 users',
    storageRule: '25 GiB, pooled',
    antigravityRule: 'Not eligible',
    pricingLabel: '$21/user/mo yearly · $25/user/mo monthly',
  },
  standard: {
    id: 'standard',
    name: 'Gemini Enterprise Standard',
    shortName: 'Standard',
    segment: 'Enterprise Core',
    summary: 'Full connector ecosystem, priority Gemini models, full-code agents, enterprise security, and AI developer tools.',
    seatRule: '1 or more users',
    storageRule: '30 GiB, pooled',
    antigravityRule: '$10 / license / mo pooled',
    pricingLabel: '$30/user/mo yearly · $35/user/mo monthly',
  },
  plus: {
    id: 'plus',
    name: 'Gemini Enterprise Plus',
    shortName: 'Plus',
    segment: 'High-Scale & Regulated',
    summary: 'Expanded 75 GiB pooled indexing per user plus full enterprise security, developer tools, and $15/mo Antigravity pool.',
    seatRule: '1 or more users',
    storageRule: '75 GiB, pooled',
    antigravityRule: '$15 / license / mo pooled',
    pricingLabel: '$50/user/mo yearly · $60/user/mo monthly',
  },
  payg: {
    id: 'payg',
    name: 'Gemini Enterprise Pay-as-you-go',
    shortName: 'Pay-as-you-go',
    segment: 'Consumption Billing',
    summary: 'Flexible consumption-only billing with access to all Standard and Plus features, instant deployment with a $0 access fee, no seat commitments, payment only for actual consumption at standard pay-as-you-go rates, usage tracking, spend caps, and centralized cost management.',
    seatRule: 'No seat commitment',
    storageRule: 'Pay-as-you-go',
    antigravityRule: 'Pay-as-you-go billing',
    pricingLabel: '$0 access fee · Pay only for consumption',
  },
  frontline: {
    id: 'frontline',
    name: 'Gemini Enterprise Frontline',
    shortName: 'Frontline',
    segment: 'Frontline Workforce Add-on',
    summary: 'Designed for organizations with 150+ Standard or Plus seats extending grounded AI, search, and security to frontline staff.',
    seatRule: '150+ Standard/Plus seats req.',
    storageRule: '2 GiB, pooled',
    antigravityRule: 'Not included',
    pricingLabel: 'Contact Cloud 11',
  },
};

export const ALL_COMPARISON_EDITIONS: ComparisonEditionId[] = [
  'business',
  'standard',
  'plus',
  'payg',
  'frontline',
];

export const COMPARISON_CATEGORIES: ComparisonCategory[] = [
  'All',
  'Seats & Storage',
  'Data & Search',
  'AI Models & Media',
  'Agents & Skills',
  'Notebooks & Insights',
  'Security & Admin',
  'Developer & Console',
];

const INC: ComparisonCell = { status: 'included', label: 'Included' };
const NO: ComparisonCell = { status: 'not_included', label: 'Not included' };

export const EDITION_COMPARISON_ROWS: ComparisonRow[] = [
  {
    id: 'seats',
    feature: 'Seats',
    category: 'Seats & Storage',
    business: { status: 'spec', label: '1–500 users' },
    standard: { status: 'spec', label: '1 or more users' },
    plus: { status: 'spec', label: '1 or more users' },
    payg: { status: 'spec', label: 'No seat commitment' },
    frontline: { status: 'spec', label: '150 or more users of Standard or Plus editions' },
  },
  {
    id: 'storage-indexing',
    feature: 'Storage and data indexing per user',
    footnoteRef: '1',
    category: 'Seats & Storage',
    business: { status: 'spec', label: '25 GiB, pooled' },
    standard: { status: 'spec', label: '30 GiB, pooled' },
    plus: { status: 'spec', label: '75 GiB, pooled' },
    payg: { status: 'spec', label: 'Pay-as-you-go' },
    frontline: { status: 'spec', label: '2 GiB, pooled' },
  },
  {
    id: 'segment-connectors',
    feature: 'Access select, segment-relevant connectors',
    category: 'Data & Search',
    business: INC,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: INC,
  },
  {
    id: 'full-connectors',
    feature: 'Access the full data connector ecosystem',
    category: 'Data & Search',
    business: NO,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: INC,
  },
  {
    id: 'permission-search',
    feature: 'Use permission-aware enterprise search',
    category: 'Data & Search',
    business: INC,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: INC,
  },
  {
    id: 'ground-google-3p',
    feature: 'Ground based on enterprise data from Google data sources and third-party data sources',
    category: 'Data & Search',
    business: INC,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: INC,
  },
  {
    id: 'priority-models',
    feature: 'Get priority access to the latest Gemini models',
    category: 'AI Models & Media',
    business: NO,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: NO,
  },
  {
    id: 'blended-search-gen',
    feature: 'Get answers incorporating blended search and text generation',
    category: 'AI Models & Media',
    business: INC,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: INC,
  },
  {
    id: 'generate-media',
    feature: 'Generate media (images and videos)',
    category: 'AI Models & Media',
    business: INC,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: INC,
  },
  {
    id: 'ground-google-search',
    feature: 'Use Ground with Google Search',
    category: 'Data & Search',
    business: INC,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: INC,
  },
  {
    id: 'web-grounding',
    feature: 'Use Web Grounding',
    category: 'Data & Search',
    business: INC,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: INC,
  },
  {
    id: 'prebuilt-actions',
    feature: 'Use permission-aware prebuilt tasks and agent actions',
    category: 'Agents & Skills',
    business: INC,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: INC,
  },
  {
    id: 'chat-notebooks',
    feature: 'Chat with published Gemini Notebook Enterprise notebooks',
    category: 'Notebooks & Insights',
    business: INC,
    standard: INC,
    plus: INC,
    payg: NO,
    frontline: INC,
  },
  {
    id: 'create-notebooks',
    feature: 'Create and publish Gemini Notebook Enterprise notebooks',
    category: 'Notebooks & Insights',
    business: INC,
    standard: INC,
    plus: INC,
    payg: NO,
    frontline: NO,
  },
  {
    id: 'build-nocode-agents',
    feature: 'Build and publish custom no-code agents using Gemini Enterprise no-code tools (preview)',
    category: 'Agents & Skills',
    business: INC,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: NO,
  },
  {
    id: 'use-nocode-agents',
    feature: 'Use custom no-code agents built using Gemini Enterprise no-code tools (preview)',
    category: 'Agents & Skills',
    business: INC,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: INC,
  },
  {
    id: 'create-skills',
    feature: 'Create and upload custom skills',
    category: 'Agents & Skills',
    business: INC,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: NO,
  },
  {
    id: 'use-shared-skills',
    feature: 'Use Google-managed skills and user-created skills shared with you',
    category: 'Agents & Skills',
    business: INC,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: { status: 'included', label: 'Included', footnote: '2' },
  },
  {
    id: 'deep-research',
    feature: 'Use Deep Research (Made by Google)',
    category: 'Notebooks & Insights',
    business: INC,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: INC,
  },
  {
    id: 'data-insights',
    feature: 'Use Data Insights (Made by Google)',
    category: 'Notebooks & Insights',
    business: NO,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: INC,
  },
  {
    id: 'full-code-agents',
    feature: 'Use your own full-code agents built outside of Gemini Enterprise',
    category: 'Agents & Skills',
    business: NO,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: { status: 'included', label: 'Included', footnote: '3' },
  },
  {
    id: 'agent-marketplace',
    feature: 'Access the Agent Marketplace',
    category: 'Agents & Skills',
    business: NO,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: INC,
  },
  {
    id: 'agent-governance',
    feature: 'Access basic agent governance and administration',
    category: 'Security & Admin',
    business: INC,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: NO,
  },
  {
    id: 'enterprise-security',
    feature: 'Enterprise-grade security and compliance',
    category: 'Security & Admin',
    business: NO,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: INC,
  },
  {
    id: 'ai-developer-tools',
    feature: 'AI developer tools',
    footnoteRef: '4',
    category: 'Developer & Console',
    business: NO,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: NO,
  },
  {
    id: 'antigravity-pool',
    feature: 'Antigravity monthly pooled AI inference entitlement',
    category: 'Developer & Console',
    business: NO,
    standard: { status: 'spec', label: '$10 / license / month pooled' },
    plus: { status: 'spec', label: '$15 / license / month pooled' },
    payg: { status: 'spec', label: 'Usage-based billing' },
    frontline: NO,
  },
  {
    id: 'gcp-console',
    feature: 'Google Cloud console access',
    footnoteRef: '5',
    category: 'Developer & Console',
    business: NO,
    standard: INC,
    plus: INC,
    payg: INC,
    frontline: INC,
  },
];

export const COMPARISON_FOOTNOTES: Array<{ id: string; text: string }> = [
  {
    id: '1',
    text: 'Storage and data indexing allocations (25 GiB Business, 30 GiB Standard, 75 GiB Plus, 2 GiB Frontline) are pooled per user across the licensed organization.',
  },
  {
    id: '2',
    text: 'Frontline users can run Google-managed skills and user-created skills shared with them, but cannot create or upload custom skills.',
  },
  {
    id: '3',
    text: 'Frontline edition supports running full-code agents built outside of Gemini Enterprise when provisioned alongside 150+ Standard or Plus seats.',
  },
  {
    id: '4',
    text: 'AI developer tools (including Google Antigravity pooled inference entitlements of $10/mo in Standard and $15/mo in Plus) are included in Standard, Plus, and Pay-as-you-go.',
  },
  {
    id: '5',
    text: 'Google Cloud console access applies to Standard, Plus, Pay-as-you-go, and Frontline deployments managed via Google Cloud projects.',
  },
];

export interface RecommendationAnswers {
  deploymentModel: 'seat_smb' | 'seat_enterprise' | 'payg' | 'frontline_addon';
  connectorAndSecurity: 'basic' | 'full_enterprise';
  storageAndAntigravity: 'standard_30gb' | 'plus_75gb';
  needDeveloperTools: 'no' | 'yes';
}

export interface RecommendationResult {
  recommendedEdition: ComparisonEditionId;
  calculatorEdition: EditionId;
  rationale: string[];
  antigravityNote: string;
}

export function recommendEdition(answers: RecommendationAnswers): RecommendationResult {
  const rationale: string[] = [];

  if (answers.deploymentModel === 'payg') {
    rationale.push('Supports flexible consumption-based billing starting from 1 minimum seat.');
    rationale.push('Includes full data connector ecosystem, enterprise-grade security, Agent Marketplace, Data Insights, and AI developer tools.');
    return {
      recommendedEdition: 'payg',
      calculatorEdition: 'standard',
      rationale,
      antigravityNote:
        'Pay-as-you-go bills usage directly rather than fixed monthly $10/$15 seat pools; use Standard or Plus if you prefer predictable pooled Antigravity quotas.',
    };
  }

  if (answers.deploymentModel === 'frontline_addon') {
    rationale.push('Built for frontline cohorts alongside 150 or more existing Standard or Plus seats.');
    rationale.push('Provides 2 GiB pooled indexing per user, full connector ecosystem, Deep Research, Data Insights, enterprise security, and access to shared agents & skills.');
    return {
      recommendedEdition: 'frontline',
      calculatorEdition: 'standard',
      rationale,
      antigravityNote:
        'Frontline focuses on operational staff and does not include AI developer tools or Antigravity pools; your underlying 150+ Standard/Plus seats carry the Antigravity pool.',
    };
  }

  if (
    answers.deploymentModel === 'seat_smb' &&
    answers.connectorAndSecurity === 'basic' &&
    answers.needDeveloperTools === 'no'
  ) {
    rationale.push('Fits teams of 1–500 users needing 25 GiB pooled storage per user, permission-aware search, Deep Research, and Notebook authoring.');
    rationale.push('Includes custom no-code agents and custom skills without paying for full-code developer tools or full connector ecosystems.');
    return {
      recommendedEdition: 'business',
      calculatorEdition: 'business',
      rationale,
      antigravityNote:
        'Gemini Enterprise Business does not include AI developer tools or Antigravity pooled quotas.',
    };
  }

  if (answers.storageAndAntigravity === 'plus_75gb') {
    rationale.push('Delivers the highest pooled data indexing capacity at 75 GiB per user for large enterprise knowledge estates.');
    rationale.push('Includes full connector ecosystem, priority Gemini models, full-code agents, enterprise-grade security, and Google Cloud console access.');
    rationale.push('Maximizes your Antigravity pooled inference budget at $15/license/month.');
    return {
      recommendedEdition: 'plus',
      calculatorEdition: 'plus',
      rationale,
      antigravityNote:
        'Every assigned and unassigned Gemini Enterprise Plus license contributes $15/month to your isolated Plus Antigravity pool.',
    };
  }

  rationale.push('Supports 1 or more users with 30 GiB pooled storage per user, full connector ecosystem, and priority access to the latest Gemini models.');
  rationale.push('Includes enterprise-grade security & compliance, Data Insights, full-code agents, Agent Marketplace, and AI developer tools.');
  return {
    recommendedEdition: 'standard',
    calculatorEdition: 'standard',
    rationale,
    antigravityNote:
      'Every assigned and unassigned Gemini Enterprise Standard license contributes $10/month to your Standard Antigravity pool.',
  };
}
