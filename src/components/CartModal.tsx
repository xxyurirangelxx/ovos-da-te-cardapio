import React from 'react';
import { Trash2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';
import { WHATSAPP_NUMBER } from '../data';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from './ui/sheet';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface CartModalProps {
  items: CartItem[];
  onClose: () => void;
  onRemoveItem: (id: string) => void;
}

export function CartModal({ items, onClose, onRemoveItem }: CartModalProps) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    let message = `*NOVO PEDIDO - OVOS DA TÊ* 🐰🍫\n\n`;

    items.forEach((item, index) => {
      message += `*${index + 1}. ${item.name}*\n`;
      message += `Tamanho/Opção: ${item.variant.label}\n`;

      if (item.flavor) {
        message += `Sabor: ${item.flavor}\n`;
      }

      message += `Quantidade: ${item.quantity}\n`;
      message += `Valor: R$ ${item.price.toFixed(2).replace('.', ',')}\n\n`;
    });

    message += `*TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
    message += `Olá! Gostaria de finalizar este pedido.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col border-stone-200">
        <SheetHeader className="p-6 border-b border-stone-100 text-left bg-white shrink-0">
          <SheetTitle className="text-2xl font-bold text-stone-800">Seu Pedido</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-grow bg-stone-50/50">
          <div className="p-6">
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center justify-center h-64 text-stone-400"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </motion.div>
                <p className="text-lg font-medium text-stone-500">Seu carrinho está vazio</p>
                <p className="text-sm mt-2 text-center max-w-[200px]">Adicione algumas delícias para continuar.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 50, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -50, scale: 0.9, height: 0, marginBottom: 0, padding: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                        layout: { duration: 0.3 }
                      }}
                      className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex gap-4"
                    >
                      <div className="flex-grow">
                        <h4 className="font-bold text-stone-800 leading-tight mb-1">{item.name}</h4>
                        <div className="text-sm text-stone-500 space-y-0.5 mb-2">
                          <p>Tamanho: <span className="font-medium text-stone-700">{item.variant.label}</span></p>
                          {item.flavor && <p>Sabor: <span className="font-medium text-stone-700">{item.flavor}</span></p>}
                          <p>Quantidade: <span className="font-medium text-stone-700">{item.quantity}</span></p>
                        </div>
                        <div className="font-bold text-primary">
                          R$ {item.price.toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                      <div className="flex items-start">
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveItem(item.id)}
                            className="text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full h-8 w-8"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </ScrollArea>

        <AnimatePresence>
          {items.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <SheetFooter className="p-6 bg-white border-t border-stone-100 flex-col sm:flex-col gap-4 shrink-0">
                <div className="flex justify-between items-center w-full mb-2">
                  <span className="text-stone-500 font-medium">Total do Pedido</span>
                  <motion.span
                    key={total}
                    initial={{ scale: 1.2, color: '#b45309' }}
                    animate={{ scale: 1, color: '#1c1917' }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl font-black text-stone-800"
                  >
                    R$ {total.toFixed(2).replace('.', ',')}
                  </motion.span>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleCheckout}
                    className="w-full h-14 rounded-full font-bold text-lg bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg shadow-[#25D366]/20 transition-all"
                  >
                    <MessageCircle className="mr-2 h-6 w-6" />
                    Finalizar no WhatsApp
                  </Button>
                </motion.div>
                <p className="text-xs text-center text-stone-400 font-medium">
                  Você será redirecionado para o WhatsApp com os detalhes do pedido.
                </p>
              </SheetFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
