import { useEffect, useMemo, useState } from 'react';
import { EditionId, PRICING_CONFIG, ProposalState } from './config/pricingConfig';
import {
  buildProposalSummaryText,
  calculateAntigravityPools,
  calculateLicensingPricing,
} from './utils/calculators';
import { Navbar, NAV_ITEMS } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EditionsComparison } from './components/EditionsComparison';
import { FeaturesExplorer } from './components/FeaturesExplorer';
import { PricingCalculator } from './components/PricingCalculator';
import { AntigravityCalculator } from './components/AntigravityCalculator';
import { WhyCloud11Section } from './components/WhyCloud11Section';
import { ResourcesSection } from './components/ResourcesSection';
import { ContactSection } from './components/ContactSection';
import { ProposalSummaryModal } from './components/ProposalSummaryModal';
import { Footer } from './components/Footer';

const INITIAL_PROPOSAL_STATE: ProposalState = {
  customerName: '',
  contactName: '',
  editionCounts: {
    business: 0,
    standard: 20,
    plus: 10,
  },
  billingCycle: 'annual',
  customRatesUsd: {
    business: PRICING_CONFIG.editions.business.indicativeMonthlyUsd,
    standard: PRICING_CONFIG.editions.standard.indicativeMonthlyUsd,
    plus: PRICING_CONFIG.editions.plus.indicativeMonthlyUsd,
  },
  discountPercent: 0,
  antigravityStandardAssigned: 15,
  antigravityPlusAssigned: 8,
  standardOverageBudgetUsd: 100,
  plusOverageBudgetUsd: 150,
  consumptionPercent: 75,
  selectedServices: [
    'Gemini Enterprise Licensing & Consultation',
    'Enterprise AI Architecture',
    'Identity & Access Management',
    'Developer Productivity & Antigravity Enablement',
  ],
};

