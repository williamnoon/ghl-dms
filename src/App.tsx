import React from 'react';
import { useSearchParams } from 'react-router-dom';
import DisplayView from './views/DisplayView';
import EditView from './views/EditView';

function App() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  return (
    <div className="min-h-screen bg-gray-100">
      {mode === 'edit' ? <EditView /> : <DisplayView />}
    </div>
  );
}

export default App;