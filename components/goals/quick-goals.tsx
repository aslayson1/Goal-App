"use client"

import { useEffect, useState } from "react"

type Goal = {
  id: string
  title: string
  completed: boolean
  completed_at: string | null
  created_at: string
}

export default function QuickGoals() {
  const [title, setTitle] = useState("")
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setError(null)
    try {
      const res = await fetch("/api/goals", { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to load goals")
      setGoals(json.goals || [])
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function add() {
    if (!title.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to add goal")
      setTitle("")
      await load()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function toggle(id: string, next: boolean) {
    setError(null)
    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: next }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to update")
      await load()
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function remove(id: string) {
    setError(null)
    try {
      const res = await fetch(`/api/goals/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to delete")
      await load()
    } catch (e: any) {
      setError(e.message)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="New goal…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button className="btn" onClick={add} disabled={loading}>
          Add
        </button>
      </div>

      {error ? <p className="text-(--destructive) text-sm">{error}</p> : null}

      <ul className="space-y-2">
        {goals.map((g) => (
          <li key={g.id} className="card">
            <div className="card-content flex items-center justify-between gap-3">
              <label className="flex items-center gap-3 flex-1">
                <input type="checkbox" checked={g.completed} onChange={(e) => toggle(g.id, e.target.checked)} />
                <span className={g.completed ? "line-through opacity-70" : ""}>{g.title}</span>
              </label>
              <div className="text-xs opacity-70">
                {g.completed
                  ? `Done: ${new Date(g.completed_at || g.created_at).toLocaleString()}`
                  : `Created: ${new Date(g.created_at).toLocaleString()}`}
              </div>
              <button className="btn" onClick={() => remove(g.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
