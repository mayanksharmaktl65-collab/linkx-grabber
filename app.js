const urlInput = document.getElementById('urlInput');
const statusText = document.getElementById('status');
const fetchBtn = document.getElementById('fetchBtn');
const formatList = document.getElementById('formatList');

// 100% इंस्टॉलेशन फिक्स: सर्विस वर्कर लाइफसाइकिल फोर्स अपडेट
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => { reg.update(); console.log('Sync System Live.'); })
            .catch(err => console.log('SW Fail', err));
    });
}

// क्लिपबोर्ड ऑटो-पेस्ट डिटेक्शन
window.addEventListener('click', async () => {
    try {
        if (navigator.clipboard) {
            const text = await navigator.clipboard.readText();
            const cleanText = text.trim();
            if (cleanText.includes("youtube.com") || cleanText.includes("youtu.be") || 
                cleanText.includes("instagram.com") || cleanText.includes("facebook.com")) {
                
                if (urlInput.value !== cleanText) {
                    urlInput.value = cleanText;
                    statusText.innerText = "✨ नया मीडिया लिंक सफलतापूर्वक पकड़ा गया!";
                    statusText.style.color = "#38bdf8";
                }
            }
        }
    } catch (err) { }
});

// मीडिया डाउनलोड इंजन लॉजिक (CORS बायपास बैकअप के साथ)
fetchBtn.addEventListener('click', async () => {
    const videoUrl = urlInput.value.trim();
    if (!videoUrl) {
        statusText.innerText = "⚠ कृपया पहले सोशल मीडिया से कोई लिंक कॉपी करें!";
        return;
    }
    statusText.innerText = "🔄 प्रीमियम सर्वर से फ़ॉर्मेट ला रहे हैं...";
    formatList.innerHTML = "";

    try {
        const res = await fetch(`https://coatext.com{encodeURIComponent(videoUrl)}`);
        const backupData = await res.json();
        if(backupData.video_url || backupData.audio_url) {
            statusText.innerText = "✅ फ़ॉर्मेट मिल गया! नीचे से चुनें:";
            if(backupData.video_url) createDownBtn("🎥 डाउनलोड वीडियो (MP4 HD)", backupData.video_url);
            if(backupData.audio_url) createDownBtn("🎵 डाउनलोड ऑडियो (MP3)", backupData.audio_url);
        } else {
            statusText.innerText = "❌ मीडिया लिंक सपोर्टेड नहीं है।";
        }
    } catch(e) {
        statusText.innerText = "❌ सर्वर व्यस्त है, कृपया दोबारा प्रयास करें।";
    }
});

function createDownBtn(text, url) {
    const btn = document.createElement('button');
    btn.className = "download-btn";
    btn.innerText = text;
    btn.onclick = () => window.open(url, '_blank');
    formatList.appendChild(btn);
}

// मयंक भाई के सोशल लिंक्स का डेटा स्टोर
const socialLinks = {
    'Instagram': 'https://instagram.com',
    'Facebook': 'https://facebook.com',
    'X': 'https://x.com',
    'Telegram': 'https://t.me'
};

let qrInstance = null;

function openQR(platform) {
    document.getElementById('modalTitle').innerText = "LinkX: " + platform;
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = ""; 
    
    document.getElementById('qrModal').style.display = 'flex';
    
    qrInstance = new QRCode(qrContainer, {
        text: socialLinks[platform],
        width: 180,
        height: 180,
        colorDark : "#0f172a",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

function closeQR() {
    document.getElementById('qrModal').style.display = 'none';
}
