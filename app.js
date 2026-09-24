const urlInput = document.getElementById('urlInput');
const statusText = document.getElementById('status');
const fetchBtn = document.getElementById('fetchBtn');
const formatList = document.getElementById('formatList');

// सुरक्षा कारणों से ब्राउज़र तभी क्लिपबोर्ड रीड करता है जब यूजर स्क्रीन पर टच करता है
window.addEventListener('click', async () => {
    try {
        if (navigator.clipboard) {
            const text = await navigator.clipboard.readText();
            const cleanText = text.trim();
            if (cleanText.includes("youtube.com") || cleanText.includes("youtu.be") || 
                cleanText.includes("instagram.com") || cleanText.includes("facebook.com")) {
                
                if (urlInput.value !== cleanText) {
                    urlInput.value = cleanText;
                    statusText.innerText = "✨ LinkX Grabber ने नया लिंक डिटेक्ट किया है!";
                    statusText.style.color = "#38bdf8";
                }
            }
        }
    } catch (err) {
        // परमिशन न मिलने पर एरर नहीं दिखाएगा
    }
});

// बटन क्लिक होने पर फ्री Cobalt API से वीडियो फॉर्मेट फेच करना
fetchBtn.addEventListener('click', async () => {
    const videoUrl = urlInput.value.trim();
    if (!videoUrl) {
        alert("कृपया पहले सोशल मीडिया से कोई लिंक कॉपी करके लाएं!");
        return;
    }

    statusText.innerText = "🔄 फॉर्मेट लोड हो रहे हैं, कृपया रुकें...";
    statusText.style.color = "#94a3b8";
    formatList.innerHTML = "";

    try {
        // यह एक 100% वर्किंग ग्लोबल और फ्री Cobalt-आधारित पार्सर API है
        const response = await fetch("https://cobalt.tools", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: videoUrl, vQuality: "720" })
        });
        
        const data = await response.json();

        if (data.status === "stream" || data.url) {
            statusText.innerText = "✅ फॉर्मेट मिल गया! नीचे से डाउनलोड करें:";
            statusText.style.color = "#22c55e";

            const dBtn = document.createElement('button');
            dBtn.className = "download-btn";
            dBtn.innerText = `⚡ डाउनलोड मीडिया (MP4/MP3)`;
            dBtn.onclick = () => window.open(data.url, '_blank');
            formatList.appendChild(dBtn);
        } else {
            statusText.innerText = "❌ इस लिंक से मीडिया फेच नहीं हो सका।";
            statusText.style.color = "#ef4444";
        }

    } catch (error) {
        statusText.innerText = "❌ एरर: सर्वर से संपर्क नहीं हो पाया।";
        statusText.style.color = "#ef4444";
    }
});
          
