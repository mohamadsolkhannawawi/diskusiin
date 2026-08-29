import {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from 'react-redux';
import {dismissAlert} from '../states/shared/alertSlice';

/**
 * A single dismissible toast that removes itself after a few seconds.
 * @param {object} props - Component props.
 * @return {JSX.Element} Toast element.
 */
function AlertToast({id, message, type}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => dispatch(dismissAlert(id)), 4000);
    return () => clearTimeout(timer);
  }, [id, dispatch]);

  return (
    <div className={`alert-toast alert-toast--${type}`}>
      <p>{message}</p>
      <button type="button" aria-label="Tutup notifikasi" onClick={() => dispatch(dismissAlert(id))}>
        ×
      </button>
    </div>
  );
}

AlertToast.propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

/**
 * Renders any active alert messages as dismissible, self-expiring toasts.
 * @return {JSX.Element|null} Alert stack element.
 */
export default function AlertStack() {
  const alerts = useSelector((state) => state.alert);

  if (alerts.length === 0) return null;

  return (
    <div className="alert-stack" aria-live="assertive">
      {alerts.map((alert) => (
        <AlertToast key={alert.id} {...alert} />
      ))}
    </div>
  );
}
