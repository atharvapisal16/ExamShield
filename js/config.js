// ===== EXAMSHIELD — API KEY AUTO-CONFIG =====
// Initializes empty API key slots in localStorage; users add their own keys via Settings.
(function () {
    const existing = localStorage.getItem('er_apikeys');
    if (!existing || existing === '{}' || existing === 'null') {
        localStorage.setItem('er_apikeys', JSON.stringify({
            gemini: '',
            openai: ''
        }));
    }
})();
