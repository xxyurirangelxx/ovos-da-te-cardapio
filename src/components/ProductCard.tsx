import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const startingPrice = Math.min(...product.variants.map((v) => v.price));

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 border-stone-200/60 hover:border-primary/30 flex flex-col h-full group p-0 gap-0"
        onClick={() => onClick(product)}
      >
        <div className="relative h-48 w-full bg-stone-100 overflow-hidden shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            style={{ objectPosition: product.imagePosition || 'center' }}
            referrerPolicy="no-referrer"
          />
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {product.badge && (
            <Badge
              className={`absolute top-3 left-3 shadow-sm ${product.badgeColor || 'bg-stone-800 text-white hover:bg-stone-700'}`}
            >
              {product.badge}
            </Badge>
          )}
        </div>
        <CardHeader className="p-5 pb-2">
          <CardTitle className="text-xl font-bold text-stone-800 leading-tight">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0 flex-grow">
          <CardDescription className="text-sm text-stone-500 line-clamp-2">
            {product.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-5 bg-stone-50 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">A partir de</span>
            <span className="text-xl font-bold text-primary">
              R$ {startingPrice.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Button size="icon" variant="secondary" className="rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Plus className="h-5 w-5" />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
