# Coding Standard

## Naming conventions

### Folders

- Use dash case for folder names.

  ```typescript
  // Example
  folder - name;
  ```

### Files

- Use camelCase for file names.
- Files should have suffixes based what they do

  ```typescript
  // Example
  example.service.ts
  example.util.ts
  example.controller.ts
  ...
  ```

### Classes

- Use PascalCase for class names.

  ```typescript
  // Example
  class MyClass {}
  ```

### Class methods

- Use camelCase for method names.

  ```typescript
  // Example
  myMethod(): string {
  }
  ```

### Functions

- Use camelCase for function names.
  ```typescript
  // Example
  myFunction(): string {
  }
  ```

### Enums

- Use PascalCase for enum names.
- Use PascalCase for enum keys.
- Use dash-case for enum values.

  ```typescript
  // Example
  enum MyEnum {
    FirstValue = 'first-value',
    SecondValue = 'second-value,
  }
  ```

## External packages

- When adding a new external package, please make sure that the package is actively maintained, has a high number of downloads and low number of active issues.

## Imports and exports

- Import statements should be grouped and ordered.
- Due to better autocompletion, prefer named over default exports.

  ```typescript
  // Example
  import ModuleA from 'moduleA';
  import { FunctionB, FunctionA } from 'moduleB';
  ```

## Types

- Use types for variable declarations.
- Avoid `any` type when possible.
- When throwing an exception inside a method or a function, please provide `never` as a possible return type

```typescript
// Example
const myVariable: string = 'Hello';
```

## Error handling

- Ensure human-readable error messages are provided.
- Avoid using a catch block without handling the error; if absolutely nothing should be done, at least log the error.
- When returning an error, include a proper [HTTP Status Code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).
- Ensure no sensitive information about the system is displayed in production environments.
