import { useState, useEffect } from 'react';
import { newsApi } from '../services/newsApi';
import NewsCard from '../components/NewsCard';

const CATEGORIES = ['general', 'technology', 'business', 'sports', 'entertainment', 'health', 'science'];

const News = () => {
  const [category, setCategory] = useState('general');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const PAGE_SIZE = 9;

  const fetchNews = async (cat, pg) => {
    setLoading(true);
    try {
      const data = await newsApi.getByCategory(cat, pg);
      setArticles(data.data?.articles || []);
      setTotal(data.data?.totalResults || 0);
    } catch { setArticles([]); }
    finally { setLoading(false); }
  };

  const fetchSearch = async (q, pg) => {
    setLoading(true);
    try {
      const data = await newsApi.search(q, pg);
      setArticles(data.data?.articles || []);
      setTotal(data.data?.totalResults || 0);
    } catch { setArticles([]); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (searchQuery) fetchSearch(searchQuery, page);
    else fetchNews(category, page);
  }, [category, page, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(search);
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(1);
    setSearchQuery('');
    setSearch('');
  };

  const totalPages = Math.ceil(Math.min(total, 100) / PAGE_SIZE);

  return (
    <div className="news-page container py-4">
      <div className="page-header mb-4">
        <h2><i className="bi bi-newspaper me-2 text-primary"></i>News Feed</h2>
        <p className="text-muted">Stay up-to-date with the latest stories</p>
      </div>

      {/* Search */}
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8">
          <form onSubmit={handleSearch} className="d-flex gap-2">
            <input
              type="text"
              className="form-control app-input"
              placeholder="Search news..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary px-4">
              <i className="bi bi-search"></i>
            </button>
            {searchQuery && (
              <button type="button" className="btn btn-outline-secondary" onClick={() => { setSearch(''); setSearchQuery(''); setPage(1); }}>
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Category Pills */}
      {!searchQuery && (
        <div className="d-flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`btn btn-sm ${category === cat ? 'btn-primary' : 'chip-btn'}`}
              onClick={() => handleCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      )}

      {searchQuery && (
        <div className="alert alert-info py-2 mb-4">
          Showing results for "<strong>{searchQuery}</strong>"
          &nbsp;—&nbsp;{total} found
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-newspaper display-1 text-muted opacity-25"></i>
          <p className="text-muted mt-3">No articles found</p>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {articles.map((article, i) => (
              <div className="col-12 col-sm-6 col-lg-4" key={i}>
                <NewsCard article={article} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-5 d-flex justify-content-center">
              <ul className="pagination">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link app-page-link" onClick={() => setPage(p => p - 1)}>
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  const p = i + 1;
                  return (
                    <li key={p} className={`page-item ${page === p ? 'active' : ''}`}>
                      <button className="page-link app-page-link" onClick={() => setPage(p)}>{p}</button>
                    </li>
                  );
                })}
                <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
                  <button className="page-link app-page-link" onClick={() => setPage(p => p + 1)}>
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default News;
