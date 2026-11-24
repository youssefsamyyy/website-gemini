import React, { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { PRICING_CONFIG } from '../config/pricingConfig';
import { FEATURE_CATEGORIES } from '../data/portalContent';

export const FeaturesExplorer: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(FEATURE_CATEGORIES[0].id);
  const [imgError, setImgError] = useState(false);

  const activeCategory =
    FEATURE_CATEGORIES.find((c) => c.id === activeId) ?? FEATURE_CATEGORIES[0];

  return (
    <section id="features" className="border-b border-slate-200 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-blue-700">
            Architecture & Capabilities
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Features & Capabilities Explorer
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Inspect how Gemini Enterprise connects business data, executes agentic workflows, enforces security, and powers software engineering across all nine capability domains.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Category Navigation Rail */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-1">
              {FEATURE_CATEGORIES.map((cat, idx) => {
                const isActive = cat.id === activeCategory.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveId(cat.id)}
                    className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      isActive
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm truncate">
                      <span className="mr-2 font-mono text-xs text-slate-400">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      {cat.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Architecture Visual */}
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              {!imgError ? (
                <img
                  src="/src/assets/images/feature_agents_architecture_1795445573806.jpg"
                  alt="Isometric technical diagram of modular AI agent orchestration nodes and enterprise data connectors"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center p-6 text-center text-xs text-slate-500">
                  Enterprise AI Agent & Connector Topology
                </div>
              )}
              <div className="border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
                Modular orchestration linking enterprise repositories, IAM policies, Gemini models, and Antigravity surfaces.
              </div>
            </div>
          </div>

          {/* Active Capability Dossier */}
          <div className="lg:col-span-8">
            <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="text-xs font-medium text-slate-500">
                    Applicable Editions:{' '}
                    <span className="font-semibold text-slate-900">
                      {activeCategory.applicableEditions
                        .map((id) => PRICING_CONFIG.editions[id].shortName)
                        .join(' · ')}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-display text-2xl font-bold text-slate-950">
                    {activeCategory.title}
                  </h3>
                </div>

                <a
                  href={activeCategory.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 whitespace-nowrap shrink-0"
                >
                  <span>{activeCategory.docLabel}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <p className="mt-5 text-base leading-relaxed text-slate-700">
                {activeCategory.summary}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-5">
                  <h4 className="font-display text-sm font-semibold text-slate-950">
                    Business Value
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {activeCategory.businessValue}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-5">
                  <h4 className="font-display text-sm font-semibold text-slate-950">
                    Technical Architecture
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {activeCategory.technicalExplanation}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <h4 className="font-display text-sm font-semibold text-slate-950">
                  Key Capabilities in This Domain
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {activeCategory.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Architecture Flow Diagram */}
              <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold text-slate-700">
                  Enterprise Execution Flow
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                  <div className="rounded border border-slate-200 bg-white px-3 py-2.5">
                    <div className="font-semibold text-slate-900">1. Identity & SSO</div>
                    <div className="mt-0.5 text-slate-500">Verify user & group ACLs</div>
                  </div>
                  <div className="rounded border border-slate-200 bg-white px-3 py-2.5">
                    <div className="font-semibold text-slate-900">2. Grounded Context</div>
                    <div className="mt-0.5 text-slate-500">Retrieve authorized records</div>
                  </div>
                  <div className="rounded border border-slate-200 bg-white px-3 py-2.5">
                    <div className="font-semibold text-slate-900">3. Gemini Reasoning</div>
                    <div className="mt-0.5 text-slate-500">Synthesize or trigger action</div>
                  </div>
                  <div className="rounded border border-slate-200 bg-white px-3 py-2.5">
                    <div className="font-semibold text-slate-900">4. Audit & Governance</div>
                    <div className="mt-0.5 text-slate-500">Log & enforce policy caps</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
