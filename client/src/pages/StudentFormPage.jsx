import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createStudent, getStudent, updateStudent } from '../lib/api'

const initial = { name: '', age: '', city: '' }

export function StudentFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [values, setValues] = useState(initial)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [banner, setBanner] = useState('')

  useEffect(() => {
    if (!isEdit) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const s = await getStudent(id)
        if (cancelled) return
        setValues({
          name: s.name ?? '',
          age: s.age != null ? String(s.age) : '',
          city: s.city ?? '',
        })
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not load student.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, isEdit])

  const onChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setBanner('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setBanner('')
    const payload = {
      name: values.name.trim(),
      age: values.age,
      city: values.city.trim(),
    }
    try {
      if (isEdit) {
        await updateStudent(id, payload)
        setBanner('Student updated successfully.')
      } else {
        await createStudent(payload)
        navigate('/', {
          replace: true,
          state: { toast: 'Student added successfully.' },
        })
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="panel panel-pad center-muted">
          <p>Loading student…</p>
        </div>
      </div>
    )
  }

  if (isEdit && error && !values.name && !values.city) {
    return (
      <div className="page">
        <div className="banner banner-error" role="alert">
          {error}
        </div>
        <Link to="/" className="btn btn-secondary">
          Back to directory
        </Link>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit student' : 'Add student'}</h1>
          <p className="page-subtitle">
            {isEdit ? 'Update details and save changes.' : 'Create a new record in the directory.'}
          </p>
        </div>
        <Link to="/" className="btn btn-ghost">
          Back
        </Link>
      </div>

      {banner ? (
        <div className="banner banner-success" role="status">
          {banner}
        </div>
      ) : null}
      {error ? (
        <div className="banner banner-error" role="alert">
          {error}
        </div>
      ) : null}

      <form className="panel form-panel" onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            className="input"
            value={values.name}
            onChange={onChange('name')}
            autoComplete="name"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            className="input"
            inputMode="numeric"
            value={values.age}
            onChange={onChange('age')}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="city">City</label>
          <input
            id="city"
            className="input"
            value={values.city}
            onChange={onChange('city')}
            autoComplete="address-level2"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Save student'}
          </button>
        </div>
      </form>
    </div>
  )
}
