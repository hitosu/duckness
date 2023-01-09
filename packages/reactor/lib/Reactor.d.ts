import LocalReactorRuntime from './runtimes/local/LocalReactorRuntime';
import type { ReactorRuntime } from './runtimes/ReactorRuntime';
export type Reactor = ReactorRuntime;
export default function Reactor(runtime?: typeof LocalReactorRuntime): Reactor;
