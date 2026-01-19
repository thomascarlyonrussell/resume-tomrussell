Feature: Visualization Section
  As a visitor
  I want to explore Tom's skills visually
  So that I can understand his capabilities

  Scenario: Default view
    Given a visitor scrolls to the Visualization section
    When the section comes into view
    Then one view is displayed by default

  Scenario: View toggle
    Given the visitor is viewing the Visualization section
    When they click the toggle control
    Then the view smoothly transitions to the alternate visualization
