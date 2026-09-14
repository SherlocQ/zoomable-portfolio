export default function ScrollCue({ visible, overMedia = false, className = '' }) {
  return (
    <span
      className={`scroll-cue${overMedia ? ' scroll-cue--media' : ''}${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      <span className="scroll-cue-mouse">
        <span className="scroll-cue-dot" />
      </span>
    </span>
  );
}
