## Changelog

The first release of `@bysolivan/signal`, an type-safe event system for
efficient event-driven pattern.

## [1.0.0, 1.0.1] - 2026-06-18

### Added

- Implementation of the `Signal` class supporting generic tuple payloads.
- `ExposedSignal` interface to restrict public access to internal event
  triggers.
- `SignalConnection` interface to handle safe listener disconnections.
- Lifecycle hooks including `connect`, `fire`, `clear`, `restore`, and
  `dispose`.
- Support for persistent event listeners via configuration flags.
