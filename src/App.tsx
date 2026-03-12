import React, { useState, useRef } from 'react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { CATEGORIES, PRODUCTS, GALLERY_IMAGES } from './data';
import { Product, CartItem } from './types';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartModal } from './components/CartModal';
import { Input } from './components/ui/input';
import { Button, buttonVariants } from './components/ui/button';
import { ScrollArea, ScrollBar } from './components/ui/scroll-area';

// Componente auxiliar para animar elementos quando entram na viewport
function FadeInWhenVisible({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    };
    setCartItems([...cartItems, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img 
                src="/logo.png" 
                alt="Ovos da Tê" 
                className="h-20 w-auto object-contain scale-[1.6] origin-left ml-2"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  document.getElementById('fallback-logo-header')?.classList.remove('hidden');
                  document.getElementById('fallback-logo-header')?.classList.add('flex');
                }}
              />
              <div id="fallback-logo-header" className="hidden items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner shadow-amber-900/20">
                  Tê
                </div>
                <h1 className="text-2xl font-black text-stone-800 tracking-tight">
                  Ovos da <span className="text-amber-600">Tê</span>
                </h1>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {['Cardápio', 'Galeria', 'Sobre'].map((label, i) => (
                <motion.a
                  key={label}
                  href={`#${label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
                  className="text-stone-600 hover:text-amber-600 font-medium transition-colors relative"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  {label}
                </motion.a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5, type: "spring" }}
              >
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCartOpen(true)}
                  className="relative text-stone-600 hover:text-primary hover:bg-primary/10 rounded-full h-10 w-10"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <AnimatePresence mode="wait">
                    {cartItemsCount > 0 && (
                      <motion.span
                        key={cartItemsCount}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm"
                      >
                        {cartItemsCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
              
              {/* Mobile Menu Toggle */}
              <Button 
                variant="ghost"
                size="icon"
                className="md:hidden text-stone-600 hover:bg-stone-100 rounded-full h-10 w-10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isMenuOpen ? 'close' : 'menu'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden bg-white border-t border-stone-100 shadow-lg absolute w-full overflow-hidden"
            >
              <div className="py-4 px-4 space-y-1">
                {['Cardápio', 'Galeria', 'Sobre'].map((label, i) => (
                  <motion.a
                    key={label}
                    href={`#${label.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-stone-800 font-medium p-3 hover:bg-stone-50 rounded-lg"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                  >
                    {label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-amber-900 text-amber-50 py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1514517521153-1be72277b32f?auto=format&fit=crop&q=80&w=2000" 
              alt="Chocolate background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900 to-transparent"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
            >
              Páscoa Artesanal
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl text-amber-200/80 max-w-2xl mx-auto mb-10 font-medium"
            >
              Ovos de colher, tradicionais e trufados feitos com muito amor e ingredientes selecionados para deixar sua Páscoa mais doce.
            </motion.p>
            <motion.a 
              href="#cardapio"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.98 }}
              className={buttonVariants({ size: "lg", className: "bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 px-10 rounded-full transition-all shadow-xl shadow-primary/20 text-lg" })}
            >
              Ver Cardápio
            </motion.a>
          </div>

          {/* Floating decorative elements */}
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 rounded-full bg-amber-500/10 blur-xl"
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 right-20 w-32 h-32 rounded-full bg-amber-400/10 blur-2xl"
            animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </section>

        {/* Menu Section */}
        <section id="cardapio" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="text-3xl font-black text-stone-800 mb-2">Nosso Cardápio</h2>
                <p className="text-stone-500">Escolha suas delícias favoritas</p>
              </div>
              
              {/* Search with animation */}
              <motion.div 
                className="relative w-full md:w-72"
                animate={{ width: isSearchFocused ? '100%' : undefined }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ maxWidth: isSearchFocused ? '24rem' : undefined }}
              >
                <motion.div 
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  animate={{ color: isSearchFocused ? 'var(--color-primary)' : undefined }}
                >
                  <Search className="h-5 w-5 text-stone-400" />
                </motion.div>
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="pl-10 py-6 rounded-2xl border-stone-200 bg-white focus-visible:ring-primary focus-visible:border-primary shadow-sm transition-shadow duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  style={{ boxShadow: isSearchFocused ? '0 8px 30px rgba(0,0,0,0.08)' : undefined }}
                />
              </motion.div>
            </div>
          </FadeInWhenVisible>

          {/* Categories with animated selection */}
          <FadeInWhenVisible delay={0.1}>
            <ScrollArea className="w-full whitespace-nowrap pb-4 mb-8">
              <div className="flex w-max space-x-3 px-1">
                {CATEGORIES.map((category) => (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={activeCategory === category.id ? "default" : "outline"}
                      onClick={() => setActiveCategory(category.id)}
                      className={`rounded-full px-6 py-5 font-bold text-sm transition-all relative overflow-hidden ${
                        activeCategory === category.id
                          ? 'shadow-md shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {activeCategory === category.id && (
                        <motion.div
                          layoutId="activeCategory"
                          className="absolute inset-0 bg-primary rounded-full"
                          style={{ zIndex: -1 }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      {category.label}
                    </Button>
                  </motion.div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
          </FadeInWhenVisible>

          {/* Product Grid with AnimatePresence */}
          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              <motion.div
                key={activeCategory + searchQuery}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.06,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <ProductCard 
                      product={product} 
                      onClick={setSelectedProduct} 
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20 bg-white rounded-3xl border border-stone-100 shadow-sm"
              >
                <motion.div
                  initial={{ y: 10 }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Search className="h-12 w-12 text-stone-300 mx-auto mb-4" />
                </motion.div>
                <p className="text-stone-500 text-lg mb-4">Nenhum produto encontrado para sua busca.</p>
                <Button 
                  variant="outline"
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                  className="text-primary border-primary/20 hover:bg-primary/10"
                >
                  Limpar filtros
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Gallery Section */}
        <section id="galeria" className="py-20 bg-white border-t border-stone-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInWhenVisible>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-stone-800 mb-4">Galeria de Delícias</h2>
                <p className="text-stone-500 max-w-2xl mx-auto">Um pouco do nosso trabalho e da qualidade que entregamos em cada ovo de Páscoa.</p>
              </div>
            </FadeInWhenVisible>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {GALLERY_IMAGES.slice(0, 8).map((img, i) => (
                <FadeInWhenVisible key={i} delay={i * 0.08}>
                  <motion.div
                    className="aspect-square rounded-2xl overflow-hidden bg-stone-100 group cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src={img}
                      alt={`Galeria ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/choco${i}/400/400`;
                      }}
                    />
                  </motion.div>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <FadeInWhenVisible>
        <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/logo.png" 
                alt="Ovos da Tê" 
                className="h-20 w-auto object-contain brightness-0 invert opacity-80"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  document.getElementById('fallback-logo-footer')?.classList.remove('hidden');
                  document.getElementById('fallback-logo-footer')?.classList.add('flex');
                }}
              />
              <div id="fallback-logo-footer" className="hidden items-center justify-center gap-3">
                <div className="w-8 h-8 bg-stone-800 rounded-lg flex items-center justify-center text-stone-300 font-bold text-sm">
                  Tê
                </div>
                <span className="text-xl font-bold text-stone-300 tracking-tight">Ovos da Tê</span>
              </div>
            </div>
            <p className="mb-6 max-w-md mx-auto">Feito com amor e os melhores ingredientes para adoçar a sua vida.</p>
            <p className="text-sm text-stone-500">
              © {new Date().getFullYear()} Ovos da Tê. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </FadeInWhenVisible>

      {/* Modals */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={handleAddToCart} 
        />
      )}

      {isCartOpen && (
        <CartModal 
          items={cartItems} 
          onClose={() => setIsCartOpen(false)} 
          onRemoveItem={handleRemoveItem} 
        />
      )}
    </div>
  );
}
