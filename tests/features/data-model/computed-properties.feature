Feature: Computed Properties
  As a developer
  I want derived values calculated automatically
  So that visualizations have the data they need

  Scenario: Time calculation
    Given a skill started "2020-01"
    When computing timeInvested in 2025
    Then it returns approximately 5 years
