# AGENTS.md

## Coding Style

Use two-space indentation, single quotes, semicolons, and trailing commas in multiline constructs. Use `PascalCase` for classes/interfaces, `camelCase` for functions and variables, and `ALL_CAPS` for constants. Prefix booleans with `is`, `has`, `can`, or `should`; include units such as `timeoutMs`.

## Best Practices

Use `const` by default and never `var`; use strict equality. Keep functions small, avoid deeply nested control flow, and do not mutate inputs or use `arguments`. Keep code self-documenting, adding comments only for non-obvious decisions. Represent missing values explicitly under strict TypeScript options.

## Optimization Guidelines

Choose collections deliberately: use `Map` for dynamic dictionaries, `Set` for large or frequently queried collections, and arrays for short lists. Prefer fixed property access. Keep hot functions monomorphic with stable argument and return types, initialize object fields consistently, and reuse allocations only when ownership and correctness remain clear.

## API Guidelines

no local state/cache (unless already implemented)

## Tests

no need for that now

## NestJS

This app's version of NestJS is likely newer than what you know. https://docs.nestjs.com/llms.txt indexes its documentation, with a markdown page per chapter.

## URL shortener

Bitly like app to shorten urls

## Functional requirments

- submit long URL and get a unique short one instead
- optionally support a custom alias instead-of random id
- optionally support an expiration time
- get redirect from the short URL to a long one

# Misc requirments

- short id length no more than 6 symols

## Entities

- URL

## API

POST /urls {original, alias?, expireMs?} -> 200 {shortId}
GET /:shortId -> 302 to original or 404

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
