Feature: Responsive Design
  As a visitor on any device
  I want the site to work well on my screen size
  So that I can access all content regardless of device

  Scenario: Mobile viewing
    Given a visitor on a mobile device
    When they view the site
    Then all content is readable and accessible
    And visualizations adapt to smaller screens
    And the chatbot remains usable
