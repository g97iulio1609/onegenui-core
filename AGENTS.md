# AGENTS.md - @onegenui/core

Core package containing types, validation, actions, visibility rules, and prompt generation.

## Purpose

This is the foundational package with zero React dependencies. It defines:
- **Types**: Core type definitions for elements, patches, and tree structures
- **Catalog**: Component registration and schema management
- **Validation**: Zod-based validation with built-in validators
- **Actions**: Action definitions with confirmation, success/error handlers
- **Visibility**: Conditional visibility rules (path-based, auth, logical operators)
- **Prompt Generation**: AI prompt construction from component catalog

## File Structure

```
src/
├── index.ts              # Public exports
├── types.ts              # Core type definitions (UIElement, Patch, etc.)
├── catalog.ts            # Component catalog registry
├── validation.ts         # Built-in validators (required, email, minLength, etc.)
├── actions.ts            # Action types and utilities
├── visibility.ts         # Visibility rule evaluation
├── component.ts          # Component definition helpers
└── prompt/               # Prompt generation for AI
    └── prompt-generator.ts
```

## Key Types

```typescript
// Core element structure
interface UIElement {
  key: string;
  type: string;
  props: Record<string, unknown>;
  children?: UIElement[];
}

// Streaming patches
interface Patch {
  op: 'add' | 'replace' | 'remove';
  path: string;
  value?: unknown;
}

// Component definition
interface ComponentDefinition {
  name: string;
  props: ZodSchema;
  description: string;
  hasChildren?: boolean;
}
```

## Development Guidelines

- No React imports - this package must remain framework-agnostic
- All schemas use Zod v4
- Export types alongside runtime code
- Keep validation functions pure and side-effect free

## Refactoring Priorities

From `toBeta.md`:
- `prompt-generator.ts` (504 LOC) needs splitting into smaller modules
- `types.ts` (437 LOC) is acceptable as it's primarily type definitions

## Testing

```bash
pnpm --filter @onegenui/core test
pnpm --filter @onegenui/core type-check
```

## Dependencies

- `zod` ^4.0.0 (peer dependency)

No internal workspace dependencies - this is the base package.
