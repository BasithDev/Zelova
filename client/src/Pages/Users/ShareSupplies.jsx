import { useState } from 'react';
import Header from '../../Components/Common/Header';

const ShareSupplies = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        placeholderText="Search foods, restaurants, etc..."
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Share Your Supplies</h1>
        {/* ShareSupplies content will go here */}
      </div>
    </div>
  );
};

export default ShareSupplies;