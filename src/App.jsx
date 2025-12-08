import React, { useState, useEffect, useRef } from 'react';
import {
  Github,
  Linkedin,
  Mail,
  FileText,
  Cpu,
  Database,
  Code,
  Terminal,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Briefcase,
  User,
  Award,
  Send,
  MessageSquare,
  Sparkles,
  Bot,
  Loader2,
  XCircle
} from 'lucide-react';
import resumePDF from './assets/Nov 2025 ATS_Resume_AzharDzakwan.pdf';

// --- GEMINI API UTILS ---

// PENTING: Konfigurasi API Key
// Membaca API key dari environment variable (Vercel atau .env lokal)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

const RESUME_CONTEXT = `
Anda adalah AI Assistant untuk portofolio Azhar Dzakwan Azizi. Jawab pertanyaan pengunjung seolah-olah Anda adalah representasi digital profesional dari Azhar. Gunakan nada yang ramah, profesional, dan antusias.

Data Diri:
- Nama: Azhar Dzakwan Azizi
- Lokasi: Depok, Indonesia
- Pendidikan: S1 Teknik Robotika dan Kecerdasan Buatan, Universitas Airlangga (IPK 3.66/4.00, Cum Laude). Lulus Des 2024.
- Bahasa: Indonesia (Native), Inggris (Professional).

Pengalaman Kerja:
1. Intern AI Analyst di AMANA Solutions (Nov 2025 - Sekarang): Fokus pada analisis data, pengembangan solusi AI, dan machine learning untuk bisnis.
2. IT Support di PT Delta Mate Indonesia (Jul 2025 - Oct 2025): Manage aset IT (Snipe-IT, Docker), maintenance software, otomasi payroll dengan Python Pandas.
3. Sales Admin di PT Chelatama Perkasa (Des 2024 - Apr 2025): Kelola data proyek, laporan penjualan, kurangi error pricing 15%.
4. IoT R&D Engineer Intern di PT ARIA AGRI Indonesia (Agus 2022 - Des 2022): Buat sistem penyiraman otomatis IoT, analisis data sensor, dashboard Blynk.

Proyek Unggulan:
1. Skripsi (Thesis): Autonomous Mobile Robot dengan A-Star Path Planning. Self-driving robot dengan navigasi rute terdekat, rotary encoder, sensor ultrasonik, Python.
2. Podcast Summarization AI: Pipeline NLP. Audio -> 30s segments -> Whisper ASR (Speech-to-Text) -> BART Transformer (Summarization). Akurasi transkripsi 92%.
3. Sales Dashboard: Analisis data penjualan & inventoris. Python (Pandas) untuk cleaning, Tableau untuk visualisasi. Mengurangi waktu reporting dari 2 jam ke 15 menit.

Skill Teknis:
- Programming: Python, SQL, JavaScript, C++.
- Data/AI: Pandas, NumPy, Scikit-learn, Hugging Face, OpenCV, TensorFlow, Tableau.
- Tools: Docker, Git, Jupyter.

Instruksi Khusus:
- Jika ditanya kontak, arahkan ke email: azhardzakwanazizi@gmail.com atau LinkedIn.
- Jawaban harus ringkas tapi informatif.
- Jika ditanya hal di luar konteks ini, jawab sopan bahwa Anda hanya tahu tentang profesionalitas Azhar.
`;

const callGemini = async (prompt, systemInstruction = RESUME_CONTEXT) => {
  // Validasi sederhana untuk environment deploy (jika apiKey kosong di production)
  // Di environment preview ini, apiKey kosong tidak masalah karena di-inject runtime.

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] }
        }),
      }
    );

    if (!response.ok) throw new Error('API Error');

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya sedang mengalami gangguan koneksi.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, terjadi kesalahan saat menghubungi AI server.";
  }
};

// --- COMPONENTS ---

