/**
 * SafeSpace AI - Background Service Worker
 * Handles extension state, evidence storage, and cross-tab communication
 */

// Default settings
const DEFAULT_SETTINGS = {
  enabled: true,
  sensitivity: 'medium', // low, medium, high
  showPopups: true,
  autoHide: false,
  scanInterval: 3000
};

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  console.log('SafeSpace AI Extension installed');
  
  // Set default settings
  const existing = await chrome.storage.local.get('settings');
  if (!existing.settings) {
    await chrome.storage.local.set({ 
      settings: DEFAULT_SETTINGS,
      evidence: [],
      stats: {
        threatsBlocked: 0,
        scansCompleted: 0,
        lastScan: null
      }
    });
  }
  
  // Set badge
  chrome.action.setBadgeBackgroundColor({ color: '#a78bfa' });
  chrome.action.setBadgeText({ text: 'ON' });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender).then(sendResponse);
  return true; // Keep channel open for async response
});

async function handleMessage(message, sender) {
  switch (message.type) {
    case 'GET_SETTINGS':
      return await getSettings();
    
    case 'UPDATE_SETTINGS':
      return await updateSettings(message.settings);
    
    case 'SAVE_EVIDENCE':
      return await saveEvidence(message.evidence);
    
    case 'GET_EVIDENCE':
      return await getEvidence();
    
    case 'DELETE_EVIDENCE':
      return await deleteEvidence(message.id);
    
    case 'CLEAR_EVIDENCE':
      return await clearEvidence();
    
    case 'GET_STATS':
      return await getStats();
    
    case 'INCREMENT_STAT':
      return await incrementStat(message.stat);
    
    case 'THREAT_DETECTED':
      return await handleThreatDetected(message.data, sender.tab);
    
    case 'OPEN_SUPPORT_HUB':
      chrome.tabs.create({ url: message.url || 'https://safespace-ai.repl.co/resources' });
      return { success: true };
    
    default:
      return { error: 'Unknown message type' };
  }
}

async function getSettings() {
  const data = await chrome.storage.local.get('settings');
  return data.settings || DEFAULT_SETTINGS;
}

async function updateSettings(newSettings) {
  const current = await getSettings();
  const updated = { ...current, ...newSettings };
  await chrome.storage.local.set({ settings: updated });
  
  // Update badge based on enabled state
  chrome.action.setBadgeText({ text: updated.enabled ? 'ON' : 'OFF' });
  chrome.action.setBadgeBackgroundColor({ 
    color: updated.enabled ? '#a78bfa' : '#6b7280' 
  });
  
  return updated;
}

async function saveEvidence(evidence) {
  const data = await chrome.storage.local.get('evidence');
  const list = data.evidence || [];
  
  // Add timestamp and ID
  const newEvidence = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    ...evidence,
    timestamp: new Date().toISOString(),
    encrypted: true
  };
  
  // Simple encryption (base64 + marker for demo)
  if (evidence.content) {
    newEvidence.encryptedContent = btoa('ENCRYPTED:' + evidence.content);
    delete newEvidence.content;
  }
  
  list.unshift(newEvidence);
  
  // Keep only last 100 items
  if (list.length > 100) list.pop();
  
  await chrome.storage.local.set({ evidence: list });
  return newEvidence;
}

async function getEvidence() {
  const data = await chrome.storage.local.get('evidence');
  return data.evidence || [];
}

async function deleteEvidence(id) {
  const data = await chrome.storage.local.get('evidence');
  const list = (data.evidence || []).filter(e => e.id !== id);
  await chrome.storage.local.set({ evidence: list });
  return { success: true };
}

async function clearEvidence() {
  await chrome.storage.local.set({ evidence: [] });
  return { success: true };
}

async function getStats() {
  const data = await chrome.storage.local.get('stats');
  return data.stats || { threatsBlocked: 0, scansCompleted: 0, lastScan: null };
}

async function incrementStat(stat) {
  const data = await chrome.storage.local.get('stats');
  const stats = data.stats || { threatsBlocked: 0, scansCompleted: 0, lastScan: null };
  
  if (stat === 'scan') {
    stats.scansCompleted++;
    stats.lastScan = new Date().toISOString();
  } else if (stat === 'threat') {
    stats.threatsBlocked++;
  }
  
  await chrome.storage.local.set({ stats });
  return stats;
}

async function handleThreatDetected(data, tab) {
  // Update stats
  await incrementStat('threat');
  
  // Show notification if enabled
  const settings = await getSettings();
  if (settings.showPopups && chrome.notifications) {
    try {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: '⚠️ SafeSpace AI Alert',
        message: `Harmful content detected: ${data.category || 'Unknown category'}`,
        priority: 2
      });
    } catch (e) {
      console.log('Notification not available');
    }
  }
  
  return { success: true };
}

console.log('SafeSpace AI Background Service Worker loaded');
