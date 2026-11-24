import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Bot,
  Cpu,
  Database,
  Layers,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (id: string) => void;
}

const ADOPTION_STAGES = [
  {
    id: 'discover',
    step: '01',
    title: 'Discover',
    caption: 'Grounded enterprise search',
    detail:
      'Unify corporate knowledge across Google Workspace, Microsoft 365, Cloud Storage, and SaaS repositories with source-cited answers.',
  },
  {
    id: 'connect',
    step: '02',
    title: 'Connect',
    caption: 'Permission-aware data fabric',
    detail:
      'Preserve native document ACLs and enterprise identity policies via Cloud Identity, SSO, and pre-built enterprise connectors.',
  },
  {
    id: 'build',
    step: '03',
    title: 'Build',
    caption: 'No-code & pro-code agents',
    detail:
      'Empower business analysts with custom no-code agents and enable engineers via Vertex AI, ADK, and Google Antigravity.',
  },
  {
    id: 'automate',
    step: '04',
    title: 'Automate',
    caption: 'Cross-system workflows',
    detail:
      'Execute multi-step actions across ITSM, CRM, ERP, and engineering toolchains inside governed enterprise boundaries.',
  },
  {
    id: 'scale',
    step: '05',
    title: 'Scale',
    caption: 'Governed pools & overage control',
    detail:
      'Manage seat cohorts across Business, Standard, and Plus editions with project-level Antigravity pooling and spending caps.',
  },
];

