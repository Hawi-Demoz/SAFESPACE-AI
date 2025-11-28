/**
 * SafeSpace AI - Lightweight Toxicity Detection Model
 * Runs entirely in the browser - no server required
 * 
 * Categories detected:
 * - harassment: Insults, personal attacks, bullying
 * - threats: Physical harm, violence, intimidation
 * - sexual_coercion: Unwanted sexual advances, blackmail
 * - hate_speech: Discrimination based on identity
 * - identity_attack: Attacks on personal identity/characteristics
 * - manipulation: Emotional manipulation, gaslighting
 */

const ToxicityModel = {
  // Weighted keyword patterns for each category
  patterns: {
    harassment: {
      keywords: [
        'stupid', 'idiot', 'dumb', 'worthless', 'pathetic', 'loser', 
        'ugly', 'fat', 'disgusting', 'shut up', 'nobody cares', 'useless',
        'moron', 'retard', 'freak', 'weirdo', 'creep', 'trash',
        'you suck', 'go away', 'nobody likes you', 'kill yourself'
      ],
      weight: 1.0
    },
    threats: {
      keywords: [
        'kill you', 'hurt you', 'harm you', 'attack you', 'destroy you',
        'you will die', 'watch your back', 'be careful', 'i know where',
        'find you', 'get you', 'coming for you', 'make you pay',
        'regret this', 'beat you', 'punch you', 'break your'
      ],
      weight: 1.5
    },
    sexual_coercion: {
      keywords: [
        'send pics', 'send photos', 'send nudes', 'show me', 
        'meet me alone', 'come over', 'secret between us',
        'dont tell anyone', 'if you loved me', 'prove you love',
        'nobody will know', 'just us', 'private photos'
      ],
      weight: 1.5
    },
    hate_speech: {
      keywords: [
        'hate you', 'despise', 'scum', 'vermin', 'plague',
        'dont deserve', 'inferior', 'subhuman', 'go back to',
        'all you people', 'your kind'
      ],
      weight: 1.3
    },
    identity_attack: {
      keywords: [
        'because youre a', 'all women', 'all men', 'typical',
        'just like all', 'your kind', 'people like you',
        'you people', 'those people', 'of course you would'
      ],
      weight: 1.2
    },
    manipulation: {
      keywords: [
        'if you loved me', 'prove it', 'you owe me', 'after all i did',
        'ungrateful', 'selfish', 'you made me', 'its your fault',
        'nobody else will', 'youre crazy', 'youre imagining',
        'thats not what happened', 'youre too sensitive'
      ],
      weight: 1.1
    }
  },

  // Context amplifiers increase severity
  amplifiers: ['very', 'so', 'really', 'extremely', 'totally', 'absolutely', 'fucking', 'damn'],
  
  // Mitigators reduce severity
  mitigators: ['maybe', 'kind of', 'sort of', 'perhaps', 'just kidding', 'jk', 'lol', 'haha', 'joking'],

  /**
   * Analyze text for toxicity
   * @param {string} text - Text to analyze
   * @returns {Object} Analysis result
   */
  analyze(text) {
    if (!text || typeof text !== 'string' || text.length < 3) {
      return { isToxic: false, confidence: 0, categories: {}, severity: 'safe' };
    }

    const lowerText = text.toLowerCase().trim();
    const categories = {};
    const flaggedPatterns = [];
    let totalScore = 0;
    let maxScore = 0;

    // Check each category
    for (const [category, data] of Object.entries(this.patterns)) {
      let categoryScore = 0;
      
      for (const keyword of data.keywords) {
        if (lowerText.includes(keyword)) {
          flaggedPatterns.push({ keyword, category });
          
          // Base score
          let score = 0.4 * data.weight;
          
          // Context window around the match
          const idx = lowerText.indexOf(keyword);
          const contextStart = Math.max(0, idx - 30);
          const contextEnd = Math.min(lowerText.length, idx + keyword.length + 30);
          const context = lowerText.substring(contextStart, contextEnd);
          
          // Amplifier check
          if (this.amplifiers.some(amp => context.includes(amp))) {
            score += 0.15;
          }
          
          // Mitigator check
          if (this.mitigators.some(mit => context.includes(mit))) {
            score -= 0.2;
          }
          
          // Intensity markers
          if (text.match(/!{2,}/)) score += 0.1;
          if (text.match(/[A-Z]{5,}/)) score += 0.1;
          
          categoryScore = Math.max(categoryScore, Math.min(score, 1.0));
        }
      }
      
      if (categoryScore > 0) {
        categories[category] = Math.round(categoryScore * 100) / 100;
        totalScore += categoryScore;
        maxScore = Math.max(maxScore, categoryScore);
      }
    }

    // Calculate overall confidence
    const categoryCount = Object.keys(categories).length;
    const confidence = categoryCount > 0 
      ? Math.min(maxScore + (categoryCount * 0.05), 0.99)
      : 0;

    // Determine severity level
    let severity = 'safe';
    if (confidence > 0.7) severity = 'high';
    else if (confidence > 0.5) severity = 'medium';
    else if (confidence > 0.3) severity = 'low';

    return {
      isToxic: confidence > 0.3,
      confidence: Math.round(confidence * 100) / 100,
      categories,
      severity,
      flaggedPatterns: flaggedPatterns.slice(0, 5),
      primaryCategory: Object.keys(categories)[0] || null
    };
  },

  /**
   * Get human-readable category name
   */
  getCategoryLabel(category) {
    const labels = {
      harassment: 'Harassment',
      threats: 'Threat',
      sexual_coercion: 'Sexual Coercion',
      hate_speech: 'Hate Speech',
      identity_attack: 'Identity Attack',
      manipulation: 'Manipulation'
    };
    return labels[category] || category;
  },

  /**
   * Get severity color
   */
  getSeverityColor(severity) {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#eab308',
      safe: '#22c55e'
    };
    return colors[severity] || colors.safe;
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ToxicityModel;
}
