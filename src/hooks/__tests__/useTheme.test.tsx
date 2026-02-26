/// <reference types="vitest" />
import { render, act } from '@testing-library/react';
import { useTheme, getThemeGlowColor, ThemeColor } from '../useTheme';

describe('useTheme hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function setup(initial?: ThemeColor) {
    let hookValue: ReturnType<typeof useTheme>;
    const Component = () => {
      hookValue = useTheme(initial as any);
      return null;
    };
    const { rerender } = render(<Component />);
    return {
      get value() {
        return hookValue!;
      },
      rerender,
    };
  }

  it('initializes with default theme when none saved', () => {
    const { value } = setup();
    expect(value.theme).toBe('blue');
  });

  it('reads theme from localStorage if valid', () => {
    localStorage.setItem('theme', 'green');
    const { value } = setup('purple');
    expect(value.theme).toBe('green');
  });

  it('changes theme and persists to localStorage', () => {
    const result = setup();
    act(() => {
      result.value.changeTheme('purple');
    });
    result.rerender();
    expect(result.value.theme).toBe('purple');
    expect(localStorage.getItem('theme')).toBe('purple');
  });

  it('returns correct glow color for each theme', () => {
    const mapping: Record<ThemeColor, string> = {
      blue: '#3b82f6',
      green: '#22c55e',
      purple: '#a855f7',
    };
    (Object.keys(mapping) as ThemeColor[]).forEach((color) => {
      expect(getThemeGlowColor(color)).toBe(mapping[color]);
    });
  });
});
