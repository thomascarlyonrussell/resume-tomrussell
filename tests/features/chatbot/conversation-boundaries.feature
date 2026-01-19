Feature: Conversation Boundaries
  As a visitor
  I want the chatbot to maintain appropriate boundaries
  So that I know what topics are appropriate to discuss

  Scenario: Personal question
    Given the visitor asks about Tom's personal life "What are Tom's hobbies?"
    When the question is outside professional scope
    Then the AI politely declines
    And suggests focusing on professional topics

  Scenario: Salary question
    Given the visitor asks about salary expectations "What is Tom's salary expectation?"
    When processing the sensitive request
    Then the AI explains it can't discuss compensation
    And provides contact information for direct inquiry