const Navbar = ({ activeSection, isScrolled, toggleMenu, isMenuOpen, scrollToSection }) => (
  <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
    <div className="container mx-auto px-6 flex justify-between items-center">
      <div className="font-bold text-2xl text-cyan-400 tracking-tighter cursor-pointer flex items-center gap-2" onClick={() => scrollToSection('home')}>
        <Cpu className="w-8 h-8" />
        <span>AZHAR.DEV</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8 text-slate-300 font-medium">
        {['Home', 'About', 'Experience', 'Projects', 'Skills', 'Contact'].map((item) => (
          <button
            key={item}
            onClick={() => scrollToSection(item.toLowerCase())}
            className={`hover:text-cyan-400 transition-colors relative group ${activeSection === item.toLowerCase() ? 'text-cyan-400' : ''}`}
          >
            {item}
            <span className={`absolute -bottom-2 left-0 h-0.5 bg-cyan-400 transition-all duration-300 ${activeSection === item.toLowerCase() ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </button>
        ))}
        <a
          href={resumePDF}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 border border-cyan-400 text-cyan-400 rounded-full hover:bg-cyan-400/10 transition-all flex items-center gap-2"
        >
          <FileText size={16} /> Resume
        </a>
      </div>

      {/* Mobile Menu Toggle */}
      <button className="md:hidden text-slate-300" onClick={toggleMenu}>
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
    </div>

    {/* Mobile Menu */}
    <div className={`md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className="flex flex-col p-6 gap-4 text-center">
        {['Home', 'About', 'Experience', 'Projects', 'Skills', 'Contact'].map((item) => (
          <button
            key={item}
            onClick={() => scrollToSection(item.toLowerCase())}
            className={`text-lg font-medium ${activeSection === item.toLowerCase() ? 'text-cyan-400' : 'text-slate-300'}`}
          >
            {item}
          </button>
        ))}
        <a
          href={resumePDF}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 flex justify-center items-center gap-2 py-2"
        >
          <FileText size={18} /> Resume
        </a>
      </div>
    </div>
  </nav>
);

const Hero = ({ scrollToSection }) => (
  <section id="home" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden bg-slate-950">
    {/* Animated Background Elements */}
    <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse"></div>
    <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse delay-700"></div>

    <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
      <div className="inline-block px-4 py-2 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-full text-cyan-400 font-medium mb-6 animate-fade-in-up">
        👋 Hello, World! I am
      </div>
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight animate-fade-in-up delay-100">
        Azhar Dzakwan <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Azizi</span>
      </h1>
      <h2 className="text-xl md:text-3xl text-slate-400 mb-8 max-w-2xl animate-fade-in-up delay-200">
        Robotics & AI Engineer | Data Analyst
      </h2>
      <p className="text-slate-400 text-lg mb-10 max-w-2xl leading-relaxed animate-fade-in-up delay-300">
        Menggabungkan keahlian Robotika, Artificial Intelligence, dan Data Analytics untuk menciptakan solusi otomatisasi cerdas dan wawasan bisnis yang berdampak.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-400">
        <button
          onClick={() => scrollToSection('projects')}
          className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-full transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
        >
          Lihat Portfolio <Code size={20} />
        </button>
        <div className="flex gap-4 items-center justify-center">
          <SocialLink href="https://github.com/elite789" icon={<Github size={24} />} />
          <SocialLink href="https://linkedin.com/in/azhardzakwan" icon={<Linkedin size={24} />} />
          <SocialLink href="mailto:azhardzakwanazizi@gmail.com" icon={<Mail size={24} />} />
        </div>
      </div>

      <div className="absolute bottom-10 animate-bounce cursor-pointer text-slate-500 hover:text-cyan-400 transition-colors" onClick={() => scrollToSection('about')}>
        <ChevronDown size={32} />
      </div>
    </div>
  </section>
);

const SocialLink = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 rounded-full transition-all border border-slate-700 hover:border-cyan-400/50"
  >
    {icon}
  </a>
);

const About = () => (
  <section id="about" className="py-24 bg-slate-900 relative">
    <div className="container mx-auto px-6">
      <SectionTitle title="About Me" subtitle="Who I Am" />

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl transform rotate-6 group-hover:rotate-3 transition-transform opacity-20"></div>
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 relative z-10 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <User className="text-cyan-400" />
              Profile Singkat
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Lulusan <strong>Teknik Robotika dan Kecerdasan Buatan</strong> dari Universitas Airlangga (IPK 3.66/4.00) dengan pengalaman praktis dalam analisis data, machine learning, dan implementasi sistem otomasi.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Saya memiliki passion dalam pemecahan masalah di lingkungan yang dinamis, mulai dari merancang algoritma navigasi robot otonom hingga membangun dashboard analitik bisnis yang meningkatkan efisiensi operasional.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={<Award />} value="3.66" label="GPA (Cum Laude)" />
          <StatCard icon={<Briefcase />} value="3+" label="Posisi Profesional" />
          <StatCard icon={<Code />} value="10+" label="Tech Projects" />
          <StatCard icon={<Terminal />} value="4+" label="Years Coding" />
        </div>
      </div>
    </div>
  </section>
);

const StatCard = ({ icon, value, label }) => (
  <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-cyan-400/50 transition-all hover:bg-slate-800 text-center group">
    <div className="text-cyan-400 mb-3 flex justify-center group-hover:scale-110 transition-transform">{icon}</div>
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-slate-400">{label}</div>
  </div>
);

const Experience = () => (
  <section id="experience" className="py-24 bg-slate-950">
    <div className="container mx-auto px-6">
      <SectionTitle title="Experience" subtitle="My Career Journey" />

      <div className="max-w-4xl mx-auto space-y-8">
        <ExperienceCard
          role="Intern AI Analyst"
          company="AMANA Solutions"
          period="Nov 2025 - Present"
          description={[
            "Memulai peran baru sebagai AI Analyst, berfokus pada analisis data dan pengembangan solusi AI.",
            "Berkolaborasi dalam tim untuk proyek-proyek inovatif berbasis kecerdasan buatan.",
            "Mengimplementasikan integrasi AI dalam berbagai solusi bisnis untuk meningkatkan efisiensi dan produktivitas."
          ]}
          active={true}
        />
        <ExperienceCard
          role="IT Support"
          company="PT Delta Mate Indonesia"
          period="Jul 2025 - Oct 2025"
          description={[
            "Mengelola aset IT menggunakan Snipe-IT Software dan deployment via Docker.",
            "Bertanggung jawab atas maintenance aset IT dan instalasi software.",
            "Menggunakan Python (Pandas) untuk otomatisasi pengolahan data payroll bulanan."
          ]}
        />
        <ExperienceCard
          role="Sales Admin"
          company="PT Chelatama Perkasa"
          period="Dec 2024 - Apr 2025"
          description={[
            "Mengelola data pelanggan dan proyek konstruksi untuk akurasi harga dan timeline.",
            "Membuat laporan penjualan dan kuotasi, meningkatkan akurasi harga dan mengurangi error 15%.",
            "Membangun tracking sheet berbasis Excel untuk visibilitas progress proyek."
          ]}
        />
        <ExperienceCard
          role="IoT R&D Engineer Intern"
          company="PT ARIA AGRI Indonesia"
          period="Aug 2022 - Dec 2022"
          description={[
            "Membangun sistem penyiraman otomatis berbasis IoT untuk efisiensi irigasi.",
            "Menganalisis data sensor untuk optimasi penggunaan air.",
            "Konfigurasi dashboard Blynk IoT untuk visualisasi data jarak jauh."
          ]}
        />
      </div>
    </div>
  </section>
);

const ExperienceCard = ({ role, company, period, description, active }) => (
  <div className={`relative pl-8 border-l-2 ${active ? 'border-cyan-400' : 'border-slate-700'} transition-all hover:border-cyan-500`}>
    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${active ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' : 'bg-slate-700'}`}></div>
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all shadow-sm">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{role}</h3>
          <p className="text-cyan-400">{company}</p>
        </div>
        <span className="text-sm font-mono text-slate-500 mt-2 md:mt-0 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">{period}</span>
      </div>
      <ul className="space-y-2">
        {description.map((item, index) => (
          <li key={index} className="flex items-start text-slate-300 text-sm">
            <span className="mr-2 text-cyan-500 mt-1.5">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Projects = () => (
  <section id="projects" className="py-24 bg-slate-900">
    <div className="container mx-auto px-6">
      <SectionTitle title="Projects" subtitle="Featured Work & Code" />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Project 1: Thesis */}
        <ProjectCard
          title="Autonomous Mobile Robot A*"
          tags={['Python', 'Robotics', 'Path Planning', 'Sensors']}
          desc="Mengembangkan robot mobile otonom dengan algoritma A-Star untuk navigasi rute terdekat. Integrasi rotary encoder dan sensor ultrasonik untuk obstacle avoidance."
          link="https://github.com/elite789"
          type="Thesis"
          fullContext="Proyek skripsi ini berfokus pada navigasi robot mobile otonom. Tantangan utamanya adalah mengimplementasikan algoritma A* (A-Star) secara efisien pada hardware terbatas agar robot dapat mencari rute terpendek secara real-time. Saya menggunakan Python untuk logika navigasi dan mengintegrasikan data dari rotary encoder (odometry) serta sensor ultrasonik untuk deteksi halangan dinamis."
        />

        {/* Project 2: NLP */}
        <ProjectCard
          title="Podcast Summarization AI"
          tags={['Python', 'NLP', 'HuggingFace', 'Wav2Vec', 'BART']}
          desc="Pipeline otomatis untuk memproses audio podcast, transkripsi speech-to-text (Whisper), dan peringkasan teks menggunakan model transformer BART."
          link="https://github.com/elite789"
          type="Data Science"
          fullContext="Proyek NLP end-to-end untuk meringkas konten audio panjang. Pipeline dimulai dengan pemrosesan audio menggunakan Librosa (segmentasi 30 detik), lalu speech-to-text menggunakan model Whisper (akurasi 92%), dan akhirnya text summarization menggunakan model BART dari Hugging Face. Ini memecahkan masalah konsumsi konten audio yang memakan waktu."
        />

        {/* Project 3: Data Analytics */}
        <ProjectCard
          title="Sales & Inventory Dashboard"
          tags={['Tableau', 'Pandas', 'Excel', 'Data Viz']}
          desc="Dashboard interaktif untuk visualisasi tren penjualan dan stok. Mengotomatisasi laporan penjualan dari 2 jam menjadi 15 menit menggunakan Python."
          link="https://github.com/elite789"
          type="Analytics"
          fullContext="Proyek Business Intelligence untuk optimasi ritel. Saya menggunakan Python Pandas untuk membersihkan dataset kotor berisi 1000+ record penjualan. Hasilnya divisualisasikan di Tableau untuk melacak KPI kritis. Dampak bisnisnya nyata: strategi pembelian berbasis data meningkatkan ketersediaan stok barang terlaris sebesar 15% dan menghemat waktu admin hingga 87%."
        />

        {/* More Projects Link */}
        <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-800/50 transition-all group cursor-pointer" onClick={() => window.open('https://github.com/elite789?tab=repositories', '_blank')}>
          <Github className="w-16 h-16 text-slate-600 group-hover:text-cyan-400 transition-colors mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Lihat Project Lainnya</h3>
          <p className="text-slate-400 text-sm mb-4">Kunjungi GitHub saya untuk melihat source code lengkap dan repositori lainnya.</p>
          <span className="text-cyan-400 text-sm font-medium flex items-center gap-1 group-hover:underline">
            github.com/elite789 <ExternalLink size={14} />
          </span>
        </div>
      </div>
    </div>
  </section>
);

const ProjectCard = ({ title, tags, desc, link, type, fullContext }) => {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAIInsight = async () => {
    if (insight) return; // Don't regenerate if already present
    setLoading(true);
    const prompt = `Analisis proyek teknis berikut ini secara singkat (maksimal 3 kalimat poin-poin). Jelaskan "Technical Challenge", "Solution", dan "Impact" agar mudah dimengerti recruiter. Proyek: ${title}. Konteks: ${fullContext}`;

    const result = await callGemini(prompt, "You are a senior tech recruiter analyst. Summarize technical projects impressively.");
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all group flex flex-col h-full relative">
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-slate-700/50 text-cyan-300 text-xs px-2 py-1 rounded uppercase tracking-wider font-semibold">
            {type}
          </div>
          <div className="flex gap-2">
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <ExternalLink size={20} />
            </a>
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{title}</h3>
        <p className="text-slate-400 text-sm mb-6 flex-grow">{desc}</p>

        {/* AI Insight Section */}
        {insight && (
          <div className="mb-4 p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-lg animate-fade-in text-sm text-cyan-100">
            <div className="flex items-center gap-2 mb-2 text-cyan-400 font-bold text-xs uppercase tracking-wide">
              <Sparkles size={12} /> AI Analysis
            </div>
            <div className="whitespace-pre-line leading-relaxed text-xs opacity-90">{insight}</div>
          </div>
        )}

        <div className="flex justify-between items-end mt-auto">
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="text-xs font-mono text-slate-300 bg-slate-900 border border-slate-700 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* AI Button */}
        <button
          onClick={handleAIInsight}
          disabled={loading || insight}
          className={`mt-4 w-full py-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${insight ? 'bg-slate-900 text-slate-500 border-slate-800' : 'bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'}`}
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
          {loading ? 'Analyzing...' : insight ? 'Insight Generated' : '✨ Generate AI Insight'}
        </button>
      </div>
    </div>
  );
};

const Skills = () => {
  const skills = {
    "Programming": ["Python", "SQL", "JavaScript", "C++ (Arduino)"],
    "Data & Tools": ["Pandas", "NumPy", "Tableau", "Excel", "Docker", "Git"],
    "AI & ML": ["Scikit-learn", "Hugging Face", "OpenCV", "NLP", "TensorFlow"],
    "Databases": ["MySQL", "MariaDB", "PostgreSQL"]
  };

  return (
    <section id="skills" className="py-24 bg-slate-950">
      <div className="container mx-auto px-6">
        <SectionTitle title="Skills" subtitle="Technical Arsenal" />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all">
              <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-slate-800 text-cyan-300 text-sm rounded-lg border border-slate-700 flex items-center gap-1.5 hover:bg-slate-700 transition-colors">
                    <Code size={12} className="opacity-50" /> {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => (
  <section id="contact" className="py-24 bg-slate-900">
    <div className="container mx-auto px-6 max-w-4xl">
      <SectionTitle title="Contact" subtitle="Get In Touch" />

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Mari Berkolaborasi!</h3>
          <p className="text-slate-400 mb-8">
            Saya terbuka untuk kesempatan kerja penuh waktu atau freelance di bidang Data Science, AI, atau IoT. Jika Anda memiliki proyek menarik atau tawaran pekerjaan, jangan ragu untuk menghubungi saya.
          </p>

          <div className="space-y-4">
            <ContactItem icon={<Mail />} text="azhardzakwanazizi@gmail.com" href="mailto:azhardzakwanazizi@gmail.com" />
            <ContactItem icon={<Linkedin />} text="linkedin.com/in/azhardzakwan" href="https://linkedin.com/in/azhardzakwan" />
            <ContactItem icon={<Github />} text="github.com/elite789" href="https://github.com/elite789" />
            <ContactItem icon={<Briefcase />} text="Depok, Indonesia" />
          </div>
        </div>

        <form className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-400 mb-1 block">Nama</label>
              <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors" placeholder="Nama Anda" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400 mb-1 block">Email</label>
              <input type="email" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors" placeholder="email@contoh.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400 mb-1 block">Pesan</label>
              <textarea rows="4" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors" placeholder="Halo Azhar, saya ingin mendiskusikan..." />
            </div>
            <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex justify-center items-center gap-2">
              Kirim Pesan <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
);

const ContactItem = ({ icon, text, href }) => (
  <div className="flex items-center gap-4 text-slate-300">
    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-cyan-400 border border-slate-700 shrink-0">
      {icon}
    </div>
    {href ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors break-all">
        {text}
      </a>
    ) : (
      <span>{text}</span>
    )}
  </div>
);

const SectionTitle = ({ title, subtitle }) => (
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-bold text-white relative inline-block">
      {title}
      <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-cyan-500 rounded-full"></span>
    </h2>
    <span className="text-cyan-400 font-medium tracking-wider uppercase text-sm block mt-6">{subtitle}</span>
  </div>
);

const Footer = () => (
  <footer className="bg-slate-950 py-8 border-t border-slate-900 text-center text-slate-500 text-sm">
    <div className="container mx-auto px-6">
      <p>&copy; {new Date().getFullYear()} Azhar Dzakwan Azizi. Built with React & Tailwind CSS.</p>
    </div>
  </footer>
);

// --- CHAT WIDGET COMPONENT ---

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Halo! Saya adalah AI Assistant Azhar. Ada yang bisa saya bantu tentang portofolio atau pengalaman Azhar?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const aiResponse = await callGemini(userMessage);

    setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-cyan-500/20 p-1.5 rounded-lg">
                <Bot size={20} className="text-cyan-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Azhar AI Assistant</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs text-slate-400">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <XCircle size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-950/50 space-y-4 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                  ? 'bg-cyan-600 text-white rounded-br-none'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-700 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-slate-800 border-t border-slate-700">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya tentang Azhar..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-cyan-500/20 transition-all duration-300 ${isOpen ? 'bg-slate-700 rotate-90' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-110'}`}
      >
        {isOpen ? <X size={24} className="text-white" /> : <MessageSquare size={24} className="text-white group-hover:animate-pulse" />}
      </button>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="font-sans bg-slate-950 text-slate-200 min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar
        activeSection={activeSection}
        isScrolled={isScrolled}
        toggleMenu={toggleMenu}
        isMenuOpen={isMenuOpen}
        scrollToSection={scrollToSection}
      />
      <Hero scrollToSection={scrollToSection} />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
      <Footer />

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default App;