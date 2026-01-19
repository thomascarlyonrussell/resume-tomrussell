Feature: Timeline Animation
  As a visitor
  I want smooth animations in the Timeline view
  So that I have an engaging visual experience

  Scenario: Timeline entrance
    Given the user switches to Timeline view
    When the animation plays
    Then areas grow from the start date toward present
    And the effect suggests career growth over time
