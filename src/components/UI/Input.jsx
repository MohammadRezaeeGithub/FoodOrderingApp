export default function Input({label, id, error, ...props}) {
    return (
        <div className="control">
            <label htmlFor={id}>{label}</label>
            <input id={id} name={id} required {...props} />
            <div className="control-error ">{error && <p>{error}</p>}</div>
        </div>
    );
}