Feature: Chatbot Knowledge Format
  As a developer
  I want data exportable for LLM system prompts
  So that the chatbot can answer questions accurately

  Scenario: Chatbot query about skills
    Given the chatbot receives "What languages does Tom know?"
    When it queries the knowledge base
    Then it can find all skills in the programming subcategory

  Scenario: Chatbot query about publications
    Given the chatbot receives "What has Tom published?"
    When it queries the knowledge base
    Then it can list all publications with titles and descriptions

  Scenario: Chatbot query about education
    Given the chatbot receives "Where did Tom go to school?"
    When it queries the knowledge base
    Then it can provide education details
