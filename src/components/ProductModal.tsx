import React, { useState } from 'react';
import { Minus, Plus, ShoppingBag, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductVariant, CartItem } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [selectedFlavor, setSelectedFlavor] = useState<string>(product.hasFlavors && product.flavors ? product.flavors[0] : '');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart({
      productId: product.id,
      name: product.modalName || product.name,
      variant: selectedVariant,
      flavor: product.hasFlavors ? selectedFlavor : undefined,
      quantity,
      price: selectedVariant.price * quantity,
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0 border-stone-200 flex flex-col max-h-[90vh]" showCloseButton={false}>
        <div className="relative h-48 sm:h-56 w-full bg-stone-100 shrink-0 overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{ objectPosition: product.imagePosition || 'center' }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent h-20" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white backdrop-blur-sm"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            <span className="sr-only">Fechar</span>
          </Button>
          {product.badge && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Badge className={`absolute top-3 left-3 shadow-sm ${product.badgeColor || 'bg-stone-800 text-white'}`}>
                {product.badge}
              </Badge>
            </motion.div>
          )}
        </div>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-5 sm:p-6">
            <DialogHeader className="mb-4 text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <DialogTitle className="text-2xl font-bold text-stone-800 tracking-tight">
                  {product.modalName || product.name}
                </DialogTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <DialogDescription className="text-stone-500 mt-2 text-sm sm:text-base">
                  {product.description}
                </DialogDescription>
              </motion.div>
            </DialogHeader>

            <Separator className="my-6" />

            {/* Variants */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-3">
                {product.variantLabel || 'Escolha o Tamanho'}
              </h4>
              <div className="space-y-2">
                {product.variants.map((variant, index) => (
                  <motion.label
                    key={variant.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.06, duration: 0.3 }}
                    onClick={() => setSelectedVariant(variant)}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedVariant.label === variant.label
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-stone-100 hover:border-stone-200 hover:bg-stone-50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedVariant.label === variant.label ? 'border-primary' : 'border-stone-300'
                        }`}>
                        <AnimatePresence>
                          {selectedVariant.label === variant.label && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 25 }}
                              className="w-2.5 h-2.5 bg-primary rounded-full"
                            />
                          )}
                        </AnimatePresence>
                      </div>
                      <span className="font-medium text-stone-800">{variant.label}</span>
                    </div>
                    <span className="font-bold text-stone-800">
                      R$ {variant.price.toFixed(2).replace('.', ',')}
                    </span>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Flavors */}
            {product.hasFlavors && product.flavors && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-3">
                  Escolha o Sabor
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.flavors.map((flavor, index) => (
                    <motion.label
                      key={flavor}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.45 + index * 0.04, duration: 0.25 }}
                      onClick={() => setSelectedFlavor(flavor)}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedFlavor === flavor
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-stone-100 hover:border-stone-200 hover:bg-stone-50'
                        }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selectedFlavor === flavor ? 'border-primary' : 'border-stone-300'
                        }`}>
                        <AnimatePresence>
                          {selectedFlavor === flavor && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 25 }}
                              className="w-2.5 h-2.5 bg-primary rounded-full"
                            />
                          )}
                        </AnimatePresence>
                      </div>
                      <span className="font-medium text-stone-800 text-sm">{flavor}</span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <DialogFooter className="p-6 bg-stone-50 border-t border-stone-100 flex-row sm:justify-between items-center gap-4">
            <div className="flex items-center bg-white rounded-full border border-stone-200 shadow-sm overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-none hover:bg-stone-100 text-stone-600"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={18} />
              </Button>
              <AnimatePresence mode="wait">
                <motion.span
                  key={quantity}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="w-10 text-center font-bold text-stone-800 inline-block"
                >
                  {quantity}
                </motion.span>
              </AnimatePresence>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-none hover:bg-stone-100 text-stone-600"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={18} />
              </Button>
            </div>

            <motion.div
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleAddToCart}
                className="w-full h-12 rounded-full font-bold text-base shadow-md shadow-primary/20"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                <span>Adicionar</span>
                <motion.span
                  key={selectedVariant.price * quantity}
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="ml-1"
                >
                  • R$ {(selectedVariant.price * quantity).toFixed(2).replace('.', ',')}
                </motion.span>
              </Button>
            </motion.div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
