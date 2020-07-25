import LocalReactorRuntime from './runtimes/local/LocalReactorRuntime'
import type { ReactorRuntime } from './runtimes/ReactorRuntime'

export type Reactor = ReactorRuntime

export default function Reactor(runtime = LocalReactorRuntime): Reactor {
  const reactor = runtime()
  return Object.freeze(reactor)
}
