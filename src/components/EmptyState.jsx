import PropTypes from 'prop-types';

/**
 * Friendly placeholder shown when a list has no items to display.
 * @param {object} props - Component props.
 * @return {JSX.Element} Empty state element.
 */
export default function EmptyState({title, description}) {
  return (
    <div className="empty-state">
      <div className="empty-state-mark">
        <span />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};
