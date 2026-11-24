import React, { useMemo, useState } from 'react';
import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ_ITEMS, ResourceItem, RESOURCES_LIST } from '../data/portalContent';

const RESOURCE_CATEGORIES: Array<'All' | ResourceItem['category']> = [
  'All',
  'Official Documentation',
  'Edition & Licensing',
  'Security & Compliance',
  'Antigravity',
  'Onboarding & Enablement',
];

export const ResourcesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ResourceItem['category']>('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0].id);

  const filteredResources = useMemo(() => {
    if (selectedCategory === 'All') return RESOURCES_LIST;
    return RESOURCES_LIST.filter((r) => r.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section id="resources" className="border-b border-slate-200 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-blue-700">
            Documentation & Enablement
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Official Resources & Technical FAQ
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Access verified Google Cloud product documentation, connector matrices, security whitepapers, Antigravity materials, and licensing answers.
          </p>
        </div>

        {/* Category Filter Bar */}
        <div className="mt-8 flex flex-wrap items-center gap-1.5">
          {RESOURCE_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Resource Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {filteredResources.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-blue-600/60 hover:bg-slate-50/50"
            >
              <div>
                <div className="text-[11px] font-medium text-slate-500">
                  {item.category} · {item.source}
                </div>
                <h3 className="mt-2 font-display text-base font-bold text-slate-950 group-hover:text-blue-700">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                <span>Open Official Source</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </a>
          ))}
        </div>

        {/* Technical & Licensing FAQ */}
        <div className="mt-14 rounded-xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8">
          <h3 className="font-display text-2xl font-bold text-slate-950">
            Frequently Asked Questions
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Key clarifications used during executive, procurement, and security discovery meetings.
          </p>

          <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {FAQ_ITEMS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id}>
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50/80"
                  >
                    <span className="font-display text-sm font-semibold text-slate-950 sm:text-base">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-slate-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm leading-relaxed text-slate-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
