Feature: Hero Section
  As a new visitor
  I want an impactful introduction
  So that I immediately understand whose portfolio this is

  Scenario: First impression
    Given a new visitor arrives at the site
    When the Hero section loads
    Then Tom's name is immediately visible
    And the visitor understands this is a professional portfolio
