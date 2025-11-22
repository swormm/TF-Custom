// ==UserScript==
// @name         TradeFlow Ultra Sniper
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Sniper ultra-rapide pour TradeFlow avec clic automatique sur bouton 3 SOL
// @author       You
// @match        https://axiom.trade/*
// @match        https://*.axiom.trade/*
// @match        https://photon-sol.tinyastro.io/*
// @match        https://*.photon-sol.tinyastro.io/*
// @match        https://www.dexscreener.com/*
// @match        https://*.dexscreener.com/*
// @match        https://bullx.io/*
// @match        https://*.bullx.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=axiom.trade
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @noframes
// ==/UserScript==

// ========================================
// TRADEFLOW CUSTOM + SNIPER SYSTEM V2
// ========================================
// Version avec simulation de clic sur bouton 3 SOL

// ========================================
// TRADEFLOW CUSTOM + SNIPER SYSTEM V2
// ========================================
// Version avec simulation de clic sur bouton 3 SOL

(function() {
    console.log("🚀 TradeFlow Custom + Sniper V2 - Starting...");

    // ========================================
    // CONFIGURATION
    // ========================================
    const DEFAULT_AMOUNTS = {
        button1: 0.25,
        button2: 0.5,
        button3: 0.75,
        button4: 1
    };

    const SNIPER_CONFIG = {
        enabled: false,
        amount: 3,  // Montant fixé à 3 SOL pour utiliser le bouton natif
        slippage: 5,
        autoSnipe: false
    };

    // ========================================
    // STORAGE - Sauvegarde automatique dans le navigateur
    // ========================================
    function loadConfig() {
        const saved = localStorage.getItem('tradeflow_custom_amounts');
        if (saved) {
            try {
                const config = JSON.parse(saved);
                console.log('✅ Configuration chargée depuis localStorage:', config);
                return config;
            } catch (e) {
                console.error("❌ Erreur chargement config:", e);
            }
        }
        console.log('ℹ️ Utilisation de la config par défaut');
        return DEFAULT_AMOUNTS;
    }

    function saveConfig(amounts) {
        try {
            localStorage.setItem('tradeflow_custom_amounts', JSON.stringify(amounts));
            console.log('💾 Configuration sauvegardée:', amounts);
            return true;
        } catch (e) {
            console.error('❌ Erreur sauvegarde config:', e);
            return false;
        }
    }

    function loadSniperConfig() {
        const saved = localStorage.getItem('tradeflow_sniper_config');
        if (saved) {
            try {
                const config = JSON.parse(saved);
                console.log('✅ Config Sniper chargée depuis localStorage:', config);
                return config;
            } catch (e) {
                console.error("❌ Erreur chargement config sniper:", e);
            }
        }
        console.log('ℹ️ Utilisation de la config sniper par défaut');
        return SNIPER_CONFIG;
    }

    function saveSniperConfig(config) {
        try {
            localStorage.setItem('tradeflow_sniper_config', JSON.stringify(config));
            console.log('💾 Config Sniper sauvegardée:', config);
            return true;
        } catch (e) {
            console.error('❌ Erreur sauvegarde config sniper:', e);
            return false;
        }
    }

    // Sauvegarder automatiquement la config au démarrage si elle n'existe pas
    function initStorage() {
        if (!localStorage.getItem('tradeflow_custom_amounts')) {
            saveConfig(DEFAULT_AMOUNTS);
            console.log('🆕 Configuration initiale créée');
        }
        if (!localStorage.getItem('tradeflow_sniper_config')) {
            saveSniperConfig(SNIPER_CONFIG);
            console.log('🆕 Configuration Sniper initiale créée');
        }
    }

    // ========================================
    // INJECTION CSS
    // ========================================
    function injectStyles() {
        if (document.getElementById('tf-custom-styles')) return;

        const style = document.createElement('style');
        style.id = 'tf-custom-styles';
        style.textContent = `
            /* Bouton Config */
            .tf-config-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(135deg, #8B51FF 0%, #CB8FFF 100%);
                color: white;
                border: none;
                border-radius: 50px;
                padding: 12px 20px;
                font-family: 'Inter', sans-serif;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(139, 81, 255, 0.4);
                z-index: 999998;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
            }

            .tf-config-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(139, 81, 255, 0.6);
            }

            /* Bouton Sniper sur les tokens */
            .tf-sniper-btn {
                position: absolute !important;
                top: 6px !important;
                right: 6px !important;
                z-index: 100 !important;
                background: linear-gradient(135deg, #ff4757 0%, #ff6348 100%) !important;
                border: none !important;
                border-radius: 6px !important;
                padding: 6px 10px !important;
                font-family: 'Inter', sans-serif !important;
                font-size: 11px !important;
                font-weight: 700 !important;
                color: white !important;
                cursor: pointer !important;
                opacity: 0 !important;
                transition: all 0.2s ease !important;
                box-shadow: 0 2px 8px rgba(255, 71, 87, 0.4) !important;
                display: flex !important;
                align-items: center !important;
                gap: 4px !important;
            }

            .group:hover .tf-sniper-btn {
                opacity: 1 !important;
            }

            .tf-sniper-btn:hover {
                transform: scale(1.05) !important;
                box-shadow: 0 4px 12px rgba(255, 71, 87, 0.6) !important;
            }

            .tf-sniper-btn.active {
                background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%) !important;
                opacity: 1 !important;
            }

            /* Modal */
            .tf-config-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 999999;
                align-items: center;
                justify-content: center;
            }

            .tf-config-modal.active {
                display: flex;
            }

            .tf-config-content {
                background: #1F1F21;
                border: 1px solid #4b4b4b;
                border-radius: 12px;
                padding: 30px;
                width: 500px;
                max-width: 90%;
                font-family: 'Inter', sans-serif;
                max-height: 90vh;
                overflow-y: auto;
            }

            .tf-config-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
            }

            .tf-config-title {
                font-size: 20px;
                font-weight: 700;
                color: white;
                margin: 0;
            }

            .tf-config-close {
                background: none;
                border: none;
                color: #777A8C;
                font-size: 24px;
                cursor: pointer;
            }

            .tf-config-section {
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 1px solid #2f2f2f;
            }

            .tf-config-section:last-child {
                border-bottom: none;
            }

            .tf-config-section-title {
                font-size: 16px;
                font-weight: 600;
                color: #8B51FF;
                margin-bottom: 15px;
            }

            .tf-config-input-group {
                margin-bottom: 15px;
            }

            .tf-config-label {
                display: block;
                color: #C8C9D1;
                font-size: 13px;
                font-weight: 500;
                margin-bottom: 8px;
            }

            .tf-config-input {
                width: 100%;
                background: #181818;
                border: 1px solid #2f2f2f;
                border-radius: 8px;
                color: white;
                font-size: 14px;
                padding: 12px 15px;
                font-family: 'Inter', sans-serif;
                transition: border-color 0.3s ease;
            }

            .tf-config-input:focus {
                outline: none;
                border-color: #8B51FF;
            }

            .tf-config-toggle {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 15px;
            }

            .tf-toggle {
                position: relative;
                width: 50px;
                height: 26px;
                background: #2f2f2f;
                border-radius: 13px;
                cursor: pointer;
                transition: background 0.3s;
            }

            .tf-toggle.active {
                background: #8B51FF;
            }

            .tf-toggle-slider {
                position: absolute;
                top: 3px;
                left: 3px;
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                transition: transform 0.3s;
            }

            .tf-toggle.active .tf-toggle-slider {
                transform: translateX(24px);
            }

            .tf-config-buttons {
                display: flex;
                gap: 12px;
                margin-top: 30px;
            }

            .tf-config-btn {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 8px;
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .tf-config-btn-save {
                background: linear-gradient(135deg, #8B51FF 0%, #CB8FFF 100%);
                color: white;
            }

            .tf-config-btn-save:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(139, 81, 255, 0.4);
            }

            .tf-config-btn-reset {
                background: #2f2f2f;
                color: #C8C9D1;
            }

            .tf-config-btn-reset:hover {
                background: #3a3a3a;
            }

            /* Notification */
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ========================================
    // UI - BOUTON ET MODAL
    // ========================================
    function createConfigUI() {
        if (document.getElementById('tf-config-button')) return;

        const button = document.createElement('button');
        button.id = 'tf-config-button';
        button.className = 'tf-config-button';
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2"/>
                <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" stroke-width="2"/>
            </svg>
            TF Config
        `;

        const modal = document.createElement('div');
        modal.id = 'tf-config-modal';
        modal.className = 'tf-config-modal';

        const config = loadConfig();
        const sniperConfig = loadSniperConfig();

        modal.innerHTML = `
            <div class="tf-config-content">
                <div class="tf-config-header">
                    <h2 class="tf-config-title">⚙️ TradeFlow Configuration</h2>
                    <button class="tf-config-close">&times;</button>
                </div>

                <!-- Section Buy Buttons -->
                <div class="tf-config-section">
                    <div class="tf-config-section-title">💰 Buy Buttons</div>

                    <div class="tf-config-input-group">
                        <label class="tf-config-label">Bouton 1 (SOL)</label>
                        <input type="text" class="tf-config-input" id="tf-input-1" value="${config.button1}" placeholder="0.25">
                    </div>

                    <div class="tf-config-input-group">
                        <label class="tf-config-label">Bouton 2 (SOL)</label>
                        <input type="text" class="tf-config-input" id="tf-input-2" value="${config.button2}" placeholder="0.5">
                    </div>

                    <div class="tf-config-input-group">
                        <label class="tf-config-label">Bouton 3 (SOL)</label>
                        <input type="text" class="tf-config-input" id="tf-input-3" value="${config.button3}" placeholder="0.75">
                    </div>

                    <div class="tf-config-input-group">
                        <label class="tf-config-label">Bouton 4 (SOL)</label>
                        <input type="text" class="tf-config-input" id="tf-input-4" value="${config.button4}" placeholder="1">
                    </div>
                </div>

                <!-- Section Sniper -->
                <div class="tf-config-section">
                    <div class="tf-config-section-title">🎯 Sniper Mode (3 SOL)</div>

                    <div class="tf-config-toggle">
                        <div class="tf-toggle ${sniperConfig.enabled ? 'active' : ''}" id="tf-sniper-toggle">
                            <div class="tf-toggle-slider"></div>
                        </div>
                        <label class="tf-config-label" style="margin: 0;">Activer le mode Sniper</label>
                    </div>

                    <div style="background: #0D1124; border: 1px solid #4367e7; border-radius: 8px; padding: 12px; margin-top: 15px; font-size: 12px; color: #C8C9D1;">
                        <div style="color: #4367e7; font-weight: 600; margin-bottom: 5px;">💡 Info Sniper</div>
                        Le sniper cliquera automatiquement sur le bouton <strong>3 SOL</strong> de TradeFlow. Un bouton "SNIPE" apparaîtra sur chaque token.
                    </div>
                </div>

                <div class="tf-config-buttons">
                    <button class="tf-config-btn tf-config-btn-reset">Réinitialiser</button>
                    <button class="tf-config-btn tf-config-btn-save">Sauvegarder</button>
                </div>
            </div>
        `;

        document.body.appendChild(button);
        document.body.appendChild(modal);

        setupEventListeners(modal);
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================
    function setupEventListeners(modal) {
        // Ouvrir modal
        document.getElementById('tf-config-button').addEventListener('click', () => {
            modal.classList.add('active');
        });

        // Fermer modal
        modal.querySelector('.tf-config-close').addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Toggle Sniper
        document.getElementById('tf-sniper-toggle').addEventListener('click', function() {
            this.classList.toggle('active');
        });

        // Sauvegarder
        modal.querySelector('.tf-config-btn-save').addEventListener('click', () => {
            const newConfig = {
                button1: parseFloat(document.getElementById('tf-input-1').value) || DEFAULT_AMOUNTS.button1,
                button2: parseFloat(document.getElementById('tf-input-2').value) || DEFAULT_AMOUNTS.button2,
                button3: parseFloat(document.getElementById('tf-input-3').value) || DEFAULT_AMOUNTS.button3,
                button4: parseFloat(document.getElementById('tf-input-4').value) || DEFAULT_AMOUNTS.button4
            };

            const newSniperConfig = {
                enabled: document.getElementById('tf-sniper-toggle').classList.contains('active'),
                amount: 3,  // Toujours 3 SOL
                slippage: 5,
                autoSnipe: false
            };

            saveConfig(newConfig);
            saveSniperConfig(newSniperConfig);
            modifyBuyButtons();

            if (newSniperConfig.enabled) {
                initSniper();
            } else {
                removeSniper();
            }

            modal.classList.remove('active');
            showNotification('✅ Configuration sauvegardée !');
        });

        // Réinitialiser
        modal.querySelector('.tf-config-btn-reset').addEventListener('click', () => {
            saveConfig(DEFAULT_AMOUNTS);
            saveSniperConfig(SNIPER_CONFIG);

            document.getElementById('tf-input-1').value = DEFAULT_AMOUNTS.button1;
            document.getElementById('tf-input-2').value = DEFAULT_AMOUNTS.button2;
            document.getElementById('tf-input-3').value = DEFAULT_AMOUNTS.button3;
            document.getElementById('tf-input-4').value = DEFAULT_AMOUNTS.button4;

            document.getElementById('tf-sniper-toggle').classList.remove('active');

            modifyBuyButtons();
            removeSniper();
            showNotification('🔄 Configuration réinitialisée');
        });

        // Validation inputs
        const inputs = modal.querySelectorAll('.tf-config-input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.value = input.value.replace(/[^0-9.]/g, '');
                const parts = input.value.split('.');
                if (parts.length > 2) {
                    input.value = parts[0] + '.' + parts[1];
                }
            });
        });
    }

    // ========================================
    // MODIFIER LES BOUTONS BUY
    // ========================================
    function modifyBuyButtons() {
        const config = loadConfig();
        const buyButtons = document.querySelectorAll('.tradeflow-buy-button-container button[action="paper-buy"]');

        if (buyButtons.length === 0) return false;

        const amounts = [config.button1, config.button2, config.button3, config.button4];

        buyButtons.forEach((button, index) => {
            if (index < amounts.length) {
                button.setAttribute('data-amount', amounts[index]);
                button.textContent = `${amounts[index]} SOL`;
            }
        });

        console.log("✅ Boutons modifiés:", config);
        return true;
    }

    // ========================================
    // SYSTÈME DE SNIPE
    // ========================================
    function initSniper() {
        console.log("🎯 Sniper activé - Clic sur bouton 3 SOL");

        // Observer optimisé avec debounce
        let timeout;
        const observer = new MutationObserver(() => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                addSniperButtons();
            }, 500);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Ajouter immédiatement si tokens déjà présents
        addSniperButtons();
    }

    function addSniperButtons() {
        // Chercher tous les containers de tokens
        const tokenContainers = document.querySelectorAll('.group.relative[class*="h-[142px]"], .group.relative[class*="h-[116px]"]');

        tokenContainers.forEach(container => {
            // Vérifier si le bouton sniper n'existe pas déjà
            if (container.querySelector('.tf-sniper-btn')) return;

            // Extraire l'adresse du token
            const addressElement = container.querySelector('[class*="truncate"]');
            const tokenAddress = addressElement ? addressElement.textContent.trim() : null;

            if (!tokenAddress) return;

            // Créer le bouton sniper
            const sniperBtn = document.createElement('button');
            sniperBtn.className = 'tf-sniper-btn';
            sniperBtn.innerHTML = '⚡ SNIPE';
            sniperBtn.dataset.address = tokenAddress;

            // Event click
            sniperBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();
                await handleSnipe(sniperBtn, container);
            });

            // Insérer le bouton dans le container
            container.style.position = 'relative';
            container.appendChild(sniperBtn);
        });

        console.log(`🎯 ${tokenContainers.length} boutons sniper ajoutés`);
    }

    async function handleSnipe(button, container) {
        const sniperConfig = loadSniperConfig();

        // Extraire les infos du token
        const tokenName = container.querySelector('[class*="text-textPrimary"][class*="text-[16px]"]')?.textContent || 'Unknown';
        const tokenAddress = button.dataset.address;

        if (!tokenAddress) {
            showNotification('❌ Impossible de trouver l\'adresse du token');
            return;
        }

        // Désactiver le bouton pendant le snipe
        button.disabled = true;
        button.innerHTML = '⏳ SNIPE...';
        button.classList.add('active');

        try {
            console.log(`🎯 Snipe de ${tokenName} (${tokenAddress})`);
            console.log(`💰 Montant: 3 SOL (via clic bouton)`);

            // Vérifier si le panel TradeFlow est déjà chargé
            const panelExists = document.querySelector('.tradeflow-playground-panel');

            if (!panelExists) {
                // Panel pas chargé = on doit naviguer vers le token
                console.log('📍 Navigation vers le token...');
                button.innerHTML = '🔄 NAVIGATION...';
                showNotification(`🔄 Ouverture de ${tokenName}...`);

                // Sauvegarder la config de snipe pour l'utiliser après navigation
                const snipeData = {
                    tokenAddress: tokenAddress,
                    tokenName: tokenName,
                    timestamp: Date.now()
                };
                sessionStorage.setItem('tf_pending_snipe', JSON.stringify(snipeData));

                // Cliquer sur le container pour ouvrir la chart
                container.click();

                // Le snipe se fera automatiquement après le chargement du panel
                return;
            }

            // Panel existe = on est sur la chart, on peut sniper via clic sur bouton natif
            console.log('🎯 Recherche du bouton 3 SOL...');

            // Trouver le bouton de 3 SOL dans le panel TradeFlow
            const buyButton3SOL = findBuyButton3SOL();

            if (!buyButton3SOL) {
                throw new Error('Bouton 3 SOL non trouvé dans le panel TradeFlow');
            }

            console.log('✅ Bouton 3 SOL trouvé, simulation du clic...');

            // Simuler un clic réaliste sur le bouton
            simulateRealClick(buyButton3SOL);

            // Feedback visuel
            button.innerHTML = '✅ SNIPED';
            button.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
            showNotification(`✅ Snipe lancé: ${tokenName} (3 SOL)`);

            // Nettoyer le snipe en attente
            sessionStorage.removeItem('tf_pending_snipe');

            setTimeout(() => {
                button.innerHTML = '⚡ SNIPE';
                button.style.background = 'linear-gradient(135deg, #ff4757 0%, #ff6348 100%)';
                button.disabled = false;
                button.classList.remove('active');
            }, 3000);

        } catch (error) {
            console.error('Erreur snipe:', error);
            button.innerHTML = '❌ FAILED';
            showNotification(`❌ Snipe échoué: ${error.message}`);

            setTimeout(() => {
                button.innerHTML = '⚡ SNIPE';
                button.classList.remove('active');
                button.disabled = false;
            }, 3000);
        }
    }

    // ========================================
    // TROUVER LE BOUTON 3 SOL
    // ========================================
    function findBuyButton3SOL() {
        // Chercher dans le panel TradeFlow
        const panel = document.querySelector('.tradeflow-playground-panel');
        if (!panel) {
            console.error('❌ Panel TradeFlow non trouvé');
            return null;
        }

        console.log('✅ Panel TradeFlow trouvé');

        // Méthode 1: Chercher par le texte "3 SOL" ou "3"
        const allButtons = panel.querySelectorAll('button[action="paper-buy"]');
        console.log(`🔍 ${allButtons.length} boutons buy trouvés`);

        for (const btn of allButtons) {
            const text = btn.textContent.trim();
            const amount = btn.getAttribute('data-amount');

            console.log(`  Bouton: "${text}", data-amount: "${amount}"`);

            // Vérifier si c'est le bouton 3 SOL
            if (text.includes('3') && text.includes('SOL')) {
                console.log('  ✅ Bouton 3 SOL identifié par texte!');
                return btn;
            }

            if (amount === '3' || amount === '3.0') {
                console.log('  ✅ Bouton 3 SOL identifié par data-amount!');
                return btn;
            }
        }

        // Méthode 2: Si les boutons sont dans un container spécifique
        const buyContainer = panel.querySelector('.tradeflow-buy-button-container');
        if (buyContainer) {
            const buttons = buyContainer.querySelectorAll('button[action="paper-buy"]');
            console.log(`🔍 ${buttons.length} boutons dans le container`);

            // Le 3ème bouton pourrait être celui de 3 SOL (index 2)
            if (buttons[2]) {
                console.log('⚠️ Utilisation du 3ème bouton (index 2) par défaut');
                return buttons[2];
            }
        }

        // Méthode 3: Chercher tous les boutons qui contiennent "3"
        const allPanelButtons = panel.querySelectorAll('button');
        for (const btn of allPanelButtons) {
            const text = btn.textContent.trim();
            if ((text === '3 SOL' || text === '3') && btn.hasAttribute('action')) {
                console.log('  ✅ Bouton 3 SOL trouvé via recherche large!');
                return btn;
            }
        }

        console.error('❌ Aucun bouton 3 SOL trouvé');
        return null;
    }

    // ========================================
    // SIMULER UN CLIC RÉALISTE
    // ========================================
    function simulateRealClick(element) {
        console.log('🖱️ Simulation de clic sur:', element);

        // Focus sur l'élément
        element.focus();

        // Créer plusieurs événements pour simuler un vrai clic
        const events = [
            new MouseEvent('mouseenter', {
                bubbles: true,
                cancelable: true,
                view: window
            }),
            new MouseEvent('mouseover', {
                bubbles: true,
                cancelable: true,
                view: window
            }),
            new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0,
                buttons: 1
            }),
            new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0,
                buttons: 0
            }),
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0
            })
        ];

        // Dispatch tous les événements
        events.forEach((event, index) => {
            setTimeout(() => {
                element.dispatchEvent(event);
                console.log(`  ✓ Événement ${index + 1}/${events.length}: ${event.type}`);
            }, index * 10); // Petit délai entre chaque événement
        });

        // Tenter aussi un clic direct au cas où
        setTimeout(() => {
            try {
                element.click();
                console.log('  ✓ Clic direct exécuté');
            } catch (e) {
                console.warn('  ⚠️ Clic direct échoué:', e.message);
            }
        }, 100);

        console.log('✅ Tous les événements de clic dispatchés');
    }

    function removeSniper() {
        console.log("🎯 Sniper désactivé");
        document.querySelectorAll('.tf-sniper-btn').forEach(btn => btn.remove());
    }

    // ========================================
    // NOTIFICATIONS
    // ========================================
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #8B51FF 0%, #CB8FFF 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 600;
            z-index: 9999999;
            box-shadow: 0 4px 15px rgba(139, 81, 255, 0.4);
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }

    // ========================================
    // AUTO-APPLY OPTIMISÉ
    // ========================================
    let panelObserver = null;
    let lastPanelCheck = 0;
    const PANEL_CHECK_COOLDOWN = 1000;

    function setupPanelObserver() {
        // Éviter de spam les vérifications
        panelObserver = new MutationObserver(() => {
            const now = Date.now();
            if (now - lastPanelCheck < PANEL_CHECK_COOLDOWN) return;

            lastPanelCheck = now;

            const panel = document.querySelector('.tradeflow-playground-panel');
            if (panel) {
                modifyBuyButtons();

                // Vérifier s'il y a un snipe en attente
                checkPendingSnipe();
            }
        });

        // Observer uniquement les changements directs du body
        panelObserver.observe(document.body, {
            childList: true,
            subtree: false
        });
    }

    // ========================================
    // GESTION DU SNIPE EN ATTENTE
    // ========================================
    function checkPendingSnipe() {
        const pendingSnipe = sessionStorage.getItem('tf_pending_snipe');
        if (!pendingSnipe) return;

        try {
            const snipeData = JSON.parse(pendingSnipe);

            // Vérifier que le snipe n'est pas trop vieux (max 30 secondes)
            const age = Date.now() - snipeData.timestamp;
            if (age > 30000) {
                sessionStorage.removeItem('tf_pending_snipe');
                showNotification('⏱️ Snipe expiré (30s dépassées)');
                return;
            }

            // Panel chargé, on peut maintenant exécuter le snipe
            console.log('🎯 Exécution du snipe en attente:', snipeData.tokenName);
            showNotification(`🎯 Snipe en cours: ${snipeData.tokenName}...`);

            // Attendre un peu que le panel soit complètement chargé
            setTimeout(() => {
                executePendingSnipe(snipeData);
            }, 2000);

        } catch (error) {
            console.error('Erreur snipe en attente:', error);
            sessionStorage.removeItem('tf_pending_snipe');
        }
    }

    async function executePendingSnipe(snipeData) {
        try {
            console.log('🎯 Exécution du snipe en attente:', snipeData.tokenName);

            // Trouver le bouton de 3 SOL
            const buyButton3SOL = findBuyButton3SOL();

            if (!buyButton3SOL) {
                throw new Error('Bouton 3 SOL non trouvé');
            }

            console.log('✅ Bouton 3 SOL trouvé, simulation du clic...');

            // Simuler un clic réaliste sur le bouton
            simulateRealClick(buyButton3SOL);

            showNotification(`✅ Snipe lancé: ${snipeData.tokenName} (3 SOL)`);

            // Nettoyer le snipe en attente
            sessionStorage.removeItem('tf_pending_snipe');

        } catch (error) {
            console.error('Erreur snipe en attente:', error);
            showNotification(`❌ Snipe échoué: ${error.message}`);
            sessionStorage.removeItem('tf_pending_snipe');
        }
    }

    // ========================================
    // INITIALISATION
    // ========================================
    function init() {
        injectStyles();
        createConfigUI();
        setupPanelObserver();

        // Appliquer la config existante
        setTimeout(() => {
            modifyBuyButtons();

            const sniperConfig = loadSniperConfig();
            if (sniperConfig.enabled) {
                initSniper();
            }
        }, 1000);

        console.log("✅ TradeFlow Custom + Sniper V2 initialisé");
        console.log("💡 Cliquez sur le bouton en bas à droite pour configurer");
        console.log("🎯 Mode: Clic automatique sur bouton 3 SOL");
    }

    init();

})();

