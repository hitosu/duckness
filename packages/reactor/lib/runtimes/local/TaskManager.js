"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var MAX_TASK_ID = Math.pow(2, 53) - 1;
function buildTaskManager() {
    var state = {
        idCounter: 0,
        taskQueue: [],
        running: new Map(),
        paused: false
    };
    var taskManager = {
        add: function (worker, onDone) {
            var workerArgs = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                workerArgs[_i - 2] = arguments[_i];
            }
            var id = MAX_TASK_ID <= state.idCounter ? (state.idCounter = 0) : state.idCounter++;
            state.taskQueue.push({
                id: id,
                worker: worker,
                workerArgs: workerArgs,
                onDone: onDone
            });
            return id;
        },
        runQueue: function (resume) {
            if (resume === void 0) { resume = false; }
            if (resume) {
                taskManager.resumeQueue();
            }
            if (!state.paused) {
                var _loop_1 = function () {
                    var task = state.taskQueue.shift();
                    var cancel = task.worker.apply(task, __spreadArray([function () {
                            var onDoneArgs = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                onDoneArgs[_i] = arguments[_i];
                            }
                            state.running.delete(task.id);
                            task.onDone.apply(task, onDoneArgs);
                        }], task.workerArgs)).cancel;
                    task.onCancel = cancel;
                };
                while (state.taskQueue.length) {
                    _loop_1();
                }
            }
        },
        pauseQueue: function () {
            state.paused = true;
        },
        resumeQueue: function () {
            state.paused = false;
        },
        cancel: function (id, cancelValue) {
            var canceled = false;
            if (state.running.has(id)) {
                var task = state.running.get(id);
                canceled = task.onCancel ? task.onCancel(cancelValue) : true;
                state.running.delete(id);
            }
            else {
                state.taskQueue = state.taskQueue.filter(function (task) { return (id === task.id ? ((canceled = true), false) : true); });
            }
            return canceled;
        },
        cancelAll: function (cancelValue) {
            state.taskQueue = [];
            state.running.forEach(function (task) {
                if (task.onCancel)
                    task.onCancel(cancelValue);
            });
            state.running.clear();
        }
    };
    return Object.freeze(taskManager);
}
exports.default = buildTaskManager;
//# sourceMappingURL=TaskManager.js.map