export declare type TTaskID = number;
export declare type TTaskOnDone = (...onDoneArgs: any[]) => void;
export declare type TTaskOnCancel = (cancelValue?: any) => boolean;
export declare type TTaskWorker = (onDone: TTaskOnDone, ...workerArgs: any[]) => {
    cancel?: TTaskOnCancel;
};
export interface TTask {
    id: TTaskID;
    worker: TTaskWorker;
    workerArgs?: any[];
    onDone: TTaskOnDone;
    onCancel?: TTaskOnCancel;
}
export interface TTaskManager {
    add(worker: TTaskWorker, onDone: TTaskOnDone, ...workerArgs: any[]): TTaskID;
    runQueue(resume?: boolean): void;
    pauseQueue(): void;
    resumeQueue(): void;
    cancel(id: TTaskID, cancelValue?: any): boolean;
    cancelAll(cancelValue?: any): void;
}
export default function TaskManager(): TTaskManager;
