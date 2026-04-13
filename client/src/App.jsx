import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { StudentList } from './pages/StudentList'
import { StudentFormPage } from './pages/StudentFormPage'

function EphemeralToast({ message }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(false), 4200)
    return () => window.clearTimeout(t)
  }, [message])

  if (!visible) return null
  return (
    <div className="toast" role="status">
      {message}
    </div>
  )
}

function NavigationToast() {
  const location = useLocation()
  const message = location.state?.toast
  if (!message) return null
  return <EphemeralToast message={message} key={`${location.key}-${message}`} />
}

export default function App() {
  return (
    <BrowserRouter>
      <NavigationToast />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StudentList />} />
          <Route path="add" element={<StudentFormPage />} />
          <Route path="edit/:id" element={<StudentFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