const KEY_BENEFITS = [
  {
    icon: Layers,
    title: 'Enterprise AI Assistance',
    description:
      'Multimodal conversational intelligence for analysis, drafting, and synthesis with zero customer data model training.',
  },
  {
    icon: Bot,
    title: 'Intelligent AI Agents',
    description:
      'Role-scoped agents that automate multi-step departmental tasks and coordinate actions across business software.',
  },
  {
    icon: Database,
    title: 'Business Data Integration',
    description:
      'Pre-built connectors across Google Workspace, SharePoint, Jira, Confluence, BigQuery, and enterprise SaaS.',
  },
  {
    icon: Cpu,
    title: 'Advanced AI Models',
    description:
      'Direct enterprise access to Google Gemini reasoning and multimodal models inside managed Google Cloud perimeters.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Security & Governance',
    description:
      'Identity federation, document ACL enforcement, CMEK/VPC-SC readiness, and central admin telemetry.',
  },
  {
    icon: Terminal,
    title: 'Developer Productivity with Antigravity',
    description:
      'Pooled AI inference entitlements across Standard ($10/seat) and Plus ($15/seat) with admin-managed overage budgets.',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [imgError, setImgError] = useState(false);

  const activeStage = ADOPTION_STAGES[activeStageIdx];

  return (
    <section id="overview" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1380px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        {/* Hero Split */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <p className="text-xs font-medium tracking-wide text-slate-500">
                Cloud 11 Enterprise Advisory · Google Cloud Premier Partner
              </p>

              <h1
                className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-[54px] lg:leading-[1.08]"
                style={{ textWrap: 'balance' }}
              >
                Bring Enterprise AI to Life with Gemini.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Discover how Gemini Enterprise empowers your organization with advanced AI
                capabilities, intelligent agents, enterprise-grade security, and developer
                productivity — delivered with Cloud 11.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onNavigate('editions')}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1A73E8] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1557B0] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  <span>Explore Editions</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('pricing')}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <span>Calculate Your Investment</span>
                </button>
              </div>
            </div>

            {/* Quiet structural summary strip */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
              <div>
                <div className="text-xs font-medium text-slate-500">Editions</div>
                <div className="mt-1 font-display text-sm font-semibold text-slate-900">
                  Business · Standard · Plus · PAYG · Frontline
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Antigravity Pooling</div>
                <div className="mt-1 font-mono text-sm font-semibold text-slate-900 tabular-nums">
                  $10 Std / $15 Plus
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Regional Delivery</div>
                <div className="mt-1 font-display text-sm font-semibold text-slate-900">
                  EG · KSA · UAE · QA
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Carrier */}
          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[340px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {!imgError ? (
                <img
                  src="/src/assets/images/hero_enterprise_ai_1795445572981.jpg"
                  alt="Precision glass optical prisms and brushed aluminum representing connected enterprise AI systems and Gemini Enterprise architecture"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover lg:h-full"
                />
              ) : (
                <div className="flex h-full min-h-[340px] flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 p-8 text-center">
                  <Layers className="h-10 w-10 text-blue-600" />
                  <p className="mt-3 font-display text-base font-semibold text-slate-900">
                    Gemini Enterprise Architecture
                  </p>
                  <p className="mt-1 max-w-sm text-sm text-slate-600">
                    Unified enterprise knowledge, intelligent agents, and Antigravity developer inference.
                  </p>
                </div>
              )}

              {/* Subtle bottom overlay panel */}
              <div className="absolute inset-x-4 bottom-4 rounded-lg border border-white/60 bg-white/92 p-4 backdrop-blur-md">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-900">
                    Enterprise AI Platform Architecture
                  </span>
                  <span>Zero model training on corporate data</span>
                </div>
                <div className="mt-2.5 grid grid-cols-3 gap-2.5 text-xs">
                  <div className="rounded-md border border-slate-200 bg-slate-50/90 px-3 py-2">
                    <div className="font-semibold text-slate-900">Knowledge Layer</div>
                    <div className="mt-0.5 text-slate-600">Search & ACL Sync</div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-slate-50/90 px-3 py-2">
                    <div className="font-semibold text-slate-900">Agent Layer</div>
                    <div className="mt-0.5 text-slate-600">No-Code & Vertex ADK</div>
                  </div>
                  <div className="rounded-md border border-blue-200 bg-blue-50/80 px-3 py-2">
                    <div className="font-semibold text-blue-950">Antigravity</div>
                    <div className="mt-0.5 text-blue-800">Pooled AI Inference</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Pipeline: Discover -> Connect -> Build -> Automate -> Scale */}
        <div className="mt-16 rounded-xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-950">
                Enterprise AI Value Progression
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Select any stage to inspect how Gemini Enterprise moves organizations from knowledge discovery to governed scale.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('antigravity')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0 self-start sm:self-auto"
            >
              Inspect Antigravity Quota Model →
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
            {ADOPTION_STAGES.map((stage, idx) => {
              const selected = idx === activeStageIdx;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStageIdx(idx)}
                  className={`group relative rounded-lg border px-4 py-3.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    selected
                      ? 'border-blue-600 bg-white shadow-sm'
                      : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>{stage.step}</span>
                    {idx < ADOPTION_STAGES.length - 1 && (
                      <span className="hidden sm:inline text-slate-300">→</span>
                    )}
                  </div>
                  <div
                    className={`mt-1.5 font-display text-base font-semibold ${
                      selected ? 'text-blue-700' : 'text-slate-900'
                    }`}
                  >
                    {stage.title}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500 truncate">{stage.caption}</div>
                </button>
              );
            })}
          </div>

          <motion.div
            key={activeStage.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="mt-4 flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:flex-row sm:items-center"
          >
            <div>
              <div className="text-xs font-medium text-blue-700">
                Stage {activeStage.step} · {activeStage.title}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">{activeStage.detail}</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('features')}
              className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap shrink-0 self-start sm:self-center"
            >
              Explore Capabilities
            </button>
          </motion.div>
        </div>

        {/* 6 Core Benefits */}
        <div className="mt-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Built for executive governance, knowledge workers, and engineering teams.
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Gemini Enterprise consolidates conversational AI, grounded enterprise search, workflow agents, and developer inference under one Google Cloud commercial structure.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-3">
            {KEY_BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="bg-white p-6 sm:p-7">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-blue-700">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-slate-950">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
