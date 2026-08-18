import { describe, test, expect } from 'vitest';
import { getRank } from './rankLogic';

describe('Daily Boot Rank Calculation', () => {
    test('returns SCRIPTER for baseline users under 300 points', () => {
        expect(getRank(150)).toBe('SCRIPTER');
    });

    test('returns CONSOLE WARRIOR at the 300 point threshold', () => {
        expect(getRank(300)).toBe('CONSOLE WARRIOR');
    });

    test('returns LOGIC KNIGHT at the 800 point threshold', () => {
        expect(getRank(800)).toBe('LOGIC KNIGHT');
    });

    test('returns SYSTEM ARCHITECT for scores above 1500', () => {
        expect(getRank(1600)).toBe('SYSTEM ARCHITECT');
    });

    test('returns TIER 1 ELITE for maximum prestige scores above 2500', () => {
        expect(getRank(3000)).toBe('TIER 1 ELITE');
    });
});