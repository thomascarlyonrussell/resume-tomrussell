Feature: Timeline Legend
  As a visitor
  I want to understand the timeline visualization
  So that I can interpret category colors and data representation

  Scenario: Legend clarity
    Given a first-time visitor viewing the Timeline
    When they look for explanation of the visualization
    Then they can reference the legend to understand category colors
    And the legend shows category names with their corresponding colors
    And the legend explains the stacked area representation
