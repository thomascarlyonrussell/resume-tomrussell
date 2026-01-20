Feature: Model Flexibility
  As a developer
  I want the chatbot to support swapping LLM models
  So that I can configure different models without changing code

  Background:
    Given the chatbot uses OpenRouter as the LLM gateway
    And the implementation abstracts model selection from the UI

  Scenario: Model configuration via environment variable
    Given an environment variable specifies a model
    When the app starts
    Then it uses the configured model
    And the chatbot responds using that model's capabilities

  Scenario: Default model fallback
    Given no environment variable specifies a model
    When the app starts
    Then it uses the default free-tier model (e.g., Llama 3.3 or Mistral Small)
    And the chatbot functions normally with the default model

  Scenario: Model configuration without UI changes
    Given the model is configured via environment
    When switching between different models
    Then the UI and user experience remain unchanged
    And only the backend model provider differs
