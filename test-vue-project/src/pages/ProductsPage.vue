<template>
  <div class="products-page">
    <v-container>
      <v-row class="justify-center">
        <v-col cols="12" md="12" lg="8">
          <h1 class="text-h3 mb-6 text-center">Каталог Продуктов</h1>
          <div class="text-body-1 mb-6 text-center">
            Управление продуктами с поиском, фильтрацией и CRUD операциями.
          </div>
        </v-col>
      </v-row>

      <v-row class="justify-center">
        <v-col cols="12" md="12" lg="8">
          <product-list
            :products="products"
            :loading="loading"
            @create="showCreateForm = true"
            @view="viewProduct"
            @edit="editProduct"
            @delete="deleteProduct"
            class="mb-8"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ProductList from "@/features/product-catalog/ui/ProductList.vue";
import type { Product } from "@/entities/product";

// Моковые данные продуктов
const mockProducts: Product[] = [
  {
    id: 1,
    title: "Смартфон iPhone 14 Pro",
    description: "Флагманский смартфон Apple с камерой 48 МП",
    price: 129990,
    discountPercentage: 5,
    rating: 4.8,
    stock: 25,
    brand: "Apple",
    category: "Электроника",
    thumbnail:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-model-unselect-gallery-2-202309?wid=5120&hei=2880&fmt=webp",
  },
  {
    id: 2,
    title: 'Ноутбук MacBook Pro 16"',
    description: "Профессиональный ноутбук с чипом M3 Pro",
    price: 249990,
    discountPercentage: 0,
    rating: 4.9,
    stock: 12,
    brand: "Apple",
    category: "Электроника",
    thumbnail:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp-14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg",
  },
  {
    id: 3,
    title: "Наушники Sony WH-1000XM5",
    description: "Беспроводные наушники с шумоподавлением",
    price: 34990,
    discountPercentage: 10,
    rating: 4.7,
    stock: 45,
    brand: "Sony",
    category: "Аксессуары",
    thumbnail: "https://m.media-amazon.com/images/I/61vJ6OijDaL._AC_SL1500_.jpg",
  },
  {
    id: 4,
    title: "Игровая консоль PlayStation 5",
    description: "Игровая приставка нового поколения",
    price: 59990,
    discountPercentage: 0,
    rating: 4.8,
    stock: 8,
    brand: "Sony",
    category: "Игры",
    thumbnail: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21",
  },
  {
    id: 5,
    title: "Умные часы Apple Watch Series 9",
    description: "Умные часы с функцией измерения ЭКГ",
    price: 45990,
    discountPercentage: 7,
    rating: 4.6,
    stock: 32,
    brand: "Apple",
    category: "Аксессуары",
    thumbnail:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-card-40-ultra2-202309_GEO_RU?wid=340&hei=264&fmt=p-jpg",
  },
  {
    id: 6,
    title: 'Планшет iPad Pro 12.9"',
    description: "Профессиональный планшет с дисплеем Liquid Retina XDR",
    price: 149990,
    discountPercentage: 3,
    rating: 4.8,
    stock: 18,
    brand: "Apple",
    category: "Электроника",
    thumbnail:
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-12-11-select-202210?wid=820&hei=1092&fmt=jpeg",
  },
  {
    id: 7,
    title: "Фотоаппарат Canon EOS R5",
    description: "Беззеркальная камера с разрешением 45 МП",
    price: 389990,
    discountPercentage: 0,
    rating: 4.9,
    stock: 5,
    brand: "Canon",
    category: "Фототехника",
    thumbnail:
      "https://static.photoblog.canon-europe.com/wp-content/uploads/sites/2/2020/07/EOSR5_angled_left_hero-1.jpg",
  },
  {
    id: 8,
    title: 'Телевизор LG OLED C3 65"',
    description: "4K OLED телевизор с технологией AI",
    price: 199990,
    discountPercentage: 12,
    rating: 4.7,
    stock: 14,
    brand: "LG",
    category: "Техника для дома",
    thumbnail: "https://www.lg.com/ru/images/tvs/md08001017/gallery/medium01.jpg",
  },
  {
    id: 9,
    title: "Смартфон Samsung Galaxy S24 Ultra",
    description: "Флагманский смартфон с пером S Pen и камерой 200 МП",
    price: 149990,
    discountPercentage: 8,
    rating: 4.8,
    stock: 22,
    brand: "Samsung",
    category: "Электроника",
    thumbnail:
      "https://images.samsung.com/is/image/samsung/p6pim/ru/feature/164041755/ru-feature-galaxy-s24-s24-s928-536886717",
  },
  {
    id: 10,
    title: "Игровой ноутбук ASUS ROG Strix G18",
    description: "Игровой ноутбук с процессором Intel Core i9 и RTX 4090",
    price: 299990,
    discountPercentage: 5,
    rating: 4.9,
    stock: 7,
    brand: "ASUS",
    category: "Электроника",
    thumbnail: "https://dlcdnweb.download/wsd/assets/products/61868/images/main/DN8wRuvEWI.jpg",
  },
  {
    id: 11,
    title: "Кофемашина DeLonghi Magnifica S",
    description: "Автоматическая кофемашина для приготовления эспрессо и капучино",
    price: 69990,
    discountPercentage: 15,
    rating: 4.6,
    stock: 19,
    brand: "DeLonghi",
    category: "Техника для дома",
    thumbnail:
      "https://www.delonghi.com/medias/Dedica-Style-EC685M-1100W-19BAR-Main-1200Wx1200H?context=bWFzdGVyfHJvb3R8MTQwNDYyfGltYWdlL2pwZWd8aDk0L2hmZi8xMDE2MjEyNDk0NTcxMC5qcGd8ZjBhNmM5M2EzZjcwNjExOWU2Njg1ZjE5Y2NlZGRmMTJjY2Q3YjI5MmY1Y2EzYjVmMDNjZDI1MTgwNDFiNjk5Yw",
  },
  {
    id: 12,
    title: "Беспроводная клавиатура Logitech MX Keys",
    description: "Эргономичная беспроводная клавиатура с подсветкой",
    price: 12990,
    discountPercentage: 10,
    rating: 4.7,
    stock: 42,
    brand: "Logitech",
    category: "Аксессуары",
    thumbnail:
      "https://resource.logitech.com/content/dam/logitech/en/products/keyboards/mx-keys/gallery/mx-keys-top-view-grey-gallery.png",
  },
  {
    id: 13,
    title: 'Монитор Dell UltraSharp 32" 4K',
    description: "Профессиональный монитор с разрешением 4K и цветовым охватом 100% sRGB",
    price: 89990,
    discountPercentage: 0,
    rating: 4.8,
    stock: 11,
    brand: "Dell",
    category: "Электроника",
    thumbnail:
      "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/u-series/u3223qe/media-gallery/monitor-u3223qe-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402&chrss=full",
  },
  {
    id: 14,
    title: "Робот-пылесос iRobot Roomba j7+",
    description: "Умный робот-пылесос с самоочисткой и навигацией",
    price: 89990,
    discountPercentage: 12,
    rating: 4.5,
    stock: 27,
    brand: "iRobot",
    category: "Техника для дома",
    thumbnail: "https://homesupport.irobot.com/euf/assets/img/global/roomba-j7-plus.png",
  },
  {
    id: 15,
    title: "Фитнес-браслет Xiaomi Mi Band 8",
    description: "Умный браслет с отслеживанием активности и пульса",
    price: 3990,
    discountPercentage: 20,
    rating: 4.4,
    stock: 68,
    brand: "Xiaomi",
    category: "Аксессуары",
    thumbnail:
      "https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1682327133.80296359.png",
  },
  {
    id: 16,
    title: "Игровая мышь Razer DeathAdder V3",
    description: "Эргономичная игровая мышь с оптическим сенсором 30K DPI",
    price: 8990,
    discountPercentage: 0,
    rating: 4.9,
    stock: 35,
    brand: "Razer",
    category: "Аксессуары",
    thumbnail: "https://assets2.razerzone.com/images/daV3/og-image.png",
  },
  {
    id: 17,
    title: "Внешний SSD Samsung T7 Shield 2TB",
    description: "Защищенный внешний SSD с защитой от воды и пыли",
    price: 19990,
    discountPercentage: 5,
    rating: 4.8,
    stock: 41,
    brand: "Samsung",
    category: "Аксессуары",
    thumbnail:
      "https://images.samsung.com/is/image/samsung/p6pim/ru/feature/164041755/ru-feature-t7-shield-portable-ssd-1tb-mu-pe2t0b-eu-536886717",
  },
  {
    id: 18,
    title: "Игровая консоль Xbox Series X",
    description: "Мощная игровая консоль с поддержкой 4K и 120 FPS",
    price: 54990,
    discountPercentage: 0,
    rating: 4.7,
    stock: 15,
    brand: "Microsoft",
    category: "Игры",
    thumbnail:
      "https://compass-ssl.xbox.com/assets/b9/0a/b90ad58f-9950-44a7-87fa-1ee8f0f6a8e6.jpg?n=XSX_Page-Hero-0_768x658.jpg",
  },
];

const products = ref<Product[]>(mockProducts);
const loading = ref(false);
const showCreateForm = ref(false);
const selectedProduct = ref<Product>();

// Имитация загрузки данных
onMounted(() => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});

const viewProduct = (product: Product) => {
  selectedProduct.value = product;
  // В будущем можно открыть модалку с деталями
  alert(`Просмотр продукта: ${product.title}`);
};

const editProduct = (product: Product) => {
  selectedProduct.value = product;
  showCreateForm.value = true;
};

const deleteProduct = (product: Product) => {
  if (confirm(`Удалить продукт "${product.title}"?`)) {
    products.value = products.value.filter((p) => p.id !== product.id);
  }
};
</script>

<style scoped>
.products-page {
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 100%;
}

:deep(.v-container) {
  padding-left: 0 !important;
  padding-right: 0 !important;
  max-width: 100% !important;
}
</style>
