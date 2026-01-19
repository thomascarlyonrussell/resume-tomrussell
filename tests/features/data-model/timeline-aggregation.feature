Feature: Timeline Aggregation
  As a developer
  I want data aggregated by category over time
  So that the timeline visualization can show career progression

  Scenario: Category growth over time
    Given multiple skills in "software-development" category
    When viewed on timeline from 2015-2025
    Then the area shows growth as skills were added over time
