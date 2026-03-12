// Define a estrutura de um tamanho/opção de produto (ex: "Casca 500g" - R$ 69.90)
export type ProductVariant = {
  label: string;
  price: number;
};

// Define a estrutura completa de um Produto no catálogo
export type Product = {
  id: string; // Identificador único
  name: string; // Nome exibido no card
  category: string; // Categoria para o filtro
  image: string; // URL da imagem
  badge?: string; // Etiqueta opcional (ex: "Mais Vendido")
  badgeColor?: string; // Cor da etiqueta
  description: string; // Descrição curta
  descriptionExtra?: string; // Descrição longa (HTML)
  hasFlavors: boolean; // Se o produto exige escolha de sabor
  flavors?: string[]; // Lista de sabores disponíveis
  variants: ProductVariant[]; // Lista de tamanhos/preços
  notes?: string; // Notas de aviso no modal
  modalName?: string; // Nome alternativo para exibir no modal
  imagePosition?: string; // Ajuste de posição da imagem (CSS object-position)
};

// Define a estrutura de um item que foi adicionado ao carrinho
export type CartItem = {
  id: string; // ID único gerado no momento da adição ao carrinho
  productId: string; // Referência ao produto original
  name: string; // Nome do produto
  variant: ProductVariant; // Tamanho escolhido
  flavor?: string; // Sabor escolhido (se aplicável)
  quantity: number; // Quantidade
  price: number; // Preço total (preço da variante * quantidade)
};
