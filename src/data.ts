import { Product } from './types';

// Número do WhatsApp que receberá os pedidos (formato: código do país + DDD + número)
export const WHATSAPP_NUMBER = "5519999928688";

// Categorias usadas no menu de navegação e filtro
export const CATEGORIES = [
    { id: "all", label: "Todos" },
    { id: "colher", label: "De Colher" },
    { id: "tradicional", label: "Tradicionais" },
    { id: "trufado", label: "Trufados" },
    { id: "infantil", label: "Infantil" },
    { id: "especiais", label: "Cestas & Kits" },
];

// Sabores comuns reutilizados em vários produtos para facilitar a manutenção
export const COMMON_FLAVORS = [
    "Brigadeiro",
    "Prestígio",
    "Paçoca",
    "Leite Ninho",
    "Oreo",
    "Sensação",
    "Bis",
    "Kit Kat",
    "Bombom",
];

// Lista principal de produtos da loja
export const PRODUCTS: Product[] = [
    {
        id: "ovo-de-colher",
        name: "Ovo de Colher",
        category: "colher",
        image: "/images/colher.png",
        badge: "Ovo de Colher",
        badgeColor: "bg-pink-400 text-white",
        description: 'Meio ovo super recheado.',
        descriptionExtra: '<strong>Sabores:</strong> Brigadeiro, Prestígio, Paçoca, Leite Ninho, Oreo, Sensação, Bis, Kit Kat e Bombom.',
        hasFlavors: true,
        flavors: COMMON_FLAVORS,
        variants: [
            { label: "Casca 350 gr.", price: 59.9 },
            { label: "Casca 500 gr.", price: 69.9 },
        ],
    },
    {
        id: "ovo-tradicional",
        name: "Ovo Tradicional",
        category: "tradicional",
        image: "/images/tradicional.jpeg",
        badge: "Ovo Tradicional",
        badgeColor: "bg-amber-700 text-white",
        description: "O clássico ovo de Páscoa da Tê com casca saborosa de chocolate de excelente qualidade. Ideal para presentear toda a família!",
        hasFlavors: false,
        variants: [
            { label: "Casca 250 gr.", price: 35.0 },
            { label: "Casca 350 gr.", price: 39.9 },
            { label: "Casca 500 gr.", price: 59.9 },
        ],
    },
    {
        id: "ovo-trufado",
        name: "Ovo Trufado",
        category: "trufado",
        image: "/images/tradicional.jpeg",
        badge: "Ovo Trufado",
        badgeColor: "bg-amber-900 text-pink-200",
        description: "Casca fechada com recheio cremoso e irresistível.",
        descriptionExtra: '<strong>Sabores:</strong> Brigadeiro, Prestígio, Paçoca, Leite Ninho, Oreo, Sensação, Bis, Kit Kat e Bombom.',
        hasFlavors: true,
        flavors: COMMON_FLAVORS,
        variants: [
            { label: "Casca 250 gr.", price: 39.9 },
            { label: "Casca 350 gr.", price: 49.9 },
            { label: "Casca 500 gr.", price: 69.9 },
        ],
    },
    {
        id: "kit-mini-confeiteiro",
        name: "Kit Mini Confeiteiro",
        category: "infantil",
        image: "/images/crianca.jpeg",
        badge: "Kit Infantil",
        badgeColor: "bg-yellow-400 text-amber-900",
        description: "Perfeito para a diversão das crianças! Casca de chocolate ao leite, uma bisnaga de brigadeiro e dois tubetes de confeitos diversos.",
        hasFlavors: false,
        variants: [{ label: "Padrão", price: 49.9 }],
    },
    {
        id: "caixa-personalizada",
        name: "Caixa Personalizada",
        category: "especiais",
        image: "/images/mini ovos.jpeg",
        badge: "Kits & Cestas",
        badgeColor: "bg-purple-500 text-white",
        description: "Linda caixinha decorada contendo 3 mini ovos de colher com sabores a sua escolha para presentear quem você ama.",
        hasFlavors: true,
        flavors: COMMON_FLAVORS,
        variants: [{ label: "Padrão", price: 29.9 }],
        notes: "Atenção: Selecione o sabor principal. Como o kit vem com 3 ovos, você poderá informar os outros 2 sabores detalhadamente pelo WhatsApp.",
        modalName: "Caixa Personalizada com 3 Ovos de Colher",
    },
    {
        id: "cestas-premium",
        name: "Cestas Premium",
        category: "especiais",
        image: "/images/cesta.png",
        badge: "Kits & Cestas",
        badgeColor: "bg-purple-500 text-white",
        description: "As opções mais completas e elegantes para uma surpresa inesquecível!",
        hasFlavors: false,
        variants: [
            { label: "Cesta de chocolate com 15 itens", price: 150.0 },
            { label: "Cesta de chocolate com pelúcia", price: 180.0 },
        ],
        modalName: "Cesta Premium de Chocolate",
    },
    {
        id: "cestas-ovos-coelhinhos",
        name: "Cestas Ovos & Coelhinhos",
        category: "especiais",
        image: "/images/coelinhos.png",
        badge: "Kits & Cestas",
        badgeColor: "bg-purple-500 text-white",
        description: "Conjuntos perfeitos misturando ovos tradicionais, deliciosos bombons e mini coelhinhos.",
        hasFlavors: false,
        variants: [
            {
                label: "Cesta com 2 ovos de 350 gr., 2 coelhinhos e 20 bombons",
                price: 130.0,
            },
            {
                label: "Cesta com 1 ovo de 350 gr. 1 coelhinho e 20 bombons",
                price: 79.9,
            },
        ],
        modalName: "Cesta Ovos e Coelhinhos",
    },
    {
        id: "cachepos-especiais",
        name: "Cachepôs Especiais",
        category: "especiais",
        image: "/images/cachepos.jpeg",
        badge: "Kits & Cestas",
        badgeColor: "bg-purple-500 text-white",
        description: "Lembrancinhas montadas em lindos cachepôs com recheios sortidos. Ótimo custo-benefício.",
        hasFlavors: false,
        variants: [
            {
                label: "Cachepó com 1 ovo recheado com bombons de 150 gr., 1 coelhinho de chocolate e 10 bombons recheados",
                price: 49.9,
            },
            {
                label: "Cachepó com 2 ovos de 150 gr., 2 coelhinhos de chocolate e 6 bombons recheados",
                price: 59.9,
            },
            { label: "Cachepó com 3 ovos de 150 gr.", price: 44.9 },
        ],
        modalName: "Cachepó Especial",
    },
    {
        id: "controle-videogame-trufado",
        name: "Controle de VideoGame Trufado",
        category: "especiais",
        image: "/images/controle.jpeg",
        badge: "Novidade",
        badgeColor: "bg-purple-500 text-white",
        description: "Um chocolate divertido e delicioso! Formato de controle de video game recheado totalmente com trufa.",
        imagePosition: "bottom",
        hasFlavors: true,
        flavors: COMMON_FLAVORS,
        variants: [{ label: "Padrão", price: 49.9 }],
    },
];

