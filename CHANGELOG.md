## [1.1.0] - 2026-06-20

Minor update introducing strict error handling during event firing and internal
code cleanup.

### Added

- Implemented `Exposable<ExposedSignal<Payload>>` interface on the `Signal`
  class.
- Added `expose()` method to provide a read-only, publicly exposed view of the
  signal, restricting access to internal firing and clearing mechanisms.
- Added strict error handling in the `fire` lifecycle method ensuring execution
  exceptions from subscribers are propagated correctly without passing
  unnoticed.

### Changed

- Updated implements clause in `Signal` class to include
  `Exposable<ExposedSignal<Payload>>`.
- Refactored `connect` method to remove dead/unnecessary `try-catch` blocks,
  simplifying execution flow and improving internal code maintainability.
