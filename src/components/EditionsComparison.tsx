import React, { useMemo, useState } from 'react';
import {
  Check,
  Compass,
  Filter,
  Minus,
  RotateCcw,
  Search,
} from 'lucide-react';
import { EditionId } from '../config/pricingConfig';
import {
  ALL_COMPARISON_EDITIONS,
  COMPARISON_CATEGORIES,
  COMPARISON_EDITIONS,
  COMPARISON_FOOTNOTES,
  ComparisonCategory,
  ComparisonCell,
  ComparisonEditionId,
  ComparisonRow,
  EDITION_COMPARISON_ROWS,
  RecommendationAnswers,
  recommendEdition,
} from '../data/geminiEditions';

interface EditionsComparisonProps {
  onApplyRecommendedEdition: (edition: EditionId) => void;
  onNavigate: (id: string) => void;
}

type RequirementFilter =
  | 'all'
  | 'differences_only'
  | 'included_business'
  | 'included_standard'
  | 'included_plus'
  | 'included_payg'
  | 'included_frontline'
  | 'upgrade_over_business';

const REQUIREMENT_FILTERS: Array<{ value: RequirementFilter; label: string }> = [
  { value: 'all', label: 'All capabilities (27)' },
  { value: 'differences_only', label: 'Only where selected editions differ' },
  { value: 'upgrade_over_business', label: 'Added in Standard / Plus vs. Business' },
  { value: 'included_business', label: 'Included in Business' },
  { value: 'included_standard', label: 'Included in Standard' },
  { value: 'included_plus', label: 'Included in Plus' },
  { value: 'included_payg', label: 'Included in Pay-as-you-go' },
  { value: 'included_frontline', label: 'Included in Frontline' },
];

