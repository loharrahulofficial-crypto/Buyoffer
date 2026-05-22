import { useState } from 'react'

const NearMeButton = ({ active, onLocation }) => {
  const [status, setStatus] = useState(active ? 'active' : 'idle')

  const handleClick = () => {
    if (!navigator.geolocation) {
      setStatus('error')
      alert('Please enable location access in your browser settings')
      return
    }

    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStatus('active')
        onLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        console.error('Geolocation error:', error)
        setStatus('error')
        alert('Please enable location access in your browser settings')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }

  const label = status === 'loading'
    ? 'Finding you...'
    : status === 'active' || active
      ? 'Near Me ✓'
      : status === 'error'
        ? 'Location denied'
        : 'Near Me'

  return (
    <button
      type="button"
      className={`location-chip near-me-button ${active || status === 'active' ? 'active' : ''} ${status === 'error' ? 'error' : ''}`}
      onClick={handleClick}
      disabled={status === 'loading'}
    >
      <span>📍</span>
      <span>{label}</span>
    </button>
  )
}

export default NearMeButton
