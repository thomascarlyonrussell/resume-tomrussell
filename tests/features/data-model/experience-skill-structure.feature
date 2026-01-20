Feature: Experience Skill Structure
  As a developer
  I want experiences to define skill proficiency levels
  So that skill timelines and proficiency can be accurately computed

  Background:
    Given the new data model where proficiency is stored at the experience level
    And each experience has a skills array of ExperienceSkill objects

  Scenario: Experience with skill proficiencies
    Given an experience "Product Manager, VP at Integral Analytics"
    When defining skills used in this role
    Then each skill includes both the skill ID and the proficiency level achieved
    And the proficiency reflects the level attained during that specific role

  Scenario: Skill proficiency in experience structure
    Given an experience that used "Neo4j"
    When adding "Neo4j" to the experience skills
    Then the entry includes skillId "neo4j" and proficiency 5
    And the proficiency reflects the level achieved during that role
