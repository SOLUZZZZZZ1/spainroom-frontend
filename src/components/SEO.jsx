import { useEffect } from 'react'

export default function SEO({ title, description }) {
  useEffect(() => {
    if (title) document.title = title
    if (description) {
      let m = document.querySelector('meta[name="description"]')
      if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m) }
      m.setAttribute('content', description)
    }
  }, [title, description])
  return null
}
