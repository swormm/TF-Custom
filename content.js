console.log('🚀 TradeFlow Extension - Content Script chargé');

// Variable globale pour éviter les doubles injections
if (!window.tfContentScriptLoaded) {
  window.tfContentScriptLoaded = true;
  console.log('✅ Premier chargement du content script');
} else {
  console.log('⚠️ Content script déjà chargé, skip injection');
}

function injectMainScript() {
  if (document.getElementById('tradeflow-injected-script')) {
    console.log('✅ Script déjà injecté');
    return;
  }
  
  // Vérifier aussi si le script est déjà actif via le bouton config
  if (document.getElementById('tf-config-button')) {
    console.log('✅ Script TradeFlow déjà actif (bouton détecté)');
    return;
  }
  
  console.log('⏳ Attente de 3 secondes avant injection...');
  
  setTimeout(() => {
    // Double vérification après le délai
    if (document.getElementById('tradeflow-injected-script') || document.getElementById('tf-config-button')) {
      console.log('✅ Script déjà présent après délai, skip');
      return;
    }
    
    const script = document.createElement('script');
    script.id = 'tradeflow-injected-script';
    script.src = chrome.runtime.getURL('injected.js');
    script.type = 'text/javascript';
    (document.head || document.documentElement).appendChild(script);
    
    console.log('✅ Script TradeFlow injecté');
    chrome.runtime.sendMessage({ action: 'scriptInjected', url: window.location.href });
    
    script.onload = function() { 
      console.log('✅ injected.js chargé et exécuté');
      this.remove(); 
    };
    
    script.onerror = function() {
      console.error('❌ Erreur chargement injected.js');
    };
  }, 3000); // Délai de 3 secondes
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Message:', message);
  
  if (message.action === 'ping') {
    // Vérifier si le bouton de config existe (= script actif)
    const isActive = !!document.getElementById('tf-config-button');
    console.log('🏓 Ping reçu, script actif:', isActive);
    sendResponse({ 
      status: isActive ? 'active' : 'loading',
      stats: { snipes: parseInt(localStorage.getItem('tf_snipes_count') || '0') }
    });
  } else if (message.action === 'openConfig') {
    const configBtn = document.getElementById('tf-config-button');
    if (configBtn) {
      configBtn.click();
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false });
    }
  } else if (message.action === 'reload') {
    window.location.reload();
    sendResponse({ success: true });
  }
  
  return true;
});

window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  
  if (event.data.type === 'TF_STATUS_UPDATE') {
    chrome.runtime.sendMessage({
      action: 'statusUpdate',
      status: event.data.status,
      title: event.data.title,
      text: event.data.text
    });
  }
  
  if (event.data.type === 'TF_STATS_UPDATE') {
    chrome.runtime.sendMessage({
      action: 'statsUpdate',
      stats: event.data.stats
    });
  }
  
  if (event.data.type === 'TF_SNIPE_SUCCESS') {
    let count = parseInt(localStorage.getItem('tf_snipes_count') || '0');
    count++;
    localStorage.setItem('tf_snipes_count', count.toString());
    chrome.runtime.sendMessage({ action: 'statsUpdate', stats: { snipes: count } });
  }
});

// Injection au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectMainScript);
} else {
  injectMainScript();
}

// Observer pour les navigations SPA (moins agressif)
let lastUrl = location.href;
let urlCheckInterval = setInterval(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log('🔄 Navigation détectée vers:', url);
    setTimeout(() => {
      if (!document.getElementById('tf-config-button')) {
        console.log('🔄 Réinjection nécessaire');
        injectMainScript();
      }
    }, 2000);
  }
}, 2000);

console.log('✅ Content Script initialisé');