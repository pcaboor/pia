import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';


const itemsPerPage = 4; // Nombre d'articles par page

const StorePage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const products = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    description: `Description for product ${i + 1}`,
  }));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {selectedProducts.map((product) => (
          <Card key={product.id} className="text-left">
            <CardHeader className="items-start">
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{product.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Pagination1
          total={Math.ceil(products.length / itemsPerPage)}
          current={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default StorePage;



interface PaginationProps {
  total: number;
  current: number;
  onPageChange: (page: number) => void;
}

export const Pagination1: React.FC<PaginationProps> = ({ total, current, onPageChange }) => {
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="flex space-x-2">
      {pages.map((page) => (
        <button
          key={page}
          className={`px-4 py-2 ${page === current ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};
