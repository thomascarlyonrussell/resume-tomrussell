Feature: Error Handling
  As a visitor
  I want graceful error handling
  So that I can recover from errors

  Scenario: API error
    Given a network or API error occurs
    When the AI cannot generate a response
    Then an error message displays
    And the visitor can retry their message

  Scenario: Rate limiting
    Given the free tier rate limit is reached
    When this occurs
    Then the user sees a friendly message
    And is informed they can try again shortly
