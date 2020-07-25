export declare type TaskID = number;
export declare type TaskOnDone = (...onDoneArgs: any[]) => void;
export declare type TaskOnCancel = (cancelValue?: any) => boolean;
export declare type TaskWorker = (onDone: TaskOnDone, ...workerArgs: any[]) => {
    cancel?: TaskOnCancel;
};
export interface Task {
    id: TaskID;
    worker: TaskWorker;
    workerArgs?: any[];
    onDone: TaskOnDone;
    onCancel?: TaskOnCancel;
}
export interface TaskManager {
    add(worker: TaskWorker, onDone: TaskOnDone, ...workerArgs: any[]): TaskID;
    runQueue(resume?: boolean): void;
    pauseQueue(): void;
    resumeQueue(): void;
    cancel(id: TaskID, cancelValue?: any): boolean;
    cancelAll(cancelValue?: any): void;
}
export default function buildTaskManager(): TaskManager;
