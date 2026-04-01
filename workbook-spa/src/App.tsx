import { useEffect, useState } from 'react';
import Header from './components/Header';
import { getCurrentPath } from './utils/router';

const ChrisPage = () => <h1>크리스 페이지</h1>;
const MasPage = () => <h1>마스 페이지</h1>;
const EveCarolPage = () => <h1>이브캐롤 페이지</h1>;
const NotFound = () => <h1>404</h1>;

function App() {
  const [path, setPath] = useState<string>(getCurrentPath());

  useEffect(() => {
    const handleRoute = () => {
      setPath(getCurrentPath());
    };

    window.addEventListener('popstate', handleRoute);

    return () => {
      window.removeEventListener('popstate', handleRoute);
    };
  }, []);

  const renderPage = () => {
    switch (path) {
      case '/chris':
        return <ChrisPage />;
      case '/mas':
        return <MasPage />;
      case '/eve-carol':
        return <EveCarolPage />;
      default:
        return <NotFound />;
    }
  };

  return (
    <>
      <Header />
      {renderPage()}
    </>
  );
}

export default App;