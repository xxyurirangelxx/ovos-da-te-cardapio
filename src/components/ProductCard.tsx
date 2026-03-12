import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Plus, X, ZoomIn } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const startingPrice = Math.min(...product.variants.map((v) => v.price));
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card
          className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 border-stone-200/60 hover:border-primary/30 flex flex-col h-full group p-0 gap-0"
        >
          {/* Imagem - proporção vertical, object-cover para preencher */}
          <div
            className="relative w-full bg-stone-100 overflow-hidden shrink-0"
            style={{ aspectRatio: '4/5' }}
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(true);
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            {/* Hover overlay com ícone de zoom */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                  <ZoomIn className="h-5 w-5 text-stone-700" />
                </div>
              </motion.div>
            </div>
            {product.badge && (
              <Badge
                className={`absolute top-3 left-3 shadow-sm ${product.badgeColor || 'bg-stone-800 text-white hover:bg-stone-700'}`}
              >
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Conteúdo - clique abre o modal do produto */}
          <div onClick={() => onClick(product)}>
            <CardHeader className="p-4 pb-1">
              <CardTitle className="text-lg font-bold text-stone-800 leading-tight">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
              <CardDescription className="text-sm text-stone-500 line-clamp-2">
                {product.description}
              </CardDescription>
            </CardContent>
          </div>

          <CardFooter className="p-4 pt-2 flex items-center justify-between mt-auto gap-3">
            <div className="flex flex-col shrink-0">
              <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">A partir de</span>
              <span className="text-xl font-bold text-primary">
                R$ {startingPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 max-w-[140px]"
            >
              <Button
                onClick={(e) => { e.stopPropagation(); onClick(product); }}
                className="w-full h-10 rounded-full font-semibold text-sm shadow-md shadow-primary/20 gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Lightbox - ampliar imagem */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              className="absolute top-4 right-4 z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsZoomed(false)}
                className="h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.img
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              src={product.image}
              alt={product.name}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 text-white font-medium px-5 py-2.5 rounded-full backdrop-blur-sm text-sm"
            >
              {product.name}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
