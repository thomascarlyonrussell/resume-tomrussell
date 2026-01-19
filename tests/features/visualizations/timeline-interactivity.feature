Feature: Timeline Interactivity
  As a visitor
  I want to explore specific points in time
  So that I can see what skills Tom had at different career stages

  Scenario: Time exploration
    Given the user hovers at a specific year on the timeline
    When the hover occurs
    Then a tooltip shows all skills active at that point
    And any milestones from that year are highlighted
