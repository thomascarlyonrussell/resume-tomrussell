Feature: Navigation Indicators
  As a visitor
  I want to know where I am on the page
  So that I can understand my progress through the content

  Background:
    Given the site provides visual indicators with interactive navigation
    And the navigation displays the currently active section with a larger, colored dot
    And allows clicking to jump directly to any section

  Scenario: Scroll progress
    Given a visitor is scrolling through the site
    When they are partway through
    Then they see which section is active via the navigation dots
    And they can hover over dots to see section labels
    And they can click dots to jump to sections

  Scenario: Hover interaction
    Given a visitor sees the navigation component
    When they hover over any navigation dot
    Then a tooltip appears showing the section label
    And the tooltip helps identify section names without cluttering the UI

  Scenario: Keyboard accessibility
    Given a visitor using keyboard navigation
    When they tab to the navigation component
    Then focus indicators appear on each dot
    And they can use Enter or Space to jump to sections

