const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80';

const NewsCard = ({ article }) => {
  const { title, description, url, urlToImage, publishedAt, source } = article;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const truncate = (str, len = 120) => {
    if (!str) return '';
    return str.length > len ? str.slice(0, len) + '…' : str;
  };

  return (
    <div className="news-card app-card rounded-4 h-100 d-flex flex-column overflow-hidden">
      <div className="news-image-wrapper">
        <img
          src={urlToImage || DEFAULT_IMAGE}
          alt={title}
          onError={e => { e.target.src = DEFAULT_IMAGE; }}
          className="news-image"
        />
        <span className="news-source-badge">{source?.name}</span>
      </div>
      <div className="p-3 d-flex flex-column flex-grow-1">
        <h6 className="news-title mb-2">{truncate(title, 80)}</h6>
        <p className="news-desc text-muted small mb-3 flex-grow-1">{truncate(description)}</p>
        <div className="d-flex justify-content-between align-items-center">
          <span className="news-date small text-muted">
            <i className="bi bi-calendar3 me-1"></i>{formatDate(publishedAt)}
          </span>
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
            Read <i className="bi bi-arrow-up-right-circle ms-1"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
