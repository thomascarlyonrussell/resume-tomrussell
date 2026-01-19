Feature: Skill Item Structure
  As a developer
  I want skill data to have a consistent structure
  So that visualizations and chatbot can use it reliably

  Scenario: Complete skill entry
    Given a skill "Python"
    When it is added to the data
    Then it includes id, name, category, subcategory, proficiency, and startDate

  Scenario: Active vs inactive skills
    Given a skill the user no longer actively uses
    When endDate is populated
    Then visualizations can distinguish current from past skills
