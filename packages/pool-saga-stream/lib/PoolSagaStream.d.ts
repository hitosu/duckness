import { IDuck, TRefDucks, TRefErrorReporter } from '@duckness/pool';
import { TSaga } from '@duckness/saga';
export default function PoolSagaStream({ buildRootSaga }?: {
    buildRootSaga?: (ducks: IDuck[], { refDucks, refErrorReporter }: {
        refDucks: TRefDucks;
        refErrorReporter: TRefErrorReporter;
    }) => TSaga;
}): {};
