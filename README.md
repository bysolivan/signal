# Signal

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Deno](https://img.shields.io/badge/deno-%23000000.svg?style=for-the-badge&logo=deno&logoColor=white)
![License](https://img.shields.io/github/license/bysolivan/signal?style=for-the-badge)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/bysolivan/signal/main.yml?style=for-the-badge)

> Type-safe event system for efficient event-driven pattern.

## Description

The `Signal` class provides a structured and type-safe way to implement the
observer pattern in TypeScript and Deno projects. It allows components to
subscribe to events, dispatch payloads, and safely manage component lifecycles
through granular connection, disconnection, and disposal mechanisms. It
guarantees type safety with generic payload arrays and supports persistent
listeners, signal exposure, and complete state resetting.

## Features

- **Type-Safe Payloads**: Supports generic tuple payloads to strictly type event
  data.
- **Persistent Listeners**: Ability to register persistent callbacks that
  survive standard clearing operations.
- **Exposed Public Views**: Restricts consumer access to event firing or
  clearing via the `ExposedSignal` interface.
- **Lifecycle Management**: Built-in enablement toggling, clearing, restoring,
  and disposal methods.
- **Memory Leak Prevention**: Clean disconnection handles and automatic listener
  wiping upon disposal.

## Getting Started

### Prerequisites

- [Deno 1.40 or higher](https://deno.land/)

### Installation

```bash
deno add jsr:@bysolivan/signal
```

## Quick Usage

```typescript
import { Signal } from './signal.ts'

const signal = new Signal<[string, number]>()

const connection = signal.connect((name, age) => {
  console.log(`${name} is ${age} years old`)
})

signal.fire('Lydia', 30)

connection.disconnect()
```

## Documentation & Help

### Ecosystem Dependencies

- `@bysolivan/types` (Provides `Disposable` and `Restorable` contracts)

### Troubleshooting

- **Error: `Signal is disposed, cannot connect/fire/restore**`: You are
  attempting to interact with a signal instance after `dispose()` has been
  called. Re-instantiate the signal or avoid calling `dispose` until the
  component unmounts entirely.
- **Error: `Signal is disabled, cannot connect/fire**`: The signal's `.enabled`
  property is set to `false`. Set `signal.enabled = true` before attempting to
  fire or hook up new listeners.

## Authors

- **Solivan** ([@bysolivan](https://github.com/bysolivan))

## License

This project is licensed under the MIT License - see the `LICENSE` file for
details.

## Acknowledgments

- [Deno Documentation](https://docs.deno.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
