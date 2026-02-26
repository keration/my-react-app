import { render, screen } from '@testing-library/react';
import UserProfile from '../UserProfile';
import { ThemeProvider } from '@/contexts/ThemeContext';

/// <reference types="vitest" />

describe('UserProfile component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderWithTheme = (theme: string, props: any) => {
    localStorage.setItem('theme', theme);
    return render(
      <ThemeProvider>
        <UserProfile {...props} />
      </ThemeProvider>
    );
  };

  it('displays name, intro and avatar alt text', () => {
    renderWithTheme('blue', { name: 'Carol', avatar: 'c.png', intro: 'hey there' });
    expect(screen.getByRole('heading', { name: 'Carol' })).toBeInTheDocument();
    expect(screen.getByText('hey there')).toBeInTheDocument();
    const img = screen.getByRole('img', { name: 'Carol' }) as HTMLImageElement;
    expect(img.src).toContain('c.png');
  });

  it('applies pink text style when theme is purple', () => {
    renderWithTheme('purple', { name: 'Dave', avatar: 'd.png', intro: 'intro' });
    const heading = screen.getByRole('heading', { name: 'Dave' });
    expect(heading).toHaveClass('text-pink-200');
  });

  it('applies white text style when theme is not purple', () => {
    renderWithTheme('green', { name: 'Eve', avatar: 'e.png', intro: 'hello' });
    const heading = screen.getByRole('heading', { name: 'Eve' });
    expect(heading).toHaveClass('text-white');
  });
});
