import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'editions', label: 'Editions' },
  { id: 'features', label: 'Features' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'antigravity', label: 'Antigravity' },
  { id: 'why-cloud11', label: 'Why Cloud 11' },
  { id: 'resources', label: 'Resources' },
  { id: 'contact', label: 'Contact' },
];

interface NavbarProps {
  activeSection: string;
  onNavigate: (id: string) => void;
  onOpenProposal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenProposal,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (id: string) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1380px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Cloud 11 Wordmark + Google Cloud Premier Partner designation */}
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('overview');
          }}
          className="flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
        >
          <img
            src="/assets/aistudio/Cloud-11-Logo-Header_e48843a5.png"
            alt="Cloud 11"
            className="h-8 w-auto object-contain shrink-0"
          />
          <span className="hidden h-4 w-px bg-slate-200 sm:inline-block" aria-hidden="true" />
          <span className="hidden text-xs font-medium tracking-tight text-slate-600 sm:inline-block">
            Google Cloud Premier Partner
          </span>
        </a>

        {/* Zone 2: Single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-4 xl:gap-5 text-[13px] font-medium text-slate-600"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                className={`relative py-1 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded ${
                  isActive
                    ? 'text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute inset-x-0 -bottom-[19px] h-[2px] bg-blue-600"
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary CTA + Mobile menu toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenProposal}
            className="hidden sm:inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            Proposal Brief
          </button>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('contact');
            }}
            className="inline-flex items-center justify-center rounded-lg bg-[#1A73E8] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1557B0] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Request a Consultation
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex lg:hidden items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4">
          <div className="mb-3 pb-2 border-b border-slate-100 text-xs font-medium text-slate-500">
            Cloud 11 · Google Cloud Premier Partner
          </div>
          <nav className="grid grid-cols-2 gap-2" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.id);
                  }}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenProposal();
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            >
              View Customer Proposal Summary
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
