Feature: Starter Prompts
  As a new visitor
  I want to see suggested questions
  So that I know what to ask the chatbot

  Scenario: Using a starter prompt
    Given the chat just opened with no messages
    When the visitor clicks a starter prompt button "What projects has Tom worked on?"
    Then that prompt is sent as their message
    And the AI responds accordingly
