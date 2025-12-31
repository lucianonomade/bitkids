
import { Category, Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "00142",
    name: "Conjunto Verão Divertido",
    description: "Camiseta algodão e short leve com estampa colorida.",
    price: 89.90,
    old_price: 119.90,
    category: Category.MENINOS,
    sizes: ["2", "4", "6"],
    colors: ["Multi"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBD4PEZ0-lI_y2cGD6uYCXrRMiGvTTqNO6Iqrjp5dZq1djspHvKonlVWsjCSNCOLKHvV9HBoojwU5C_8P7BUbb0OQZldJoUSdTw8k8CdnnXTPTS4JnC7TFvxJ1rwqBbNR_8zu6eziarI0azUIoXDJWlHmPXJ5_0t7Zmnd-EOjSdf6toW7svVDPRQaz0z_ULVhqyhOq_vFuirY1u52T2eyMMUHLf2Q1V-JpEgMlWgBms53e4mSkt019bigFJGvP11AxQ-jWbx6wTVow",
    is_popular: true
  },
  {
    id: "00145",
    name: "Vestido Floral Jardim",
    description: "Vestido em algodão com estampa floral e detalhes em renda.",
    price: 119.90,
    category: Category.MENINAS,
    sizes: ["4", "6", "8"],
    colors: ["Green"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKRIVEFK8sja8mrKUO21YkCYz9D_B--PgurrAQK-MlEoyyvIFD04NTP2hW-XGKrNE1xBRgzGx_uYIxb_39LaUF34CGZccMgPC-meYlkqMEu-hYDn6sIHQx8bis-FQQ7On7JrZoI4XGAlFiOjcc-SEATitQoGV8fVLXeRr4B391LVkgorG4e4Aul4PjLA8gFy-nyTv9TtQXcjulvGtpLUVAwUARwAnW17LpUicDCJSVYreJDeDBKyOkiev3wprBseOh_L3K9DQLh-I",
  },
  {
    id: "00138",
    name: "Jardineira Jeans Baby",
    description: "Jardineira resistente e confortável para bebês.",
    price: 102.00,
    old_price: 120.00,
    category: Category.BEBES,
    sizes: ["1", "2", "3"],
    colors: ["Blue Denim"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDr5l8_Zg1EbfHXKy3-AEhD7khoW9pcL97D1KVWZoxZtWbyz5nX1Vg13khz06TVUCCz4rZgANFpCcM2_tle88a30F7tAr_D2VUasEhKImWFG60JfS3kElvjPrDGQMAiLa96WMTfdXzbkmwEdc4sUINW1eWbYIqL-hahxFK2OddUxZ1AMync0iMeDhyXeRgffRp5tC40QYBcsOssugEH636MmmheodcMVNAbseUE-TUZqMU9x69yMXBlqAyYnU8PyGUt1WZzAVK9zRw",
  },
  {
    id: "00150",
    name: "Pijama Sonhos Felizes",
    description: "Pijama macio 100% algodão com estampas lúdicas.",
    price: 69.90,
    category: Category.BEBES,
    sizes: ["P", "M", "G"],
    colors: ["White"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeHYD6Curj-JDMbVyANq1TLH2cMkG2wxu1dNHMlD0StFWDEicA1iw-OTTQOpCj_JSAQT1xzqgvRbDxIFoVPEa-hXP7FpvjUoJkS9SaqqTVsjn4wmNn3_FkPJoK6DvGyOpIZ0BVfzobvkXAHEaTBRV6D9W8HwR2MVT3b2tK2BVhcKuC0L1Gm87iQrnlkcUC4bQlrOCNzjj8PDNvA9HP0GM0nRhNlFmfGGyWKc2IsNnL7bCoTrx-7Syl1GaSvrd0s1s2UBB-uwzhAhY",
  },
  {
    id: "00160",
    name: "Camisa Social Kids",
    description: "Elegância e conforto para eventos especiais.",
    price: 95.00,
    category: Category.MENINOS,
    sizes: ["4", "6", "8"],
    colors: ["Light Blue"],
    is_new: true,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVg2QM_WRWcl-_uzYiFX1sPU9zKSJumYiGUl6P_2V_J897RD_Y9lEp0liQ92KwmECP0IxXi9lGBgjX5y5E3pfbnI9K_mkKseldNxFVPPOa2VTnVaCrsWvYoRV__b_NEmEqaqKNB1R1Zdk8fEGb-IOaY8YYaKLlkkOx7cjl3J4XYbZzd6P0AChuq6tXj_JeqLnU6srm-nlG5bmy0r7MM8y2uEkVA6q_N1rmIPsJaJkZQBe_Q3ZILuC-0Bh1IYhsAQ34JE6Rcf333AY"
  }
];

export const WHATSAPP_NUMBER = "5551997182923";
