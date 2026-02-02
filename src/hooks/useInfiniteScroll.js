// Custom hook for infinite scrolling
import { useRef, useCallback, useEffect } from 'react';

/**
 * useInfiniteScroll
 * @param {Function} onLoadMore - Callback to load more data
 * @param {boolean} hasNextPage - Whether more data is available
 * @param {boolean} isFetchingNextPage - Whether data is currently being fetched
 * @returns {object} loader ref
 */
export default function useInfiniteScroll(onLoadMore, hasNextPage, isFetchingNextPage) {
  const loader = useRef();

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return loader;
}