Feature: Contact Redirect
  As a recruiter or potential client
  I want to be directed to contact Tom directly for certain topics
  So that I can have detailed discussions

  Scenario: Hiring inquiry
    Given a recruiter asks about availability "Is Tom available for new opportunities?"
    When the AI recognizes a hiring context
    Then it provides helpful general info
    And suggests direct contact for specifics
