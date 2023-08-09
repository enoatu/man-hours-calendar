import React from 'react'
import { ReactSortable } from 'react-sortablejs'
import { generateRand } from '@/utils/number'
import { displayFmt } from '@/utils/date'

export type Task = {
  id: number,
  name: string,
  days: number,
  start: Date,
  end: Date,
}
export type TaskEditProps = {
  tasks: Task[],
  updateTasks: (arg: Task[]) => void,
}
export const TaskEdit = ({tasks, updateTasks}: TaskEditProps) => {
  const editTaskName = (id: number, name: string) => {
    const newTasks = tasks.map(task => {
        if (task.id === id) {
            return {...task, name}
        }
        return task
    })
    updateTasks(newTasks)
  }
  const editTaskDays = (id: number, days: string) => {
    const newTasks = tasks.map(task => {
        if (task.id === id) {
            let daysNumber = Number(days)
            if (isNaN(daysNumber) || daysNumber < 0) {
              daysNumber = 0
            }
            return {...task, days: daysNumber}
        }
        return task
    })
    updateTasks(newTasks)
  }
  const deleteTask = (id: number) => {
    if (tasks.length <= 1) {
      return
    }
    const newTasks = tasks.filter(task => task.id !== id)
    updateTasks(newTasks)
  }
  const addTask = () => {
    const newTasks = [...tasks, {
      id: generateRand(),
      name: '',
      days: 1,
      start: new Date(),
      end: new Date(),
    }]
    updateTasks(newTasks)
  }
  return (
    <div className="task-edit">
      <div className="task-list task-header">
        <div className="task-item-wrapper task-header">
          <div className="task-item task-header">タスク名</div>
          <div className="task-item task-header">かかる日数</div>
          <div className="task-item task-header">開始日<br/>(自動作成)</div>
          <div className="task-item task-header">終了日<br/>(自動作成)</div>
          <div className="task-item task-header">並替</div>
          <div className="task-item task-header">編集</div>
        </div>
      </div>
      <div className="task-list">
        <ReactSortable list={tasks} setList={(c) => updateTasks(c) }>
          {tasks.map((t) => (
            <div key={t.id} className="task-item-wrapper">
              <div className="task-item">
                <input type="text" value={t.name} onChange={(e) => editTaskName(t.id, e.target.value)}/>
              </div>
              <div className="task-item">
                <input type="text" value={t.days} onChange={(e) => editTaskDays(t.id, e.target.value)}/>
              </div>
              <div className="task-item">{displayFmt(t.start)}</div>
              <div className="task-item">{displayFmt(t.end)}</div>
              <div className="task-item">☰</div>
              <div className="task-item"><button className={tasks.length === 1 ? 'disable-delete-btn' : ''} onClick={() => deleteTask(t.id)}>削除</button></div>
            </div>
          ))}
          <div className="add-task-wrapper">
            <button className="add-task" onClick={() => addTask()}>＋タスクを追加</button>
          </div>
        </ReactSortable>
        <div>
        ※コピペ用
        {tasks.map((t) => (
          <div key={t.id} className="task-item-wrapper">
            {t.name} {displayFmt(t.start)}〜{displayFmt(t.end)}
          </div>
        ))}
        </div>
      </div>
      <style jsx>{`
        .task-edit {
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .task-list {
          box-sizing: border-box;
          border: 1px #ccc solid;
          display: flex;
          flex-direction: column;
        }
        .task-item-wrapper {
          display: flex;
        }
        .task-header.task-item-wrapper {
          justify-content: center;
          text-align: center;
          align-items: center;
        }
        .task-item {
          display: flex;
          background-color: #fff;
          justify-content: flex-start;
          align-items: center;
          padding: 0 10px;
          box-sizing: border-box;
          width: 110px;
          overflow: hidden;
          flex: 3;
        }
        .task-item:nth-child(1) {
          flex: 10;
        }
        .task-item:nth-child(1) input {
          padding: 6px;
          width: 100%;
          background-color: rgba(207, 240, 240, 0.5);
        }
        .task-item:nth-child(2) {
          flex: 3;
        }
        .task-item:nth-child(2) input {
          padding: 6px;
          width: 100%;
          text-align: right;
          background-color: rgba(207, 240, 240, 0.5);
        }

        .task-item:nth-child(5) {
          flex: 1;
          font-size: 30px;
          cursor: move;
          color: #ddd;
          padding-bottom: 5px;
        }
        .task-header.task-item:nth-child(5) {
          font-size: 16px;
          color: #000;
        }
        .task-item:nth-child(6) {
          flex: 1;
          text-align: center;
        }
        .disable-delete-btn {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .add-task-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
        .add-task {
          width: 90%;
          padding: 5px 10px;
          border: 1px #ccc solid;
          border-radius: 5px;
          background-color: #fff;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

