import LocalReactorRuntime from './runtimes/local/LocalReactorRuntime';
import type { TReactorRuntime } from './runtimes/ReactorRuntime';
export declare type TReactor = TReactorRuntime;
export default function Reactor(runtime?: typeof LocalReactorRuntime): TReactor;
