import PropTypes from 'prop-types';

/**
 * A simple, reusable loading indicator shown whenever data is being
 * fetched from the API.
 * @param {object} props - Component props.
 * @return {JSX.Element} Loading element.
 */
export default function Loading({label = 'Memuat...'}) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="loading-dot" />
      <span className="loading-dot" />
      <span className="loading-dot" />
      <p>{label}</p>
    </div>
  );
}

Loading.propTypes = {
  label: PropTypes.string,
};
