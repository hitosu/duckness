import LocalReactorRuntime from './runtimes/local/LocalReactorRuntime';
import type { ReactorRuntime } from './runtimes/ReactorRuntime';
export declare type Reactor = ReactorRuntime;
export default function Reactor(runtime?: typeof LocalReactorRuntime): Reactor;
