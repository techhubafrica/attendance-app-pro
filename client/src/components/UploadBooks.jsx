import React, { useState } from 'react';
import ManualBookUpload from './ManualBookUpload';
import BulkBookUpload from './BulkBookUpload';

const UploadBooks = () => {
  const [uploadType, setUploadType] = useState('manual');

  return (
    <div>
      <h1>Upload Books</h1>
      <div>
        <button onClick={() => setUploadType('manual')}>Manual Upload</button>
        <button onClick={() => setUploadType('bulk')}>Bulk Upload</button>
      </div>
      {uploadType === 'manual' ? <ManualBookUpload /> : <BulkBookUpload />}
    </div>
  );
};

export default UploadBooks;