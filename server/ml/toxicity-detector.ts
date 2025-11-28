// Lightweight toxicity detection using keyword matching and pattern analysis
// In production, this would use a real ML model like DistilBERT or unitary/toxic-bert

interface ToxicityResult {
  isToxic: boolean;
  confidence: number;
  categories: {
    harassment?: number;
    threats?: number;
    sexual_coercion?: number;
    hate?: number;
    identity_attack?: number;
    manipulation?: number;
  };
  flaggedPatterns: string[];
}

// Weighted keyword lists for different harm categories
const PATTERNS = {
  harassment: [
    'stupid', 'idiot', 'dumb', 'worthless', 'pathetic', 'loser', 
    'ugly', 'fat', 'disgusting', 'shut up', 'nobody cares'
  ],
  threats: [
    'kill', 'hurt', 'harm', 'attack', 'destroy', 'die', 
    'careful', 'watch out', 'regret', 'pay for', 'get you'
  ],
  sexual_coercion: [
    'send pics', 'send photo', 'meet me', 'come over', 
    'alone', 'private', 'secret', 'dont tell'
  ],
  hate: [
    'hate you', 'despise', 'scum', 'trash', 'garbage',
    'deserve', 'inferior'
  ],
  identity_attack: [
    'because you\'re a', 'all women', 'typical', 'just like',
    'your kind', 'people like you'
  ],
  manipulation: [
    'if you loved me', 'prove it', 'owe me', 'after all i',
    'ungrateful', 'selfish', 'you made me'
  ]
};

// Context amplifiers - these words increase severity when combined
const AMPLIFIERS = ['very', 'so', 'really', 'extremely', 'totally', 'absolutely'];

// Mitigators - these reduce severity
const MITIGATORS = ['maybe', 'kind of', 'sort of', 'perhaps', 'just kidding', 'jk', 'lol', 'haha'];

export function analyzeToxicity(text: string): ToxicityResult {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  const categories: ToxicityResult['categories'] = {};
  const flaggedPatterns: string[] = [];
  let totalScore = 0;
  let matchCount = 0;

  // Check each category
  for (const [category, patterns] of Object.entries(PATTERNS)) {
    let categoryScore = 0;
    
    for (const pattern of patterns) {
      if (lowerText.includes(pattern)) {
        flaggedPatterns.push(pattern);
        
        // Base score for match
        let score = 0.3;
        
        // Check for amplifiers near the pattern
        const patternIndex = lowerText.indexOf(pattern);
        const contextWindow = lowerText.substring(
          Math.max(0, patternIndex - 20),
          Math.min(lowerText.length, patternIndex + pattern.length + 20)
        );
        
        if (AMPLIFIERS.some(amp => contextWindow.includes(amp))) {
          score += 0.2;
        }
        
        if (MITIGATORS.some(mit => contextWindow.includes(mit))) {
          score -= 0.15;
        }
        
        // Multiple exclamation marks or all caps increases severity
        if (text.match(/!{2,}/)) score += 0.1;
        if (text === text.toUpperCase() && text.length > 10) score += 0.15;
        
        categoryScore = Math.max(categoryScore, score);
        matchCount++;
      }
    }
    
    if (categoryScore > 0) {
      categories[category as keyof typeof categories] = Math.min(categoryScore, 1.0);
      totalScore += categoryScore;
    }
  }

  // Calculate overall confidence
  const confidence = matchCount > 0 
    ? Math.min(totalScore / matchCount + (matchCount * 0.05), 0.99)
    : 0;

  return {
    isToxic: confidence > 0.3,
    confidence: Math.round(confidence * 100) / 100,
    categories,
    flaggedPatterns: [...new Set(flaggedPatterns)].slice(0, 5) // Limit to 5
  };
}

// Batch analysis for efficiency
export function analyzeBatch(texts: string[]): ToxicityResult[] {
  return texts.map(analyzeToxicity);
}
