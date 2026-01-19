Feature: Response Behavior
  As a visitor
  I want helpful and accurate responses
  So that I can trust the information I receive

  Scenario: Accurate response
    Given the visitor asks about Tom's experience with a specific technology "Python"
    When the technology is in the knowledge base
    Then the AI provides accurate details
    And may mention related projects or context

  Scenario: Unknown information
    Given the visitor asks about something not in the knowledge base "What is Tom's favorite color?"
    When the AI cannot find relevant information
    Then it honestly states it doesn't have that information
    And suggests the visitor contact Tom directly for details
