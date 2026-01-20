/**
 * Unit tests for TimelineArea milestone markers
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { TimelineArea } from './TimelineArea';

// Mock ResizeObserver
class ResizeObserverMock {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe(target: Element) {
    // Mock the offsetWidth and offsetHeight properties
    Object.defineProperty(target, 'offsetWidth', { value: 800, configurable: true });
    Object.defineProperty(target, 'offsetHeight', { value: 400, configurable: true });

    // Simulate dimensions being set
    this.callback([{
      target,
      contentRect: { width: 800, height: 400 } as DOMRectReadOnly,
      borderBoxSize: [],
      contentBoxSize: [],
      devicePixelContentBoxSize: [],
    }], this);
  }
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// Mock the hooks to simplify testing
vi.mock('./hooks/useTimelineData', () => ({
  useTimelineData: vi.fn(() => ({
    data: [
      { year: 2011, month: 1, date: '2011-01', engineering: 5, 'software-development': 0, 'product-management': 0 },
      { year: 2015, month: 1, date: '2015-01', engineering: 15, 'software-development': 5, 'product-management': 0 },
      { year: 2019, month: 1, date: '2019-01', engineering: 10, 'software-development': 10, 'product-management': 10 },
      { year: 2024, month: 1, date: '2024-01', engineering: 8, 'software-development': 15, 'product-management': 15 },
    ],
    categories: [
      { id: 'engineering', name: 'Engineering', color: '#3B82F6' },
      { id: 'software-development', name: 'Software Development', color: '#10B981' },
      { id: 'product-management', name: 'Product Management', color: '#8B5CF6' },
    ],
  })),
  useSkillTimelineData: vi.fn(() => null),
}));

// Mock the reduced motion hook
vi.mock('./hooks', () => ({
  useReducedMotion: vi.fn(() => true), // Disable animations for testing
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('TimelineArea Milestone Markers', () => {
  it('renders milestone badges', () => {
    render(<TimelineArea />);

    // Check that milestone badges are rendered
    const badges = screen.getAllByTestId('milestone-badge');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('shows milestone tooltip on hover', async () => {
    render(<TimelineArea />);

    // Find a milestone badge
    const badges = screen.getAllByTestId('milestone-badge');
    const firstBadge = badges[0];

    // Hover over the badge
    fireEvent.mouseEnter(firstBadge);

    // Check that the tooltip appears
    const tooltip = await screen.findByTestId('milestone-tooltip');
    expect(tooltip).toBeInTheDocument();
  });

  it('renders the timeline chart container', () => {
    render(<TimelineArea />);

    const container = screen.getByTestId('timeline-area');
    expect(container).toBeInTheDocument();
  });

  it('renders with expected class for chart container', () => {
    render(<TimelineArea />);

    const container = screen.getByTestId('timeline-area');
    expect(container.className).toContain('relative');
  });

  it('renders category legend items', () => {
    render(<TimelineArea />);

    // Check that category legend is rendered
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Software Development')).toBeInTheDocument();
    expect(screen.getByText('Product Management')).toBeInTheDocument();
  });

  it('shows "Career Milestones" section', () => {
    render(<TimelineArea />);

    expect(screen.getByText('★ Career Milestones')).toBeInTheDocument();
  });

  it('renders SVG overlay for milestone markers when dimensions are set', async () => {
    const { container } = render(<TimelineArea />);

    // Wait for useEffect to process
    await new Promise(resolve => setTimeout(resolve, 50));

    // The ResizeObserver mock triggers with dimensions, so SVG should render
    // Look for the milestone-markers-overlay SVG
    const overlay = container.querySelector('[data-testid="milestone-markers-overlay"]');

    // The overlay should exist when dimensions are set
    expect(overlay).toBeInTheDocument();

    if (overlay) {
      // Check for polygon elements (diamond markers)
      const polygons = overlay.querySelectorAll('polygon');
      expect(polygons.length).toBeGreaterThan(0);

      // Check that each marker is wrapped in a group for interaction
      const groups = overlay.querySelectorAll('g');
      expect(groups.length).toEqual(polygons.length);
    }
  });

  it('renders diamond markers with correct SVG attributes', async () => {
    const { container } = render(<TimelineArea />);

    // Wait for useEffect to process
    await new Promise(resolve => setTimeout(resolve, 50));

    const overlay = container.querySelector('[data-testid="milestone-markers-overlay"]');

    if (overlay) {
      // Check that polygons have the correct fill color (cyan)
      const polygons = overlay.querySelectorAll('polygon');
      if (polygons.length > 0) {
        const firstPolygon = polygons[0];
        expect(firstPolygon.getAttribute('fill')).toBe('#06B6D4'); // MILESTONE_COLOR
      }
    }
  });
});
