const Notification = ({ message,color }) => {
  if (!message) {
    return null
  }
  return (
    <div style={{ color: color, background: 'lightgray', padding: '10px', marginBottom: '10px' }}  >
      {message}
    </div>
  )
}

export default Notification
