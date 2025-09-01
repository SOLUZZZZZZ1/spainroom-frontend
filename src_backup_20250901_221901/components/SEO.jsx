import { useEffect } from 'react'

export default function SEO({ title, description, ogTitle, ogDescription }) {
  useEffect(() => {
    if (title) document.title = title

    const setMeta = (name, content) => {
      let m = document.querySelector(`meta[name="${name}"]`)
      if (!m) { m = document.createElement('meta'); m.setAttribute('name', name); document.head.appendChild(m) }
      if (content != null) m.setAttribute('content', content)
    }

    const setOg = (property, content) => {
      let m = document.querySelector(`meta[property="${property}"]`)
      if (!m) { m = document.createElement('meta'); m.setAttribute('property', property); document.head.appendChild(m) }
      if (content != null) m.setAttribute('content', content)
    }

    if (description) setMeta('description', description)
    setOg('og:title', ogTitle || title || '')
    setOg('og:description', ogDescription || description || '')
  }, [title, description, ogTitle, ogDescription])

  return null
}
