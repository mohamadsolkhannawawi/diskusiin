import PropTypes from 'prop-types';
import {getInitials, colorFromString} from '../utils';

/**
 * A round avatar that doubles as a speech-bubble anchor: a small triangular
 * tail points from the avatar into its post, tying every author to their
 * words — the app's signature visual motif.
 * @param {object} props - Component props.
 * @return {JSX.Element} Avatar element.
 */
export default function Avatar({name, image, size = 44, tail = true}) {
  const initials = getInitials(name);
  const background = colorFromString(name);

  return (
    <div
      className="avatar"
      style={{
        '--avatar-size': `${size}px`,
        '--avatar-bg': background,
      }}
    >
      {image ? (
        <img src={image} alt={name} onError={(e) => {
          e.currentTarget.style.display = 'none';
        }} />
      ) : (
        <span>{initials}</span>
      )}
      {tail && <i className="avatar-tail" aria-hidden="true" />}
    </div>
  );
}

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string,
  size: PropTypes.number,
  tail: PropTypes.bool,
};