export default function App() {
  const [proposal, setProposal] = useState<ProposalState>(INITIAL_PROPOSAL_STATE);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [proposalOpen, setProposalOpen] = useState<boolean>(false);

  // Scrollspy for active navigation indicator
  useEffect(() => {
    const ids = NAV_ITEMS.map((item) => item.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0 && visible[0].target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: [0.05, 0.25, 0.5],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const pricing = useMemo(
    () =>
      calculateLicensingPricing(
        proposal.editionCounts,
        proposal.customRatesUsd,
        proposal.billingCycle,
        proposal.discountPercent
      ),
    [
      proposal.editionCounts,
      proposal.customRatesUsd,
      proposal.billingCycle,
      proposal.discountPercent,
    ]
  );

  const antigravity = useMemo(
    () =>
      calculateAntigravityPools({
        standardLicenses: proposal.editionCounts.standard,
        plusLicenses: proposal.editionCounts.plus,
        standardAssigned: proposal.antigravityStandardAssigned,
        plusAssigned: proposal.antigravityPlusAssigned,
        standardOverageBudgetUsd: proposal.standardOverageBudgetUsd,
        plusOverageBudgetUsd: proposal.plusOverageBudgetUsd,
        consumptionPercent: proposal.consumptionPercent,
      }),
    [
      proposal.editionCounts.standard,
      proposal.editionCounts.plus,
      proposal.antigravityStandardAssigned,
      proposal.antigravityPlusAssigned,
      proposal.standardOverageBudgetUsd,
      proposal.plusOverageBudgetUsd,
      proposal.consumptionPercent,
    ]
  );

  const updateEditionCount = (edition: EditionId, count: number) => {
    const clean = Math.max(0, Math.floor(count));
    setProposal((prev) => ({
      ...prev,
      editionCounts: {
        ...prev.editionCounts,
        [edition]: clean,
      },
      antigravityStandardAssigned:
        edition === 'standard'
          ? Math.min(prev.antigravityStandardAssigned, clean)
          : prev.antigravityStandardAssigned,
      antigravityPlusAssigned:
        edition === 'plus'
          ? Math.min(prev.antigravityPlusAssigned, clean)
          : prev.antigravityPlusAssigned,
    }));
  };

  const applyRecommendedEdition = (edition: EditionId) => {
    setProposal((prev) => ({
      ...prev,
      editionCounts: {
        business: edition === 'business' ? Math.max(25, prev.editionCounts.business || 25) : 0,
        standard: edition === 'standard' ? Math.max(25, prev.editionCounts.standard || 25) : 0,
        plus: edition === 'plus' ? Math.max(25, prev.editionCounts.plus || 25) : 0,
      },
      antigravityStandardAssigned: edition === 'standard' ? 20 : 0,
      antigravityPlusAssigned: edition === 'plus' ? 20 : 0,
    }));
  };

  const loadReferenceAntigravityExample = () => {
    setProposal((prev) => ({
      ...prev,
      editionCounts: {
        ...prev.editionCounts,
        standard: 20,
        plus: 10,
      },
      antigravityStandardAssigned: 16,
      antigravityPlusAssigned: 8,
      standardOverageBudgetUsd: 100,
      plusOverageBudgetUsd: 150,
      consumptionPercent: 100,
    }));
  };

  const downloadAntigravityEstimate = () => {
    const text = buildProposalSummaryText(proposal, pricing, antigravity);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cloud11-antigravity-usage-estimate.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleService = (title: string) => {
    setProposal((prev) => {
      const exists = prev.selectedServices.includes(title);
      return {
        ...prev,
        selectedServices: exists
          ? prev.selectedServices.filter((s) => s !== title)
          : [...prev.selectedServices, title],
      };
    });
  };

  const primaryEdition: EditionId =
    proposal.editionCounts.plus > 0
      ? 'plus'
      : proposal.editionCounts.standard > 0
      ? 'standard'
      : 'business';

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenProposal={() => setProposalOpen(true)}
      />

      <main>
        <HeroSection onNavigate={scrollToSection} />

        <EditionsComparison
          onApplyRecommendedEdition={applyRecommendedEdition}
          onNavigate={scrollToSection}
        />

        <FeaturesExplorer />

        <PricingCalculator
          proposal={proposal}
          pricing={pricing}
          onUpdateCounts={updateEditionCount}
          onUpdateBillingCycle={(billingCycle) =>
            setProposal((prev) => ({ ...prev, billingCycle }))
          }
          onUpdateRate={(edition, rate) =>
            setProposal((prev) => ({
              ...prev,
              customRatesUsd: { ...prev.customRatesUsd, [edition]: rate },
            }))
          }
          onUpdateDiscount={(discountPercent) =>
            setProposal((prev) => ({ ...prev, discountPercent }))
          }
          onResetRates={() =>
            setProposal((prev) => ({
              ...prev,
              discountPercent: 0,
              customRatesUsd: {
                business: PRICING_CONFIG.editions.business.indicativeMonthlyUsd,
                standard: PRICING_CONFIG.editions.standard.indicativeMonthlyUsd,
                plus: PRICING_CONFIG.editions.plus.indicativeMonthlyUsd,
              },
            }))
          }
          onOpenProposal={() => setProposalOpen(true)}
          onNavigate={scrollToSection}
        />

        <AntigravityCalculator
          proposal={proposal}
          antigravity={antigravity}
          onUpdateStandardLicenses={(count) => updateEditionCount('standard', count)}
          onUpdatePlusLicenses={(count) => updateEditionCount('plus', count)}
          onUpdateStandardAssigned={(count) =>
            setProposal((prev) => ({
              ...prev,
              antigravityStandardAssigned: Math.min(prev.editionCounts.standard, count),
            }))
          }
          onUpdatePlusAssigned={(count) =>
            setProposal((prev) => ({
              ...prev,
              antigravityPlusAssigned: Math.min(prev.editionCounts.plus, count),
            }))
          }
          onUpdateStandardOverage={(amount) =>
            setProposal((prev) => ({ ...prev, standardOverageBudgetUsd: amount }))
          }
          onUpdatePlusOverage={(amount) =>
            setProposal((prev) => ({ ...prev, plusOverageBudgetUsd: amount }))
          }
          onUpdateConsumptionPercent={(consumptionPercent) =>
            setProposal((prev) => ({ ...prev, consumptionPercent }))
          }
          onLoadReferenceExample={loadReferenceAntigravityExample}
          onDownloadEstimate={downloadAntigravityEstimate}
          onOpenProposal={() => setProposalOpen(true)}
        />

        <WhyCloud11Section
          selectedServices={proposal.selectedServices}
          onToggleService={toggleService}
          onNavigate={scrollToSection}
        />

        <ResourcesSection />

        <ContactSection
          defaultUsers={pricing.totalLicenses}
          defaultEdition={primaryEdition}
        />
      </main>

      <Footer
        onNavigate={scrollToSection}
        onOpenProposal={() => setProposalOpen(true)}
      />

      <ProposalSummaryModal
        open={proposalOpen}
        onClose={() => setProposalOpen(false)}
        proposal={proposal}
        pricing={pricing}
        antigravity={antigravity}
        onUpdateCustomerName={(customerName) =>
          setProposal((prev) => ({ ...prev, customerName }))
        }
        onUpdateContactName={(contactName) =>
          setProposal((prev) => ({ ...prev, contactName }))
        }
      />
    </div>
  );
}
