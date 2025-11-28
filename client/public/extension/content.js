// Mock Content Script
console.log("SafeSpace AI Protection Active");

// Simple keyword matcher for demo purposes
const TOXIC_KEYWORDS = ['stupid', 'hate', 'kill', 'ugly', 'idiot', 'attack'];

function scanPage() {
  const text = document.body.innerText;
  const found = TOXIC_KEYWORDS.filter(word => text.toLowerCase().includes(word));
  
  if (found.length > 0) {
    console.warn("SafeSpace: Potential harmful content detected:", found);
    // In a real extension, this would trigger an overlay or alert
  }
}

// Run scan periodically
setInterval(scanPage, 5000);
