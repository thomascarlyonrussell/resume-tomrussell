Feature: Visualization Performance
  As a visitor
  I want visualizations to perform smoothly
  So that I have a pleasant user experience

  Scenario: Large dataset
    Given 50+ skills in the dataset
    When rendering either visualization
    Then performance remains smooth
    And animations don't stutter
