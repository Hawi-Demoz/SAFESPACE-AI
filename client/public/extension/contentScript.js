/**
 * SafeSpace AI - Content Script
 * Real-time harm detection on web pages
 * Scans text content and shows warning overlays for harmful content
 */

// Import toxicity model (inline for content script)
const ToxicityDetector = {
  patterns: {
    harassment: {
      keywords: ['stupid', 'idiot', 'dumb', 'worthless', 'pathetic', 'loser', 'ugly', 'fat', 'disgusting', 'shut up', 'nobody cares', 'useless', 'moron', 'freak', 'weirdo', 'creep', 'trash', 'you suck', 'go away', 'nobody likes you'],
      weight: 1.0
    },
    threats: {
      keywords: ['kill you', 'hurt you', 'harm you', 'attack you', 'destroy you', 'you will die', 'watch your back', 'be careful', 'i know where', 'find you', 'get you', 'coming for you', 'make you pay', 'regret this'],
      weight: 1.5
    },
    sexual_coercion: {
      keywords: ['send pics', 'send photos', 'send nudes', 'show me', 'meet me alone', 'come over', 'secret between us', 'dont tell anyone', 'if you loved me', 'prove you love', 'nobody will know'],
      weight: 1.5
    },
    hate_speech: {
      keywords: ['hate you', 'despise', 'scum', 'vermin', 'dont deserve', 'inferior', 'subhuman', 'go back to', 'all you people', 'your kind'],
      weight: 1.3
    },
    identity_attack: {
      keywords: ['because youre a', 'all women', 'all men', 'typical', 'just like all', 'your kind', 'people like you', 'you people'],
      weight: 1.2
    },
    manipulation: {
      keywords: ['if you loved me', 'prove it', 'you owe me', 'after all i did', 'ungrateful', 'selfish', 'you made me', 'its your fault', 'nobody else will', 'youre crazy', 'youre imagining'],
      weight: 1.1
    }
  },
  amplifiers: ['very', 'so', 'really', 'extremely', 'fucking'],
  mitigators: ['maybe', 'kind of', 'just kidding', 'jk', 'lol', 'haha'],

  analyze(text) {
    if (!text || text.length < 5) return { isToxic: false, confidence: 0, categories: {} };
    
    const lowerText = text.toLowerCase();
    const categories = {};
    let maxScore = 0;

    for (const [category, data] of Object.entries(this.patterns)) {
      for (const keyword of data.keywords) {
        if (lowerText.includes(keyword)) {
          let score = 0.4 * data.weight;
          if (this.amplifiers.some(a => lowerText.includes(a))) score += 0.15;
          if (this.mitigators.some(m => lowerText.includes(m))) score -= 0.2;
          if (text.match(/!{2,}/)) score += 0.1;
          
          categories[category] = Math.max(categories[category] || 0, Math.min(score, 1.0));
          maxScore = Math.max(maxScore, categories[category]);
        }
      }
    }

    const confidence = Object.keys(categories).length > 0 ? maxScore : 0;
    return {
      isToxic: confidence > 0.3,
      confidence,
      categories,
      severity: confidence > 0.7 ? 'high' : confidence > 0.5 ? 'medium' : confidence > 0.3 ? 'low' : 'safe',
      primaryCategory: Object.keys(categories)[0] || null
    };
  },

  getCategoryLabel(cat) {
    return {
      harassment: 'Harassment',
      threats: 'Threat',
      sexual_coercion: 'Sexual Coercion',
      hate_speech: 'Hate Speech',
      identity_attack: 'Identity Attack',
      manipulation: 'Manipulation'
    }[cat] || cat;
  }
};

// State
let settings = { enabled: true, sensitivity: 'medium', showPopups: true };
let processedElements = new WeakSet();
let warningOverlay = null;

// Initialize
async function init() {
  console.log('🛡️ SafeSpace AI Protection Active');
  
  // Get settings
  try {
    settings = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });
  } catch (e) {
    console.log('Using default settings');
  }
  
  if (!settings.enabled) {
    console.log('SafeSpace AI is disabled');
    return;
  }
  
  // Initial scan
  scanPage();
  
  // Set up mutation observer for dynamic content
  const observer = new MutationObserver((mutations) => {
    let shouldScan = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldScan = true;
        break;
      }
    }
    if (shouldScan) {
      debounce(scanPage, 1000)();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Periodic scan
  setInterval(scanPage, settings.scanInterval || 5000);
}

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Scan the page for harmful content
function scanPage() {
  if (!settings.enabled) return;
  
  // Selectors for common message/comment elements
  const selectors = [
    '[data-testid*="tweet"]',
    '[data-testid*="comment"]',
    '.comment', '.message', '.post', '.reply',
    '[class*="comment"]', '[class*="message"]', '[class*="post"]',
    'article', '.status', '.tweet',
    '[role="article"]', '[role="comment"]'
  ];
  
  const elements = document.querySelectorAll(selectors.join(', '));
  let threatsFound = 0;
  
  elements.forEach(element => {
    if (processedElements.has(element)) return;
    
    const text = element.innerText || element.textContent;
    if (!text || text.length < 10) return;
    
    const result = ToxicityDetector.analyze(text);
    
    if (result.isToxic) {
      threatsFound++;
      markHarmfulElement(element, result);
    }
    
    processedElements.add(element);
  });
  
  // Update stats
  if (threatsFound > 0) {
    chrome.runtime.sendMessage({ type: 'INCREMENT_STAT', stat: 'threat' });
  }
  chrome.runtime.sendMessage({ type: 'INCREMENT_STAT', stat: 'scan' });
}

