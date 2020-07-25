import LocalReactorRuntime from './runtimes/local/LocalReactorRuntime'
import type { TReactorRuntime } from './runtimes/ReactorRuntime'

export type TReactor = TReactorRuntime

export default function Reactor(runtime = LocalReactorRuntime): TReactor {
  const reactor = runtime()
  return Object.freeze(reactor)
}
