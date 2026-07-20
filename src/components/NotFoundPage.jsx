import { NotFoundIllustration } from './illustrations/NotFoundIllustration';

export default function NotFoundPage({ onGoHome }) {
  return (
    <div className="notfound-page">
      <NotFoundIllustration className="notfound-illustration" aria-hidden="true" />
      <h1 className="notfound-title">Page not found</h1>
      <p className="notfound-desc">We couldn't find the page you were looking for.</p>
      <button className="notfound-btn" onClick={onGoHome}>Back home</button>
    </div>
  );
}
