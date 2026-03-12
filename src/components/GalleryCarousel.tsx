import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { Button } from './ui/button';

// Importa automaticamente todas as imagens da pasta public/images/galeria/
const galleryModules = import.meta.glob<string>(
    '/public/images/galeria/*.{jpg,jpeg,png,webp,gif}',
    { eager: true, query: '?url', import: 'default' }
);

function getGalleryImages(): string[] {
    return Object.entries(galleryModules).map(([path, url]) => {
        if (typeof url === 'string') return url;
        const publicPath = path.replace('/public', '');
        return publicPath;
    });
}

interface GalleryCarouselProps {
    className?: string;
}

export function GalleryCarousel({ className = '' }: GalleryCarouselProps) {
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    useEffect(() => {
        setImages(getGalleryImages());
    }, []);

    const goToNext = useCallback(() => {
        if (images.length === 0) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const goToPrev = useCallback(() => {
        if (images.length === 0) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Auto-play
    useEffect(() => {
        if (isLightboxOpen || images.length <= 1) return;
        const interval = setInterval(goToNext, 4500);
        return () => clearInterval(interval);
    }, [goToNext, isLightboxOpen, images.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') goToPrev();
            else if (e.key === 'ArrowRight') goToNext();
            else if (e.key === 'Escape') setIsLightboxOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToNext, goToPrev]);

    if (images.length === 0) {
        return (
            <div className={`text-center py-20 ${className}`}>
                <p className="text-stone-400 text-lg">
                    Nenhuma imagem na galeria ainda. Adicione imagens em <code className="bg-stone-100 px-2 py-1 rounded text-sm">public/images/galeria/</code>
                </p>
            </div>
        );
    }

    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 200 : -200,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -200 : 200,
            opacity: 0,
        }),
    };

    // 5 thumbnails visíveis no máximo
    const getVisibleThumbnails = () => {
        const total = images.length;
        if (total <= 5) return images.map((_, i) => i);
        const indices: number[] = [];
        for (let offset = -2; offset <= 2; offset++) {
            indices.push((currentIndex + offset + total) % total);
        }
        return indices;
    };

    return (
        <div className={`max-w-lg mx-auto ${className}`}>
            {/* Main Carousel */}
            <div className="relative group">
                {/* Image Container - proporção vertical (3:4) */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-stone-100 to-stone-200 shadow-xl" style={{ aspectRatio: '3/4' }}>
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                                opacity: { duration: 0.3 },
                            }}
                            className="absolute inset-0 flex items-center justify-center p-4"
                        >
                            <img
                                src={images[currentIndex]}
                                alt={`Galeria ${currentIndex + 1}`}
                                className="max-w-full max-h-full object-contain rounded-2xl drop-shadow-lg"
                                referrerPolicy="no-referrer"
                                draggable={false}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons - always visible on sides */}
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                                className="h-11 w-11 rounded-full bg-white/80 text-stone-700 hover:bg-white shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                        </motion.div>
                    </div>

                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-10">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                className="h-11 w-11 rounded-full bg-white/80 text-stone-700 hover:bg-white shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </motion.div>
                    </div>

                    {/* Zoom button */}
                    <motion.div
                        className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsLightboxOpen(true)}
                            className="h-10 w-10 rounded-full bg-white/80 text-stone-700 hover:bg-white shadow-md backdrop-blur-sm"
                        >
                            <ZoomIn className="h-5 w-5" />
                        </Button>
                    </motion.div>

                    {/* Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 text-white text-sm font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="mt-5 flex justify-center gap-2.5 px-4">
                    {getVisibleThumbnails().map((imgIndex, pos) => (
                        <button
                            key={`pos-${pos}`}
                            onClick={() => {
                                setDirection(imgIndex > currentIndex ? 1 : -1);
                                setCurrentIndex(imgIndex);
                            }}
                            className={`relative rounded-xl overflow-hidden shrink-0 transition-all duration-300 ${imgIndex === currentIndex
                                    ? 'ring-2 ring-primary ring-offset-2 shadow-md scale-110'
                                    : 'opacity-50 hover:opacity-80'
                                }`}
                            style={{
                                width: 64,
                                height: 64,
                            }}
                        >
                            <img
                                src={images[imgIndex]}
                                alt={`Thumbnail ${imgIndex + 1}`}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                                draggable={false}
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Dot indicators */}
            {images.length > 1 && images.length <= 15 && (
                <div className="flex justify-center gap-1.5 mt-4">
                    {images.map((_, index) => (
                        <motion.button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                            className={`rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-primary w-6 h-2'
                                : 'bg-stone-300 w-2 h-2 hover:bg-stone-400'
                                }`}
                            layout
                        />
                    ))}
                </div>
            )}

            {/* Lightbox */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        {/* Close button */}
                        <motion.div
                            className="absolute top-4 right-4 z-10"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsLightboxOpen(false)}
                                className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </motion.div>

                        {/* Navigation */}
                        <motion.div
                            className="absolute left-4 z-10"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                                className="h-14 w-14 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </Button>
                        </motion.div>

                        <motion.div
                            className="absolute right-4 z-10"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                className="h-14 w-14 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                            >
                                <ChevronRight className="h-8 w-8" />
                            </Button>
                        </motion.div>

                        {/* Image */}
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.img
                                key={currentIndex}
                                src={images[currentIndex]}
                                alt={`Galeria ${currentIndex + 1}`}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                                    opacity: { duration: 0.25 },
                                }}
                                className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                                draggable={false}
                            />
                        </AnimatePresence>

                        {/* Counter */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
