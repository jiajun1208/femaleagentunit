// Explicitly get React and ReactDOM from the global window object
// This is crucial for compatibility with UMD bundles like lucide-react
const React = window.React;
const ReactDOM = window.ReactDOM;

// Now destructure from the React object
const { useState, useEffect } = React;

// Lucide Icons are globally available via UMD build linked in index.html
// Access them directly from the global 'lucideReact' object
const { ShoppingCart, ChevronRight, User, Building, X, Info, ArrowLeft, Settings } = lucideReact;

// 全局 Firebase 實例 (如果成功初始化)
let firebaseApp = null;
let db = null;
let auth = null;

// Firebase 配置彈窗組件
const FirebaseConfigModal = ({ onClose, onSave, initialConfig, lang, translations }) => {
  const [config, setConfig] = useState(initialConfig || {
    apiKey: "AIzaSyCZSC4KP9r9Ia74gjhVM4hkhkCiXU6ltR4",
    authDomain: "avny-ccbe9.firebaseapp.com",
    databaseURL: "https://avny-ccbe9-default-rtdb.firebaseio.com",
    projectId: "avny-ccbe9",
    storageBucket: "avny-ccbe9.firebasestorage.app",
    messagingSenderId: "686829295344",
    appId: "1:686829295344:web:f0412dc3afa84c04701435",
    measurementId: "G-1GT5Y7YYDD"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 text-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors duration-300 rounded-full p-2 bg-gray-700 hover:bg-gray-600"
          aria-label={translations[lang].close}
        >
          <X size={24} />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-purple-400 border-b border-purple-700 pb-3">
          Firebase 設定
        </h2>
        <div className="space-y-4">
          {Object.keys(config).map(key => (
            <div key={key}>
              <label htmlFor={key} className="block text-gray-300 text-sm font-semibold mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </label>
              <input
                type="text"
                id={key}
                name={key}
                value={config[key]}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                placeholder={`輸入您的 ${key}`}
              />
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={handleSave}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 shadow-lg transform hover:scale-105"
          >
            儲存設定
          </button>
        </div>
      </div>
    </div>
  );
};


// 應用程式的主要組件
function App() {
  // 定義所有語言的翻譯內容
  const translations = {
    ja: {
      appName: 'FAU SHOPPING',
      introTitle: 'ようこそ FAU SHOPPING へ',
      ceoProfileTitle: '社長紹介',
      companyProfileTitle: '会社概要',
      ceoName: '黒川 智慧',
      ceoBio: '黒川グループの会長である黒川智慧は、革新的なリーダーシップと卓越したビジョンで知られています。彼の指導の下、当社は技術と顧客満足度の新たな基準を確立しました。',
      companyBio: '黒川グループは、高品質な製品と優れた顧客サービスを提供することに専念する最先端の企業です。私たちは革新を推進し、お客様の生活を豊かにすることを目指しています。',
      enterShop: 'ショッピングを始める',
      productsTitle: '商品一覧',
      addToCart: 'カートに追加',
      viewCart: 'カートを見る',
      cartTitle: 'ショッピングカート',
      total: '合計',
      checkout: 'チェックアウト',
      emptyCart: 'カートは空です。',
      close: '閉じる',
      removeFromCart: '削除',
      language: '言語',
      languageOptions: {
        ja: '日本語',
        en: '英語',
        'zh-tw': '繁體中文',
        'zh-cn': '簡體中文',
        ko: '韓国語',
      },
      productDescription: '高品質な素材で作られた、モダンでスタイリッシュな製品。',
      allCategories: '全商品',
      categoryHypnosis: '催眠類',
      categoryPossession: '附身類',
      categoryTSF: 'TSF類',
      categoryAgentGear: '特工用品',
      aboutUs: '会社情報',
      backToShop: 'ショップに戻る',
      placeOrder: '注文を確定する',
      orderSuccess: 'ご注文ありがとうございます！',
      firebaseSettings: 'Firebase 設定', // 新增 Firebase 設定翻譯
    },
    en: {
      appName: 'FAU SHOPPING',
      introTitle: 'Welcome to FAU SHOPPING',
      ceoProfileTitle: 'CEO Profile',
      companyProfileTitle: 'Company Profile',
      ceoName: 'Kurokawa Chie',
      ceoBio: 'Kurokawa Chie, the Chairman of Kurokawa Group, is known for his innovative leadership and exceptional vision. Under his guidance, the company has set new standards in technology and customer satisfaction.',
      companyBio: 'Kurokawa Group is a cutting-edge enterprise dedicated to providing high-quality products and excellent customer service. We strive to drive innovation and enrich the lives of our customers.',
      enterShop: 'Enter Shop',
      productsTitle: 'Our Products',
      addToCart: 'Add to Cart',
      viewCart: 'View Cart',
      cartTitle: 'Shopping Cart',
      total: 'Total',
      checkout: 'Checkout',
      emptyCart: 'Your cart is empty.',
      close: 'Close',
      removeFromCart: 'Remove',
      language: 'Language',
      languageOptions: {
        ja: 'Japanese',
        en: 'English',
        'zh-tw': 'Traditional Chinese',
        'zh-cn': 'Simplified Chinese',
        ko: 'Korean',
      },
      productDescription: 'A modern and stylish product made with high-quality materials.',
      allCategories: 'All Categories',
      categoryHypnosis: 'Hypnosis',
      categoryPossession: 'Possession',
      categoryTSF: 'TSF',
      categoryAgentGear: 'Agent Gear',
      aboutUs: 'About Us',
      backToShop: 'Back to Shop',
      placeOrder: 'Place Order',
      orderSuccess: 'Thank you for your order!',
      firebaseSettings: 'Firebase Settings', // 新增 Firebase 設定翻譯
    },
    'zh-tw': {
      appName: 'FAU SHOPPING',
      introTitle: '歡迎來到 FAU SHOPPING',
      ceoProfileTitle: '社長簡介',
      companyProfileTitle: '公司簡介',
      ceoName: '黑川 智慧',
      ceoBio: '黑川集團董事長黑川智慧以其創新的領導力和卓越的遠見而聞名。在他的指導下，公司在技術和客戶滿意度方面樹立了新的標準。',
      companyBio: '黑川集團是一家致力於提供高品質產品和卓越客戶服務的尖端企業。我們致力於推動創新，豐富客戶的生活。',
      enterShop: '進入購物頁面',
      productsTitle: '我們的產品',
      addToCart: '加入購物車',
      viewCart: '查看購物車',
      cartTitle: '購物車',
      total: '總計',
      checkout: '結帳',
      emptyCart: '您的購物車是空的。',
      close: '關閉',
      removeFromCart: '移除',
      language: '語言',
      languageOptions: {
        ja: '日文',
        en: '英文',
        'zh-tw': '繁體中文',
        'zh-cn': '簡體中文',
        ko: '韓文',
      },
      productDescription: '一款採用高品質材料製成的現代時尚產品。',
      allCategories: '所有分類',
      categoryHypnosis: '催眠類',
      categoryPossession: '附身類',
      categoryTSF: 'TSF類',
      categoryAgentGear: '特工用品',
      aboutUs: '關於我們',
      backToShop: '返回商店',
      placeOrder: '確認下單',
      orderSuccess: '感謝您的訂單！',
      firebaseSettings: 'Firebase 設定', // 新增 Firebase 設定翻譯
    },
    'zh-cn': {
      appName: 'FAU SHOPPING',
      introTitle: '欢迎来到 FAU SHOPPING',
      ceoProfileTitle: '社长简介',
      companyProfileTitle: '公司简介',
      ceoName: '黑川 智慧',
      ceoBio: '黑川集团董事长黑川智慧以其创新的领导力和卓越的远见而闻名。在他的指导下，公司在技术和客户满意度方面树立了新的标准。',
      companyBio: '黑川集团是一家致力于提供高质量产品和卓越客户服务的尖端企业。我们致力于推动创新，丰富客户的生活。',
      enterShop: '进入购物页面',
      productsTitle: '我们的产品',
      addToCart: '加入购物车',
      viewCart: '查看购物车',
      cartTitle: '购物车',
      total: '总计',
      checkout: '结算',
      emptyCart: '您的购物车是空的。',
      close: '关闭',
      removeFromCart: '移除',
      language: '语言',
      languageOptions: {
        ja: '日文',
        en: '英文',
        'zh-tw': '繁体中文',
        'zh-cn': '简体中文',
        ko: '韩文',
      },
      productDescription: '一款采用高质量材料制成的现代时尚产品。',
      allCategories: '所有分类',
      categoryHypnosis: '催眠类',
      categoryPossession: '附身类',
      categoryTSF: 'TSF类',
      categoryAgentGear: '特工用品',
    },
    ko: {
      appName: 'FAU SHOPPING',
      introTitle: 'FAU SHOPPING에 오신 것을 환영합니다',
      ceoProfileTitle: 'CEO 프로필',
      companyProfileTitle: '회사 프로필',
      ceoName: '쿠로카와 치에',
      ceoBio: '쿠로카와 그룹의 회장인 쿠로카와 치에는 혁신적인 리더십과 탁월한 비전으로 유명합니다. 그의 지도 아래 회사는 기술과 고객 만족도에서 새로운 기준을 세웠습니다.',
      companyBio: '쿠로카와 그룹은 고품질 제품과 우수한 고객 서비스를 제공하는 데 전념하는 최첨단 기업입니다. 우리는 혁신을 추진하고 고객의 삶을 풍요롭게 하는 것을 목표로 합니다.',
      enterShop: '쇼핑 시작',
      productsTitle: '제품',
      addToCart: '장바구니에 추가',
      viewCart: '장바구니 보기',
      cartTitle: '장바구니',
      total: '총계',
      checkout: '결제',
      emptyCart: '장바구니가 비어 있습니다.',
      close: '닫기',
      removeFromCart: '제거',
      language: '언어',
      languageOptions: {
        ja: '일본어',
        en: '英語',
        'zh-tw': '번체 중국어',
        'zh-cn': '간체 중국어',
        ko: '한국어',
      },
      productDescription: '고품질 소재로 제작된 현대적이고 세련된 제품입니다.',
      allCategories: '모든 카테고리',
      categoryHypnosis: '최면',
      categoryPossession: '빙의',
      categoryTSF: 'TSF',
      categoryAgentGear: '요원 장비',
    },
  };

  // 模擬商品資料，新增 category 屬性
  const products = [
    { id: 1, name: '時尚耳機', price: 299, image: 'https://placehold.co/400x300/333333/FFFFFF?text=Product+1', category: '催眠類' },
    { id: 2, name: '智能手錶', price: 199, image: 'https://placehold.co/400x300/4B0082/FFFFFF?text=Product+2', category: '附身類' },
    { id: 3, name: '無線充電器', price: 49, image: 'https://placehold.co/400x300/8B0000/FFFFFF?text=Product+3', category: '特工用品' },
    { id: 4, name: '便攜式音箱', price: 79, image: 'https://placehold.co/400x300/333333/FFFFFF?text=Product+4', category: 'TSF類' },
    { id: 5, 'name': '高解析度顯示器', price: 499, image: 'https://placehold.co/400x300/4B0082/FFFFFF?text=Product+5', category: '催眠類' },
    { id: 6, 'name': '人體工學鍵盤', price: 129, image: 'https://placehold.co/400x300/8B0000/FFFFFF?text=Product+6', category: '附身類' },
    { id: 7, 'name': '迷你無人機', price: 150, image: 'https://placehold.co/400x300/333333/FFFFFF?text=Product+7', category: '特工用品' },
    { id: 8, 'name': '變形眼鏡', price: 89, image: 'https://placehold.co/400x300/4B0082/FFFFFF?text=Product+8', category: 'TSF類' },
  ];

  // 狀態管理：當前頁面、購物車、當前語言、購物車彈窗是否顯示、選定的商品分類
  const [currentPage, setCurrentPage] = useState('intro'); // 'intro', 'shop', 或 'checkout'
  const [cart, setCart] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState('ja'); // 預設日文
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all'); // 預設顯示所有商品
  const [orderPlacedMessage, setOrderPlacedMessage] = useState(''); // 訂單成功訊息
  const [showFirebaseConfigModal, setShowFirebaseConfigModal] = useState(false); // 控制 Firebase 設定彈窗顯示
  const [firebaseConfig, setFirebaseConfig] = useState(null); // 儲存 Firebase 配置

  // 載入 Firebase 配置並初始化 Firebase
  useEffect(() => {
    const storedConfig = localStorage.getItem('firebaseConfig');
    if (storedConfig) {
      try {
        const parsedConfig = JSON.parse(storedConfig);
        setFirebaseConfig(parsedConfig);
        // 嘗試初始化 Firebase
        // 確保 window.firebase 已經被 index.html 中的 <script type="module"> 載入並暴露
        if (window.firebase && !firebaseApp) { 
          firebaseApp = window.firebase.initializeApp(parsedConfig);
          db = window.firebase.getFirestore(firebaseApp);
          auth = window.firebase.getAuth(firebaseApp);
          console.log("Firebase initialized from stored config.");
          // 可以選擇在此處進行匿名登入或其他認證
          // window.firebase.signInAnonymously(auth).then(userCredential => {
          //   console.log("Signed in anonymously:", userCredential.user.uid);
          // }).catch(error => {
          //   console.error("Anonymous sign-in failed:", error);
          // });
        } else if (!window.firebase) {
          console.warn("Firebase SDK not loaded. Please ensure Firebase scripts in index.html are uncommented and loaded correctly.");
        }
      } catch (e) {
        console.error("Failed to parse Firebase config from localStorage:", e);
        localStorage.removeItem('firebaseConfig'); // 清除無效配置
      }
    }
  }, []); // 只在組件掛載時運行一次

  // 語言切換邏輯
  const handleLanguageChange = () => {
    const languages = ['ja', 'en', 'zh-tw', 'zh-cn', 'ko'];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setCurrentLanguage(languages[nextIndex]);
  };

  // 將商品添加到購物車
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // 從購物車中移除商品
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // 根據選定的分類篩選商品
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  // 處理 Firebase 配置儲存
  const handleSaveFirebaseConfig = (config) => {
    localStorage.setItem('firebaseConfig', JSON.stringify(config));
    setFirebaseConfig(config);
    // 重新初始化 Firebase (如果已經載入 SDK)
    if (window.firebase) {
      // 避免重複初始化，如果已經有 app 實例則不再初始化
      if (firebaseApp) {
        // 如果需要更新配置，可能需要先刪除舊的 app 實例
        // window.firebase.deleteApp(firebaseApp).then(() => {
        //   firebaseApp = window.firebase.initializeApp(config);
        //   db = window.firebase.getFirestore(firebaseApp);
        //   auth = window.firebase.getAuth(firebaseApp);
        //   console.log("Firebase re-initialized with new config.");
        // });
        console.warn("Firebase app already initialized. Restart the page to apply new config if significant changes were made.");
      } else {
        firebaseApp = window.firebase.initializeApp(config);
        db = window.firebase.getFirestore(firebaseApp);
        auth = window.firebase.getAuth(firebaseApp);
        console.log("Firebase initialized with new config.");
      }
    } else {
      console.warn("Firebase SDK not loaded. Please uncomment Firebase scripts in index.html.");
    }
  };

  // 購物車彈窗組件
  const CartModal = ({ cartItems, onClose, onRemoveFromCart, onCheckout, lang, translations }) => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 text-white rounded-lg shadow-xl p-6 w-full max-w-md md:max-w-lg lg:max-w-xl relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors duration-300 rounded-full p-2 bg-gray-700 hover:bg-gray-600"
            aria-label={translations[lang].close}
          >
            <X size={24} />
          </button>
          <h2 className="text-3xl font-bold mb-6 text-red-400 border-b border-red-700 pb-3">
            {translations[lang].cartTitle}
          </h2>
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-400 text-lg">{translations[lang].emptyCart}</p>
          ) : (
            <>
              <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg shadow-md"
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/64x64/333333/FFFFFF?text=${item.id}`; }}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-purple-300">{item.name}</h3>
                        <p className="text-gray-400">{item.quantity} x ¥{item.price}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-300 shadow-md"
                    >
                      {translations[lang].removeFromCart}
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center text-2xl font-bold">
                <span>{translations[lang].total}:</span>
                <span className="text-red-400">¥{total.toFixed(2)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="mt-8 w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg text-xl font-semibold transition-colors duration-300 shadow-lg transform hover:scale-105"
              >
                {translations[lang].checkout}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // 商品卡片組件
  const ProductCard = ({ product, onAddToCart, lang, translations }) => (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover object-center rounded-t-xl"
        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/333333/FFFFFF?text=${product.id}`; }}
      />
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-purple-300 mb-2">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-3 flex-grow">{translations[lang].productDescription}</p>
        <div className="flex justify-between items-center mt-auto gap-x-6"> {/* 增加價格與按鈕間距 */}
          <span className="text-2xl font-bold text-red-400">¥{product.price}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-red-700 hover:bg-red-600 text-white px-5 py-2 rounded-full font-semibold transition-colors duration-300 shadow-md transform hover:scale-105"
          >
            {translations[lang].addToCart}
          </button>
        </div>
      </div>
    </div>
  );

  // 簡介頁面組件
  const IntroPage = ({ onEnterShop, lang, translations }) => (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white flex flex-col items-center p-4 overflow-y-auto"> {/* 允許滾動 */}
      <div className="bg-gray-800 bg-opacity-90 rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl w-full text-center border border-purple-700 flex flex-col flex-grow">
        <div className="flex-grow flex flex-col justify-center items-center"> {/* 內容區塊 */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-red-400 mb-8 animate-fade-in">
            {translations[lang].introTitle}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-purple-800 transform hover:scale-105 transition-transform duration-300">
              <User className="text-purple-400 mx-auto mb-4" size={48} />
              <h2 className="text-3xl font-bold text-purple-300 mb-4">{translations[lang].ceoProfileTitle}</h2>
              <h3 className="text-2xl font-semibold text-red-300 mb-2">{translations[lang].ceoName}</h3>
              <p className="text-gray-300 leading-relaxed">{translations[lang].ceoBio}</p>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-purple-800 transform hover:scale-105 transition-transform duration-300">
              <Building className="text-purple-400 mx-auto mb-4" size={48} />
              <h2 className="text-3xl font-bold text-purple-300 mb-4">{translations[lang].companyProfileTitle}</h2>
              <p className="text-gray-300 leading-relaxed">{translations[lang].companyBio}</p>
            </div>
          </div>
        </div>

        {/* 進入購物介面的按鈕位於最下方 */}
        <div className="mt-auto pt-8"> {/* mt-auto 將按鈕推到底部 */}
          <button
            onClick={onEnterShop}
            className="bg-red-600 hover:bg-red-500 text-white text-2xl font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 flex items-center justify-center mx-auto"
          >
            {translations[lang].enterShop} <ChevronRight className="ml-3" size={28} />
          </button>
        </div>
      </div>
    </div>
  );

  // 購物頁面組件
  const ShopPage = ({ products, onAddToCart, cartCount, onViewCart, lang, translations, onCategoryChange, selectedCategory, onViewIntro, onShowFirebaseConfig }) => (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white flex flex-col">
      {/* 頂部導航欄 */}
      <header className="w-full bg-gray-900 p-4 shadow-xl flex items-center justify-center relative">
        {/* 網站名稱居中 */}
        <h1 className="text-3xl font-extrabold text-red-400">
          {translations[lang].appName}
        </h1>

        {/* 右側按鈕組 */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-4">
          {/* Firebase 設定按鈕 */}
          <button
            onClick={onShowFirebaseConfig}
            className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 shadow-md flex items-center space-x-2"
          >
            <Settings size={18} />
            <span>{translations[lang].firebaseSettings}</span>
          </button>

          {/* 簡介按鈕 */}
          <button
            onClick={onViewIntro}
            className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 shadow-md flex items-center space-x-2"
          >
            <Info size={18} />
            <span>{translations[lang].aboutUs}</span>
          </button>

          {/* 語言切換按鈕 */}
          <button
            onClick={handleLanguageChange}
            className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 shadow-md"
          >
            {translations[lang].languageOptions[lang]}
          </button>

          {/* 購物車按鈕 */}
          <button
            onClick={onViewCart}
            className="relative bg-red-700 hover:bg-red-600 text-white p-3 rounded-full shadow-md transform hover:scale-105 transition-transform duration-300"
            aria-label={translations[lang].viewCart}
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 主要內容區域 */}
      <main className="flex-grow p-6 md:p-8 lg:p-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-4xl font-extrabold text-red-400">{translations[lang].productsTitle}</h2>
          <div className="flex items-center space-x-4">
            {/* 商品分類篩選 */}
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="bg-gray-700 text-white rounded-full px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md"
            >
              <option value="all">{translations[lang].allCategories}</option>
              <option value="催眠類">{translations[lang].categoryHypnosis}</option>
              <option value="附身類">{translations[lang].categoryPossession}</option>
              <option value="TSF類">{translations[lang].categoryTSF}</option>
              <option value="特工用品">{translations[lang].categoryAgentGear}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              lang={lang}
              translations={translations}
            />
          ))}
        </div>
      </main>
    </div>
  );

  // 結帳頁面組件
  const CheckoutPage = ({ cartItems, onBackToShop, lang, translations }) => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 訂單成功訊息的顯示邏輯
    const handlePlaceOrder = () => {
      setCart([]); // 清空購物車
      setOrderPlacedMessage(translations[lang].orderSuccess); // 設定成功訊息
      setTimeout(() => {
        setOrderPlacedMessage(''); // 訊息顯示一段時間後消失
        setCurrentPage('shop'); // 返回購物頁面
      }, 3000); // 3 秒後消失
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white flex flex-col items-center p-4">
        <div className="bg-gray-800 bg-opacity-90 rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl w-full border border-purple-700">
          <h2 className="text-4xl font-extrabold text-red-400 mb-8 border-b border-red-700 pb-4 text-center">
            {translations[lang].checkout}
          </h2>

          {cartItems.length === 0 && !orderPlacedMessage ? (
            <p className="text-center text-gray-400 text-lg mb-8">{translations[lang].emptyCart}</p>
          ) : (
            <div className="mb-8 max-h-96 overflow-y-auto custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg shadow-md"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/333333/FFFFFF?text=${item.id}`; }}
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300">{item.name}</h3>
                      <p className="text-gray-400">{item.quantity} x ¥{item.price}</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-red-400">¥{(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {orderPlacedMessage && (
            <div className="bg-green-700 text-white text-center py-3 px-6 rounded-lg mb-8 text-xl font-semibold shadow-lg animate-fade-in">
              {orderPlacedMessage}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center text-3xl font-bold mb-8">
            <span>{translations[lang].total}:</span>
            <span className="text-red-400">¥{total.toFixed(2)}</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button
              onClick={handlePlaceOrder}
              className="bg-red-600 hover:bg-red-500 text-white text-2xl font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              {translations[lang].placeOrder}
            </button>
            <button
              onClick={onBackToShop}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-xl font-semibold py-4 px-8 rounded-full shadow-md transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              <ArrowLeft size={24} className="mr-2" /> {translations[lang].backToShop}
            </button>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="font-sans antialiased">
      {currentPage === 'intro' && (
        <IntroPage onEnterShop={() => setCurrentPage('shop')} lang={currentLanguage} translations={translations} />
      )}
      {currentPage === 'shop' && (
        <ShopPage
          products={filteredProducts}
          onAddToCart={addToCart}
          cartCount={cart.length}
          onViewCart={() => setIsCartOpen(true)}
          lang={currentLanguage}
          translations={translations}
          onCategoryChange={setSelectedCategory}
          selectedCategory={selectedCategory}
          onViewIntro={() => setCurrentPage('intro')}
          onShowFirebaseConfig={() => setShowFirebaseConfigModal(true)} // 新增按鈕觸發顯示 Firebase 設定彈窗
        />
      )}
      {currentPage === 'checkout' && (
        <CheckoutPage
          cartItems={cart}
          onBackToShop={() => setCurrentPage('shop')}
          lang={currentLanguage}
          translations={translations}
        />
      )}

      {isCartOpen && (
        <CartModal
          cartItems={cart}
          onClose={() => setIsCartOpen(false)}
          onRemoveFromCart={removeFromCart}
          onCheckout={() => {
            setIsCartOpen(false); // 關閉購物車彈窗
            setCurrentPage('checkout'); // 導航到結帳頁面
          }}
          lang={currentLanguage}
          translations={translations}
        />
      )}

      {showFirebaseConfigModal && (
        <FirebaseConfigModal
          onClose={() => setShowFirebaseConfigModal(false)}
          onSave={handleSaveFirebaseConfig}
          initialConfig={firebaseConfig}
          lang={currentLanguage}
          translations={translations}
        />
      )}
    </div>
  );
}

// Render the App component into the root div
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
