import { EditionId } from '../config/pricingConfig';

export interface FeatureCategory {
  id: string;
  title: string;
  shortLabel: string;
  summary: string;
  businessValue: string;
  technicalExplanation: string;
  applicableEditions: EditionId[];
  highlights: string[];
  docLabel: string;
  docUrl: string;
}

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'enterprise-ai',
    title: 'Enterprise AI',
    shortLabel: 'Enterprise AI',
    summary: 'Multimodal conversational workspace grounded in organizational context with strict enterprise privacy.',
    businessValue:
      'Reduces time spent synthesizing reports, RFPs, financial briefs, and policy documents while keeping proprietary data out of public model training.',
    technicalExplanation:
      'Operates within your Google Cloud tenant boundary using Gemini foundation models. Prompts, retrieved context, and outputs are never used to train Google public models.',
    applicableEditions: ['business', 'standard', 'plus'],
    highlights: [
      'Long-context reasoning over documents, spreadsheets, and technical specs',
      'Multimodal understanding across text, tables, code, and visual artifacts',
      'Zero foundation model training on customer data',
    ],
    docLabel: 'Google Cloud Gemini Enterprise Overview',
    docUrl: 'https://cloud.google.com/gemini/enterprise',
  },
  {
    id: 'ai-agents',
    title: 'AI Agents',
    shortLabel: 'AI Agents',
    summary: 'Purpose-built, permission-aware agents that automate multi-step departmental and cross-functional tasks.',
    businessValue:
      'Moves teams beyond single-turn chat by automating recurring workflows in procurement, HR, finance, IT service desks, and customer operations.',
    technicalExplanation:
      'Agents combine system instructions, grounded retrieval indexes, and structured tool/action bindings with per-user ACL enforcement at runtime.',
    applicableEditions: ['business', 'standard', 'plus'],
    highlights: [
      'No-code agent creation for business analysts and team leads',
      'Role-scoped agent publishing and organization directory governance',
      'Pre-built patterns for research, summarization, and ticket triage',
    ],
    docLabel: 'Gemini Enterprise Agents Documentation',
    docUrl: 'https://cloud.google.com/agentspace/docs/overview',
  },
  {
    id: 'agent-development',
    title: 'Agent Development',
    shortLabel: 'Agent Dev',
    summary: 'Extensible framework connecting low-code agent builders with pro-code Google Cloud Vertex AI and ADK pipelines.',
    businessValue:
      'Enables engineering teams to standardize reusable enterprise tools, APIs, and multi-agent workflows without fragmenting governance.',
    technicalExplanation:
      'Supports custom action extensions, Agent Development Kit (ADK) interoperability, and Vertex AI Agent Engine integration for deterministic API orchestration.',
    applicableEditions: ['standard', 'plus'],
    highlights: [
      'Custom REST/OpenAPI tool bindings for ERP, CRM, and ITSM systems',
      'A2A / ADK alignment for multi-agent enterprise architectures',
      'Central lifecycle versioning and approval controls in Standard & Plus',
    ],
    docLabel: 'Vertex AI Agent Builder & ADK Docs',
    docUrl: 'https://cloud.google.com/vertex-ai/generative-ai/docs/agent-builder/overview',
  },
  {
    id: 'data-integration',
    title: 'Data & Knowledge Integration',
    shortLabel: 'Data Connectors',
    summary: 'Pre-built connectors unifying Google Workspace, Microsoft 365, cloud data warehouses, and SaaS repositories.',
    businessValue:
      'Eliminates manual data migration by indexing existing enterprise knowledge in place while respecting native document permissions.',
    technicalExplanation:
      'Incremental sync connectors ingest metadata and ACLs from SharePoint, Confluence, Jira, Salesforce, ServiceNow, Google Drive, and BigQuery.',
    applicableEditions: ['business', 'standard', 'plus'],
    highlights: [
      'Native Google Workspace & Cloud Storage / BigQuery connectivity',
      'Microsoft ecosystem and major third-party SaaS connectors (Standard & Plus)',
      'Scheduled incremental sync with source-level permission preservation',
    ],
    docLabel: 'Enterprise Data Connectors Reference',
    docUrl: 'https://cloud.google.com/agentspace/docs/connectors',
  },
  {
    id: 'enterprise-search',
    title: 'Enterprise Search',
    shortLabel: 'Enterprise Search',
    summary: 'Google-quality semantic and hybrid search across structured and unstructured corporate knowledge.',
    businessValue:
      'Cuts employee information discovery time across fragmented portals and provides verifiable inline citations for every answer.',
    technicalExplanation:
      'Combines semantic vector retrieval, lexical matching, and personalized ranking filtered strictly by the querying user’s verified identity.',
    applicableEditions: ['business', 'standard', 'plus'],
    highlights: [
      'Grounded responses with direct source document citations',
      'Real-time ACL filtering ensuring users only retrieve authorized records',
      'Unified search bar across policies, tickets, wikis, and structured tables',
    ],
    docLabel: 'Vertex AI Search & Grounding Docs',
    docUrl: 'https://cloud.google.com/generative-ai-app-builder/docs/enterprise-search-introduction',
  },
  {
    id: 'security-governance',
    title: 'Security & Governance',
    shortLabel: 'Security',
    summary: 'Defense-in-depth enterprise controls spanning IAM, encryption, data residency, and network perimeters.',
    businessValue:
      'Satisfies CISO, Risk, and Compliance review boards across banking, telecommunications, energy, and public-sector deployments.',
    technicalExplanation:
      'Integrates Cloud IAM, SSO, VPC Service Controls, Customer-Managed Encryption Keys (CMEK), and Cloud Audit Logs depending on edition and GCP topology.',
    applicableEditions: ['business', 'standard', 'plus'],
    highlights: [
      'Enterprise SSO and Cloud Identity synchronization',
      'Configurable data residency and regional processing boundaries',
      'CMEK and VPC Service Controls readiness for regulated workloads (Plus)',
    ],
    docLabel: 'Google Cloud AI Security & Privacy',
    docUrl: 'https://cloud.google.com/security/ai',
  },
  {
    id: 'administration',
    title: 'Administration',
    shortLabel: 'Admin',
    summary: 'Unified admin control plane for seat lifecycle, connector policies, agent governance, and spending guardrails.',
    businessValue:
      'Gives IT Directors predictable operational control over rollout phases, license utilization, and project-level cost ceilings.',
    technicalExplanation:
      'Administers user provisioning, role assignments, connector scopes, and project-level Antigravity overage budgets from Google Cloud and Admin consoles.',
    applicableEditions: ['business', 'standard', 'plus'],
    highlights: [
      'Central license allocation and group-based feature policies',
      'Edition-isolated Antigravity pool monitoring and overage caps',
      'Detailed audit trails integrated with Google Cloud Logging',
    ],
    docLabel: 'Google Cloud Admin & Governance Docs',
    docUrl: 'https://cloud.google.com/docs/enterprise/administration',
  },
  {
    id: 'developer-productivity',
    title: 'Developer Productivity',
    shortLabel: 'Developer Tools',
    summary: 'AI-assisted coding, architecture exploration, refactoring, and automated test generation for engineering orgs.',
    businessValue:
      'Accelerates software delivery across cloud-native and enterprise modernization backlogs without ad-hoc individual AI subscriptions.',
    technicalExplanation:
      'Combines repository-aware reasoning, terminal/IDE workflows, and governed enterprise billing under your organization’s Google Cloud project.',
    applicableEditions: ['standard', 'plus'],
    highlights: [
      'Centralized enterprise licensing replacing fragmented tool sprawl',
      'Multi-file code generation, debugging, and architectural analysis',
      'Backed by pooled project-level inference quota in Standard and Plus',
    ],
    docLabel: 'Google Cloud Developer AI Solutions',
    docUrl: 'https://cloud.google.com/solutions/ai-for-developers',
  },
  {
    id: 'antigravity',
    title: 'Antigravity',
    shortLabel: 'Antigravity',
    summary: 'Project-level pooled AI inference entitlements enabling frictionless developer productivity across Antigravity surfaces.',
    businessValue:
      'Maximizes utilization across your entire license footprint: even unassigned or light-use seats contribute budget to active engineering teams.',
    technicalExplanation:
      'Standard ($10/license/mo) and Plus ($15/license/mo) pools aggregate at the Google Cloud project level by edition, paired with admin-managed overage budgets.',
    applicableEditions: ['standard', 'plus'],
    highlights: [
      'Assigned AND unassigned seats both contribute to the edition pool',
      'Standard and Plus pools remain strictly separate by edition',
      'Admin-defined overage limits protect workflows without surprise runaway spend',
    ],
    docLabel: 'Google Antigravity & Gemini Enterprise',
    docUrl: 'https://antigravity.google/',
  },
];

