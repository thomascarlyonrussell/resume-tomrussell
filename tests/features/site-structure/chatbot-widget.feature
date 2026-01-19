Feature: Chatbot Widget
  As a visitor
  I want to access the chatbot from anywhere on the page
  So that I can ask questions while exploring

  Scenario: Opening chat
    Given the visitor is on any section of the page
    When they click the chat widget
    Then the chat interface expands
    And they can interact with the AI chatbot

  Scenario: Chat while scrolling
    Given the chat widget is open
    When the visitor scrolls the page
    Then the chat widget remains visible and functional
