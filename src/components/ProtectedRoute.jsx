import PropTypes from 'prop-types';
import {Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

/**
 * Guards routes that require an authenticated user (e.g. creating a
 * thread). Redirects guests to the login page.
 * @param {object} props - Component props.
 * @return {JSX.Element} The children, or a redirect.
 */
export default function ProtectedRoute({children}) {
  const authUser = useSelector((state) => state.authUser.value);

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
