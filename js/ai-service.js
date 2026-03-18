// ===== EXAMSHIELD — MULTI-AI SERVICE LAYER =====
// Queries OpenAI GPT-4o and Google Gemini in parallel
// Scores both responses and highlights the best one

const AI = {
    // ——— OPENAI ———
    async queryOpenAI(prompt, systemPrompt = '', apiKey = '') {
        if (!apiKey) throw new Error('No OpenAI API key set. Add it in ⚙️ Settings.');
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt || 'You are a helpful AI tutor for students. Be concise, clear, and use simple language. Use bullet points where appropriate.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 1024,
                temperature: 0.7
            })
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.error?.message || `OpenAI error: ${res.status}`);
        }
        const data = await res.json();
        return data.choices?.[0]?.message?.content || '';
    },

    // ——— GEMINI ———
    async queryGemini(prompt, systemPrompt = '', apiKey = '') {
        if (!apiKey) throw new Error('No Gemini API key set. Add it in ⚙️ Settings.');
        const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: fullPrompt }] }],
                    generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
                })
            }
        );
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.error?.message || `Gemini error: ${res.status}`);
        }
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    },

    // ——— SCORE A RESPONSE (heuristic) ———
    scoreResponse(text) {
        if (!text || text.length < 10) return 0;
        let score = 0;
        score += Math.min(text.length / 50, 40);                    // length (up to 40)
        score += (text.match(/\n/g)?.length || 0) * 1.5;           // structure
        score += (text.match(/[•\-\*]/g)?.length || 0) * 2;        // bullet points
        score += (text.match(/\*\*/g)?.length || 0) * 1;           // bold
        score += text.includes('formula') || text.includes('=') ? 5 : 0; // formulas
        score -= (text.match(/error|sorry|cannot|I am unable/gi)?.length || 0) * 10;
        return Math.round(Math.min(score, 100));
    },

    // ——— QUERY BOTH & COMPARE ———
    async queryBoth(prompt, systemPrompt = '', onResult) {
        const keys = LS.get('er_apikeys', {});
        const results = { openai: null, gemini: null };
        const errors = { openai: null, gemini: null };

        // Build enriched system prompt with profile + file context
        const enrichedSystem = this._buildSystemPrompt(systemPrompt);
        const promises = [];

        if (keys.openai) {
            promises.push(
                this.queryOpenAI(prompt, enrichedSystem, keys.openai)
                    .then(r => { results.openai = r; if (onResult) onResult('openai', r, null); })
                    .catch(e => { errors.openai = e.message; if (onResult) onResult('openai', null, e.message); })
            );
        } else {
            errors.openai = 'No OpenAI key. Add in ⚙️ Settings.';
            if (onResult) onResult('openai', null, errors.openai);
        }

        if (keys.gemini) {
            promises.push(
                this.queryGemini(prompt, enrichedSystem, keys.gemini)
                    .then(r => { results.gemini = r; if (onResult) onResult('gemini', r, null); })
                    .catch(e => { errors.gemini = e.message; if (onResult) onResult('gemini', null, e.message); })
            );
        } else {
            errors.gemini = 'No Gemini key. Add in ⚙️ Settings.';
            if (onResult) onResult('gemini', null, errors.gemini);
        }

        await Promise.allSettled(promises);

        // Determine best
        const scores = {
            openai: results.openai ? this.scoreResponse(results.openai) : 0,
            gemini: results.gemini ? this.scoreResponse(results.gemini) : 0
        };
        const best = scores.openai >= scores.gemini ? 'openai' : 'gemini';
        const bestText = results[best] || results.openai || results.gemini || 'No response from any AI. Please add API keys in ⚙️ Settings.';

        return { results, errors, scores, best, bestText };
    },

    // ——— SINGLE BEST QUERY (tries Gemini first, falls back to OpenAI) ———
    async queryBest(prompt, systemPrompt = '') {
        const keys = LS.get('er_apikeys', {});
        const enrichedSystem = this._buildSystemPrompt(systemPrompt);
        if (keys.gemini) {
            try { return await this.queryGemini(prompt, enrichedSystem, keys.gemini); } catch { }
        }
        if (keys.openai) {
            return await this.queryOpenAI(prompt, enrichedSystem, keys.openai);
        }
        return 'Please add your API keys in ⚙️ Settings to use AI features.';
    },

    // ——— BUILD ENRICHED SYSTEM PROMPT ———
    _buildSystemPrompt(base = '') {
        let parts = [];

        // Profile context
        const profile = (typeof getProfile === 'function') ? getProfile() : null;
        if (profile) {
            parts.push(`You are an AI tutor helping a ${profile.courseLabel} student. Tailor explanations to ${profile.courseLabel} level. Use relevant examples from their field.`);
        } else {
            parts.push('You are a helpful AI tutor for students. Be concise, clear and use bullet points where appropriate.');
        }

        // Custom system prompt
        if (base) parts.push(base);

        // File context
        const fileCtx = (typeof FileHandler !== 'undefined') ? FileHandler.getActiveContext() : '';
        if (fileCtx) {
            parts.push(`\n[STUDENT'S UPLOADED PERSONAL NOTES/SYLLABUS — use this as priority reference if relevant]\n${fileCtx}\n[END OF STUDENT NOTES]`);
        }

        return parts.join('\n\n');
    },

    // ——— RENDER COMPARISON UI ———
    renderCompareUI(containerId, { results, errors, scores, best }) {
        const el = document.getElementById(containerId);
        if (!el) return;
        el.innerHTML = `
      <div class="ai-compare-grid">
        ${this._aiCard('openai', '🤖 GPT-4o Mini', results.openai, errors.openai, scores.openai, best === 'openai')}
        ${this._aiCard('gemini', '✨ Gemini Flash', results.gemini, errors.gemini, scores.gemini, best === 'gemini')}
      </div>
      <div style="margin-top:16px;padding:16px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:var(--radius-md)">
        <div style="font-size:12px;font-weight:600;color:#34d399;margin-bottom:8px">🏆 BEST ANSWER (${best === 'openai' ? 'GPT-4o Mini' : 'Gemini Flash'})</div>
        <div style="font-size:14px;line-height:1.8;color:var(--text-secondary);white-space:pre-wrap">${(results[best] || 'No response available.').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')}</div>
      </div>
    `;
    },

    _aiCard(id, name, result, error, score, isBest) {
        let content;
        if (result) {
            content = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
        } else if (error) {
            content = `<span style="color:#f87171">⚠️ ${error}</span>`;
        } else {
            content = `<div class="ai-loading"><div class="spinner"></div> Loading...</div>`;
        }
        return `
      <div class="ai-card${isBest && result ? ' best' : ''}">
        <div class="ai-card-header">
          <span class="ai-name">${name}</span>
          ${result ? `<span class="ai-score" style="background:${isBest ? 'var(--gradient-green)' : 'var(--gradient-primary)'}">${score}pts${isBest ? ' ⭐' : ''}</span>` : ''}
        </div>
        <div class="ai-response">${content}</div>
      </div>
    `;
    }
};
