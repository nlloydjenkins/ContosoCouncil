---
mode: ask
tools: [security]
description: Perform a security review of the current project.
---

# Security Review Prompt

## Objective
Conduct a thorough security review of the ContosoCouncil project to identify vulnerabilities and ensure compliance with best practices.

## Instructions
1. Analyze the codebase for common security vulnerabilities, such as:
   - SQL injection
   - Cross-site scripting (XSS)
   - Cross-site request forgery (CSRF)
   - Insecure authentication and authorization mechanisms
2. Review dependencies for known vulnerabilities using tools like `npm audit` or `yarn audit`.
3. Check for proper use of environment variables and secure storage of sensitive data.
4. Verify compliance with OWASP security guidelines.
5. Ensure secure handling of user input and output.

## Expected Output
- A list of identified vulnerabilities with severity levels.
- Recommendations for mitigating each vulnerability.
- Confirmation of compliance with security best practices.

## References
- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm audit Documentation](https://docs.npmjs.com/cli/v7/commands/npm-audit)
