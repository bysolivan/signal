import type { Disposable, Exposable, Restorable } from '@bysolivan/types'

/** Defines a function that can be connected to a signal. */
export type Callback<Payload extends unknown[]> = (...payload: Payload) => void

/** A exposed public view of a signal that allows connecting without exposing the ability to fire them or clear listeners. */
export interface ExposedSignal<Payload extends unknown[]> {
  connect(
    callback: (...payload: Payload) => void,
    persistent?: boolean,
  ): SignalConnection
  readonly enabled: boolean
  listeners: ReadonlyMap<Callback<Payload>, boolean>
  readonly disposed: boolean
}

/** Represents a connection to a signal that can be disconnected. */
export interface SignalConnection {
  disconnect: () => void
}

/**
 * Implementation of a signal pattern.
 * * Provides a robust way to implement the observer pattern, allowing
 * components to subscribe to events, fire payloads, and manage lifecycle
 * through connection/disconnection mechanisms.
 *
 * Example:
 * ```typescript
 * const signal = new Signal<[string, number]>();
 *
 * const connection = signal.connect((name, age) => {
 *   console.log(`${name} is ${age} years old`);
 * });
 *
 * signal.fire("Alice", 30);
 * connection.disconnect();
 * ```
 */
export class Signal<Payload extends unknown[]>
  implements Disposable, Restorable, Exposable<ExposedSignal<Payload>> {
  // #region Lifecycle
  /** Enables or disables the signal. When disabled, it cannot fire or accept new connections. */
  public enabled: boolean = true
  /** Stores the callback functions and their persistence configuration. */
  private _listeners: Map<Callback<Payload>, boolean> = new Map()
  /** Determines if the signal has been disposed and is no longer usable. */
  private _disposed: boolean = false
  // #endregion

  // # Getters/Setters
  /** Returns a readonly map of the current listeners; the boolean indicates if the listener is persistent. */
  get listeners(): ReadonlyMap<Callback<Payload>, boolean> {
    return this._listeners
  }

  /** Returns true if the signal has been disposed and is no longer usable. */
  get disposed(): boolean {
    return this._disposed
  }
  // #endregion

  // #region Functions
  /**
   * Connects a callback function to the signal.
   * @param callback The function to execute when the signal is fired.
   * @param persistent If true, the listener remains after a clear() call unless explicitly disconnected.
   * @returns A connection object used to disconnect the listener.
   */
  public connect(
    callback: Callback<Payload>,
    persistent: boolean = false,
  ): SignalConnection {
    if (this._disposed) throw new Error('Signal is disposed, cannot connect')
    if (!this.enabled) throw new Error('Signal is disabled, cannot connect')
    this._listeners.set(callback, persistent)
    return {
      disconnect: () => {
        this._listeners.delete(callback)
      },
    }
  }

  /**
   * Fires the signal, executing all connected listeners with the provided payload.
   * @param payload The payload to pass to the listeners.
   */
  public fire(...payload: Payload): void {
    if (this._disposed) throw new Error('Signal is disposed, cannot fire')
    if (!this.enabled) throw new Error('Signal is disabled, cannot fire')
    const listeners = Array.from(this._listeners.keys())
    for (const callback of listeners) {
      if (this._listeners.has(callback)) {
        try {
          callback(...payload)
        } catch (error) {
          throw error
        }
      }
    }
  }

  /** Returns a exposed public view of the signal. */
  public expose(): ExposedSignal<Payload> {
    // deno-lint-ignore no-this-alias
    const signal = this
    return {
      connect: (callback, persistent) => signal.connect(callback, persistent),
      get enabled() {
        return signal.enabled
      },
      get listeners() {
        return signal.listeners
      },
      get disposed() {
        return signal.disposed
      },
    }
  }

  /**
   * Clears connected listeners.
   * @param force If true, removes all listeners regardless of their persistence configuration.
   */
  public clear(force: boolean = false): void {
    if (force) {
      this._listeners.clear()
    } else {
      for (const [callback, persistent] of this._listeners.entries()) {
        if (!persistent) {
          this._listeners.delete(callback)
        }
      }
    }
  }

  /** Resets the signal by clearing all listeners. */
  public restore(): void {
    if (this._disposed) {
      throw new Error('Signal is disposed, cannot restore')
    }
    this.clear(true)
    this.enabled = true
  }

  /** Destroys the signal, removing all listeners and preventing further use. */
  public dispose(): void {
    if (this._disposed) {
      throw new Error('Signal is already disposed, cannot dispose')
    }

    this.clear(true)
    this._disposed = true
  }
  // #endregion
}