export interface Cloud11Service {
  index: string;
  title: string;
  description: string;
}

export const CLOUD11_SERVICES: Cloud11Service[] = [
  {
    index: '01',
    title: 'Gemini Enterprise Licensing & Consultation',
    description: 'Edition right-sizing across Business, Standard, and Plus, seat modeling, and commercial procurement guidance.',
  },
  {
    index: '02',
    title: 'Enterprise AI Architecture',
    description: 'End-to-end Google Cloud reference architecture aligning Gemini Enterprise, Vertex AI, and existing data estates.',
  },
  {
    index: '03',
    title: 'Identity & Access Management',
    description: 'Cloud Identity, SSO federation, RBAC design, and strict document-level ACL mirroring across repositories.',
  },
  {
    index: '04',
    title: 'Security & Governance',
    description: 'CMEK key management, VPC Service Controls, data residency configuration, and enterprise AI policy guardrails.',
  },
  {
    index: '05',
    title: 'AI Agent Implementation',
    description: 'Design, build, and testing of high-impact departmental agents and custom ADK integrations.',
  },
  {
    index: '06',
    title: 'Business Workflow Automation',
    description: 'Connecting AI agents to ITSM, ERP, CRM, and approval systems for measurable cycle-time reduction.',
  },
  {
    index: '07',
    title: 'Google Workspace & Microsoft Ecosystem Integration',
    description: 'Coexistence and unified search across Google Workspace, SharePoint, Exchange, Teams, and OneDrive.',
  },
  {
    index: '08',
    title: 'Google Cloud Infrastructure',
    description: 'Landing zones, networking, BigQuery foundations, and Cloud Run workloads supporting enterprise AI.',
  },
  {
    index: '09',
    title: 'Developer Productivity & Antigravity Enablement',
    description: 'Antigravity project pool governance, overage policy tuning, and engineering team onboarding.',
  },
  {
    index: '10',
    title: 'Ongoing Technical Support and Optimization',
    description: 'Post-deployment telemetry reviews, connector expansion, and continuous license & quota optimization.',
  },
];

