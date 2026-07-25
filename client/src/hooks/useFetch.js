import { useCallback, useEffect, useState } from 'react';

/**
 * Generic data-fetching hook.
 * @param {Function} fetcher - async function returning API response
 * @param {Array} deps - dependency array to re-trigger fetch
 * @param {Object} options - { immediate: boolean }
 */
const useFetch = (fetcher, deps = [], options = {}) => {
  const { immediate = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState('');

  const run = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetcher();
      setData(res);
      return res;
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (immediate) {
      run().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: run, setData };
};

export default useFetch;
