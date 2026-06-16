import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';

const app = express();
app.use(express.json());

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
const api_key = process.env.GEMINI_API_KEY;

if (api_key && api_key !== 'MY_GEMINI_API_KEY' && api_key.trim() !== '') {
  try {
    ai = new GoogleGenAI({
      apiKey: api_key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log('Successfully initialized Gemini API Client.');
  } catch (err) {
    console.error('Error instantiating GoogleGenAI client:', err);
  }
} else {
  console.log('Running in Fallback Mode (No active GEMINI_API_KEY). App will run with intelligent simulated fallbacks.');
}

// Global logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Helper for Fallback Product Analysis
function getFallbackAnalysis(title: string, desc: string, category: string, price: string) {
  const priceVal = parseInt(price) || 0;
  const rupiahFormat = priceVal > 0 ? `Rp ${priceVal.toLocaleString('id-ID')}` : 'Harga Hubungi Kontak';
  
  return {
    usp: [
      `Produk lokal berkualitas asli dengan cita rasa khas khas ${category}`,
      `Harga yang sangat bersaing yaitu ${rupiahFormat} untuk nilai kegunaan premium`,
      `Diproduksi oleh tangan-tangan kreatif UMKM Indonesia dengan perhatian mendalam pada detail`
    ],
    targetAudience: [
      `Masyarakat urban perkotaan usia 22-45 tahun yang menghargai keunikan produk buatan lokal`,
      `Pengguna aktf media sosial (Instagram/TikTok/WhatsApp) yang menyukai kemudahan dan estetika`,
      `Keluarga muda dan profesional yang mencari alternatif berkualitas tinggi di bidang ${category}`
    ],
    brandVoice: `Hangat, ramah, meyakinkan, dan dekat dengan kehidupan sehari-hari konsumen kelas menengah Indonesia (Kasual profesional)`,
    competitorAnalysis: `Pesaing umumnya merupakan brand korporat massal yang kurang memiliki cerita personal. Kelemahan pesaing dapat dimanfaatkan dengan menonjolkan aspek 'craftsmanship', keunikan rasa/desain, dan kontribusi sosial membantu perekonomian komunitas lokal Indonesia.`,
    swot: {
      strengths: [
        `Keaslian rasa/desain buatan UMKM lokal yang otentik`,
        `Kelincahan rantai pasok dan fleksibilitas custom produk`,
        `Cerita personal di balik pembuatan produk yang menarik simpati`
      ],
      weaknesses: [
        `Kapasitas produksi harian yang belum berskala pabrik besar`,
        `Keterbatasan jangkauan distribusi fisik di luar daerah asal`,
        `Anggaran pemasaran awal yang sangat terbatas`
      ],
      opportunities: [
        `Tingginya kampanye nasional '#BanggaBuatanIndonesia' di media sosial`,
        `Tren belanja produk ramah lingkungan dan produk sehat/craft buatan rumahan`,
        `Penyebaran viral lewat video pendek (TikTok & Instagram Reels)`
      ],
      threats: [
        `Masuknya produk impor massal berkekuatan modal besar`,
        `Fluktuasi harga bahan baku lokal di pasar musiman`,
        `Kecepatan kompetitor meniru keunikan produk`
      ]
    },
    contentStrategy: [
      `Buat video cerita di balik layar (behind-the-scenes) pembuatan ${title} untuk membangun empati`,
      `Gunakan testimoni pengguna pertama yang menunjukkan ekspresi puas dan natural`,
      `Tampilkan infografis perbandingan bahan alami dibanding produk sintesis pabrikan`
    ]
  };
}

// 1. AI AGENT: Deep Product Marketing Analysis Endpoint
app.post('/api/gemini/analyze', async (req, res) => {
  const { title, description, category, price } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Judul produk wajib diisi' });
  }

  if (!ai) {
    console.log('Generating fallback analysis for:', title);
    const mockRes = getFallbackAnalysis(title, description || '', category || 'Umum', price || '0');
    return res.json(mockRes);
  }

  try {
    const prompt = `Lakukan analisis pemasaran mendalam (Deep Marketing Analysis) untuk produk UMKM Indonesia berikut:
    Nama Produk: "${title}"
    Deskripsi Produk: "${description || 'Tiada deskripsi, mohon asumsikan kegunaan umum'}"
    Kategori Produk: "${category || 'Umum'}"
    Harga Jual: "${price || 'Belum Ditentukan'}"

    Anda adalah seorang Business Consultant, Growth Hacker, dan Ahli Digital Marketing khusus UMKM di Indonesia. Berikan hasil analisis dalam format JSON murni yang terstruktur persis seperti ini agar mesin bisa membacanya dengan aman:
    {
      "usp": ["poin 1 keunggulan produk", "poin 2", "poin 3"],
      "targetAudience": ["segmen pasar potensial 1", "segmen 2", "segmen 3"],
      "brandVoice": "gaya bahasa brand yang disarankan",
      "competitorAnalysis": "analisa persaingan pasar di Indonesia terkait produk ini",
      "swot": {
        "strengths": ["kekuatan internal produk 1", "kekuatan 2", "kekuatan 3"],
        "weaknesses": ["kelemahan internal produk 1", "kelemahan 2", "kelemahan 3"],
        "opportunities": ["peluang eksternal pasar 1", "peluang 2", "peluang 3"],
        "threats": ["ancaman eksternal pasar 1", "ancaman 2", "ancaman 3"]
      },
      "contentStrategy": ["rekomendasi ide konten 1", "rekomendasi ide 2", "rekomendasi ide 3"]
    }

    Pastikan output adalah JSON valid tanpa bungkusan markdown seperti \`\`\`json ... \`\`\`, langsung mulai dengan karakter { dan berakhir dengan }. Jawab dalam Bahasa Indonesia yang profesional dan memotivasi UMKM.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text ? response.text.trim() : '';
    console.log('Gemini raw response (analyze):', text);
    
    try {
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch (parseErr) {
      console.warn('Failed parsing JSON from Gemini, trying to clean string...');
      const cleanJson = text.replace(/^```json/, '').replace(/```$/, '').trim();
      const parsedClean = JSON.parse(cleanJson);
      return res.json(parsedClean);
    }
  } catch (error: any) {
    console.error('Gemini error (analyze):', error);
    // Graceful fallback to prevent user blockage
    const mockRes = getFallbackAnalysis(title, description || '', category || 'Umum', price || '0');
    return res.json(mockRes);
  }
});

// Helper for Copywriting Fallback
function getFallbackCopywriting(title: string, category: string, channel: string, tone: string) {
  return {
    hooks: [
      `🔥 PENYELAMAT hari-hari kamu ada di sini! Kenalin nih: ${title}.`,
      `Bosan sama yang biasa-biasa aja? ${title} siap jadi andalan baru kamu!`,
      `Tinggal sekali coba, dijamin langsung jatuh cinta sama kualitas lokal rasa bintang lima.`
    ],
    bodyText: `Kabar gembira buat sahabat semua! Kami menghadirkan spesial buatan tangan anak bangsa, ${title} dengan kualitas terbaik khusus untuk Anda. Dibuat penuh cinta, sangat cocok untuk mendukung kegiatan harian maupun mempercantik gaya hidup kekinian.\n\nKenapa harus memilih kami?\n✅ Bahan premium pilihan terbaik di kelasnya\n✅ Cita rasa otentik khas UMKM Indonesia\n✅ Harga ramah di kantong, mendukung kelestarian produsen lokal!\n\nYuk saatnya beralih ke produk lokal berkualitas tinggi. Jangan lewatkan promo stok terbatas minggu ini!`,
    hashtags: [
      `#${category.replace(/[^a-zA-Z0-9]/g, '')}`,
      `#${title.replace(/[^a-zA-Z0-9]/g, '')}`,
      `#UMKMIndonesia`,
      `#PilihanLokal`,
      `#BanggaBuatanIndonesia`,
      `#SocioAgenUMKM`
    ],
    callToAction: `👉 Klik link di bio kami sekarang untuk pesan via WhatsApp sebelum kehabisan!`
  };
}

// 2. AI AGENT: Create Copywriting Endpoint
app.post('/api/gemini/copywriting', async (req, res) => {
  const { title, description, category, channel, tone } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Judul produk wajib diisi' });
  }

  if (!ai) {
    console.log('Fallback copywriting for:', title);
    const mockRes = getFallbackCopywriting(title, category || 'Umum', channel || 'Instagram', tone || 'Friendly');
    return res.json(mockRes);
  }

  try {
    const prompt = `Buatkan konten Copywriting pemasaran yang memicu interaksi tinggi (High Converting Copywriting) untuk produk:
    Nama Produk: "${title}"
    Deskripsi: "${description || ''}"
    Kategori: "${category || 'Umum'}"
    Kanal Posting: "${channel || 'Instagram'}"
    Nada Bicara (Tone): "${tone || 'Friendly & Casual'}"

    Anda adalah seorang Copywriter professional berkebangsaan Indonesia yang ahli membuat tulisan yang gampang dimengerti, memikat hati, dan memicu penjualan bagi UMKM di Indonesia. 

    Berikan hasil dalam format JSON murni terstruktur seperti ini:
    {
      "hooks": ["opsi kalimat pembuka/headline memikat 1", "opsi headline 2", "opsi headline 3"],
      "bodyText": "tulis naskah lengkap isi teks caption/konten yang persuasif dan detail (tambahkan emoji pendukung agar estetik)",
      "hashtags": ["hastag1", "hastag2", "hastag3", "hastag4", "hastag5", "hastag6"],
      "callToAction": "kalimat penutup mengajak orang membeli atau klik link/pesan WhatsApp"
    }

    Pastikan output adalah JSON valid tanpa bungkusan markdown seperti \`\`\`json ... \`\`\`, langsung mulai dengan karakter { dan berakhir dengan }.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text ? response.text.trim() : '';
    console.log('Gemini raw response (copywriting):', text);
    
    try {
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch (_) {
      const cleanJson = text.replace(/^```json/, '').replace(/```$/, '').trim();
      const parsedClean = JSON.parse(cleanJson);
      return res.json(parsedClean);
    }
  } catch (error) {
    console.error('Gemini error (copywriting):', error);
    const mockRes = getFallbackCopywriting(title, category || 'Umum', channel || 'Instagram', tone || 'Friendly');
    return res.json(mockRes);
  }
});


// Helper for Photo Concept Fallback
function getFallbackPhotoConcept(title: string, category: string, style: string) {
  return {
    visualDescription: `Sebuah foto produk beresolusi tinggi menampilkan ${title} diletakkan secara estetik di tengah bidang dengan gaya "${style}".`,
    composition: `Produk berada di titik tengah (rule of thirds), disinari cahaya lembut hangat (soft golden hour light) dari arah kanan atas. Bayangan halus jatuh manis di bagian kiri bawah produk untuk efek 3 dimensi nyata.`,
    props: `Dilengkapi elemen dekorasi alami seperti daun kelapa tropis kering, potongan kayu jati estetik halus, dan beberapa butir pasir halus yang mendukung suasana minimalis berkelas.`,
    backgroundSetting: `Latar belakang bertema solid pastel netral bertekstur semen halus (cream / sage green), mencerminkan ketenangan produk buatan tangan lokal.`,
    promptForGenerative: `Professional studio photography of empty brand product packaging of ${title}, shot on textured beige plaster backdrop, styled in organic minimalist aesthetic with sun shadow casting, cinematic lighting, 8k resolution`
  };
}

// 3. AI AGENT: Create Photo Idea / Concept Endpoint
app.post('/api/gemini/photo', async (req, res) => {
  const { title, description, category, style } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Judul produk wajib diisi' });
  }

  if (!ai) {
    console.log('Fallback photo ideas for:', title);
    const mockRes = getFallbackPhotoConcept(title, category || 'Umum', style || 'Minimalist');
    return res.json(mockRes);
  }

  try {
    const prompt = `Buatkan konsep visual foto produk profesional kelas dunia yang mudah direalisasikan oleh pelaku UMKM hanya dengan bermodal HP saja:
    Nama Produk: "${title}"
    Deskripsi: "${description || ''}"
    Kategori: "${category || 'Umum'}"
    Tema Gaya Foto: "${style || 'Minimalist Studio'}"

    Berikan hasil dalam format JSON murni terstruktur seperti ini:
    {
      "visualDescription": "deskripsi detail apa gambar/foto yang harus diambil",
      "composition": "panduan posisi kameranya & arah cahaya matahari/lampu HP",
      "props": "benda-benda pelengkap sederhana di rumah (seperti daun, piring kayu, dll.) yang ditaruh mendukung foto",
      "backgroundSetting": "rekomendasi alas foto atau tembok rumah yang cocok dijadikan layar belakang",
      "promptForGenerative": "satu buah naskah prompt inggris pendek untuk mesin AI penghasil gambar jika produk digenerate penuh oleh AI"
    }

    Pastikan output adalah JSON valid tanpa bungkusan markdown seperti \`\`\`json ... \`\`\`, langsung mulai dengan karakter { dan berakhir dengan }.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text ? response.text.trim() : '';
    console.log('Gemini raw response (photo-ideas):', text);

    try {
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch (_) {
      const cleanJson = text.replace(/^```json/, '').replace(/```$/, '').trim();
      const parsedClean = JSON.parse(cleanJson);
      return res.json(parsedClean);
    }
  } catch (error) {
    console.error('Gemini error (photo):', error);
    const mockRes = getFallbackPhotoConcept(title, category || 'Umum', style || 'Minimalist');
    return res.json(mockRes);
  }
});


// Helper for Video Script Fallback
function getFallbackVideoScript(title: string, category: string, objective: string) {
  return {
    backsoundSuggestion: `Musik akustik ukulele bertempo ceria dan santai (lo-fi ceria khas vlogger kreatif lokal)`,
    scenes: [
      {
        sceneId: 1,
        time: "0.0 - 0.5 detik",
        visual: `HP merekam close-up dramatis unboxing kemasan luar ${title} dengan merobek pita tali jerami rustic secara perlahan. Tangan pelaku usaha tampak ramah.`,
        audio: `Voiceover: "Pernah gak sih ngerasa bosan sama produk yang gitu-gitu aja? Nah, kenalin penyelamat harimu!" (Terdengar efek suara pita robek "sriiitt" murni)`
      },
      {
        sceneId: 2,
        time: "0.6 - 15.0 detik",
        visual: `Transisi cepat ke produk ${title} dalam keadaan siap pakai. Kamera mengitari produk dengan gerakan berputar (pan circular) mengekspos tekstur bahan alaminya secara detail.`,
        audio: `Voiceover: "Dibuat langsung pakai cinta dan bahan alami lokal pilihan, bikin kualitas ${title} ini gausah diragukan lagi di kelasnya!"`
      },
      {
        sceneId: 3,
        time: "15.1 - 30.0 detik",
        visual: `Pemilik UMKM mengacungkan jempol gembira di depan kamera mendampingi produknya, dilanjut transisi ke layar HP yang menunjukkan cara checkout produk.`,
        audio: `Voiceover: "Spesial hari ini ada harga UMKM sahabat khusus buat kamu yang checkout sekarang di bio. Yuk support produk lokal Indonesia!"`
      }
    ]
  };
}

// 4. AI AGENT: Create Video Script Billboard Endpoint
app.post('/api/gemini/video', async (req, res) => {
  const { title, description, category, objective } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Judul produk wajib diisi' });
  }

  if (!ai) {
    console.log('Fallback video script for:', title);
    const mockRes = getFallbackVideoScript(title, category || 'Umum', objective || 'Product Intro');
    return res.json(mockRes);
  }

  try {
    const prompt = `Buatkan storyboard video promosi berdurasi 30 detik untuk diunggah di Instagram Reels / TikTok / YouTube Shorts:
    Nama Produk: "${title}"
    Deskripsi: "${description || ''}"
    Kategori: "${category || 'Umum'}"
    Tujuan Video: "${objective || 'Promosi Penjualan Langsung'}"

    Anda adalah seorang Director Kreatif video viral di TikTok berkebangsaan Indonesia. Buatkan naskah video pendek yang seru, gampang dimengerti, interaktif, dan mudah dicoba sendiri oleh kreator UMKM lokal di rumahnya.

    Berikan hasil dalam format JSON murni terstruktur persis seperti ini:
    {
      "backsoundSuggestion": "rekomendasi musik latar belakang yang cocok",
      "scenes": [
        {
          "sceneId": 1,
          "time": "0:00 - 0:05",
          "visual": "penjelasan detil video apa yang harus diambil dengan HP",
          "audio": "perkataan voiceover (VO) Bahasa Indonesia dan petunjuk sound effect"
        },
        {
          "sceneId": 2,
          "time": "0:05 - 0:20",
          "visual": "penjelasan detil bagian tengah video produk beraksi/dipakai",
          "audio": "perkataan voiceover lanjutan yang menceritakan manfaat"
        },
        {
          "sceneId": 3,
          "time": "0:20 - 0:30",
          "visual": "penjelasan bagian penutup memperlihatkan promo & CTA",
          "audio": "perkataan voiceover penutup mengajak buru-buru membeli sebelum promo habis"
        }
      ]
    }

    Pastikan output adalah JSON valid tanpa bungkusan markdown seperti \`\`\`json ... \`\`\`, langsung mulai dengan karakter { dan berakhir dengan }.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text ? response.text.trim() : '';
    console.log('Gemini raw response (video-script):', text);

    try {
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch (_) {
      const cleanJson = text.replace(/^```json/, '').replace(/```$/, '').trim();
      const parsedClean = JSON.parse(cleanJson);
      return res.json(parsedClean);
    }
  } catch (error) {
    console.error('Gemini error (video):', error);
    const mockRes = getFallbackVideoScript(title, category || 'Umum', objective || 'Product Intro');
    return res.json(mockRes);
  }
});


// Core Web Server Setup
if (isProd) {
  // Serve the static build
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res, next) => {
    // Skip API routes so they don't fall back to single page index
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
} else {
  // Serve via Vite dev middleware
  console.log('Initializing Vite dev server middleware...');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(`DEMELO UMKM AI Server is running securely!`);
  console.log(`Port: ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Environment: ${isProd ? 'Production' : 'Development'}`);
  console.log(`===============================================`);
});
