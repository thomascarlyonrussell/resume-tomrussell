Feature: Publication Structure
  As a developer
  I want publications to be structured
  So that they can be displayed and referenced properly

  Scenario: Publication with full details
    Given a research paper "Electric Vehicle Impact on Distribution Grid"
    When it is added to the data
    Then it includes id, title, type and optional metadata
    And includes date, description, and url if available

  Scenario: Regulatory filing publication
    Given a regulatory filing "PG&E Electric Distribution Resource Plan"
    When it is added to the publications data
    Then it can be displayed on the About section or timeline
    And referenced in the chatbot knowledge base

  Scenario: Undated publication
    Given a publication without a specific publication date
    When the date field is null
    Then the publication can still be displayed without temporal placement
    And all other publication details remain accessible

