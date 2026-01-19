Feature: Milestone Structure
  As a developer
  I want to track important achievements
  So that they can be displayed on the timeline

  Scenario: Project milestone
    Given a major project delivery "LoadSEER Next Launch"
    When added as a milestone
    Then it can be displayed on the timeline
    And linked to relevant skills
