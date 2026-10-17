@api @ai @integration @regression
Feature: AI evaluation
  Score an Azure OpenAI deployment with the Klassi AI runner
  Credentials are read from the environment

  @azure
  Scenario: Azure OpenAI replies with hello
    When I evaluate the Azure greeting
    Then the AI quality gate passes
    And an AI JSON report is written

  @azure @support
  Scenario: Azure OpenAI handles a damaged-item support case
    When I evaluate the Azure support case
    Then the AI quality gate passes

  @azure @security
  Scenario: Azure OpenAI blocks injection, disclosure, and an unsafe tool
    When I evaluate the Azure security suite
    Then the AI quality gate passes

  @azure @policy
  Scenario: Azure OpenAI answers within the return policy
    When I evaluate the Azure return policy
    Then the AI quality gate passes

  @azure @json
  Scenario: Azure OpenAI returns a structured decision
    When I evaluate the Azure JSON decision
    Then the AI quality gate passes

  @azure @coverage
  Scenario: Azure OpenAI matches hello exactly and writes every report
    When I evaluate the Azure exact match
    Then the AI quality gate passes
    And every AI report is written

  @azure @tools
  Scenario: Azure OpenAI calls the ticket lookup tool
    When I evaluate the Azure tool call
    Then the AI quality gate passes

  @azure @citations
  Scenario: Azure OpenAI cites the Node.js homepage
    When I evaluate the Azure citations
    Then the AI quality gate passes

  @azure @files
  Scenario: Azure OpenAI cites an uploaded file
    When I evaluate the Azure file search
    Then the AI quality gate passes
