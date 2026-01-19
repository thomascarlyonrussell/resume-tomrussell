Feature: Contact Section
  As a visitor interested in connecting
  I want to find Tom's contact information
  So that I can reach out to him

  Scenario: Contacting Tom
    Given a visitor wants to contact Tom
    When they scroll to the Contact section
    Then they can find email link
    And they can find LinkedIn link
    And they can find GitHub link
