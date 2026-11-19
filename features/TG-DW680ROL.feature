Feature: Selecting the KlassiTech card opens the KlassiTech page

  Background:
    Given a visitor opens the website

  @BR-006 @AT-006 @TC-006
  Scenario: Visitor selects the KlassiTech card from the homepage and sees the KlassiTech page
    Then the KlassiTech page opens and displays Explore Our Solutions

  @BR-007 @AT-007 @TC-007
  Scenario: Visitor selects the KlassiTech card multiple times and still sees the KlassiTech page
    Then the KlassiTech page opens and displays Explore Our Solutions each time
