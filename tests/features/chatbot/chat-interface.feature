Feature: Chat Interface
  As a visitor
  I want to interact with the chat interface
  So that I can send messages and receive responses

  Scenario: Sending a message
    Given the chat is open
    When the visitor types a message "Hello" and presses Enter
    Then the message appears in the chat
    And a loading indicator appears
    And the AI response streams in

  Scenario: Message history
    Given an ongoing conversation with multiple messages
    When the visitor scrolls up in the message area
    Then they can see previous messages in the conversation
