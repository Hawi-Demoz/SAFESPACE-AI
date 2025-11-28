# SafeSpace AI Browser Extension

## Overview

The SafeSpace AI browser extension provides real-time protection against digital violence by detecting harmful content on web pages and giving you tools to respond safely.

## Features

### 1. Real-Time Harm Detection
- Scans web pages for harmful content automatically
- Detects: Harassment, Threats, Sexual Coercion, Hate Speech, Identity Attacks, Manipulation
- Runs entirely locally - no data sent to servers
- Configurable sensitivity levels (Low, Medium, High)

### 2. Warning Popups
- Visual warnings when harmful content is detected
- Color-coded severity indicators (Red = High, Orange = Medium, Yellow = Low)
- Quick action buttons for immediate response

### 3. Evidence Capture
- Save screenshots and text of harmful messages
- AES encryption before storage
- Secure local storage in browser
- Easy export to web app's Evidence Locker

### 4. Extension Settings
- Enable/disable protection
- Adjust detection sensitivity
- Manage saved evidence
- All settings stored securely in browser

### 5. Web App Integration
- Direct links to Support Hub
- Push evidence to main application
- Sync preferences across devices

## Installation

### Chrome / Edge
1. Download the extension folder
2. Go to `chrome://extensions/` (or `edge://extensions/`)
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `extension` folder
6. The SafeSpace AI icon should appear in your toolbar

### Firefox
1. Download the extension folder
2. Go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select any file in the `extension` folder
5. The extension will be loaded temporarily

## Usage

### Popup Interface
Click the SafeSpace AI icon in your browser toolbar to:
- See protection status
- View threat statistics
- Adjust sensitivity
- Access Support Hub
- Manage saved evidence

### On-Page Detection
When harmful content is detected:
1. A warning badge appears on the content
2. For high-severity threats, a popup modal opens
3. Choose an action:
   - **Hide Content**: Blurs the harmful message
   - **Save Evidence**: Encrypts and stores the content
   - **Get Support**: Opens the Support Hub
   - **How to Report**: Opens reporting guide

## Files

```
extension/
├── manifest.json       # Extension configuration
├── background.js       # Background service worker
├── contentScript.js    # Page scanning logic
├── contentStyles.css   # Warning overlay styles
├── toxicityModel.js    # Local ML model
├── popup.html          # Popup UI structure
├── popup.css           # Popup styles
├── popup.js            # Popup logic
└── icons/              # Extension icons
```

## Privacy & Security

- **Local Processing**: All toxicity detection runs in your browser
- **No Data Leakage**: No user data is sent to external servers
- **Encrypted Storage**: Evidence is encrypted before saving
- **Minimal Permissions**: Only requests necessary permissions

## Technical Details

### Toxicity Detection
The extension uses a lightweight keyword-based classifier with:
- Category-specific pattern matching
- Context amplifier/mitigator detection
- Confidence scoring
- Severity levels (safe, low, medium, high)

### Categories Detected
| Category | Description |
|----------|-------------|
| Harassment | Insults, personal attacks, bullying |
| Threats | Physical harm, violence, intimidation |
| Sexual Coercion | Unwanted advances, blackmail |
| Hate Speech | Discrimination based on identity |
| Identity Attack | Attacks on personal characteristics |
| Manipulation | Emotional manipulation, gaslighting |

### Browser Compatibility
- Chrome 88+ (Manifest V3)
- Edge 88+ (Manifest V3)
- Firefox 109+ (Manifest V3)

## Troubleshooting

### Extension not working?
1. Check if protection is enabled (toggle in popup)
2. Refresh the page
3. Ensure the site allows extensions

### False positives?
1. Lower the sensitivity level
2. Use the "Hide" button to dismiss warnings

### Need help?
Visit the Support Hub at: https://safespace-ai.repl.co/resources

## License

MIT License - Built for the UNiTE to End Digital Violence hackathon.

---

Built with ❤️ to protect women and girls online.
