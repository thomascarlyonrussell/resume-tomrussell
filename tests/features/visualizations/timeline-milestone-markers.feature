Feature: Timeline Milestone Markers
  As a visitor
  I want to see important milestones on the timeline
  So that I can understand key achievements in Tom's career

  Scenario: Milestone visibility
    Given a milestone exists in the data
    When viewing the timeline
    Then a marker appears at the milestone position
    And hovering shows the milestone details
