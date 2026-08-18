export const getRank = (score) => {
    if (score >= 2500) return 'TIER 1 ELITE';
    if (score >= 1500) return 'SYSTEM ARCHITECT';
    if (score >= 800) return 'LOGIC KNIGHT';
    if (score >= 300) return 'CONSOLE WARRIOR';
    return 'SCRIPTER';
};