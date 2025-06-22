import { useState } from 'react';

export default function Gallery({ categories, works, onImageClick }) {
  const [activeCategory, setActiveCategory] = useState('Все');

  const filteredWorks = activeCategory === 'Все'
    ? works
    : works.filter(work => work.category === activeCategory);

  const buttonStyle = "px-4 py-2 rounded-md text-sm font-medium transition-colors";
  const activeButtonStyle = "bg-gray-800 text-white";
  const inactiveButtonStyle = "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <div>
      {/* Фильтры */}
      <div className="flex justify-center flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('Все')}
          className={`${buttonStyle} ${activeCategory === 'Все' ? activeButtonStyle : inactiveButtonStyle}`}
        >
          Все
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`${buttonStyle} ${activeCategory === category ? activeButtonStyle : inactiveButtonStyle}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Сетка работ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredWorks.map((work, index) => {
          // Находим оригинальный индекс для лайтбокса
          const originalIndex = works.findIndex(w => w.id === work.id);
          return (
            <div
              key={work.id}
              className="group aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => onImageClick(originalIndex)}
            >
              <img
                src={work.url}
                alt={work.title}
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end p-4">
                <p className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {work.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}