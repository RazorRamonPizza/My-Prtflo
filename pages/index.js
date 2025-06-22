import { useState } from 'react';
import Head from 'next/head';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { motion } from 'framer-motion';

// ИСПРАВЛЕНИЕ 1: Импортируем данные под именем rawPortfolioData
import rawPortfolioData from '../data/portfolio.json';

function Header() {
  return (
    <header className="mb-16 text-center">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">Roman Makarov</h1>
      <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">CGI Artist | 3D Motion Designer | VFX & Product Animation</p>
    </header>
  );
}

function Gallery({ categories, works, onWorkClick }) {
  const [activeCategory, setActiveCategory] = useState('Все');
  const filteredWorks = activeCategory === 'Все' ? works : works.filter(work => work.category === activeCategory);
  const buttonStyle = "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 shadow-sm";
  const activeButtonStyle = "bg-gray-800 text-white";
  const inactiveButtonStyle = "bg-white text-gray-700 hover:bg-gray-200";

  return (
    <div>
      <div className="flex justify-center flex-wrap gap-3 mb-12">
        <button onClick={() => setActiveCategory('Все')} className={`${buttonStyle} ${activeCategory === 'Все' ? activeButtonStyle : inactiveButtonStyle}`}>Все</button>
        {categories.map(category => (
          <button key={category} onClick={() => setActiveCategory(category)} className={`${buttonStyle} ${activeCategory === category ? activeButtonStyle : inactiveButtonStyle}`}>{category}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredWorks.map((work, index) => (
          <motion.div
            key={work.id}
            className="group relative block w-full bg-black rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
            onClick={() => onWorkClick(work)}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
          >
            <div className="aspect-w-1 aspect-h-1">
              <iframe
                src={work.previewUrl}
                className="w-full h-full object-cover"
                loading="lazy"
                allow="autoplay"
              ></iframe>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 flex items-end p-4">
              <h3 className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">{work.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Home({ categories, works }) {
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState([]);

  const openLightbox = (clickedWork) => {
    setSlides([{ type: 'iframe', src: clickedWork.iframeUrl, width: 1920, height: 1080 }]);
    setOpen(true);
  };
  
  return (
    <div className="bg-gray-100 min-h-screen text-gray-800 antialiased">
      <Head>
        <title>Roman Makarov | CGI Artist Portfolio</title>
        <meta name="description" content="The portfolio of Roman Makarov, a CGI Artist and Motion Designer." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Header />
        <Gallery categories={categories} works={works} onWorkClick={openLightbox} />
      </main>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        styles={{ container: { backgroundColor: "rgba(10, 10, 10, .95)" } }}
        render={{
            slide: ({ slide }) => (
                slide.type === 'iframe' && <iframe className="w-full h-full" src={slide.src} allowFullScreen></iframe>
            )
        }}
      />
    </div>
  );
}

export async function getStaticProps() {
  // ИСПРАВЛЕНИЕ 2: Используем правильное имя переменной rawPortfolioData
  const allWorks = rawPortfolioData.map(work => ({
    ...work,
    previewUrl: `https://drive.google.com/file/d/${work.id}/preview`,
    iframeUrl: `https://drive.google.com/file/d/${work.id}/preview`
  }));

  const categories = [...new Set(allWorks.map(work => work.category))].sort();

  return {
    props: {
      categories,
      works: allWorks,
    },
  };
}