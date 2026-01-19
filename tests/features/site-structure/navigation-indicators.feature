Feature: Navigation Indicators
  As a visitor
  I want to know where I am on the page
  So that I can understand my progress through the content

  Scenario: Scroll progress
    Given a visitor is scrolling through the site
    When they are partway through
    Then they have some indication of their position
