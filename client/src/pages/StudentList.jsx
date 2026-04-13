import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listStudents, deleteStudent } from '../lib/api'
import { ConfirmDialog } from '../components/ConfirmDialog'

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="skeleton-row">
      <td colSpan={5}>
        <span className="skeleton-line" />
      </td>
    </tr>
  ))
}

export function StudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const rows = await listStudents(activeSearch)
      setStudents(rows)
    } catch (e) {
      setError(e.message || 'Could not load students.')
      setStudents([])
    } finally {
      setLoading(false)
    }
  }, [activeSearch])

  useEffect(() => {
    load()
  }, [load])

  const onSearchSubmit = (e) => {
    e.preventDefault()
    setActiveSearch(searchInput)
  }

  const onClearSearch = () => {
    setSearchInput('')
    setActiveSearch('')
  }

  const emptyMessage = useMemo(() => {
    if (activeSearch) return 'No students match your search.'
    return 'No students yet. Add your first record to get started.'
  }, [activeSearch])

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Directory</h1>
          <p className="page-subtitle">Search by name or city, then edit or remove records.</p>
        </div>
        <Link to="/add" className="btn btn-primary">
          Add student
        </Link>
      </div>

      {error ? (
        <div className="banner banner-error" role="alert">
          {error}
          <button type="button" className="banner-action" onClick={load}>
            Retry
          </button>
        </div>
      ) : null}

      <section className="panel">
        <form className="toolbar" onSubmit={onSearchSubmit}>
          <label className="sr-only" htmlFor="search">
            Search students
          </label>
          <div className="search-field">
            <span className="search-icon" aria-hidden="true" />
            <input
              id="search"
              name="search"
              className="input"
              placeholder="Search by name or city…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoComplete="off"
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
          {activeSearch ? (
            <button type="button" className="btn btn-ghost" onClick={onClearSearch}>
              Clear
            </button>
          ) : null}
        </form>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Age</th>
                <th scope="col">City</th>
                <th scope="col" className="col-actions">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-cell">
                    <div className="empty-state">
                      <p className="empty-title">{emptyMessage}</p>
                      {!activeSearch ? (
                        <Link to="/add" className="btn btn-primary btn-sm">
                          Add student
                        </Link>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id}>
                    <td className="mono">{s.id}</td>
                    <td>
                      <span className="cell-strong">{s.name}</span>
                    </td>
                    <td>{s.age}</td>
                    <td>{s.city}</td>
                    <td className="actions">
                      <Link to={`/edit/${s.id}`} className="btn btn-ghost btn-sm">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm danger-text"
                        onClick={() => setPendingDelete(s)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this student?"
        description={
          pendingDelete
            ? `This will permanently remove ${pendingDelete.name} from the directory.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return
          try {
            await deleteStudent(pendingDelete.id)
            setPendingDelete(null)
            await load()
          } catch (e) {
            setError(e.message || 'Could not delete student.')
          }
        }}
      />
    </div>
  )
}
