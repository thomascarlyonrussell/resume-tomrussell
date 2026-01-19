Feature: Knowledge Base
  As a visitor
  I want accurate information about Tom
  So that I can learn about his background and skills

  Scenario: Skills question
    Given the visitor asks "What programming languages does Tom know?"
    When the AI processes the question
    Then it retrieves relevant skills from the knowledge base
    And provides an accurate, detailed response

  Scenario: Project question
    Given the visitor asks about LoadSEER
    When the AI processes the question
    Then it provides accurate information about Tom's work on LoadSEER
