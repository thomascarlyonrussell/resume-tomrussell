Feature: Chat Widget UI
  As a visitor to Tom's portfolio
  I want to interact with the chatbot widget
  So that I can learn about Tom through conversation

  Scenario: Initial page load
    Given a visitor loads the page
    When the page finishes loading
    Then the chat widget appears in collapsed state at center-bottom

  Scenario: Opening the chat
    Given the widget is collapsed
    When the visitor clicks it
    Then the chat interface expands
    And the visitor sees a welcome message and starter prompts

  Scenario: Closing the chat
    Given the chat is expanded
    When the visitor clicks a close button
    Then the chat collapses
    And conversation history is preserved for the session
