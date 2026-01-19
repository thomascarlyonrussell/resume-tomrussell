Feature: Timeline Stacked Area Chart
  As a visitor
  I want to see how Tom's skills developed over time
  So that I can understand his career progression

  Scenario: Career progression
    Given Tom's career spans multiple years
    When viewing the timeline
    Then areas show categories building up over time
    And the total height increases as skills accumulate
