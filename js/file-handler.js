// ===== EXAMSHIELD — FILE UPLOAD HANDLER =====
// Client-side PDF/TXT/DOCX text extraction + localStorage storage
// Extracted text is injected into AI prompts as context

const UPLOADS_KEY = 'er_uploads';
const MAX_FILE_TEXT = 12000; // chars per file
const MAX_AI_CONTEXT = 8000; // total chars sent to AI

const FileHandler = {
    // ——— GET ALL UPLOADS ———
    getAll() { return LS.get(UPLOADS_KEY, []); },

    // ——— SAVE AN UPLOAD ———
    save(name, text, type) {
        const uploads = this.getAll();
        const trimmed = text.slice(0, MAX_FILE_TEXT);
        const entry = {
            id: Date.now(),
            name,
            type,
            text: trimmed,
            chars: trimmed.length,
            active: true,
            date: new Date().toLocaleDateString('en-IN')
        };
        uploads.unshift(entry);
        LS.set(UPLOADS_KEY, uploads);
        return entry;
    },

    // ——— DELETE AN UPLOAD ———
    delete(id) {
        const uploads = this.getAll().filter(u => u.id !== id);
        LS.set(UPLOADS_KEY, uploads);
    },

    // ——— TOGGLE ACTIVE ———
    toggleActive(id) {
        const uploads = this.getAll().map(u => u.id === id ? { ...u, active: !u.active } : u);
        LS.set(UPLOADS_KEY, uploads);
    },

    // ——— GET ACTIVE CONTEXT STRING ———
    getActiveContext() {
        const active = this.getAll().filter(u => u.active);
        if (!active.length) return '';
        let combined = active.map(u => `[FILE: ${u.name}]\n${u.text}`).join('\n\n---\n\n');
        if (combined.length > MAX_AI_CONTEXT) combined = combined.slice(0, MAX_AI_CONTEXT) + '\n...[truncated]';
        return combined;
    },

    // ——— COUNT ACTIVE FILES ———
    activeCount() { return this.getAll().filter(u => u.active).length; },

    // ——— READ FILE → TEXT ———
    async extractText(file) {
        const name = file.name.toLowerCase();
        if (name.endsWith('.txt') || name.endsWith('.md')) {
            return await this._readAsText(file);
        } else if (name.endsWith('.pdf')) {
            return await this._extractPDF(file);
        } else if (name.endsWith('.docx')) {
            return await this._extractDOCX(file);
        } else {
            // Try reading as text anything else
            try { return await this._readAsText(file); } catch { return '[Could not read file format]'; }
        }
    },

    _readAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    },

    async _extractPDF(file) {
        // Use PDF.js (loaded via CDN in uploads.html and other pages)
        if (typeof pdfjsLib === 'undefined') {
            return '[PDF.js not loaded. Try uploading a .txt file instead.]';
        }
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let text = '';
            for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map(item => item.str).join(' ') + '\n';
            }
            return text.trim() || '[No text found in PDF — might be scanned image]';
        } catch (e) {
            return `[PDF extraction error: ${e.message}]`;
        }
    },

    async _extractDOCX(file) {
        // Basic DOCX extraction — read as ArrayBuffer and extract text from XML
        try {
            const arrayBuffer = await file.arrayBuffer();
            const uint8 = new Uint8Array(arrayBuffer);
            // Convert to string and look for text between XML tags (simplified)
            const text = new TextDecoder('utf-8', { fatal: false }).decode(uint8);
            // Extract w:t (Word text) elements
            const matches = text.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
            const extracted = matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');
            return extracted.trim() || '[No readable text found in DOCX]';
        } catch (e) {
            return `[DOCX extraction error: ${e.message}]`;
        }
    }
};
