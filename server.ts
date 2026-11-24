import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const CONSULTATION_RECIPIENT =
  process.env.CONSULTATION_RECIPIENT_EMAIL || 'sales@cloud-11.com';
const CONSULTATION_WEBHOOK_URL = process.env.CONSULTATION_WEBHOOK_URL || '';

interface ConsultationPayload {
  fullName?: string;
  businessEmail?: string;
  company?: string;
  country?: string;
  industry?: string;
  employees?: string;
  expectedUsers?: string;
  preferredEdition?: string;
  objectives?: string;
  requirements?: string;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'cloud11-gemini-enterprise-portal',
      webhookConfigured: Boolean(CONSULTATION_WEBHOOK_URL),
    });
  });

  app.post('/api/consultation', async (req: Request, res: Response) => {
    const body = (req.body || {}) as ConsultationPayload;
    const fullName = String(body.fullName || '').trim();
    const businessEmail = String(body.businessEmail || '').trim();
    const company = String(body.company || '').trim();

    if (!fullName || !company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)) {
      res.status(400).json({
        error: 'Valid fullName, businessEmail, and company are required.',
      });
      return;
    }

    const structuredRecord = {
      submittedAt: new Date().toISOString(),
      fullName,
      businessEmail,
      company,
      country: String(body.country || ''),
      industry: String(body.industry || ''),
      employees: String(body.employees || ''),
      expectedUsers: String(body.expectedUsers || ''),
      preferredEdition: String(body.preferredEdition || ''),
      objectives: String(body.objectives || ''),
      requirements: String(body.requirements || ''),
    };

    const briefText = [
      'CLOUD 11 | GEMINI ENTERPRISE CONSULTATION BRIEF',
      `Submitted: ${structuredRecord.submittedAt}`,
      `Name: ${structuredRecord.fullName}`,
      `Business Email: ${structuredRecord.businessEmail}`,
      `Company: ${structuredRecord.company}`,
      `Country: ${structuredRecord.country}`,
      `Industry: ${structuredRecord.industry}`,
      `Employees: ${structuredRecord.employees}`,
      `Expected Users: ${structuredRecord.expectedUsers}`,
      `Preferred Edition: ${structuredRecord.preferredEdition}`,
      `Objectives: ${structuredRecord.objectives || 'N/A'}`,
      `Additional Requirements: ${structuredRecord.requirements || 'N/A'}`,
    ].join('\n');

    if (CONSULTATION_WEBHOOK_URL) {
      try {
        const webhookRes = await fetch(CONSULTATION_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(structuredRecord),
        });
        if (!webhookRes.ok) {
          throw new Error(`Webhook responded with ${webhookRes.status}`);
        }
        res.json({
          delivered: true,
          mode: 'webhook',
          message:
            'Your consultation discovery brief has been dispatched to Cloud 11.',
        });
        return;
      } catch (err) {
        console.error('Consultation webhook delivery error:', err);
        res.status(502).json({
          error:
            'Configured consultation webhook failed to accept the submission. Please retry or email Cloud 11 directly.',
        });
        return;
      }
    }

    const mailSubject = encodeURIComponent(
      `Gemini Enterprise Consultation Request — ${company}`
    );
    const mailBody = encodeURIComponent(briefText);
    const mailtoUrl = `mailto:${CONSULTATION_RECIPIENT}?subject=${mailSubject}&body=${mailBody}`;

    res.json({
      delivered: false,
      mode: 'unconfigured',
      message: `No automated email or CRM webhook transport is configured on this server yet (set CONSULTATION_WEBHOOK_URL to enable automatic dispatch). No message was sent automatically—use the pre-filled email draft to ${CONSULTATION_RECIPIENT} or download your brief below.`,
      mailtoUrl,
      briefText,
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexHtml = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build output not found. Run npm run build.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cloud 11 Gemini Enterprise Portal listening on port ${PORT}`);
  });
}

startServer();
