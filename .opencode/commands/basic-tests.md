---
description: Creates a basic test suite for new uncommitted code
subtask: true
---

Write a test suite for the new code in this branch, either by creating a new `*.spec.ts` file or by adding to an existing one.

First, find the new or modified files:
!`git diff --name-only HEAD --diff-filter=AM`
!`git status --short`

For each new or modified TypeScript file:

1. **Services** (`*.service.ts`): Write tests using `HttpTestingController` from `@angular/common/http/testing`. Use `TestBed.configureTestingModule` with `provideHttpClientTesting()` and inject `HttpTestingController` to flush mock responses. Test each method: success case, error case, and parameter passing.

2. **Components** (`*.ts` with `@Component`): Use `TestBed.configureTestingModule({ imports: [ComponentUnderTest] })`. Mock injected services by providing a spy object via `providers`. Use `fixture.detectChanges()` to trigger change detection. Test rendering, user interaction, and service calls.

3. **Pipes, Guards, Interceptors**: Write isolated unit tests using their class directly. Mock dependencies with simple objects.

Rules:
- Follow Arrange-Act-Assert pattern clearly (separate sections with a comment or blank line).
- Mock all external dependencies — HTTP calls, services, router, sessionStorage.
- This project uses vitest (not Jasmine). Use `describe`, `it`, `expect` — no `fdescribe` or `fit`.
- Use `provideHttpClientTesting()` for HTTP mocking, not `HttpClientTestingModule` (deprecated in Angular 21).
- Append to an existing spec file when one already exists for that source file.
- Place new spec files next to their source file (`src/app/pages/foo/foo.service.ts` -> `src/app/pages/foo/foo.service.spec.ts`).
- Do not modify or remove any existing tests.
- Check `AGENTS.md` for project conventions.

After writing tests, run this to verify:
!`ng test`
