/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, 
  Database, 
  Layout, 
  Terminal, 
  Copy, 
  Check, 
  Wand2, 
  Code2, 
  Cpu, 
  RefreshCw,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { enhancePrompt } from './services/geminiService';

// --- Types ---
interface AppConfig {
  title: string;
  features: string;
  sheets: string;
  uiStyle: 'Tailwind' | 'Bootstrap' | 'Vanilla CSS';
  context: string;
}

export default function App() {
  const [config, setConfig] = useState<AppConfig>({
    title: 'Employee Leave Management',
    features: 'Form submission, Leave balance check, Admin approval status',
    sheets: 'Employees (Name, ID, Dept), LeaveRequests (UserEmail, Date, Reason, Status)',
    uiStyle: 'Tailwind',
    context: 'The app should send an email notification to the manager when a request is submitted.'
  });

  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Default structured prompt logic
  const basePrompt = useMemo(() => {
    return `Create a Google Apps Script Web Application titled "${config.title}".

### Core Requirements:
- **UI Architecture**: A single-page application (SPA) served via \`index.html\`. Use ${config.uiStyle} for styling.
- **Server Logic**: \`Code.gs\` should handle \`doGet()\` to serve the HTML and functions to interact with the spreadsheet.
- **Database (Google Sheets)**:
  Use a spreadsheet with the following structure:
  ${config.sheets}

### Functional Requirements:
${config.features.split(',').map(f => `- ${f.trim()}`).join('\n')}

### Communication:
- Use \`google.script.run\` with \`withSuccessHandler\` and \`withFailureHandler\` for all client-to-server calls.
- Include a robust loading state for all async operations.

### Deployment Instructions:
- Provide exactly two files: \`Code.gs\` and \`index.html\`.
- Ensure the \`doGet\` function includes \`.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)\`.

${config.context ? `### Additional Context:\n${config.context}` : ''}

Please provide the complete, functional code for both files.`;
  }, [config]);

  useEffect(() => {
    setGeneratedPrompt(basePrompt);
  }, [basePrompt]);

  const handleEnhance = async () => {
    setIsEnhancing(true);
    const enhanced = await enhancePrompt(config);
    if (enhanced) setGeneratedPrompt(enhanced);
    setIsEnhancing(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="top-nav">
        <div className="top-left flex items-center gap-2">
          <Terminal size={14} />
          <span>Prompt GAS builder // AlexPro</span>
        </div>
        <div className="top-center hidden md:flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Cpu size={12} />
            <span>OPTIMIZED FOR DEEPSEEK-V3 & R1</span>
          </div>
          <div className="flex items-center gap-2">
            <Code2 size={12} />
            <span>GAS API v2024</span>
          </div>
        </div>
        <div className="top-right">
          SYS_READY
        </div>
      </nav>

      <main className="main sm:flex-row flex-col lg:grid lg:grid-cols-[400px_1fr] flex-1 min-h-0">
        
        {/* Left Column: Form */}
        <section className="panel-future flex flex-col h-full overflow-y-auto w-full lg:max-w-[400px]">
          <div className="panel-header">
            <RefreshCw size={10} className="panel-tag" />
            <span className="panel-label">Spesifikasi Arsitek</span>
            <div className="panel-line"></div>
          </div>
          
          <div className="flex-1 space-y-4 mt-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[var(--accent-red-soft)] uppercase tracking-widest">Judul Proyek</label>
              <input 
                type="text"
                value={config.title}
                onChange={(e) => setConfig({...config, title: e.target.value})}
                className="w-full bg-[#05060a] border border-[var(--border-soft)] p-2 focus:border-[var(--accent-red)] focus:shadow-[0_0_8px_rgba(255,0,60,0.3)] text-[#f5f5f5] outline-none transition-colors font-mono text-xs rounded"
              />
            </div>

            {/* Sheets */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[var(--accent-red-soft)] uppercase tracking-widest flex items-center gap-1">
                <Database size={10} /> Struktur Database
              </label>
              <textarea 
                rows={3}
                value={config.sheets}
                onChange={(e) => setConfig({...config, sheets: e.target.value})}
                placeholder="Sheet1 (Col1, Col2), Sheet2 (Col1...)"
                className="w-full bg-[#05060a] border border-[var(--border-soft)] p-2 focus:border-[var(--accent-red)] focus:shadow-[0_0_8px_rgba(255,0,60,0.3)] text-[#f5f5f5] outline-none transition-colors font-mono text-xs resize-none rounded"
              />
            </div>

            {/* Features */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[var(--accent-red-soft)] uppercase tracking-widest flex items-center gap-1">
                <Zap size={10} /> Daftar Kemampuan Inti
              </label>
              <textarea 
                rows={4}
                value={config.features}
                onChange={(e) => setConfig({...config, features: e.target.value})}
                className="w-full bg-[#05060a] border border-[var(--border-soft)] p-2 focus:border-[var(--accent-red)] focus:shadow-[0_0_8px_rgba(255,0,60,0.3)] text-[#f5f5f5] outline-none transition-colors font-mono text-xs resize-none rounded"
              />
            </div>

            {/* UI Style */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[var(--accent-red-soft)] uppercase tracking-widest flex items-center gap-1">
                <Layout size={10} /> Framework UI
              </label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {(['Tailwind', 'Bootstrap', 'Vanilla CSS'] as const).map(style => (
                  <button
                    key={style}
                    onClick={() => setConfig({...config, uiStyle: style})}
                    className={`text-[9px] font-mono py-2 rounded border transition-all ${config.uiStyle === style ? 'border-[var(--accent-red)] bg-[#1a050c] text-[var(--accent-red-soft)] shadow-[0_0_8px_rgba(255,0,60,0.3)]' : 'border-[var(--border-soft)] text-[var(--text-muted)] hover:border-[rgba(255,0,60,0.5)]'}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Context */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-[var(--accent-red-soft)] uppercase tracking-widest">Detail Implementasi Sekunder</label>
              <textarea 
                rows={3}
                value={config.context}
                onChange={(e) => setConfig({...config, context: e.target.value})}
                className="w-full bg-[#05060a] border border-[var(--border-soft)] p-2 focus:border-[var(--accent-red)] focus:shadow-[0_0_8px_rgba(255,0,60,0.3)] text-[#f5f5f5] outline-none transition-colors font-mono text-xs resize-none rounded"
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border-soft)] flex flex-col gap-3">
            <button
               onClick={handleEnhance}
               disabled={isEnhancing}
               className="w-full bg-[#1a050c] border border-[var(--accent-red)] text-[var(--accent-red-soft)] py-3 font-mono font-bold flex items-center justify-center gap-2 hover:bg-[#ff003c] hover:text-white transition-all active:scale-[0.98] disabled:opacity-50 rounded shadow-[0_0_12px_rgba(255,0,60,0.2)] hover:shadow-[0_0_20px_rgba(255,0,60,0.5)]"
            >
              {isEnhancing ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  <span className="text-[10px] tracking-widest">MENGOPTIMALKAN...</span>
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  <span className="text-[10px] tracking-widest">Buat PROMPT</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Column: Preview */}
        <section className="flex flex-col h-full gap-4 min-h-0 w-full overflow-hidden">
          
          <div className="stats-bar w-full">
             <div className="stat">
               <div className="stat-number">{generatedPrompt.length}</div>
               <div className="stat-label">KARAKTER</div>
             </div>
             <div className="stat hidden md:block">
               <div className="stat-number">{config.sheets.split(',').length}</div>
               <div className="stat-label">TABEL</div>
             </div>
             <div className="stat hidden md:block">
               <div className="stat-number">{config.features.split(',').length}</div>
               <div className="stat-label">FITUR</div>
             </div>
             <div className="stat col-span-3 flex items-center justify-center bg-[#090b12] border-none cursor-pointer hover:bg-[#1a050c] transition-colors" onClick={copyToClipboard}>
               {copied ? (
                 <div className="flex items-center gap-2 text-[#00ffb2] font-mono text-[10px] tracking-widest">
                   <Check size={14} /> TERSALIN KE PAPAN KLIP
                 </div>
               ) : (
                 <div className="flex items-center gap-2 text-[var(--accent-red-soft)] font-mono text-[10px] tracking-widest">
                   <Copy size={14} /> SALIN PROMPT SECARA MANUAL
                 </div>
               )}
             </div>
          </div>
          
          {/* Main Terminal Output */}
          <div className="panel-future flex-1 flex flex-col min-h-0 p-0 overflow-hidden group border-[var(--border-soft)]">
            <div className="panel-header px-4 pt-3 mb-0">
              <Code2 size={10} className="panel-tag" />
              <span className="panel-label">DEEPSEEK_V3_OPTIMIZED_VERSION.txt</span>
              <div className="panel-line"></div>
              <div className="flex gap-2 opacity-50">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)] animate-pulse" />
              </div>
            </div>
            
            <textarea
              readOnly
              value={generatedPrompt}
              className="flex-1 w-full p-4 font-mono text-xs text-[#b3b6c2] bg-transparent outline-none resize-none leading-relaxed overflow-y-auto custom-scrollbar"
            />
          </div>

          {/* Action List Below */}
          <div className="panel-grid">
            <div className="panel">
              <div className="panel-title">Penerapan // Langkah 01</div>
              <div className="panel-item">
                <div className="item-left">
                  <div className="item-pill">Inisialisasi Spreadsheet</div>
                  <div className="item-sub">Buat tab: {config.sheets.split('(')[0] || 'App'}</div>
                </div>
                <div className="item-right item-meta">GAS</div>
              </div>
            </div>
            
            <div className="panel">
              <div className="panel-title">Penerapan // Langkah 02</div>
              <div className="panel-item">
                <div className="item-left">
                  <div className="item-pill">Editor Skrip</div>
                  <div className="item-sub">Ekstensi &gt; Apps Script. Tempel Code.gs & index.html</div>
                </div>
                <div className="item-right item-status">READY</div>
              </div>
            </div>

            <div className="panel col-span-2">
              <div className="panel-title">Penerapan // Langkah 03</div>
              <div className="panel-item">
                <div className="item-left">
                  <div className="item-pill">Publikasi Aplikasi Web</div>
                  <div className="item-sub">Deploy &gt; Deployment Baru &gt; Web App. Pilih "Anyone".</div>
                </div>
                <div className="item-right item-meta text-[#00ffb2]">AKTIFKAN</div>
              </div>
            </div>
          </div>
          
          <div className="footer">
            <Info size={10} className="text-[var(--accent-red)]" />
            <span>SYSTEM_AUTH_ESTABLISHED // ARIESSDACYB // TOKEN_EST: {Math.round(generatedPrompt.length / 4)}</span>
          </div>

        </section>
      </main>
    </div>
  );
}
