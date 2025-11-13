// 活動写真のスライドショー機能

// 写真のリスト（imagesフォルダ内の写真を使用）
const photos = [
    'images/1.jpg',
    'images/2.jpg',
    'images/3.jpg',
    'images/4.jpg',
    'images/LINE_ALBUM_アウトリーチ第1回(香川)_240625_1.jpg',
    'images/LINE_ALBUM_アウトリーチ第1回(香川)_240625_2.jpg',
    'images/LINE_ALBUM_アウトリーチ第1回(香川)_240625_4.jpg',
    'images/カードゲームのリハーサル.jpg',
    'images/カードゲームリハ.jpg',
    'images/宇宙シアター.jpg'
];

let currentPhotoIndex = 0;
const photoImage = document.getElementById('photoImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// 写真を切り替える関数
function showPhoto(index) {
    // インデックスを範囲内に収める
    if (index < 0) {
        currentPhotoIndex = photos.length - 1;
    } else if (index >= photos.length) {
        currentPhotoIndex = 0;
    } else {
        currentPhotoIndex = index;
    }
    
    // フェードアウト
    photoImage.style.opacity = '0';
    
    // 画像を変更してフェードイン
    setTimeout(() => {
        photoImage.src = photos[currentPhotoIndex];
        photoImage.alt = `活動写真 ${currentPhotoIndex + 1}`;
        photoImage.style.opacity = '1';
    }, 150);
}

// 前の写真に移動
prevBtn.addEventListener('click', () => {
    showPhoto(currentPhotoIndex - 1);
});

// 次の写真に移動
nextBtn.addEventListener('click', () => {
    showPhoto(currentPhotoIndex + 1);
});

// キーボード操作（左右の矢印キー）
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        showPhoto(currentPhotoIndex - 1);
    } else if (e.key === 'ArrowRight') {
        showPhoto(currentPhotoIndex + 1);
    }
});

// 初期画像の設定
photoImage.style.transition = 'opacity 0.3s ease';
photoImage.style.opacity = '1';

// モバイルメニューのトグル機能
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const headerNav = document.querySelector('.header-nav');

if (mobileMenuToggle && headerNav) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        headerNav.classList.toggle('active');
    });
    
    // メニューリンクをクリックしたらメニューを閉じる
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            headerNav.classList.remove('active');
        });
    });
}

