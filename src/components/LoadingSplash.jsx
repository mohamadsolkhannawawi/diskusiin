/**
 * Full-viewport splash shown once, while the app checks for an existing
 * session on startup.
 * @return {JSX.Element} Splash screen element.
 */
export default function LoadingSplash() {
  return (
    <div className="loading-splash">
      <div className="loading-splash-mark">
        <span />
        <span />
        <span />
      </div>
      <p>Menyiapkan Diskusiin...</p>
    </div>
  );
}
