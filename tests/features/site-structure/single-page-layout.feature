Feature: Single Page Layout
  As a visitor
  I want to scroll through a single page
  So that I can easily navigate the entire portfolio

  Scenario: Page load
    Given a visitor navigates to the site
    When the page loads
    Then all sections are accessible via scrolling
    And the page loads with the Hero section visible

  Scenario: Section navigation
    Given the visitor is on any section
    When they scroll down
    Then they smoothly transition to the next section
