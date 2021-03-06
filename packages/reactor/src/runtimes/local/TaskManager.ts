const MAX_TASK_ID = Math.pow(2, 53) - 1
export type TaskID = number
export type TaskOnDone = (...onDoneArgs: any[]) => void
export type TaskOnCancel = (cancelValue?: any) => boolean
export type TaskWorker = (onDone: TaskOnDone, ...workerArgs: any[]) => { cancel?: TaskOnCancel }
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

export default function buildTaskManager(): TaskManager {
  const state: {
    idCounter: number,
    taskQueue: Task[],
    running: Map<TaskID, Task>,
    paused: boolean
  } = {
    idCounter: 0,
    taskQueue: [],
    running: new Map(),
    paused: false
  }

  const taskManager: TaskManager = {
    add(worker, onDone, ...workerArgs) {
      const id = MAX_TASK_ID <= state.idCounter ? (state.idCounter = 0) : state.idCounter++
      state.taskQueue.push({
        id,
        worker,
        workerArgs,
        onDone
      })
      return id
    },
    runQueue(resume = false) {
      if (resume) {
        taskManager.resumeQueue()
      }
      if (!state.paused) {
        while (state.taskQueue.length) {
          const task = state.taskQueue.shift()
          const { cancel } = task.worker((...onDoneArgs) => {
            state.running.delete(task.id)
            task.onDone(...onDoneArgs)
          }, ...task.workerArgs)
          task.onCancel = cancel
        }
      }
    },
    pauseQueue() {
      state.paused = true
    },
    resumeQueue() {
      state.paused = false
    },
    cancel(id, cancelValue) {
      let canceled = false
      if (state.running.has(id)) {
        const task = state.running.get(id)
        canceled = task.onCancel ? task.onCancel(cancelValue) : true
        state.running.delete(id)
      } else {
        state.taskQueue = state.taskQueue.filter(task => (id === task.id ? ((canceled = true), false) : true))
      }
      return canceled
    },
    cancelAll(cancelValue) {
      state.taskQueue = []
      state.running.forEach(task => {
        if (task.onCancel) task.onCancel(cancelValue)
      })
      state.running.clear()
    }
  }

  return Object.freeze(taskManager)
}
