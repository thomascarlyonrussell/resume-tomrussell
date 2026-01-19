Feature: Responsive Sizing
  As a visitor on any device
  I want visualizations to adapt to my screen size
  So that I can view them on mobile, tablet, or desktop

  Scenario: Mobile viewport
    Given a mobile device with 375px width
    When viewing either visualization
    Then the content fits without horizontal scroll
    And interactions work via touch
