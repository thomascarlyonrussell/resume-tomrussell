Feature: View Toggle
  As a visitor
  I want to switch between different visualization views
  So that I can explore Tom's skills from different perspectives

  Scenario: Toggle interaction
    Given the Fibonacci view is displayed
    When user clicks the Timeline toggle option
    Then the view transitions smoothly to Timeline
    And the toggle updates to show Timeline as active
