Feature: Visualization Accessibility
  As a visitor with accessibility needs
  I want to interact with visualizations using keyboard or screen reader
  So that I can access the information regardless of my abilities

  Scenario: Screen reader user
    Given a user with a screen reader
    When they navigate to the visualization section
    Then they hear a summary description of the data
    And can access individual skill information

  Scenario: Keyboard navigation
    Given a keyboard-only user
    When they tab into the visualization
    Then they can navigate between skill elements
    And access tooltips with Enter or Space
