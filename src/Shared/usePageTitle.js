import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title 
      ? `${title} | GarmentsTracker` 
      : 'GarmentsTracker | Smart Garments Order & Production Workflow System';

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
