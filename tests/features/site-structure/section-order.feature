Feature: Section Order
  As a visitor
  I want sections in a logical order
  So that I can follow Tom's story naturally

  Scenario: Complete page scroll
    Given a visitor at the top of the page
    When they scroll through the entire page
    Then they encounter Hero section first
    And then About section
    And then Visualizations section
    And finally Contact section