// Mark an element as harmful
function markHarmfulElement(element, result) {
  // Add warning border
  element.style.position = 'relative';
  element.style.border = `2px solid ${getSeverityColor(result.severity)}`;
  element.style.borderRadius = '8px';
  element.style.padding = '8px';
  
  // Create warning badge
  const badge = document.createElement('div');
  badge.className = 'safespace-warning-badge';
  badge.innerHTML = `
    <span class="safespace-icon">⚠️</span>
    <span class="safespace-text">${ToxicityDetector.getCategoryLabel(result.primaryCategory)}</span>
    <button class="safespace-action" data-action="hide">Hide</button>
    <button class="safespace-action" data-action="report">Report</button>
  `;
  badge.style.cssText = `
    position: absolute;
    top: -12px;
    right: 8px;
    background: ${getSeverityColor(result.severity)};
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-family: system-ui, sans-serif;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 10000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  `;
  
  // Add event listeners
  badge.querySelector('[data-action="hide"]').addEventListener('click', (e) => {
    e.stopPropagation();
    element.style.filter = 'blur(8px)';
    element.style.opacity = '0.5';
    badge.remove();
  });
  
  badge.querySelector('[data-action="report"]').addEventListener('click', (e) => {
    e.stopPropagation();
    showWarningOverlay(element, result);
  });
  
  element.appendChild(badge);
  
  // Show popup if enabled
  if (settings.showPopups && result.severity === 'high') {
    showWarningOverlay(element, result);
  }
}

// Get color based on severity
function getSeverityColor(severity) {
  return {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#eab308',
    safe: '#22c55e'
  }[severity] || '#6b7280';
}

// Show warning overlay popup
function showWarningOverlay(element, result) {
  // Remove existing overlay
  if (warningOverlay) {
    warningOverlay.remove();
  }
  
  const text = (element.innerText || '').substring(0, 200);
  
  warningOverlay = document.createElement('div');
  warningOverlay.className = 'safespace-overlay';
  warningOverlay.innerHTML = `
    <div class="safespace-modal">
      <div class="safespace-header">
        <span class="safespace-shield">🛡️</span>
        <h2>SafeSpace AI Alert</h2>
        <button class="safespace-close">&times;</button>
      </div>
      
      <div class="safespace-content">
        <div class="safespace-warning-box">
          <span class="safespace-warning-icon">⚠️</span>
          <div>
            <strong>Harmful content detected</strong>
            <p>This message may contain ${ToxicityDetector.getCategoryLabel(result.primaryCategory).toLowerCase()}</p>
          </div>
        </div>
        
        <div class="safespace-confidence">
          <div class="safespace-bar">
            <div class="safespace-bar-fill" style="width: ${result.confidence * 100}%; background: ${getSeverityColor(result.severity)}"></div>
          </div>
          <span>${Math.round(result.confidence * 100)}% confidence</span>
        </div>
        
        <div class="safespace-categories">
          ${Object.entries(result.categories).map(([cat, score]) => `
            <span class="safespace-cat">${ToxicityDetector.getCategoryLabel(cat)}: ${Math.round(score * 100)}%</span>
          `).join('')}
        </div>
        
        <div class="safespace-preview">
          <p>"${text}${text.length >= 200 ? '...' : ''}"</p>
        </div>
      </div>
      
      <div class="safespace-actions">
        <button class="safespace-btn safespace-btn-hide" data-action="hide">
          <span>👁️</span> Hide Content
        </button>
        <button class="safespace-btn safespace-btn-save" data-action="save">
          <span>💾</span> Save Evidence
        </button>
        <button class="safespace-btn safespace-btn-support" data-action="support">
          <span>💜</span> Get Support
        </button>
        <button class="safespace-btn safespace-btn-report" data-action="report-guide">
          <span>📋</span> How to Report
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(warningOverlay);
  
  // Event listeners
  warningOverlay.querySelector('.safespace-close').addEventListener('click', () => {
    warningOverlay.remove();
  });
  
  warningOverlay.querySelector('[data-action="hide"]').addEventListener('click', () => {
    element.style.filter = 'blur(8px)';
    element.style.opacity = '0.5';
    warningOverlay.remove();
  });
  
  warningOverlay.querySelector('[data-action="save"]').addEventListener('click', async () => {
    try {
      await chrome.runtime.sendMessage({
        type: 'SAVE_EVIDENCE',
        evidence: {
          content: text,
          url: window.location.href,
          category: result.primaryCategory,
          confidence: result.confidence,
          type: 'text'
        }
      });
      alert('Evidence saved securely! 🔒');
    } catch (e) {
      console.error('Failed to save evidence:', e);
    }
    warningOverlay.remove();
  });
  
  warningOverlay.querySelector('[data-action="support"]').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'OPEN_SUPPORT_HUB' });
    warningOverlay.remove();
  });
  
  warningOverlay.querySelector('[data-action="report-guide"]').addEventListener('click', () => {
    chrome.runtime.sendMessage({ 
      type: 'OPEN_SUPPORT_HUB', 
      url: 'https://safespace-ai.repl.co/resources#reporting' 
    });
    warningOverlay.remove();
  });
  
  // Close on backdrop click
  warningOverlay.addEventListener('click', (e) => {
    if (e.target === warningOverlay) {
      warningOverlay.remove();
    }
  });
}

// Listen for settings updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SETTINGS_UPDATED') {
    settings = message.settings;
    console.log('Settings updated:', settings);
  }
  sendResponse({ received: true });
});

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
