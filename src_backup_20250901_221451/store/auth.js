export function getUser() {
  try { return JSON.parse(localStorage.getItem('sr_user')) } catch { return null }
}
export function setUser(u) {
  localStorage.setItem('sr_user', JSON.stringify(u))
  window.dispatchEvent(new Event('sr_user_change'))
}
export function logout() {
  localStorage.removeItem('sr_user')
  window.dispatchEvent(new Event('sr_user_change'))
}
export function onUserChange(cb){
  const h = () => cb(getUser())
  window.addEventListener('sr_user_change', h)
  return () => window.removeEventListener('sr_user_change', h)
}