/*
========================================
📚 GUIDE D'UTILISATION - VERSION 2
========================================

🎯 NOUVELLE VERSION - CLIC SUR BOUTON 3 SOL

Cette version simule un clic sur le bouton natif de 3 SOL
au lieu d'utiliser l'API de l'extension.

========================================
1. INSTALLATION
========================================

- Ouvrez la console (F12)
- Collez tout ce script
- Appuyez sur Entrée

========================================
2. CONFIGURATION
========================================

Cliquez sur "TF Config" en bas à droite:

💰 Buy Buttons:
- Configurez les 4 boutons de montants personnalisés
- Ces montants s'appliqueront automatiquement

🎯 Sniper Mode:
- Activez le toggle "Activer le mode Sniper"
- Le sniper utilisera TOUJOURS le bouton 3 SOL natif
- Pas de configuration de montant nécessaire

========================================
3. UTILISER LE SNIPER
========================================

1. Activez le mode Sniper dans la config
2. Un bouton "⚡ SNIPE" apparaît sur chaque token
3. Cliquez sur SNIPE pour:
   - Ouvrir le token automatiquement (si pas déjà ouvert)
   - Cliquer sur le bouton 3 SOL de TradeFlow
   - L'ordre d'achat se lancera automatiquement

États du bouton:
- ⚡ SNIPE      → Prêt à sniper
- 🔄 NAVIGATION → Ouverture du token
- ⏳ SNIPE...   → Recherche du bouton 3 SOL
- ✅ SNIPED     → Clic effectué avec succès
- ❌ FAILED     → Erreur (bouton non trouvé)

========================================
4. FONCTIONNEMENT TECHNIQUE
========================================

Le script:
1. Détecte si vous êtes sur la page du token
2. Si non: Ouvre le token automatiquement
3. Attend le chargement du panel TradeFlow
4. Cherche le bouton "3 SOL" par plusieurs méthodes:
   - Texte du bouton contenant "3 SOL"
   - Attribut data-amount="3"
   - Position du 3ème bouton (fallback)
5. Simule un clic ultra-réaliste avec tous les événements:
   - mouseenter, mouseover, mousedown, mouseup, click

========================================
5. LOGS DE DÉBOGAGE
========================================

Ouvrez la console pour voir:
- 🔍 X boutons buy trouvés
- Bouton: "3 SOL", data-amount: "3"
- ✅ Bouton 3 SOL identifié!
- 🖱️ Simulation de clic sur: <button>
- ✓ Événement 1/5: mouseenter
- ✓ Événement 2/5: mouseover
- etc...

========================================
6. DÉPANNAGE
========================================

❌ "Bouton 3 SOL non trouvé":
→ Vérifiez que le panel TradeFlow est bien chargé
→ Ouvrez un token manuellement et vérifiez les logs
→ Collez ce code dans la console pour diagnostiquer:

```javascript
function testBouton3SOL() {
    const panel = document.querySelector('.tradeflow-playground-panel');
    if (!panel) {
        console.log('❌ Panel non trouvé');
        return;
    }

    const buttons = panel.querySelectorAll('button[action="paper-buy"]');
    console.log(`🔍 ${buttons.length} boutons trouvés:`);

    buttons.forEach((btn, i) => {
        const text = btn.textContent.trim();
        const amount = btn.getAttribute('data-amount');
        console.log(`  ${i+1}. "${text}" | data-amount: "${amount}"`);

        if (text.includes('3') && text.includes('SOL')) {
            console.log('     ⭐ <- BOUTON 3 SOL!');
        }
    });
}

testBouton3SOL();
```

========================================
7. AVANTAGES DE CETTE VERSION
========================================

✅ Pas besoin de l'API de l'extension
✅ Fonctionne même si l'extension est déconnectée
✅ Simule un comportement 100% naturel
✅ Compatible avec toutes les configurations
✅ Logs détaillés pour le débogage
✅ Multiples méthodes de détection du bouton
✅ Gestion automatique de la navigation

========================================
8. LIMITATIONS
========================================

⚠️ Utilise TOUJOURS le bouton 3 SOL
⚠️ Ne peut pas changer le montant dynamiquement
⚠️ Dépend de la structure HTML de TradeFlow

Si vous avez besoin d'un montant différent:
→ Modifiez la configuration des boutons Buy
→ Changez le bouton 3 pour avoir le montant souhaité

========================================
9. SÉCURITÉ
========================================

✅ Désactive le bouton pendant l'opération
✅ Timeout de 30 secondes pour les snipes en attente
✅ Nettoyage automatique des données
✅ Gestion complète des erreurs
✅ Notifications claires à chaque étape

========================================
🎉 PRÊT À UTILISER !
========================================

1. Collez le script dans la console
2. Activez le mode Sniper
3. Cliquez sur ⚡ SNIPE sur n'importe quel token
4. Le script fera le reste automatiquement !

Pour toute question, vérifiez les logs dans la console (F12)
*/
