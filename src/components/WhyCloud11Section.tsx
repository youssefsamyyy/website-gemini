import React, { useState } from 'react';
import { Check, Globe2 } from 'lucide-react';
import { CLOUD11_SERVICES, ENGAGEMENT_STAGES } from '../data/portalContent';

interface WhyCloud11SectionProps {
  selectedServices: string[];
  onToggleService: (title: string) => void;
  onNavigate: (id: string) => void;
}

const VALUE_PILLARS = [
  {
    title: 'Google Cloud Expertise',
    detail: 'Deep engineering proficiency across Google Cloud AI, Vertex AI, Workspace, BigQuery, and Cloud Identity.',
  },
  {
    title: 'Technical Presales Capabilities',
    detail: 'Structured discovery workshops, live edition mapping, and Antigravity quota modeling tailored to IT and finance.',
  },
  {
    title: 'Enterprise Architecture Experience',
    detail: 'Production blueprints for IAM federation, CMEK encryption, VPC Service Controls, and hybrid Microsoft coexistence.',
  },
  {
    title: 'Regional Engagement (EG · KSA · UAE · QA)',
    detail: 'Dedicated enterprise engagement across Egypt, Saudi Arabia, United Arab Emirates, and Qatar aligned with local governance expectations.',
  },
  {
    title: 'Licensing & Implementation Support',
    detail: 'Seamless transition from commercial procurement through connector deployment, agent rollout, and developer onboarding.',
  },
  {
    title: 'Long-Term Customer Success',
    detail: 'Ongoing quota reviews, adoption coaching, and workflow optimization as your AI maturity scales.',
  },
];

export const WhyCloud11Section: React.FC<WhyCloud11SectionProps> = ({
  selectedServices,
  onToggleService,
  onNavigate,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="why-cloud11" className="border-b border-slate-200 bg-slate-50/50 py-16 lg:py-20">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        {/* Top Split */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <p className="text-xs font-medium text-blue-700">
                Cloud 11 · Google Cloud Premier Partner
              </p>
              <h2
                className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Your AI Transformation Partner. Beyond Licensing.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Buying licenses is only the first step. Cloud 11 helps enterprise CIOs, CTOs, security directors, and engineering leaders architect, govern, integrate, and scale Google Gemini Enterprise across real business workflows.
              </p>
            </div>

            {/* Engagement Methodology */}
            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-semibold text-slate-800">
                Cloud 11 Engagement Approach
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-5">
                {ENGAGEMENT_STAGES.map((stage) => (
                  <div
                    key={stage.step}
                    className="rounded-lg border border-slate-200 bg-slate-50/70 p-3"
                  >
                    <div className="font-mono text-[11px] font-semibold text-blue-700">
                      {stage.step}
                    </div>
                    <div className="mt-0.5 font-display text-sm font-bold text-slate-950">
                      {stage.name}
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                      {stage.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[300px] overflow-hidden rounded-xl border border-slate-200 bg-slate-200">
              {!imgError ? (
                <img
                  src="/src/assets/images/cloud11_advisory_team_1795445575264.jpg"
                  alt="Cloud 11 executive enterprise AI architecture briefing room"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[300px] items-center justify-center bg-slate-100 p-8 text-center">
                  <div className="text-sm font-medium text-slate-600">
                    Cloud 11 Enterprise Advisory & Architecture Delivery
                  </div>
                </div>
              )}
              <div className="absolute inset-x-4 bottom-4 rounded-lg border border-white/60 bg-white/95 p-4 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                  <Globe2 className="h-4 w-4 text-blue-700" />
                  <span>Regional Enterprise Presence</span>
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  Supporting enterprise AI transformations across Egypt, Saudi Arabia, United Arab Emirates, and Qatar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 10 Cloud 11 Services (Interactive for Proposal Summary) */}
        <div className="mt-14">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h3 className="font-display text-2xl font-bold text-slate-950">
                End-to-End Gemini Enterprise Services
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Select any Cloud 11 service below to include it in your Customer Proposal Summary.
              </p>
            </div>
            <span className="font-mono text-xs font-medium text-slate-600 tabular-nums">
              {selectedServices.length} of {CLOUD11_SERVICES.length} selected for proposal
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {CLOUD11_SERVICES.map((service) => {
              const selected = selectedServices.includes(service.title);
              return (
                <button
                  key={service.index}
                  type="button"
                  onClick={() => onToggleService(service.title)}
                  aria-pressed={selected}
                  className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    selected
                      ? 'border-blue-600 bg-blue-50/60'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-slate-400">
                        {service.index}.
                      </span>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded border text-xs ${
                          selected
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300 bg-white text-transparent'
                        }`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                    </div>
                    <h4 className="mt-2.5 font-display text-sm font-bold text-slate-950">
                      {service.title}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      {service.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Why Work with Cloud 11 */}
        <div className="mt-14 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center">
            <div>
              <h3 className="font-display text-2xl font-bold text-slate-950">
                Why Work with Cloud 11?
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Specialized Google Cloud Premier Partner guidance designed for security-conscious, high-growth enterprises.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="rounded-lg bg-[#1A73E8] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1557B0] whitespace-nowrap shrink-0 self-start md:self-auto"
            >
              Schedule Architecture Discovery
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {VALUE_PILLARS.map((pillar) => (
              <div key={pillar.title}>
                <h4 className="font-display text-sm font-bold text-slate-950">
                  {pillar.title}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {pillar.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