export const GALLERY_IMAGES = [
    "/galeria/WhatsApp Image 2026-03-03 at 14.45.52.jpeg",
    "/galeria/WhatsApp Image 2026-03-03 at 14.45.53 (1).jpeg",
    "/galeria/WhatsApp Image 2026-03-03 at 14.45.53.jpeg",
    "/galeria/WhatsApp Image 2026-03-03 at 14.45.54 (1).jpeg",
    "/galeria/WhatsApp Image 2026-03-03 at 14.45.54 (2).jpeg",
    "/galeria/WhatsApp Image 2026-03-03 at 14.45.54 (3).jpeg",
    "/galeria/WhatsApp Image 2026-03-03 at 14.45.54 (4).jpeg",
    "/galeria/WhatsApp Image 2026-03-03 at 14.45.54 (5).jpeg",
    "/galeria/WhatsApp Image 2026-03-03 at 14.45.54.jpeg",
    "/galeria/WhatsApp Image 2026-03-03 at 14.45.55 (1).jpeg",
    "/galeria/WhatsApp Image 2026-03-03 at 14.45.55 (2).jpeg",
    "/galeria/WhatsApp Image 2026-03-03 at 14.45.55 (3).jpeg",
    "/galeria/WhatsApp Image 2026-03-03 at 14.45.55 (4).jpeg",
    "/galeria/WhatsApp Image 2026-03-03 at 14.45.55.jpeg",
    "/galeria/WhatsApp Image 2026-03-03 at 14.45.56.jpeg",
];
