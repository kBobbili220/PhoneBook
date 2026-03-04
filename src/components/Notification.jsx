const Notification = ({ message, error }) => {
    if (message === null) {
        return null
    }

    const className = error ? "Notification error" :  "Notification success"
    return (
        <div className={className}>{ message }</div>
    )
}

export default Notification