export const EditionsComparison: React.FC<EditionsComparisonProps> = ({
  onApplyRecommendedEdition,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ComparisonCategory>('All');
  const [requirementFilter, setRequirementFilter] = useState<RequirementFilter>('all');
  const [visibleEditions, setVisibleEditions] = useState<Record<ComparisonEditionId, boolean>>({
    business: true,
    standard: true,
    plus: true,
    payg: true,
    frontline: true,
  });
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  const [answers, setAnswers] = useState<RecommendationAnswers>({
    deploymentModel: 'seat_enterprise',
    connectorAndSecurity: 'full_enterprise',
    storageAndAntigravity: 'standard_30gb',
    needDeveloperTools: 'yes',
  });

  const recommendation = useMemo(() => recommendEdition(answers), [answers]);

  const activeEditionIds = useMemo(
    () => ALL_COMPARISON_EDITIONS.filter((id) => visibleEditions[id]),
    [visibleEditions]
  );

  const toggleEditionColumn = (id: ComparisonEditionId) => {
    if (visibleEditions[id] && activeEditionIds.length <= 1) {
      return;
    }
    setVisibleEditions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const applyColumnPreset = (ids: ComparisonEditionId[]) => {
    setVisibleEditions({
      business: ids.includes('business'),
      standard: ids.includes('standard'),
      plus: ids.includes('plus'),
      payg: ids.includes('payg'),
      frontline: ids.includes('frontline'),
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setRequirementFilter('all');
    setVisibleEditions({
      business: true,
      standard: true,
      plus: true,
      payg: true,
      frontline: true,
    });
    setHighlightDifferences(false);
  };

  const rowHasDifference = (row: ComparisonRow) => {
    if (activeEditionIds.length < 2) return false;
    const keys = activeEditionIds.map((id) => `${row[id].status}:${row[id].label}`);
    return new Set(keys).size > 1;
  };

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return EDITION_COMPARISON_ROWS.filter((row) => {
      if (selectedCategory !== 'All' && row.category !== selectedCategory) {
        return false;
      }

      if (requirementFilter === 'differences_only' && !rowHasDifference(row)) {
        return false;
      }
      if (requirementFilter === 'included_business' && row.business.status === 'not_included') {
        return false;
      }
      if (requirementFilter === 'included_standard' && row.standard.status === 'not_included') {
        return false;
      }
      if (requirementFilter === 'included_plus' && row.plus.status === 'not_included') {
        return false;
      }
      if (requirementFilter === 'included_payg' && row.payg.status === 'not_included') {
        return false;
      }
      if (requirementFilter === 'included_frontline' && row.frontline.status === 'not_included') {
        return false;
      }
      if (
        requirementFilter === 'upgrade_over_business' &&
        !(
          row.business.status === 'not_included' &&
          (row.standard.status !== 'not_included' || row.plus.status !== 'not_included')
        )
      ) {
        return false;
      }

      if (!q) return true;
      return (
        row.feature.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q) ||
        row.business.label.toLowerCase().includes(q) ||
        row.standard.label.toLowerCase().includes(q) ||
        row.plus.label.toLowerCase().includes(q) ||
        row.payg.label.toLowerCase().includes(q) ||
        row.frontline.label.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory, requirementFilter, activeEditionIds]);

  const renderCell = (cell: ComparisonCell) => {
    if (cell.status === 'included') {
      return (
        <div className="inline-flex items-center gap-1.5 text-emerald-800">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
          </span>
          <span className="text-xs font-medium">
            Included
            {cell.footnote && (
              <sup className="ml-0.5 font-mono text-[10px] text-slate-500">
                {cell.footnote}
              </sup>
            )}
          </span>
        </div>
      );
    }

    if (cell.status === 'not_included') {
      return (
        <div className="inline-flex items-center gap-1.5 text-slate-400">
          <Minus className="h-3.5 w-3.5" />
          <span className="text-xs">Not included</span>
        </div>
      );
    }

    return (
      <span className="text-xs font-semibold text-slate-900 leading-snug block">
        {cell.label}
      </span>
    );
  };

  return (
    <section id="editions" className="border-b border-slate-200 bg-slate-50/50 py-16 lg:py-20">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-blue-700">
              Official Gemini Enterprise Matrix · 5 Editions
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Compare Gemini Enterprise Editions
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Filter by customer requirements, compare any combination of Business, Standard, Plus, Pay-as-you-go, and Frontline, and isolate differences live during discovery meetings.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-800">
              <Check className="h-3.5 w-3.5 text-emerald-700" /> Included
            </span>
            <span className="text-slate-300">·</span>
            <span className="inline-flex items-center gap-1.5 text-slate-500">
              <Minus className="h-3.5 w-3.5 text-slate-400" /> Not included
            </span>
          </div>
        </div>

        {/* 5 Edition Summary Cards */}
        <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {ALL_COMPARISON_EDITIONS.map((id) => {
            const meta = COMPARISON_EDITIONS[id];
            const isVisible = visibleEditions[id];
            return (
              <div
                key={id}
                className={`flex flex-col justify-between rounded-xl border bg-white p-4 transition-colors ${
                  id === 'standard' ? 'border-blue-600/60' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500">
                      {meta.segment}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleEditionColumn(id)}
                      className={`rounded border px-2 py-0.5 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        isVisible
                          ? 'border-blue-200 bg-blue-50 text-blue-800'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {isVisible ? 'Shown' : 'Show'}
                    </button>
                  </div>
                  <h3 className="mt-2 font-display text-base font-bold text-slate-950">
                    {meta.shortName}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    {meta.summary}
                  </p>
                </div>

                <div className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-[11px]">
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Seats</span>
                    <span className="font-medium text-slate-900 text-right">{meta.seatRule}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Indexing</span>
                    <span className="font-mono font-medium text-slate-900 text-right">
                      {meta.storageRule}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Antigravity</span>
                    <span className="font-mono font-semibold text-blue-800 text-right">
                      {meta.antigravityRule}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Customer Filtration Toolbar */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-center">
            {/* Search Input */}
            <div className="relative lg:col-span-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search feature (e.g., Deep Research, skills, 75 GiB)..."
                aria-label="Search comparison features"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            {/* Customer Requirement Filter Select */}
            <div className="flex items-center gap-2 lg:col-span-4">
              <Filter className="h-4 w-4 shrink-0 text-slate-500" />
              <select
                aria-label="Filter by customer requirement or edition inclusion"
                value={requirementFilter}
                onChange={(e) => setRequirementFilter(e.target.value as RequirementFilter)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              >
                {REQUIREMENT_FILTERS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Column Presets & Diff Toggle */}
            <div className="flex flex-wrap items-center gap-2 lg:col-span-4 lg:justify-end">
              <button
                type="button"
                onClick={() => applyColumnPreset(['business', 'standard', 'plus'])}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                Core 3
              </button>
              <button
                type="button"
                onClick={() => applyColumnPreset(ALL_COMPARISON_EDITIONS)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                All 5
              </button>
              <button
                type="button"
                onClick={() => setHighlightDifferences((prev) => !prev)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  highlightDifferences
                    ? 'border-blue-600 bg-blue-50 text-blue-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {highlightDifferences ? 'Differences Highlighted' : 'Highlight Differences'}
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {COMPARISON_CATEGORIES.map((category) => {
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
            <div className="font-mono text-xs text-slate-500 tabular-nums">
              Showing {filteredRows.length} of {EDITION_COMPARISON_ROWS.length} features
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="w-[28%] px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Feature
                  </th>
                  {activeEditionIds.map((id) => (
                    <th
                      key={id}
                      className="px-4 py-4 text-xs font-bold text-slate-950 sm:text-sm"
                    >
                      {COMPARISON_EDITIONS[id].name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={1 + activeEditionIds.length}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      No features match your active filter criteria.{' '}
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="font-semibold text-blue-700 hover:underline"
                      >
                        Reset all filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => {
                    const isDiff = rowHasDifference(row);
                    const dimmed = highlightDifferences && !isDiff;

                    return (
                      <tr
                        key={row.id}
                        className={`transition-colors hover:bg-slate-50/80 ${
                          highlightDifferences && isDiff ? 'bg-blue-50/35' : ''
                        } ${dimmed ? 'opacity-45' : ''}`}
                      >
                        <td className="px-5 py-3.5 align-top">
                          <div className="text-[11px] font-medium text-slate-500">
                            {row.category}
                          </div>
                          <div className="mt-0.5 text-sm font-medium text-slate-950">
                            {row.feature}
                            {row.footnoteRef && (
                              <sup className="ml-0.5 font-mono text-[10px] text-blue-700">
                                {row.footnoteRef}
                              </sup>
                            )}
                          </div>
                        </td>
                        {activeEditionIds.map((id) => (
                          <td key={id} className="px-4 py-3.5 align-middle">
                            {renderCell(row[id])}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Official Footnotes */}
          <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
            <div className="text-xs font-semibold text-slate-800">Table Footnotes</div>
            <ol className="mt-2 grid grid-cols-1 gap-1.5 text-[11px] leading-relaxed text-slate-600 md:grid-cols-2">
              {COMPARISON_FOOTNOTES.map((fn) => (
                <li key={fn.id}>
                  <span className="font-mono font-semibold text-slate-800">{fn.id}.</span>{' '}
                  {fn.text}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Interactive "Find the Right Edition" Recommendation Tool */}
        <div className="mt-12 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                <Compass className="h-4 w-4" />
                <span>Interactive Discovery Tool</span>
              </div>
              <h3 className="mt-2 font-display text-2xl font-bold text-slate-950">
                Find the Right Edition
              </h3>
              <p className="mt-1.5 text-sm text-slate-600">
                Match your organization’s seat model, connector scope, indexing footprint, and developer requirements against the 5-edition matrix.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Q1 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800">
                    1. Licensing & Cohort Model
                  </label>
                  <div className="mt-2 space-y-1.5">
                    {[
                      { value: 'seat_smb', label: 'Team / SMB seat plan (1–500 users)' },
                      { value: 'seat_enterprise', label: 'Enterprise seat plan (1+ users)' },
                      { value: 'payg', label: 'Pay-as-you-go (1 min seat)' },
                      { value: 'frontline_addon', label: 'Frontline workforce (with 150+ Std/Plus)' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setAnswers((a) => ({
                            ...a,
                            deploymentModel: opt.value as RecommendationAnswers['deploymentModel'],
                          }))
                        }
                        className={`w-full rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                          answers.deploymentModel === opt.value
                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q2 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800">
                    2. Connectors, Full-Code Agents & Security
                  </label>
                  <div className="mt-2 space-y-1.5">
                    {[
                      {
                        value: 'basic',
                        label: 'Segment-relevant connectors & basic admin',
                      },
                      {
                        value: 'full_enterprise',
                        label: 'Full connector ecosystem, Data Insights & enterprise security',
                      },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setAnswers((a) => ({
                            ...a,
                            connectorAndSecurity:
                              opt.value as RecommendationAnswers['connectorAndSecurity'],
                          }))
                        }
                        className={`w-full rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                          answers.connectorAndSecurity === opt.value
                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q3 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800">
                    3. Data Indexing & Antigravity Pool Need
                  </label>
                  <div className="mt-2 space-y-1.5">
                    {[
                      {
                        value: 'standard_30gb',
                        label: '30 GiB/user pooled · $10/mo Antigravity pool',
                      },
                      {
                        value: 'plus_75gb',
                        label: '75 GiB/user pooled · $15/mo Antigravity pool',
                      },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setAnswers((a) => ({
                            ...a,
                            storageAndAntigravity:
                              opt.value as RecommendationAnswers['storageAndAntigravity'],
                          }))
                        }
                        className={`w-full rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                          answers.storageAndAntigravity === opt.value
                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q4 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800">
                    4. AI Developer Tools & Priority Models
                  </label>
                  <div className="mt-2 space-y-1.5">
                    {[
                      { value: 'no', label: 'Not required for this cohort' },
                      {
                        value: 'yes',
                        label: 'Required (Priority Gemini models + AI developer tools)',
                      },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setAnswers((a) => ({
                            ...a,
                            needDeveloperTools:
                              opt.value as RecommendationAnswers['needDeveloperTools'],
                          }))
                        }
                        className={`w-full rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                          answers.needDeveloperTools === opt.value
                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation Output */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-6 lg:col-span-5">
              <div>
                <div className="text-xs font-medium text-slate-500">
                  Recommended Edition
                </div>
                <h4 className="mt-1 font-display text-2xl font-bold text-slate-950">
                  {COMPARISON_EDITIONS[recommendation.recommendedEdition].name}
                </h4>
                <p className="mt-2 text-sm text-slate-600">
                  {COMPARISON_EDITIONS[recommendation.recommendedEdition].summary}
                </p>

                <div className="mt-5 border-t border-slate-200 pt-4">
                  <div className="text-xs font-semibold text-slate-800">
                    Verified Entitlement Match:
                  </div>
                  <ul className="mt-2.5 space-y-2">
                    {recommendation.rationale.map((reason) => (
                      <li
                        key={reason}
                        className="flex items-start gap-2 text-xs leading-relaxed text-slate-700"
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-700" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3.5 text-xs leading-relaxed text-slate-700">
                  <span className="font-semibold text-slate-900">Antigravity Impact: </span>
                  {recommendation.antigravityNote}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onApplyRecommendedEdition(recommendation.calculatorEdition);
                    onNavigate('pricing');
                  }}
                  className="rounded-lg bg-[#1A73E8] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1557B0] whitespace-nowrap shrink-0"
                >
                  Model in Investment Calculator
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  Confirm with Cloud 11
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
