import React from 'react';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminLink() {
  return (
    <Link
      to="/?mode=edit"
      className="fixed bottom-4 right-4 p-3 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors"
      title="Admin Panel"
    >
      <Settings className="h-6 w-6" />
    </Link>
  );
}