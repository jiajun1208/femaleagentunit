// Explicitly get React and ReactDOM from the global window object
const React = window.React;
const ReactDOM = window.ReactDOM;

// Now destructure from the React object
const { useState, useEffect, useRef } = React; // Import useRef

// 全局 Firebase 實例 (如果成功初始化)
let firebaseApp = null;
let db = null;
let auth = null;

// 移除 Gemini API 翻譯函數，因為用戶不使用
// async function translateText(...) { ... }


// Firebase 配置彈窗組件 (此組件仍存在，但不再從 AdminPage 觸發)
const FirebaseConfigModal = ({ onClose, onSave, initialConfig, lang, translations }) => {
  const [config, setConfig] = useState(initialConfig || {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '' // Optional
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
          ✖ {/* Close icon */}
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
      categoryHypnosis: '催眠用',
      categoryPossession: '憑依用',
      categoryTSF: 'TSF用',
      categoryAgentGear: '武装用',
      aboutUs: '会社情報',
      backToShop: 'ショップに戻る',
      placeOrder: '注文を確定する',
      orderSuccess: 'ご注文ありがとうございます！',
      firebaseSettings: 'Firebase 設定',
      adminPanel: '管理後台',
      addProduct: '新增商品',
      editProduct: '編輯商品',
      deleteProduct: '削除商品',
      productName: '商品名称',
      productPrice: '商品価格',
      productImage: '商品画像URL',
      productCategory: '商品カテゴリ',
      save: '保存',
      cancel: 'キャンセル',
      confirmDelete: 'この商品を削除してもよろしいですか？',
      productAdded: '商品が追加されました！',
      productUpdated: '商品が更新されました！',
      productDeleted: '商品が削除されました！',
      fetchingProducts: '商品を読み込み中...',
      noProducts: '現在、商品はございません。',
      productShortDescription: '商品概要',
      productDetailedDescription: '商品詳細',
      backToProducts: '商品リストに戻る',
      enterPassword: 'パスワードを入力してください',
      passwordIncorrect: 'パスワードが間違っています。もう一度入力してください。',
      submit: '送信',
      translationFailed: '翻譯失敗，請檢查網路連線或稍後再試。', // 雖然不使用自動翻譯，但保留此鍵以防萬一
      advertisement: '廣告',
    },
    en: {
      appName: 'FAU SHOPPING',
      introTitle: 'Welcome to FAU SHOPPING',
      ceoProfileTitle: 'CEO Profile',
      companyProfileTitle: 'Company Profile',
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
      categoryHypnosis: 'For Hypnosis',
      categoryPossession: 'For Possession',
      categoryTSF: 'For TSF',
      categoryAgentGear: 'For Agent Gear',
      aboutUs: 'About Us',
      backToShop: 'Back to Shop',
      placeOrder: 'Place Order',
      orderSuccess: 'Thank you for your order!',
      firebaseSettings: 'Firebase Settings',
      adminPanel: 'Admin Panel',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      deleteProduct: 'Delete Product',
      productName: 'Product Name',
      productPrice: 'Product Price',
      productImage: 'Product Image URL',
      productCategory: 'Product Category',
      save: 'Save',
      cancel: 'Cancel',
      confirmDelete: 'Are you sure you want to delete this product?',
      productAdded: 'Product added successfully!',
      productUpdated: 'Product updated successfully!',
      productDeleted: 'Product deleted successfully!',
      fetchingProducts: 'Fetching products...',
      noProducts: 'No products available.',
      productShortDescription: 'Short Description',
      productDetailedDescription: 'Detailed Description',
      backToProducts: 'Back to Products',
      enterPassword: 'Please enter password',
      passwordIncorrect: 'Incorrect password, please try again.',
      submit: 'Submit',
      translationFailed: 'Translation failed, please check network or try again later.',
      advertisement: 'Advertisement',
    },
    'zh-tw': {
      appName: 'FAU SHOPPING',
      introTitle: '歡迎來到 FAU SHOPPING',
      ceoProfileTitle: '社長簡介',
      companyProfileTitle: '公司簡介',
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
      categoryHypnosis: '催眠用',
      categoryPossession: '憑依用',
      categoryTSF: 'TSF用',
      categoryAgentGear: '武裝用',
      aboutUs: '關於我們',
      backToShop: '返回商店',
      placeOrder: '確認下單',
      orderSuccess: '感謝您的訂單！',
      firebaseSettings: 'Firebase 設定',
      adminPanel: '管理後台',
      addProduct: '新增商品',
      editProduct: '編輯商品',
      deleteProduct: '刪除商品',
      productName: '商品名稱',
      productPrice: '商品價格',
      productImage: '商品圖片URL',
      productCategory: '商品類別',
      save: '儲存',
      cancel: '取消',
      confirmDelete: '確定要刪除此商品嗎？',
      productAdded: '商品已新增！',
      productUpdated: '商品已更新！',
      productDeleted: '商品已刪除！',
      fetchingProducts: '正在載入商品...',
      noProducts: '目前沒有商品。',
      productShortDescription: '商品簡介',
      productDetailedDescription: '商品詳細介紹',
      backToProducts: '返回商品列表',
      enterPassword: '請輸入密碼',
      passwordIncorrect: '密碼錯誤，請重新輸入。',
      submit: '提交',
      translationFailed: '翻譯失敗，請檢查網路連線或稍後再試。',
      advertisement: '廣告',
    },
    'zh-cn': {
      appName: 'FAU SHOPPING',
      introTitle: '欢迎来到 FAU SHOPPING',
      ceoProfileTitle: '社长简介',
      companyProfileTitle: '公司简介',
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
      categoryHypnosis: '催眠用',
      categoryPossession: '凭依用',
      categoryTSF: 'TSF用',
      categoryAgentGear: '武装用',
      aboutUs: '关于我们',
      backToShop: '返回商店',
      placeOrder: '确认下单',
      orderSuccess: '感谢您的订单！',
      firebaseSettings: 'Firebase 设置',
      adminPanel: '管理后台',
      addProduct: '新增商品',
      editProduct: '编辑商品',
      deleteProduct: '删除商品',
      productName: '商品名称',
      productPrice: '商品价格',
      productImage: '商品图片URL',
      productCategory: '商品类别',
      save: '保存',
      cancel: '取消',
      confirmDelete: '确定要删除此商品吗？',
      productAdded: '商品已新增！',
      productUpdated: '商品已更新！',
      productDeleted: '商品已删除！',
      fetchingProducts: '正在载入商品...',
      noProducts: '目前没有商品。',
      productShortDescription: '商品简介',
      productDetailedDescription: '商品详细介绍',
      backToProducts: '返回商品列表',
      enterPassword: '请输入密码',
      passwordIncorrect: '密码错误，请重新输入。',
      submit: '提交',
      translationFailed: '翻译失败，请检查网络连接或稍后重试。',
      advertisement: '广告',
    },
    ko: {
      appName: 'FAU SHOPPING',
      introTitle: 'FAU SHOPPING에 오신 것을 환영합니다',
      ceoProfileTitle: 'CEO 프로필',
      companyProfileTitle: '회사 프로필',
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
      productDescription: '고품질 소재로 제작된 현대적이고 세련된 제품입니다。',
      allCategories: '모든 카테고리',
      categoryHypnosis: '최면용',
      categoryPossession: '빙의용',
      categoryTSF: 'TSF용',
      categoryAgentGear: '무장용',
      aboutUs: '회사 정보',
      backToShop: '상점으로 돌아가기',
      placeOrder: '주문하기',
      orderSuccess: '주문해 주셔서 감사합니다!',
      firebaseSettings: 'Firebase 설정',
      adminPanel: '관리자 패널',
      addProduct: '제품 추가',
      editProduct: '제품 편집',
      deleteProduct: '제품 삭제',
      productName: '제품명',
      productPrice: '제품 가격',
      productImage: '제품 이미지 URL',
      productCategory: '제품 카테고리',
      save: '저장',
      cancel: '취소',
      confirmDelete: '이 제품을 삭제하시겠습니까?',
      productAdded: '제품이 추가되었습니다!',
      productUpdated: '제품이 업데이트되었습니다!',
      productDeleted: '제품이 삭제되었습니다!',
      fetchingProducts: '제품을 불러오는 중...',
      noProducts: '현재 제품이 없습니다.',
      productShortDescription: '간략 설명',
      productDetailedDescription: '상세 설명',
      backToProducts: '제품 목록으로 돌아가기',
      enterPassword: '비밀번호를 입력하세요',
      passwordIncorrect: '비밀번호가 틀렸습니다. 다시 입력하세요.',
      submit: '제출',
      translationFailed: '번역에 실패했습니다. 네트워크 연결을 확인하거나 나중에 다시 시도하세요.',
      advertisement: '광고',
    },
  };

  // 狀態管理：當前頁面、購物車、當前語言、購物車彈窗是否顯示、選定的商品分類
  const [currentPage, setCurrentPage] = useState('intro'); // 'intro', 'shop', 'checkout', 'admin', 'productDetail'
  const [cart, setCart] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState('ja'); // 預設日文
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all'); // 預設顯示所有商品
  const [orderPlacedMessage, setOrderPlacedMessage] = useState(''); // 訂單成功訊息
  const [showFirebaseConfigModal, setShowFirebaseConfigModal] = useState(false); // 控制 Firebase 設定彈窗顯示
  const [firebaseConfig, setFirebaseConfig] = useState(null); // 儲存 Firebase 配置
  const [productsData, setProductsData] = useState([]); // 從 Firestore 載入的商品數據
  const [isFirebaseReady, setIsFirebaseReady] = useState(false); // Firebase 是否初始化完成
  const [selectedProductId, setSelectedProductId] = useState(null); // 儲存選定商品的ID
  const [showPasswordModal, setShowPasswordModal] = useState(false); // 控制密碼輸入框顯示
  const [passwordInput, setPasswordInput] = useState(''); // 密碼輸入框的值
  const [passwordError, setPasswordError] = useState(''); // 密碼錯誤訊息
  const [isYouTubeAPIReady, setIsYouTubeAPIReady] = useState(false); // YouTube API 是否準備就緒

  // 新增影片 URL 狀態
  const [ceoVideoUrl, setCeoVideoUrl] = useState('https://raw.githubusercontent.com/jiajun1208/femaleagentunit/main/video/CEO.mp4'); // 示例影片，請替換

  // 廣告影片輪播相關狀態
  const adVideoUrls = useRef([
      'https://www.youtube.com/watch?v=r7iAasYwWT4', // 範例 YouTube 影片 1
      'https://www.youtube.com/watch?v=-Sren30xpwY', // 範例 YouTube 影片 2
      'https://www.youtube.com/watch?v=r7iAasYwWT4', // 範例 YouTube 影片 3
      'https://raw.githubusercontent.com/mdn/learning-area/main/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4' // 範例 MP4 影片
  ]);
  const [currentAdVideoIndex, setCurrentAdVideoIndex] = useState(0);

  // 可配置的應用程式內容狀態 (社長姓名、簡介、公司簡介、公司影片URL)
  const [appContent, setAppContent] = useState({
    ceoName: {},
    ceoBio: {},
    companyBio: {},
    companyVideoUrl: {} // 新增公司影片URL
  });

  // 硬編碼的 Firebase 配置 (請務必替換為您自己的專案詳細資訊)
  // 您可以在 Firebase 控制台 (console.firebase.google.com) > 專案設定 (Project settings) > 您的應用程式 (Your apps) 中找到這些資訊。
  // 請確保將 'YOUR_API_KEY' 等佔位符替換為實際的值，並保留引號。
  const firebaseConfigHardcoded = {
      apiKey: "AIzaSyCZSC4KP9r9Ia74gjhVM4hkhkCiXU6ltR4",
      authDomain: "avny-ccbe9.firebaseapp.com",
      databaseURL: "https://avny-ccbe9-default-rtdb.firebaseio.com",
      projectId: "avny-ccbe9",
      storageBucket: "avny-ccbe9.firebasestorage.app",
      messagingSenderId: "686829295344",
      appId: "1:686829295344:web:f0928898f8af0ab3701435",
      measurementId: "G-QQYT04PKLL"
  };

  // 載入 Firebase 配置並初始化 Firebase
  useEffect(() => {
    console.log("App useEffect: Initializing Firebase...");
    const storedConfig = localStorage.getItem('firebaseConfig');
    let configToUse = null;

    if (storedConfig) {
      try {
        configToUse = JSON.parse(storedConfig);
        // 驗證從 localStorage 載入的配置是否有效
        if (configToUse && configToUse.apiKey && configToUse.projectId) {
            setFirebaseConfig(configToUse);
            console.log("App useEffect: Loaded valid Firebase config from localStorage.");
        } else {
            console.warn("App useEffect: localStorage config is invalid or incomplete. Falling back to hardcoded config.");
            localStorage.removeItem('firebaseConfig'); // 清除無效配置
        }
      } catch (e) {
        console.error("App useEffect: Failed to parse Firebase config from localStorage:", e);
        localStorage.removeItem('firebaseConfig'); // 清除無效配置
      }
    }
    
    // 如果 localStorage 沒有有效配置，則使用硬編碼的配置
    if (!configToUse || !configToUse.apiKey || !configToUse.projectId) {
        configToUse = firebaseConfigHardcoded;
        setFirebaseConfig(firebaseConfigHardcoded); // 也儲存到 state
        console.warn("App useEffect: Using hardcoded Firebase config. Please replace placeholder values with your actual Firebase project details in the code or set them via the Admin Panel's Firebase Settings modal for persistence.");
    }

    // 在嘗試初始化 Firebase 之前，先印出正在使用的配置
    console.log("App useEffect: Attempting to initialize Firebase with config:", configToUse);
    console.log("App useEffect: Current __app_id:", typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');


    // 只有當 window.firebase (SDK) 載入且有有效的 configToUse 時才初始化 Firebase
    if (window.firebase && configToUse && configToUse.apiKey && configToUse.projectId && !firebaseApp) { 
      firebaseApp = window.firebase.initializeApp(configToUse);
      db = window.firebase.getFirestore(firebaseApp);
      auth = window.firebase.getAuth(firebaseApp);
      console.log("App useEffect: Firebase initialized successfully. Attempting anonymous sign-in...");
      
      window.firebase.signInAnonymously(auth).then(userCredential => {
        console.log("App useEffect: Signed in anonymously. User UID:", userCredential.user.uid);
        setIsFirebaseReady(true); // Firebase 認證完成
      }).catch(error => {
        console.error("App useEffect: Anonymous sign-in failed:", error);
        setIsFirebaseReady(false);
      });

    } else if (!window.firebase) {
      console.warn("App useEffect: Firebase SDK not loaded. Please ensure Firebase scripts in index.html are uncommented and loaded correctly.");
      setIsFirebaseReady(false);
    } else if (firebaseApp) {
        console.log("App useEffect: Firebase already initialized.");
        // 如果已經初始化，確保 isFirebaseReady 狀態正確
        if (auth.currentUser) {
            setIsFirebaseReady(true);
        } else {
            // 如果沒有當前用戶，嘗試匿名登入
            window.firebase.signInAnonymously(auth).then(userCredential => {
                console.log("App useEffect: Re-signed in anonymously. User UID:", userCredential.user.uid);
                setIsFirebaseReady(true);
            }).catch(error => {
                console.error("App useEffect: Re-anonymous sign-in failed:", error);
                setIsFirebaseReady(false);
            });
        }
    } else {
        console.warn("App useEffect: Firebase initialization skipped due to missing or invalid configuration.");
        setIsFirebaseReady(false);
    }

    // 設定 YouTube API readiness callback
    // 檢查 window.YT 是否已經存在，如果存在則直接設定為 ready
    if (window.YT && window.YT.Player) {
      setIsYouTubeAPIReady(true);
    } else {
      // 否則，設定 onYouTubeIframeAPIReady 回調函數
      window.onYouTubeIframeAPIReady = () => {
        console.log("YouTube IFrame API is ready.");
        setIsYouTubeAPIReady(true);
      };
    }

  }, []); // 只在組件掛載時運行一次

  // 從 Firestore 實時獲取商品數據和應用程式內容
  useEffect(() => {
    console.log("Data useEffect: isFirebaseReady status:", isFirebaseReady);
    if (isFirebaseReady && db) {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      console.log("Data useEffect: Using appId for Firestore path:", appId);

      // 1. 監聽商品數據
      const productsColRef = window.firebase.collection(db, `artifacts/${appId}/public/data/products`);
      console.log("Data useEffect: Setting up onSnapshot listener for products...");
      const unsubscribeProducts = window.firebase.onSnapshot(productsColRef, (snapshot) => {
        const productsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductsData(productsList);
        console.log("Data useEffect: Products fetched from Firestore:", productsList);
      }, (error) => {
        console.error("Data useEffect: Error fetching products from Firestore:", error);
      });

      // 2. 監聽應用程式內容 (社長、公司簡介)
      const appSettingsDocRef = window.firebase.doc(db, `artifacts/${appId}/public/data/appSettings/introContent`);
      console.log("Data useEffect: Setting up onSnapshot listener for app content...");
      const unsubscribeAppSettings = window.firebase.onSnapshot(appSettingsDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAppContent(prev => ({
            ...prev,
            ceoName: data.ceoName || {},
            ceoBio: data.ceoBio || {},
            companyBio: data.companyBio || {},
            companyVideoUrl: data.companyVideoUrl || {} // 讀取公司影片URL
          }));
          console.log("Data useEffect: App content fetched from Firestore:", data);
        } else {
          console.log("Data useEffect: No app content found in Firestore. Using defaults.");
          // 如果 Firestore 中沒有內容，則設定預設值
          setAppContent({
            ceoName: { ja: '黒川 智慧', en: 'Kurokawa Chie', 'zh-tw': '黑川 智慧', 'zh-cn': '黑川 智慧', ko: '쿠로카와 치에' },
            ceoBio: { ja: '黒川グループの会長である黒川智慧は、革新的なリーダーシップと卓越したビジョンで知られています。彼の指導の下、当社は技術と顧客満足度の新たな基準を確立しました。', en: 'Kurokawa Chie, the Chairman of Kurokawa Group, is known for his innovative leadership and exceptional vision. Under his guidance, the company has set new standards in technology and customer satisfaction.', 'zh-tw': '黑川集團董事長黑川智慧以其創新的領導力和卓越的遠見而聞聞。在他的指導下，公司在技術和客戶滿意度方面樹立了新的標準。', 'zh-cn': '黑川集团董事长黑川智慧以其创新的领导力和卓越的远见而闻名。在他的指导下，公司在技术和客户满意度方面树立了新的标准。', ko: '쿠로카와 그룹의 회장인 쿠로카와 치에는 혁신적인 리더십과 탁월한 비전으로 유명합니다. 그의 지도 아래 회사는 기술과 고객 만족도에서 새로운 기준을 세웠습니다。' },
            companyBio: { ja: '黒川グループは、高品質な製品と優れた顧客サービスを提供することに専念する最先端の企業です。私たちは革新を推進し、お客様の生活を豊かにすることを目指しています。', en: 'Kurokawa Group is a cutting-edge enterprise dedicated to providing high-quality products and excellent customer service. We strive to drive innovation and enrich the lives of our customers.', 'zh-tw': '黑川集團是一家致力於提供高品質產品和卓越客戶服務的尖端企業。我們致力於推動創新，豐富客戶的生活。', 'zh-cn': '黑川集团是一家致力于提供高质量产品和卓越客户服务的尖端企业。我们致力于推动创新，丰富客户的生活。', ko: '쿠로카와 그룹은 고품질 제품과 우수한 고객 서비스를 제공하는 데 전념하는 최첨단 기업입니다。우리는 혁신을 추진하고 고객의 삶을 풍요롭게 하는 것을 목표로 합니다。' },
            companyVideoUrl: { ja: 'https://raw.githubusercontent.com/mdn/learning-area/main/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4', en: 'https://raw.githubusercontent.com/mdn/learning-area/main/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4', 'zh-tw': 'https://raw.githubusercontent.com/mdn/learning-area/main/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4', 'zh-cn': 'https://raw.githubusercontent.com/mdn/learning-area/main/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4', ko: 'https://raw.githubusercontent.com/mdn/learning-area/main/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4' } // 預設公司影片URL
          });
        }
      }, (error) => {
        console.error("Data useEffect: Error fetching app content from Firestore:", error);
      });


      // 清理訂閱
      return () => {
        console.log("Data useEffect: Cleaning up onSnapshot listeners.");
        unsubscribeProducts();
        unsubscribeAppSettings();
      };
    } else if (isFirebaseReady && !db) {
        console.warn("Data useEffect: Firebase is ready, but db instance is null.");
    } else {
        console.log("Data useEffect: Firebase not ready, skipping data fetch.");
    }
  }, [isFirebaseReady, db]); // 依賴於 Firebase 是否準備好和 db 實例

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
    ? productsData
    : productsData.filter(product => product.category === selectedCategory);

  // 處理 Firebase 配置儲存 (此函數仍存在，但不會從 AdminPage 觸發)
  const handleSaveFirebaseConfig = (config) => {
    localStorage.setItem('firebaseConfig', JSON.stringify(config));
    setFirebaseConfig(config);
    console.log("Firebase config saved to localStorage. Reloading page...");
    // 重新載入頁面以應用新的 Firebase 配置
    window.location.reload();
  };

  // 處理商品卡片點擊，導航到商品詳情頁面
  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setCurrentPage('productDetail');
  };

  // 處理管理後台按鈕點擊，顯示密碼輸入框
  const handleNavigateToAdmin = () => {
    setShowPasswordModal(true);
    setPasswordInput(''); // 清空密碼輸入框
    setPasswordError(''); // 清空錯誤訊息
  };

  // 處理密碼提交
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const correctPassword = "JASAMI9521"; // 正確密碼
    if (passwordInput === correctPassword) {
      setShowPasswordModal(false); // 關閉密碼輸入框
      setCurrentPage('admin'); // 進入管理後台
    } else {
      setPasswordError(translations[currentLanguage].passwordIncorrect); // 顯示錯誤訊息
    }
  };

  // 密碼輸入框組件
  const PasswordModal = ({ onClose, onSubmit, password, setPassword, error, lang, translations }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 text-white rounded-lg shadow-xl p-6 w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors duration-300 rounded-full p-2 bg-gray-700 hover:bg-gray-600"
          aria-label={translations[lang].close}
        >
          ✖ {/* Close icon */}
        </button>
        <h2 className="text-2xl font-bold mb-6 text-red-400 text-center">
          {translations[lang].enterPassword}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="adminPassword" className="sr-only">
              {translations[lang].enterPassword}
            </label>
            <input
              type="password"
              id="adminPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-white text-lg"
              placeholder={translations[lang].enterPassword}
              required
            />
          </div>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg text-xl font-semibold transition-colors duration-300 shadow-lg transform hover:scale-105"
          >
            {translations[lang].submit}
          </button>
        </form>
      </div>
    </div>
  );


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
            ✖ {/* Close icon */}
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
                        alt={item.name[lang] || item.name.ja || item.name} // 顯示翻譯後的名稱
                        className="w-16 h-16 object-cover rounded-lg shadow-md"
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/64x64/333333/FFFFFF?text=${item.id}`; }}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-purple-300">{item.name[lang] || item.name.ja || item.name}</h3> {/* 顯示翻譯後的名稱 */}
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
  const ProductCard = ({ product, onAddToCart, lang, translations, onProductClick }) => (
    <div
      className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col cursor-pointer"
      onClick={() => onProductClick(product.id)} // 點擊卡片導航到詳情頁
    >
      <img
        src={product.image}
        alt={product.name[lang] || product.name.ja || product.name} // 顯示翻譯後的名稱
        className="w-full h-48 object-cover object-center rounded-t-xl"
        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/333333/FFFFFF?text=${product.id}`; }}
      />
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-purple-300 mb-2">{product.name[lang] || product.name.ja || product.name}</h3> {/* 顯示翻譯後的名稱 */}
        {/* 顯示商品簡介，並保留換行 */}
        <p className="text-gray-400 text-sm mb-3 flex-grow whitespace-pre-wrap">{product.shortDescription[lang] || product.shortDescription.ja || translations[lang].productDescription}</p> {/* 顯示翻譯後的簡介 */}
        <div className="flex justify-between items-center mt-auto gap-x-6"> {/* 增加價格與按鈕間距 */}
          <span className="text-2xl font-bold text-red-400">¥{product.price}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} // 阻止事件冒泡，避免點擊按鈕也觸發詳情頁
            className="bg-red-700 hover:bg-red-600 text-white px-5 py-2 rounded-full font-semibold transition-colors duration-300 shadow-md transform hover:scale-105"
          >
            {translations[lang].addToCart}
          </button>
        </div>
      </div>
    </div>
  );

  // 簡介頁面組件
  const IntroPage = ({ onEnterShop, lang, translations, ceoVideoUrl, appContent }) => ( // 傳遞 appContent
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white flex flex-col items-center p-4 overflow-y-auto"> {/* 允許滾動 */}
      <div className="bg-gray-800 bg-opacity-90 rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl w-full text-center border border-purple-700 flex flex-col flex-grow">
        <div className="flex-grow flex flex-col justify-center items-center"> {/* 內容區塊 */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-red-400 mb-8 animate-fade-in">
            {translations[lang].introTitle}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-purple-800 transform hover:scale-105 transition-transform duration-300">
              {/* 社長頭像影片 */}
              {ceoVideoUrl ? (
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg border-2 border-purple-500">
                  <video
                    className="w-full h-full object-cover"
                    src={ceoVideoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    title="CEO Profile Video"
                  >
                    您的瀏覽器不支持影片標籤。
                  </video>
                </div>
              ) : (
                <span className="text-purple-400 mx-auto mb-4 text-4xl">👤</span> // Fallback icon
              )}
              <h2 className="text-3xl font-bold text-purple-300 mb-4">{translations[lang].ceoProfileTitle}</h2>
              <h3 className="text-2xl font-semibold text-red-300 mb-2">{appContent.ceoName[lang] || appContent.ceoName.ja || '社長姓名'}</h3> {/* 使用動態內容 */}
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{appContent.ceoBio[lang] || appContent.ceoBio.ja || '社長簡介內容'}</p> {/* 使用動態內容 */}
            </div>

            <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-purple-800 transform hover:scale-105 transition-transform duration-300">
              {/* 公司簡介影片 */}
              {(appContent.companyVideoUrl[lang] || appContent.companyVideoUrl.ja) ? (
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg border-2 border-purple-500">
                  <video
                    className="w-full h-full object-cover"
                    src={appContent.companyVideoUrl[lang] || appContent.companyVideoUrl.ja}
                    autoPlay
                    loop
                    muted
                    playsInline
                    title="Company Profile Video"
                  >
                    您的瀏覽器不支持影片標籤。
                  </video>
                </div>
              ) : (
                <span className="text-purple-400 mx-auto mb-4 text-4xl">🏢</span> // Fallback icon
              )}
              <h2 className="text-3xl font-bold text-purple-300 mb-4">{translations[lang].companyProfileTitle}</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{appContent.companyBio[lang] || appContent.companyBio.ja || '公司簡介內容'}</p> {/* 使用動態內容 */}
            </div>
          </div>
        </div>

        {/* 進入購物介面的按鈕位於最下方 */}
        <div className="mt-auto pt-8"> {/* mt-auto 將按鈕推到底部 */}
          <button
            onClick={onEnterShop}
            className="bg-red-600 hover:bg-red-500 text-white text-2xl font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 flex items-center justify-center mx-auto"
          >
            {translations[lang].enterShop} <span className="ml-3">▶</span> {/* ChevronRight icon */}
          </button>
        </div>
      </div>
    </div>
  );

  // 輔助函數：判斷是否為 YouTube 連結並提取 ID
  const getYouTubeVideoId = (url) => {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  };

  // 購物頁面組件
  const ShopPage = ({ products, onAddToCart, cartCount, onViewCart, lang, translations, onCategoryChange, selectedCategory, onViewIntro, onNavigateToAdmin, onProductClick, adVideoUrls, currentAdVideoIndex, isYouTubeAPIReady, setCurrentAdVideoIndex }) => {
    const currentAdVideoUrl = adVideoUrls.current[currentAdVideoIndex];
    const youtubeVideoId = getYouTubeVideoId(currentAdVideoUrl);
    const isYouTubeAd = youtubeVideoId !== null;

    const videoRef = useRef(null); // Ref for direct video element
    const youtubePlayerRef = useRef(null); // Ref for YouTube Player instance

    useEffect(() => {
      // Cleanup function for previous player/listeners
      return () => {
        if (youtubePlayerRef.current) {
          youtubePlayerRef.current.destroy();
          youtubePlayerRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.onended = null; // Remove event listener
        }
      };
    }, [currentAdVideoIndex]); // Re-run effect when currentAdVideoIndex changes

    useEffect(() => {
      if (isYouTubeAd && isYouTubeAPIReady) {
        // Initialize YouTube Player
        youtubePlayerRef.current = new window.YT.Player('youtube-ad-player', {
          videoId: youtubeVideoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 1,
            modestbranding: 1,
            enablejsapi: 1, // Enable JS API control
          },
          events: {
            'onReady': (event) => {
              event.target.playVideo(); // Ensure playback starts
            },
            'onStateChange': (event) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                setCurrentAdVideoIndex((prevIndex) =>
                  (prevIndex + 1) % adVideoUrls.current.length
                );
              }
            }
          }
        });
      } else if (!isYouTubeAd && videoRef.current) {
        // For regular video, attach onEnded listener
        videoRef.current.onended = () => {
          setCurrentAdVideoIndex((prevIndex) =>
            (prevIndex + 1) % adVideoUrls.current.length
          );
        };
      }
    }, [currentAdVideoIndex, isYouTubeAd, isYouTubeAPIReady]); // Dependencies for player initialization


    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white flex flex-col">
        {/* 頂部導航欄 */}
        <header className="w-full bg-gray-900 p-4 shadow-xl flex items-center justify-center relative">
          {/* 網站名稱居中 */}
          <h1 className="text-3xl font-extrabold text-red-400">
            {translations[lang].appName}
          </h1>

          {/* 右側按鈕組 */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-4">
            {/* 管理後台按鈕 */}
            <button
              onClick={onNavigateToAdmin}
              className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 shadow-md flex items-center space-x-2"
            >
              ⚙️ {/* Settings icon */}
              <span>{translations[lang].adminPanel}</span>
            </button>

            {/* 簡介按鈕 */}
            <button
              onClick={onViewIntro}
              className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 shadow-md flex items-center space-x-2"
            >
              ℹ️ {/* Info icon */}
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
              🛒 {/* ShoppingCart icon */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* 廣告影片欄位 */}
        {currentAdVideoUrl && (
          <div className="w-full bg-gray-800 p-4 md:p-6 lg:p-8 shadow-inner border-b border-purple-700 text-center">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">{translations[lang].advertisement}</h2>
            <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl border-2 border-red-500">
              {isYouTubeAd ? (
                <iframe
                  key={youtubeVideoId} // Key to force re-render
                  className="w-full h-full"
                  id="youtube-ad-player" // Assign an ID for YT.Player
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&autoplay=1&mute=1&controls=1&modestbranding=1`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube Advertisement Video"
                  loading="lazy"
                ></iframe>
              ) : (
                <video
                  key={currentAdVideoUrl} // Key to force re-render
                  ref={videoRef} // Attach ref for direct video
                  className="w-full h-full object-cover"
                  src={currentAdVideoUrl}
                  controls
                  autoPlay
                  muted
                  playsInline
                  title="Advertisement Video"
                >
                  您的瀏覽器不支持影片標籤。
                </video>
              )}
            </div>
          </div>
        )}

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
                {/* 使用翻譯後的分類名稱顯示，但值仍為原始日文，方便過濾 */}
                <option value="催眠類">{translations[lang].categoryHypnosis}</option>
                <option value="憑依用">{translations[lang].categoryPossession}</option>
                <option value="TSF用">{translations[lang].categoryTSF}</option>
                <option value="武装用">{translations[lang].categoryAgentGear}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart} // Pass addToCart directly
                lang={lang}
                translations={translations}
                onProductClick={handleProductClick} // 傳遞點擊處理函數
              />
            ))}
          </div>
        </main>
      </div>
    );
  };

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
                      alt={item.name[lang] || item.name.ja || item.name} // 顯示翻譯後的名稱
                      className="w-20 h-20 object-cover rounded-lg shadow-md"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/333333/FFFFFF?text=${item.id}`; }}
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300">{item.name[lang] || item.name.ja || item.name}</h3> {/* 顯示翻譯後的名稱 */}
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
              ⬅️ {/* ArrowLeft icon */} {translations[lang].backToShop}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 輔助函數：渲染包含影片的詳細介紹
  const renderDetailedDescription = (description, lang, translations) => {
    // 如果沒有 description 或者 description 不是物件 (舊資料可能不是多語言物件)
    const currentLangDescription = description ? (description[lang] || description.ja || description) : '';

    if (!currentLangDescription) {
      return <p className="text-gray-300 text-lg whitespace-pre-wrap">{translations[lang].productDescription}</p>;
    }

    const elements = [];
    const lines = currentLangDescription.split('\n');

    lines.forEach((line, lineIndex) => {
      const lineElements = [];
      let lastIndex = 0;

      // Combined regex for YouTube and GitHub raw video.
      // Group 1: full match, Group 2: YouTube ID, Group 3: GitHub raw video URL
      const combinedVideoRegex = /(?:(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?)|((?:https:\/\/raw\.githubusercontent\.com\/[^\s]+\.(?:mp4|webm|ogg|mov|avi|flv|wmv|mkv|3gp|m4v))(?:\s|$))/gi;

      let match;
      // Reset regex lastIndex for each line
      combinedVideoRegex.lastIndex = 0;

      while ((match = combinedVideoRegex.exec(line)) !== null) {
        // Add text before the current match
        if (match.index > lastIndex) {
          lineElements.push(<span key={`text-${lineIndex}-${lastIndex}`}>{line.substring(lastIndex, match.index)}</span>);
        }

        // Handle YouTube match
        if (match[1]) { // YouTube ID
          const videoId = match[1];
          lineElements.push(
            <div key={`youtube-${lineIndex}-${match.index}`} className="my-2 aspect-video w-full max-w-full mx-auto rounded-lg overflow-hidden shadow-xl">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video player"
                loading="lazy"
              ></iframe>
            </div>
          );
        }
        // Handle GitHub raw video match
        else if (match[2]) { // GitHub raw video URL
          const videoUrl = match[2];
          lineElements.push(
            <div key={`github-${lineIndex}-${match.index}`} className="my-2 w-full max-w-full mx-auto rounded-lg overflow-hidden shadow-xl">
              <video controls className="w-full h-auto rounded-lg" src={videoUrl}>
                您的瀏覽器不支持影片標籤。
              </video>
            </div>
          );
        }
        lastIndex = combinedVideoRegex.lastIndex;
      }

      // Add any remaining text after the last match
      if (lastIndex < line.length) {
        lineElements.push(<span key={`text-end-${lineIndex}-${lastIndex}`}>{line.substring(lastIndex)}</span>);
      }

      // Push the processed line elements to the main elements array
      elements.push(<React.Fragment key={`line-${lineIndex}`}>{lineElements}</React.Fragment>);

      // Add a <br /> for each line break, except for the last one
      if (lineIndex < lines.length - 1) {
        elements.push(<br key={`br-${lineIndex}`} />);
      }
    });

    return <p className="text-gray-300 text-lg whitespace-pre-wrap">{elements}</p>;
  };


  // 商品詳情頁面組件
  const ProductDetailPage = ({ productId, productsData, onBackToShop, onAddToCart, lang, translations }) => {
    const product = productsData.find(p => p.id === productId);

    if (!product) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white flex items-center justify-center p-4">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
            <p className="text-xl text-red-400">商品未找到。</p>
            <button
              onClick={onBackToShop}
              className="mt-6 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xl font-semibold py-4 px-8 rounded-full shadow-md transform hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto"
            >
              ⬅️ {translations[lang].backToProducts}
            </button>
          </div>
        </div>
      );
    }

    // 映射 Firestore 儲存的分類值到翻譯鍵
    const categoryTranslationMap = {
      '催眠類': translations[lang].categoryHypnosis,
      '憑依用': translations[lang].categoryPossession,
      'TSF用': translations[lang].categoryTSF,
      '武装用': translations[lang].categoryAgentGear,
    };
    const displayCategory = categoryTranslationMap[product.category] || product.category;


    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white flex flex-col items-center p-4">
        <div className="bg-gray-800 bg-opacity-90 rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl w-full border border-purple-700">
          <button
            onClick={onBackToShop}
            className="mb-8 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xl font-semibold py-3 px-6 rounded-full shadow-md transform hover:scale-105 transition-all duration-300 flex items-center"
          >
            ⬅️ {translations[lang].backToProducts}
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-full md:w-1/2 flex-shrink-0">
              <img
                src={product.image}
                alt={product.name[lang] || product.name.ja || product.name} // 顯示翻譯後的名稱
                className="w-full h-auto object-cover rounded-xl shadow-lg"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/333333/FFFFFF?text=${product.id}`; }}
              />
            </div>
            <div className="w-full md:w-1/2">
              <h1 className="text-4xl font-extrabold text-red-400 mb-4">{product.name[lang] || product.name.ja || product.name}</h1> {/* 顯示翻譯後的名稱 */}
              <p className="text-purple-300 text-2xl font-bold mb-4">¥{product.price}</p>
              {/* 使用 renderDetailedDescription 函數來渲染詳細介紹 */}
              {renderDetailedDescription(product.detailedDescription, lang, translations)}
              <p className="text-gray-400 text-md mb-8">分類: {displayCategory}</p> {/* 顯示翻譯後的分類 */}
              <button
                onClick={() => onAddToCart(product)}
                className="w-full bg-red-600 hover:bg-red-500 text-white text-xl font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                {translations[lang].addToCart}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  // 管理後台頁面組件
  const AdminPage = ({ products, lang, translations, onBackToShop, isFirebaseReady, currentLanguage, appContent }) => { // 傳遞 currentLanguage, appContent
    const [editingProduct, setEditingProduct] = useState(null); // null for add, product object for edit
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [imageURL, setImageURL] = useState(''); // 用於顯示圖片 URL
    const [imageFile, setImageFile] = useState(null); // 用於儲存選擇的圖片檔案
    const [category, setCategory] = useState('催眠類'); // Default category (original value)
    const [shortDescription, setShortDescription] = useState(''); // 新增簡介狀態
    const [detailedDescription, setDetailedDescription] = useState(''); // 新增詳細介紹狀態
    const [message, setMessage] = useState(''); // Feedback message
    // const [isTranslating, setIsTranslating] = useState(false); // 移除此狀態

    // 新增用於「關於我們」內容的狀態
    const [adminCeoName, setAdminCeoName] = useState('');
    const [adminCeoBio, setAdminCeoBio] = useState('');
    const [adminCompanyBio, setAdminCompanyBio] = useState('');
    const [adminCompanyVideoUrl, setAdminCompanyVideoUrl] = useState(''); // 新增公司影片URL狀態


    useEffect(() => {
      if (editingProduct) {
        // 編輯時，載入當前語言的內容，如果沒有則載入日文或原始值
        setName(editingProduct.name[lang] || editingProduct.name.ja || editingProduct.name || '');
        setPrice(editingProduct.price);
        setImageURL(editingProduct.image || ''); // 載入現有圖片 URL
        setImageFile(null); // 清空圖片檔案選擇
        setCategory(editingProduct.category); // 儲存原始分類值
        setShortDescription(editingProduct.shortDescription[lang] || editingProduct.shortDescription.ja || editingProduct.shortDescription || '');
        setDetailedDescription(editingProduct.detailedDescription[lang] || editingProduct.detailedDescription.ja || editingProduct.detailedDescription || '');
      } else {
        setName('');
        setPrice('');
        setImageURL('');
        setImageFile(null);
        setCategory('催眠類'); // 重置為原始日文值
        setShortDescription('');
        setDetailedDescription('');
      }
    }, [editingProduct, lang]); // 依賴於 editingProduct 和 lang

    // 當 appContent 改變時，更新「關於我們」的編輯欄位
    useEffect(() => {
      setAdminCeoName(appContent.ceoName[lang] || appContent.ceoName.ja || '');
      setAdminCeoBio(appContent.ceoBio[lang] || appContent.ceoBio.ja || '');
      setAdminCompanyBio(appContent.companyBio[lang] || appContent.companyBio.ja || '');
      setAdminCompanyVideoUrl(appContent.companyVideoUrl[lang] || appContent.companyVideoUrl.ja || ''); // 更新公司影片URL
    }, [appContent, lang]);


    const showMessage = (msg) => {
      setMessage(msg);
      setTimeout(() => setMessage(''), 3000);
    };

    const handleFileChange = (e) => {
      if (e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        setImageURL(URL.createObjectURL(file)); // 預覽圖片
        // 警告用戶本地圖片不會持久化
        showMessage("注意：本地上傳的圖片僅在本次會話中可見，重新整理或關閉瀏覽器後將會消失。");
      } else {
        setImageFile(null);
        setImageURL('');
      }
    };

    const handleAddOrUpdateProduct = async (e) => {
      e.preventDefault();
      if (!db) {
        console.error("AdminPage: Firestore is not initialized.");
        showMessage("Firestore 未初始化，無法操作。請檢查 Firebase 設定。");
        return;
      }

      // 移除 isTranslating 相關邏輯
      // setIsTranslating(true);
      // showMessage("正在翻譯商品資訊...");

      const productData = {
        price: parseFloat(price),
        image: imageURL, // 使用圖片 URL (可能是本地 URL 或外部 URL)
        category, // 儲存原始分類值
        // 儲存多語言內容，僅更新當前語言的內容
        name: { ...(editingProduct?.name || {}), [currentLanguage]: name },
        shortDescription: { ...(editingProduct?.shortDescription || {}), [currentLanguage]: shortDescription },
        detailedDescription: { ...(editingProduct?.detailedDescription || {}), [currentLanguage]: detailedDescription }
      };

      try {
        // 確保 __app_id 變數存在
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

        if (editingProduct) {
          // Update product
          const productRef = window.firebase.doc(db, 'artifacts', appId, 'public', 'data', 'products', editingProduct.id);
          await window.firebase.setDoc(productRef, productData, { merge: true }); // 使用 merge: true 以合併現有文件
          showMessage(translations[lang].productUpdated);
          console.log("AdminPage: Product updated successfully:", editingProduct.id);
        } else {
          // Add new product
          const productsColRef = window.firebase.collection(db, 'artifacts', appId, 'public', 'data', 'products');
          const docRef = await window.firebase.addDoc(productsColRef, productData);
          showMessage(translations[lang].productAdded);
          console.log("AdminPage: Product added successfully with ID:", docRef.id);
        }
        setEditingProduct(null); // Clear form
        setName('');
        setPrice('');
        setImageURL(''); // 清空圖片 URL
        setImageFile(null); // 清空圖片檔案
        setCategory('催眠類'); // 重置為原始日文值
        setShortDescription('');
        setDetailedDescription('');
      } catch (error) {
        console.error("AdminPage: Error adding/updating product:", error);
        showMessage("操作失敗：" + error.message);
      } finally {
        // setIsTranslating(false); // 移除此狀態
      }
    };

    const handleDeleteProduct = async (productId) => {
      if (!db) {
        console.error("AdminPage: Firestore is not initialized for delete.");
        showMessage("Firestore 未初始化，無法操作。請檢查 Firebase 設定。");
        return;
      }
      if (window.confirm(translations[lang].confirmDelete)) {
        try {
          // 確保 __app_id 變數存在
          const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
          const productRef = window.firebase.doc(db, 'artifacts', appId, 'public', 'data', 'products', productId);
          await window.firebase.deleteDoc(productRef);
          showMessage(translations[lang].productDeleted);
          console.log("AdminPage: Product deleted successfully:", productId);
        } catch (error) {
          console.error("AdminPage: Error deleting product:", error);
          showMessage("刪除失敗：" + error.message);
        }
      }
    };

    // 處理儲存「關於我們」內容
    const handleSaveAboutUsContent = async (e) => {
      e.preventDefault();
      if (!db) {
        console.error("AdminPage: Firestore is not initialized for saving about us content.");
        showMessage("Firestore 未初始化，無法操作。請檢查 Firebase 設定。");
        return;
      }

      // 移除 isTranslating 相關邏輯
      // setIsTranslating(true);
      // showMessage("正在翻譯關於我們內容...");

      const newAppContentData = {
        // 儲存多語言內容，僅更新當前語言的內容
        ceoName: { ...(appContent.ceoName || {}), [currentLanguage]: adminCeoName },
        ceoBio: { ...(appContent.ceoBio || {}), [currentLanguage]: adminCeoBio },
        companyBio: { ...(appContent.companyBio || {}), [currentLanguage]: adminCompanyBio },
        companyVideoUrl: { ...(appContent.companyVideoUrl || {}), [currentLanguage]: adminCompanyVideoUrl } // 儲存公司影片URL
      };

      try {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const appSettingsDocRef = window.firebase.doc(db, `artifacts/${appId}/public/data/appSettings/introContent`);
        await window.firebase.setDoc(appSettingsDocRef, newAppContentData, { merge: true }); // 使用 merge: true
        showMessage("關於我們內容已更新！");
        console.log("AdminPage: About us content updated successfully.");
      } catch (error) {
        console.error("AdminPage: Error updating about us content to Firestore:", error); // 更詳細的錯誤日誌
        showMessage(`更新關於我們內容失敗：${error.message}`); // 顯示錯誤訊息
      } finally {
        // setIsTranslating(false); // 移除此狀態
      }
    };


    if (!isFirebaseReady) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white flex items-center justify-center p-4">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
            <p className="text-xl text-red-400">{translations[lang].fetchingProducts}</p>
            <p className="text-gray-400 mt-2">請確保 Firebase 配置已儲存並重新載入頁面。</p>
          </div>
        </div>
      );
    }

    // 映射 Firestore 儲存的分類值到翻譯鍵
    const categoryOptionsMap = {
      '催眠類': translations[lang].categoryHypnosis,
      '憑依用': translations[lang].categoryPossession,
      'TSF用': translations[lang].categoryTSF,
      '武装用': translations[lang].categoryAgentGear,
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white flex flex-col items-center p-4">
        <div className="bg-gray-800 bg-opacity-90 rounded-2xl shadow-2xl p-8 md:p-12 max-w-5xl w-full border border-purple-700">
          <h2 className="text-4xl font-extrabold text-red-400 mb-8 border-b border-red-700 pb-4 text-center">
            {translations[lang].adminPanel}
          </h2>

          {message && (
            <div className="bg-green-700 text-white text-center py-3 px-6 rounded-lg mb-6 text-lg font-semibold shadow-lg animate-fade-in">
              {message}
            </div>
          )}

          {/* 移除 isTranslating 相關的載入訊息 */}
          {/* {isTranslating && (
            <div className="bg-blue-700 text-white text-center py-3 px-6 rounded-lg mb-6 text-lg font-semibold shadow-lg animate-pulse">
              正在翻譯商品資訊，請稍候...
            </div>
          )} */}

          {/* 新增/編輯商品表單 */}
          <form onSubmit={handleAddOrUpdateProduct} className="bg-gray-900 p-6 rounded-xl shadow-lg mb-8 border border-purple-800">
            <h3 className="text-2xl font-bold text-purple-300 mb-6">
              {editingProduct ? translations[lang].editProduct : translations[lang].addProduct}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="productName" className="block text-gray-300 text-sm font-semibold mb-1">
                  {translations[lang].productName}:
                </label>
                <input
                  type="text"
                  id="productName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="productPrice" className="block text-gray-300 text-sm font-semibold mb-1">
                  {translations[lang].productPrice}:
                </label>
                <input
                  type="number"
                  id="productPrice"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                  step="0.01"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="productImageFile" className="block text-gray-300 text-sm font-semibold mb-1">
                  選擇圖片檔案 (本地上傳):
                </label>
                <input
                  type="file"
                  id="productImageFile"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
                {imageURL && ( // 判斷是否有圖片 URL 才顯示預覽
                  <div className="mt-4">
                    <p className="text-gray-400 text-sm mb-2">圖片預覽 / 現有圖片URL:</p>
                    <img src={imageURL} alt="Product Preview" className="max-w-xs h-auto rounded-md shadow-md" />
                    <p className="text-gray-500 text-xs break-all mt-2">{imageURL}</p>
                  </div>
                )}
                <label htmlFor="productImageURL" className="block text-gray-300 text-sm font-semibold mb-1 mt-4">
                  或輸入圖片URL (如果未選擇檔案):
                </label>
                <input
                  type="url"
                  id="productImageURL"
                  value={imageURL}
                  onChange={(e) => { setImageURL(e.target.value); setImageFile(null); }} // 如果手動輸入URL，則清空檔案選擇
                  className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                  placeholder="https://example.com/image.jpg"
                  required // 圖片 URL 仍為必填
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="productCategory" className="block text-gray-300 text-sm font-semibold mb-1">
                  {translations[lang].productCategory}:
                </label>
                <select
                  id="productCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                  required
                >
                  {/* 選項的值為原始日文，顯示為翻譯後的文字 */}
                  <option value="催眠類">{translations[lang].categoryHypnosis}</option>
                  <option value="憑依用">{translations[lang].categoryPossession}</option>
                  <option value="TSF用">{translations[lang].categoryTSF}</option>
                  <option value="武装用">{translations[lang].categoryAgentGear}</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="shortDescription" className="block text-gray-300 text-sm font-semibold mb-1">
                  {translations[lang].productShortDescription}:
                </label>
                <textarea
                  id="shortDescription"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-white h-24"
                  placeholder="輸入商品簡短介紹 (顯示在商品卡片上)"
                  required
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="detailedDescription" className="block text-gray-300 text-sm font-semibold mb-1">
                  {translations[lang].productDetailedDescription}:
                </label>
                <textarea
                  id="detailedDescription"
                  value={detailedDescription}
                  onChange={(e) => setDetailedDescription(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-white h-32"
                  placeholder="輸入商品詳細介紹 (顯示在商品專屬頁面上)"
                  required
                ></textarea>
              </div>
            </div>
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 shadow-lg transform hover:scale-105"
                // disabled={isTranslating} // 移除禁用狀態
              >
                {translations[lang].save}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-6 py-3 rounded-full font-semibold transition-colors duration-300 shadow-md"
                  // disabled={isTranslating} // 移除禁用狀態
                >
                  {translations[lang].cancel}
                </button>
              )}
            </div>
          </form>

          {/* 新增：設定關於我們內容表單 */}
          <form onSubmit={handleSaveAboutUsContent} className="bg-gray-900 p-6 rounded-xl shadow-lg mb-8 border border-purple-800">
            <h3 className="text-2xl font-bold text-purple-300 mb-6">設定關於我們內容</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="adminCeoName" className="block text-gray-300 text-sm font-semibold mb-1">
                  社長姓名:
                </label>
                <input
                  type="text"
                  id="adminCeoName"
                  value={adminCeoName}
                  onChange={(e) => setAdminCeoName(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="adminCeoBio" className="block text-gray-300 text-sm font-semibold mb-1">
                  社長簡介:
                </label>
                <textarea
                  id="adminCeoBio"
                  value={adminCeoBio}
                  onChange={(e) => setAdminCeoBio(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-white h-32"
                  placeholder="輸入社長詳細介紹"
                  required
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="adminCompanyBio" className="block text-gray-300 text-sm font-semibold mb-1">
                  公司簡介:
                </label>
                <textarea
                  id="adminCompanyBio"
                  value={adminCompanyBio}
                  onChange={(e) => setAdminCompanyBio(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-white h-32"
                  placeholder="輸入公司詳細介紹"
                  required
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="adminCompanyVideoUrl" className="block text-gray-300 text-sm font-semibold mb-1">
                  公司簡介影片URL:
                </label>
                <input
                  type="url"
                  id="adminCompanyVideoUrl"
                  value={adminCompanyVideoUrl}
                  onChange={(e) => setAdminCompanyVideoUrl(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                  placeholder="輸入公司簡介影片URL (可選)"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 shadow-lg transform hover:scale-105"
                // disabled={isTranslating}
              >
                儲存關於我們內容
              </button>
            </div>
          </form>

          {/* 商品列表 */}
          <h3 className="text-2xl font-bold text-purple-300 mb-6 mt-8 border-b border-purple-700 pb-3">
            現有商品
          </h3>
          {products.length === 0 ? (
            <p className="text-center text-gray-400 text-lg">{translations[lang].noProducts}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-gray-900 p-4 rounded-xl shadow-md border border-gray-700 flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name[lang] || product.name.ja || product.name} // 顯示翻譯後的名稱
                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/333333/FFFFFF?text=${product.id}`; }}
                  />
                  <div className="flex-grow">
                    <h4 className="text-xl font-semibold text-red-300">{product.name[lang] || product.name.ja || product.name}</h4> {/* 顯示翻譯後的名稱 */}
                    <p className="text-gray-400">¥{product.price} | {categoryOptionsMap[product.category] || product.category}</p> {/* 顯示翻譯後的分類 */}
                    <p className="text-gray-500 text-sm italic whitespace-pre-wrap">{product.shortDescription[lang] || product.shortDescription.ja || ''}</p> {/* 顯示翻譯後的簡介，保留換行 */}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 shadow-md"
                    >
                      {translations[lang].editProduct}
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 shadow-md"
                    >
                      {translations[lang].deleteProduct}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={onBackToShop}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-xl font-semibold py-4 px-8 rounded-full shadow-md transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              ⬅️ {translations[lang].backToShop}
            </button>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="font-sans antialiased">
      {currentPage === 'intro' && (
        <IntroPage onEnterShop={() => setCurrentPage('shop')} lang={currentLanguage} translations={translations} ceoVideoUrl={ceoVideoUrl} appContent={appContent} />
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
          onNavigateToAdmin={handleNavigateToAdmin}
          onProductClick={handleProductClick}
          adVideoUrls={adVideoUrls} // 傳遞 useRef
          currentAdVideoIndex={currentAdVideoIndex} // 傳遞當前索引
          isYouTubeAPIReady={isYouTubeAPIReady} // 傳遞 YouTube API 準備狀態
          setCurrentAdVideoIndex={setCurrentAdVideoIndex} // 傳遞更新索引的函數
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
      {currentPage === 'admin' && (
        <AdminPage
          products={productsData}
          lang={currentLanguage}
          translations={translations}
          onBackToShop={() => setCurrentPage('shop')}
          isFirebaseReady={isFirebaseReady}
          currentLanguage={currentLanguage}
          appContent={appContent} // 傳遞 appContent
        />
      )}
      {currentPage === 'productDetail' && (
        <ProductDetailPage
          productId={selectedProductId}
          productsData={productsData}
          onBackToShop={() => setCurrentPage('shop')}
          onAddToCart={addToCart}
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
            setIsCartOpen(false);
            setCurrentPage('checkout');
          }}
          lang={currentLanguage}
          translations={translations}
        />
      )}

      {showPasswordModal && (
        <PasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handlePasswordSubmit}
          password={passwordInput}
          setPassword={setPasswordInput}
          error={passwordError}
          lang={currentLanguage}
          translations={translations}
        />
      )}
    </div>
  );
}

// Render the App component into the root div
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
 