export const ENGAGEMENT_STAGES = [
  {
    step: '01',
    name: 'Discover',
    detail: 'Audit AI use cases, user personas, identity landscape, and target data repositories.',
  },
  {
    step: '02',
    name: 'Design',
    detail: 'Architect edition mix, security perimeter, connector topology, and Antigravity pool budgets.',
  },
  {
    step: '03',
    name: 'Deploy',
    detail: 'Provision licenses, configure IAM/ACLs, connect enterprise data sources, and launch pilot cohorts.',
  },
  {
    step: '04',
    name: 'Enable',
    detail: 'Deliver hands-on workshops for business champions, administrators, and software engineering teams.',
  },
  {
    step: '05',
    name: 'Optimize',
    detail: 'Track adoption, tune overage guardrails, and scale custom agents across additional business units.',
  },
];

export interface ResourceItem {
  id: string;
  category:
    | 'Official Documentation'
    | 'Edition & Licensing'
    | 'Security & Compliance'
    | 'Antigravity'
    | 'Onboarding & Enablement';
  title: string;
  description: string;
  url: string;
  source: string;
}

export const RESOURCES_LIST: ResourceItem[] = [
  {
    id: 'res-gemini-ent',
    category: 'Official Documentation',
    title: 'Google Cloud Gemini Enterprise Product Portal',
    description: 'Official overview of Gemini Enterprise capabilities, multimodal AI assistance, and organizational deployment.',
    url: 'https://cloud.google.com/gemini/enterprise',
    source: 'Google Cloud',
  },
  {
    id: 'res-agentspace-docs',
    category: 'Official Documentation',
    title: 'Enterprise Search & Agents Technical Documentation',
    description: 'Technical guides covering grounding, enterprise search indexes, agent creation, and action connectors.',
    url: 'https://cloud.google.com/agentspace/docs/overview',
    source: 'Google Cloud Docs',
  },
  {
    id: 'res-connectors',
    category: 'Edition & Licensing',
    title: 'Supported Enterprise Data Connectors Guide',
    description: 'Reference matrix for Google Workspace, Microsoft SharePoint/OneDrive, Jira, Confluence, and ServiceNow connectors.',
    url: 'https://cloud.google.com/agentspace/docs/connectors',
    source: 'Google Cloud Docs',
  },
  {
    id: 'res-vertex-adk',
    category: 'Edition & Licensing',
    title: 'Vertex AI Agent Builder & Pro-Code Extensibility',
    description: 'Architectural guidance on extending no-code enterprise agents with Vertex AI and custom APIs.',
    url: 'https://cloud.google.com/vertex-ai/generative-ai/docs/agent-builder/overview',
    source: 'Google Cloud Docs',
  },
  {
    id: 'res-ai-security',
    category: 'Security & Compliance',
    title: 'Google Cloud Generative AI Privacy & Security Whitepaper',
    description: 'Details on zero customer data training, encryption at rest/in transit, CMEK, and VPC Service Controls.',
    url: 'https://cloud.google.com/security/ai',
    source: 'Google Cloud Security',
  },
  {
    id: 'res-antigravity',
    category: 'Antigravity',
    title: 'Google Antigravity Developer Platform',
    description: 'Official information on Google Antigravity agentic development surfaces and enterprise workflow integration.',
    url: 'https://antigravity.google/',
    source: 'Google',
  },
  {
    id: 'res-cloud-iam',
    category: 'Security & Compliance',
    title: 'Cloud IAM & Enterprise Identity Best Practices',
    description: 'Official guidance on identity federation, RBAC policies, and least-privilege access governance.',
    url: 'https://cloud.google.com/iam/docs/overview',
    source: 'Google Cloud Docs',
  },
  {
    id: 'res-adoption',
    category: 'Onboarding & Enablement',
    title: 'Google Cloud AI Adoption Framework',
    description: 'Structured organizational readiness checklist spanning leadership alignment, security sign-off, and enablement.',
    url: 'https://cloud.google.com/architecture/framework/perspectives/ai-ml',
    source: 'Google Cloud Architecture',
  },
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What is the difference between license subscription price and Antigravity included quota?',
    answer:
      'The subscription price is the commercial fee per user license for Gemini Enterprise. The Antigravity included quota ($10/license/month for Standard and $15/license/month for Plus) is the monthly pooled AI inference allowance inside Google Antigravity included with those licenses. They are separate metrics.',
  },
  {
    id: 'faq-2',
    question: 'Do unassigned Gemini Enterprise Standard or Plus licenses contribute to the Antigravity quota pool?',
    answer:
      'Yes. Both assigned and unassigned licenses contribute 100% of their per-license monthly quota to the applicable edition’s Google Cloud project-level pool.',
  },
  {
    id: 'faq-3',
    question: 'Can Standard and Plus Antigravity quota pools be combined into one shared pool?',
    answer:
      'No. Standard and Plus quota pools remain strictly separate by edition at the Google Cloud project level. A Standard license contributes only to the Standard pool ($10/license), and a Plus license contributes only to the Plus pool ($15/license).',
  },
  {
    id: 'faq-4',
    question: 'Is the administrator-defined overage budget extra free included quota?',
    answer:
      'No. An administrator-configured overage budget is a project-level spending ceiling—not additional included quota. It prevents developer workflows in Antigravity from stopping abruptly when the included pool is exhausted, while keeping spend within an admin-approved cap.',
  },
  {
    id: 'faq-5',
    question: 'Does the Antigravity quota guarantee a fixed number of prompts, tokens, or model requests?',
    answer:
      'No. Actual inference consumption depends on the specific AI models selected, context window size, and workload complexity. The calculator models financial quota pools and spending envelopes rather than fixed prompt counts.',
  },
  {
    id: 'faq-6',
    question: 'How does Cloud 11 support organizations across Egypt, Saudi Arabia, UAE, and Qatar?',
    answer:
      'As a Google Cloud Premier Partner, Cloud 11 provides localized presales discovery, licensing optimization, security and residency architecture, Microsoft/Google Workspace integration, and technical enablement tailored to regional enterprise requirements.',
  },
];
