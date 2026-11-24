import React from 'react';
import { NAV_ITEMS } from './Navbar';

interface FooterProps {
  onNavigate: (id: string) => void;
  onOpenProposal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenProposal }) => {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/Cloud-11-Logo-Header_e48843a5.png"
                alt="Cloud 11"
                className="h-7 w-auto object-contain shrink-0"
              />
              <span className="text-slate-300" aria-hidden="true">|</span>
              <span className="text-xs font-medium text-slate-600">
                Google Cloud Premier Partner
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Cloud 11 | Gemini Enterprise Solutions presales portal. Supporting enterprise AI transformation across Egypt, Saudi Arabia, UAE, and Qatar.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-xs sm:grid-cols-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                className="text-slate-600 hover:text-slate-950"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div>
            <button
              type="button"
              onClick={onOpenProposal}
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap shrink-0"
            >
              Open Customer Proposal Summary
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-slate-100 pt-6 text-[11px] text-slate-500 sm:flex-row sm:items-center">
          <div>
            © {new Date().getFullYear()} Cloud 11. Google Cloud Premier Partner. All rights reserved.
          </div>
          <div>
            Indicative planning estimates shown require a confirmed Cloud 11 commercial quotation.
          </div>
        </div>
      </div>
    </footer>
  );
};
