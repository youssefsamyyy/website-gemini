import React, { useState } from 'react';
import { CheckCircle2, Download, Mail, Send, AlertCircle } from 'lucide-react';
import { EditionId, PRICING_CONFIG } from '../config/pricingConfig';

interface ContactSectionProps {
  defaultUsers: number;
  defaultEdition: EditionId;
}

interface SubmissionResult {
  status: 'delivered' | 'unconfigured' | 'error';
  message: string;
  mailtoUrl?: string;
  briefText?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  defaultUsers,
  defaultEdition,
}) => {
  const [fullName, setFullName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('Saudi Arabia');
  const [industry, setIndustry] = useState('Financial Services & Banking');
  const [employees, setEmployees] = useState('500 - 2,500');
  const [expectedUsers, setExpectedUsers] = useState(String(defaultUsers || 50));
  const [preferredEdition, setPreferredEdition] = useState<string>(
    PRICING_CONFIG.editions[defaultEdition].name
  );
  const [objectives, setObjectives] = useState('');
  const [requirements, setRequirements] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fullName.trim() || !company.trim() || !emailRegex.test(businessEmail.trim())) {
      setResult({
        status: 'error',
        message: 'Please provide your full name, company name, and a valid business email address.',
      });
      return;
    }

    setSubmitting(true);
    const payload = {
      fullName: fullName.trim(),
      businessEmail: businessEmail.trim(),
      company: company.trim(),
      country,
      industry,
      employees,
      expectedUsers,
      preferredEdition,
      objectives: objectives.trim(),
      requirements: requirements.trim(),
    };

    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setResult({
          status: 'error',
          message: data.error || 'Unable to process consultation request.',
        });
      } else if (data.delivered) {
        setResult({
          status: 'delivered',
          message:
            data.message ||
            'Your consultation request has been dispatched to the Cloud 11 Gemini Enterprise advisory team.',
        });
      } else {
        setResult({
          status: 'unconfigured',
          message:
            data.message ||
            'Direct mail transport is not configured in this runtime environment. No automated email was sent—please open the pre-filled email draft or download your discovery brief below.',
          mailtoUrl: data.mailtoUrl,
          briefText: data.briefText,
        });
      }
    } catch {
      const subject = encodeURIComponent(
        `Gemini Enterprise Consultation Request — ${payload.company}`
      );
      const body = encodeURIComponent(
        `Name: ${payload.fullName}\nEmail: ${payload.businessEmail}\nCompany: ${payload.company}\nCountry: ${payload.country}\nIndustry: ${payload.industry}\nEmployees: ${payload.employees}\nExpected Users: ${payload.expectedUsers}\nPreferred Edition: ${payload.preferredEdition}\nObjectives: ${payload.objectives}\nRequirements: ${payload.requirements}`
      );
      setResult({
        status: 'unconfigured',
        message:
          'Backend email transport is not configured. Use the pre-filled email button or download your discovery brief to send directly to Cloud 11.',
        mailtoUrl: `mailto:sales@cloud-11.com?subject=${subject}&body=${body}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const downloadBrief = (text: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloud11-discovery-${(company || 'enterprise').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="contact" className="bg-slate-50/70 py-16 lg:py-20">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Context */}
          <div className="lg:col-span-5">
            <p className="text-xs font-medium text-blue-700">
              Presales Consultation · Cloud 11
            </p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Let’s Build Your Enterprise AI Strategy.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Share your licensing scope, target integrations, and security priorities. Cloud 11 Solutions Architects will prepare an official commercial quotation and deployment architecture tailored to your organization.
            </p>

            <div className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
              <div>
                <div className="text-xs font-medium text-slate-500">Partner Designation</div>
                <div className="mt-0.5 font-display text-sm font-bold text-slate-950">
                  Cloud 11 · Google Cloud Premier Partner
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <div className="text-xs font-medium text-slate-500">Regional Coverage</div>
                <div className="mt-0.5 text-sm font-medium text-slate-800">
                  Egypt · Saudi Arabia · United Arab Emirates · Qatar
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <div className="text-xs font-medium text-slate-500">What You Receive</div>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                  <li>• Confirmed commercial quotation across Business, Standard, and Plus</li>
                  <li>• Antigravity project quota & overage governance blueprint</li>
                  <li>• IAM, CMEK, VPC-SC & connector readiness assessment</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Discovery Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Karim Mansour"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    Business Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-company"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    Company *
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Organization name"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-country"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    Country
                  </label>
                  <select
                    id="contact-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option>Saudi Arabia</option>
                    <option>United Arab Emirates</option>
                    <option>Egypt</option>
                    <option>Qatar</option>
                    <option>Kuwait</option>
                    <option>Bahrain</option>
                    <option>Oman</option>
                    <option>Other / Global</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-industry"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    Industry
                  </label>
                  <select
                    id="contact-industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option>Financial Services & Banking</option>
                    <option>Telecommunications</option>
                    <option>Energy & Utilities</option>
                    <option>Government & Public Sector</option>
                    <option>Retail & E-Commerce</option>
                    <option>Healthcare & Life Sciences</option>
                    <option>Technology & Software</option>
                    <option>Manufacturing & Logistics</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-employees"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    Number of Employees
                  </label>
                  <select
                    id="contact-employees"
                    value={employees}
                    onChange={(e) => setEmployees(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option>1 - 250</option>
                    <option>250 - 500</option>
                    <option>500 - 2,500</option>
                    <option>2,500 - 10,000</option>
                    <option>10,000+</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-users"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    Expected Gemini Enterprise Users
                  </label>
                  <input
                    id="contact-users"
                    type="number"
                    min={1}
                    value={expectedUsers}
                    onChange={(e) => setExpectedUsers(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 tabular-nums focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-edition"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    Preferred Edition
                  </label>
                  <select
                    id="contact-edition"
                    value={preferredEdition}
                    onChange={(e) => setPreferredEdition(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option>Gemini Enterprise Business</option>
                    <option>Gemini Enterprise Standard</option>
                    <option>Gemini Enterprise Plus</option>
                    <option>Gemini Enterprise Pay-as-you-go</option>
                    <option>Gemini Enterprise Frontline</option>
                    <option>Mixed Editions (Standard + Plus / Frontline)</option>
                    <option>Undecided — Need Cloud 11 Assessment</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="contact-objectives"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    Main Business Objectives
                  </label>
                  <textarea
                    id="contact-objectives"
                    rows={3}
                    value={objectives}
                    onChange={(e) => setObjectives(e.target.value)}
                    placeholder="e.g., Enterprise search across SharePoint & Workspace, HR/IT workflow agents, Antigravity enablement for 40 engineers..."
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="contact-requirements"
                    className="block text-xs font-semibold text-slate-800"
                  >
                    Additional Security, Identity, or Integration Requirements
                  </label>
                  <textarea
                    id="contact-requirements"
                    rows={2}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="e.g., Data residency region, CMEK, Entra ID / Okta SSO, ServiceNow integration..."
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              {result && (
                <div
                  className={`mt-5 rounded-lg border p-4 text-xs leading-relaxed ${
                    result.status === 'delivered'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : result.status === 'error'
                      ? 'border-red-200 bg-red-50 text-red-900'
                      : 'border-amber-200 bg-amber-50 text-amber-950'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {result.status === 'delivered' ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                    ) : (
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{result.message}</p>
                      {result.status === 'unconfigured' && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {result.mailtoUrl && (
                            <a
                              href={result.mailtoUrl}
                              className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                            >
                              <Mail className="h-3.5 w-3.5" />
                              <span>Open Pre-Filled Email to Cloud 11</span>
                            </a>
                          )}
                          {result.briefText && (
                            <button
                              type="button"
                              onClick={() => downloadBrief(result.briefText!)}
                              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>Download Discovery Brief</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
                <span className="text-xs text-slate-500">
                  Required fields marked with *. No data is stored in browser localStorage.
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1A73E8] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1557B0] disabled:opacity-60 whitespace-nowrap shrink-0"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitting ? 'Submitting...' : 'Let’s Build Your Enterprise AI Strategy'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
