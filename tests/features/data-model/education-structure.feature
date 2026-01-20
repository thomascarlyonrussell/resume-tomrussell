Feature: Education Structure
  As a developer
  I want education and certifications to be structured
  So that they can be displayed properly

  Scenario: Bachelor's degree
    Given a degree "BS Electrical Engineering" from Penn State
    When it is added to the education data
    Then it includes institution, degree, field, and date range
    And can be displayed in the About section

  Scenario: Professional certification
    Given a certification "Database Clinic: Neo4J" from LinkedIn Learning
    When it is added to the certifications data
    Then it includes name, issuer, and date obtained
    And can be referenced in skills context

  Scenario: Current education in progress
    Given a degree or certification that is currently in progress
    When endDate or expirationDate is null
    Then it displays as "In Progress" or "No Expiration"
    And the record remains valid and displayable

