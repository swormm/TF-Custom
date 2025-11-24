console.log('🚀 TradeFlow Extension - Background Worker démarré');

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('✅ Extension installée');
    chrome.storage.local.set({
      status: 'inactive',
      title: 'Extension installée',
      text: 'Naviguez vers axiom.trade',
      startTime: Date.now(),
      snipesCount: 0
    });
    chrome.tabs.create({ url: 'https://axiom.trade' });
  } else if (details.reason === 'update') {
    console.log('🔄 Extension mise à jour');
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Message background:', message);
  
  if (message.action === 'scriptInjected') {
    console.log('✅ Script injecté sur:', message.url);
    chrome.storage.local.set({
      status: 'active',
      title: 'Script actif',
      text: 'TradeFlow Ultra en cours'
    });
    chrome.runtime.sendMessage({
      action: 'statusUpdate',
      status: 'active',
      title: 'Script actif',
      text: 'TradeFlow Ultra en cours'
    }).catch(() => {});
  }
  
  if (message.action === 'statusUpdate' || message.action === 'statsUpdate') {
    chrome.runtime.sendMessage(message).catch(() => {});
  }
  
  return true;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    const supportedSites = ['axiom.trade', 'photon-sol.tinyastro.io', 'dexscreener.com', 'bullx.io'];
    const isSupported = supportedSites.some(site => tab.url?.includes(site));
    if (isSupported) {
      console.log('✅ Onglet sur site supporté:', tab.url);
    }
  }
});

console.log('✅ Background Worker initialisé');