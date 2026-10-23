export const lifeCategories = [
  { id: 'endowment', name: 'Endowment Plans', description: 'Savings and protection combined for long-term goals.', icon: 'shield' },
  { id: 'whole-life', name: 'Whole Life Plans', description: 'Lifelong coverage ensuring your legacy is protected.', icon: 'infinity' },
  { id: 'money-back', name: 'Money Back Plans', description: 'Periodic returns to meet milestones along the journey.', icon: 'coins' },
  { id: 'term', name: 'Term Plans', description: 'Pure protection ensuring high cover at affordable premiums.', icon: 'umbrella' },
  { id: 'pension', name: 'Annuity Plans', description: 'Build dependable retirement income for financial independence later.', icon: 'wallet' },
  { id: 'ulip', name: 'Unit Linked Plans', description: 'Market-linked growth potential combined with life cover.', icon: 'chart' },
  { id: 'child', name: 'Child Plans', description: "Secure your child's education, milestones and future.", icon: 'graduation' },
];

export const getLifeCategory = (id) => lifeCategories.find((item) => item.id === id);
