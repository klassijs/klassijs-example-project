@larryg
Feature: Activating the Schedule a meeting link opens a usable scheduling interface

  Background:
    Given a visitor opens the website

  @BR-004 @AT-004 @TC-004
  Scenario: User activates the Schedule a meeting link and a usable scheduling interface opens
    Then the Schedule a meeting is displayed
    When the visitor activates the Schedule a meeting link
    Then a usable scheduling interface opens, allowing the visitor to continue or return to the website

  @BR-005 @AT-005 @TC-005
  Scenario Outline: User activates the Schedule a meeting link with different display states
    Then a usable scheduling interface opens, allowing the visitor to continue or return to the website
    Examples:
      | display_state |
      | example1 |

  @BR-006 @AT-006 @TC-006
  Scenario: User activates the Schedule a meeting link and no scheduling interface opens
    Then the Schedule a meeting is displayed
    When the visitor activates the Schedule a meeting link
    Then no scheduling interface opens and the visitor remains on the current page

  @BR-007 @AT-007 @TC-007
  Scenario: User attempts to activate the Schedule a meeting link when it is not displayed
    When Schedule a meeting is not displayed the visitor attempts to activate the Schedule a meeting link
    Then no action occurs and the visitor remains on the current page

  @BR-008 @AT-008 @TC-008
  Scenario: User activates the Schedule a meeting link and encounters an error in opening the interface
    Then the Schedule a meeting is displayed
    When the visitor activates the Schedule a meeting link
    Then an error message is displayed indicating the scheduling interface could not be opened
