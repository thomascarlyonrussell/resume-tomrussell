Feature: Fibonacci Interactivity
  As a visitor
  I want to interact with skills in the Fibonacci view
  So that I can see detailed information about specific skills

  Scenario: Hover interaction
    Given the user hovers over a skill element
    When the cursor is over "Python"
    Then a tooltip appears with Python's details
    And the element visually highlights

  Scenario: Touch interaction
    Given a mobile user
    When they tap a skill element
    Then the detail panel appears
    And they can tap elsewhere to dismiss
