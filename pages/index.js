import { useState } from 'react';
import Head from 'next/head';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { getPortfolioData } from '@/lib/googleDrive';

// Компонент Header
function Header() {
  // ... ваш код для Header ...
}

// Компонент Gallery
function Gallery({ categories, works, onImageClick }) {
  // ... ваш код для Gallery ...
}

// Главная страница
export default function Home({ categories, works }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const lightboxSlides = works.map(work => ({ src: work.url }));

  const openLightboxOnImage = (index) => {
    const originalIndex = works.findIndex(w => w.id === filteredWorks[index].id);
    setLightboxIndex(originalIndex);
    setLightboxOpen(true);
  };
  
  // ... остальной код для страницы ...
}

export async function getStaticProps() {
  const { categories, works } = await getPortfolioData();
  return {
    props: { categories, works },
    revalidate: 3600, 
  };
}