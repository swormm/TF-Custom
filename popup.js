function createParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 3 + 's';
    particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
    container.appendChild(particle);
  }
}

let startTime = Date.now();
let uptimeInterval;
let isReinjecting = false; // Empêcher les réinjections multiples

function updateStatus(status, title, text) {
  const icon = document.getElementById('statusIcon');
  const emoji = document.getElementById('statusEmoji');
  const titleEl = document.getElementById('statusTitle');
  const textEl = document.getElementById('statusText');
  
  icon.classList.remove('active', 'inactive', 'loading');
  
  if (status === 'active') {
    icon.classList.add('active');
    emoji.textContent = '✅';
  } else if (status === 'inactive') {
    icon.classList.add('inactive');
    emoji.textContent = '❌';
  } else {
    icon.classList.add('loading');
    emoji.textContent = '⏳';
  }
  
  titleEl.textContent = title;
  textEl.textContent = text;
  chrome.storage.local.set({ status, title, text });
}

function startUptimeCounter() {
  uptimeInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    document.getElementById('uptime').textContent = 
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

async function checkScriptStatus() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      updateStatus('inactive', 'Aucun onglet', 'Ouvrez axiom.trade');
      return;
    }
    
    const isSupported = tab.url?.includes('axiom.trade');
    if (!isSupported) {
      updateStatus('inactive', 'Site non supporté', 'Allez sur axiom.trade');
      return;
    }
    
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
      if (response?.status === 'active') {
        updateStatus('active', 'Script actif', `Sur ${new URL(tab.url).hostname}`);
        isReinjecting = false; // Reset le flag
        if (response.stats) {
          document.getElementById('snipesCount').textContent = response.stats.snipes || 0;
        }
      } else {
        updateStatus('loading', 'Chargement...', 'Script en cours');
      }
    } catch (error) {
      // Content script ne répond pas
      if (!isReinjecting) {
        console.log('❌ Content script ne répond pas, réinjection...');
        isReinjecting = true;
        updateStatus('loading', 'Injection...', 'Injection du script');
        await reinjectScript(tab.id);
      }
    }
  } catch (error) {
    console.error('Erreur:', error);
    updateStatus('inactive', 'Erreur', 'Une erreur est survenue');
  }
}

async function reinjectScript(tabId) {
  try {
    // Injecter le content script manuellement
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
    console.log('✅ Content script réinjecté');
    
    // Attendre 2 secondes et revérifier UNE SEULE FOIS
    setTimeout(() => {
      checkScriptStatus();
      // Après cette vérification, reset le flag après 5 secondes
      setTimeout(() => {
        isReinjecting = false;
      }, 5000);
    }, 2000);
  } catch (error) {
    console.error('❌ Erreur réinjection:', error);
    isReinjecting = false;
    updateStatus('inactive', 'Erreur injection', 'Rechargez manuellement (F5)');
  }
}

document.getElementById('configBtn').addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      await chrome.tabs.sendMessage(tab.id, { action: 'openConfig' });
      window.close();
    }
  } catch {
    alert('Allez sur axiom.trade d\'abord');
  }
});

document.getElementById('reloadBtn').addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      updateStatus('loading', 'Rechargement...', 'Page en cours de rechargement');
      
      // Recharger la page
      await chrome.tabs.reload(tab.id);
      
      // Attendre que la page soit rechargée puis vérifier/réinjecter
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (tabId === tab.id && info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          
          // Attendre un peu puis vérifier et réinjecter si nécessaire
          setTimeout(async () => {
            await checkScriptStatus();
          }, 1500);
        }
      });
    }
  } catch (error) {
    console.error('Erreur:', error);
    updateStatus('inactive', 'Erreur', 'Rechargement échoué');
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  createParticles();
  startUptimeCounter();
  
  const saved = await chrome.storage.local.get(['status', 'title', 'text', 'startTime']);
  if (saved.startTime) {
    startTime = saved.startTime;
  } else {
    chrome.storage.local.set({ startTime });
  }
  
  if (saved.status) {
    updateStatus(saved.status, saved.title, saved.text);
  }
  
  await checkScriptStatus();
  
  // Vérifier toutes les 5 secondes au lieu de 3 (moins agressif)
  setInterval(checkScriptStatus, 5000);
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'statusUpdate') {
    updateStatus(message.status, message.title, message.text);
  }
  if (message.action === 'statsUpdate' && message.stats.snipes !== undefined) {
    document.getElementById('snipesCount').textContent = message.stats.snipes;
  }
});