import React from 'react'

export const DataControl = () => {
  const importData = [
    'startDate',
    'isRestWeekend',
    'isRestHoliday',
    'userRestDays',
    'tasks',
  ]
  const exportLocalStorages = () => {
    const result: { [key: string]: any } = {}
    for (const key of importData) {
      result[key] = JSON.parse(localStorage.getItem(key) as string)
    }
    const blob = new Blob([JSON.stringify(result)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.download = 'localStorages.json'
    a.href = url
    a.click()
    a.remove()
  }
  const importLocalStorages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const result = JSON.parse(reader.result as string)
      for (const key of importData) {
        localStorage.setItem(key, JSON.stringify(result[key]))
      }
    }
    reader.readAsText(file)
    location.reload()
  }

  return (
    <>
      <span>エクスポート</span>
      <button onClick={exportLocalStorages}>実行</button>
      <hr />
      <span>インポート</span>
      <input type="file" onChange={importLocalStorages} />
      <hr />
      <div>
      <span>リセット</span>
        <button onClick={() => {
          if (window.confirm('リセットしますか？')) {
            localStorage.clear();
            location.reload();
          }
        }}>
        実行
        </button>
      </div>
    </>
  )
}
