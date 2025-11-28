/**
 * SafeSpace AI - Popup Script
 * Handles popup UI interactions and state management
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Load initial state
  await loadState();
  
  // Set up event listeners
  setupEventListeners();
});

async function loadState() {
  try {
    // Get settings
    const settings = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });
    updateUIFromSettings(settings);
    
    // Get stats
    const stats = await chrome.runtime.sendMessage({ type: 'GET_STATS' });
    updateStats(stats);
    
    // Get evidence
    const evidence = await chrome.runtime.sendMessage({ type: 'GET_EVIDENCE' });
    updateEvidenceList(evidence);
  } catch (error) {
    console.error('Failed to load state:', error);
  }
}

function updateUIFromSettings(settings) {
  // Update toggle
  const enabledToggle = document.getElementById('enabled-toggle');
  enabledToggle.checked = settings.enabled;
  
  // Update status indicator
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = statusIndicator.querySelector('.status-text');
  if (settings.enabled) {
    statusIndicator.classList.remove('inactive');
    statusIndicator.classList.add('active');
    statusText.textContent = 'Active';
  } else {
    statusIndicator.classList.remove('active');
    statusIndicator.classList.add('inactive');
    statusText.textContent = 'Disabled';
  }
  
  // Update sensitivity buttons
  const sensitivityBtns = document.querySelectorAll('.sensitivity-btn');
  sensitivityBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === settings.sensitivity);
  });
}

function updateStats(stats) {
  document.getElementById('threats-blocked').textContent = stats.threatsBlocked || 0;
  document.getElementById('scans-completed').textContent = stats.scansCompleted || 0;
}

function updateEvidenceList(evidence) {
  const list = document.getElementById('evidence-list');
  const countEl = document.getElementById('evidence-count');
  
  countEl.textContent = evidence.length;
  
  if (evidence.length === 0) {
    list.innerHTML = '<p class="empty-state">No evidence saved yet</p>';
    return;
  }
  
  list.innerHTML = evidence.slice(0, 5).map(item => `
    <div class="evidence-item" data-id="${item.id}">
      <span class="evidence-icon">🔒</span>
      <div class="evidence-info">
        <div class="evidence-type">${item.category || 'Evidence'}</div>
        <div class="evidence-time">${formatTime(item.timestamp)}</div>
      </div>
      <button class="evidence-delete" data-id="${item.id}" title="Delete">✕</button>
    </div>
  `).join('');
  
  // Add delete handlers
  list.querySelectorAll('.evidence-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      await chrome.runtime.sendMessage({ type: 'DELETE_EVIDENCE', id });
      loadState();
    });
  });
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
}

function setupEventListeners() {
  // Enable/disable toggle
  document.getElementById('enabled-toggle').addEventListener('change', async (e) => {
    const enabled = e.target.checked;
    await chrome.runtime.sendMessage({ 
      type: 'UPDATE_SETTINGS', 
      settings: { enabled } 
    });
    loadState();
    
    // Notify content scripts
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { 
        type: 'SETTINGS_UPDATED', 
        settings: { enabled } 
      }).catch(() => {});
    }
  });
  
  // Sensitivity buttons
  document.querySelectorAll('.sensitivity-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const sensitivity = btn.dataset.value;
      await chrome.runtime.sendMessage({ 
        type: 'UPDATE_SETTINGS', 
        settings: { sensitivity } 
      });
      loadState();
    });
  });
  
  // Support Hub button
  document.getElementById('btn-support').addEventListener('click', () => {
    chrome.runtime.sendMessage({ 
      type: 'OPEN_SUPPORT_HUB',
      url: 'https://safespace-ai.repl.co/resources'
    });
    window.close();
  });
  
  // Evidence Locker button
  document.getElementById('btn-evidence').addEventListener('click', () => {
    chrome.runtime.sendMessage({ 
      type: 'OPEN_SUPPORT_HUB',
      url: 'https://safespace-ai.repl.co/evidence'
    });
    window.close();
  });
  
  // Scan Page button
  document.getElementById('btn-scan').addEventListener('click', async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          // Trigger a scan
          if (typeof scanPage === 'function') {
            scanPage();
          }
          alert('🛡️ SafeSpace AI: Page scan initiated!');
        }
      }).catch(() => {
        alert('Cannot scan this page');
      });
    }
  });
  
  // Clear evidence button
  document.getElementById('btn-clear-evidence').addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete all saved evidence?')) {
      await chrome.runtime.sendMessage({ type: 'CLEAR_EVIDENCE' });
      loadState();
    }
  });
  
  // Settings link
  document.getElementById('link-settings').addEventListener('click', (e) => {
    e.preventDefault();
    // Could open a settings page
    alert('Settings coming soon!');
  });
  
  // Help link
  document.getElementById('link-help').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.sendMessage({ 
      type: 'OPEN_SUPPORT_HUB',
      url: 'https://safespace-ai.repl.co/resources'
    });
    window.close();
  });
}

console.log('SafeSpace AI Popup loaded');
