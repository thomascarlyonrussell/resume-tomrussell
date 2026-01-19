Feature: Streaming Responses
  As a visitor
  I want to see responses appear progressively
  So that I don't have to wait for the entire response

  Scenario: Long response
    Given a question requiring a detailed answer "Tell me about Tom's career"
    When the AI generates the response
    Then text appears progressively
    And the user sees content before the full response completes
