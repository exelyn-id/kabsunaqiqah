import React, { useState } from 'react';
import { CheckCircle2, ChevronDown } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({
    nama: '',
    whatsapp: '',
    gender: 'Laki-laki',
    paket: '',
    olahanDaging: '',
    olahanTulang: '',
    alamat: ''
  });

  // State baru untuk menangani status loading saat mengirim data ke Google Sheets
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePesanWA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.paket) {
      alert('Mohon lengkapi Nama Ayah/Ibu dan Pilih Paket terlebih dahulu.');
      return;
    }

    // Mengambil URL endpoint dari file .env.local (atau gunakan string langsung jika belum disetting)
    const SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || 'URL_WEB_APP_GOOGLE_APPS_SCRIPT_ANDA_DISINI';
    
    setIsSubmitting(true);

    try {
      // 1. Kirim data ke backend Google Apps Script
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        // Default fetch dengan body stringified akan memicu preflight CORS,
        // yang sudah ditangani oleh fungsi doOptions di backend Anda.
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      // 2. Jika sukses tersimpan di database, arahkan ke WhatsApp
      if (result.status === 'success') {
        const waNumber = '6281221272999';
        const message = `Halo Admin Kabsun Aqiqah, saya ingin memesan paket aqiqah dengan detail berikut:\n\n*Nama Ayah / Ibu:* ${formData.nama}\n*No. WhatsApp:* ${formData.whatsapp}\n*Jenis Kelamin Anak:* ${formData.gender}\n\n*Pilihan Paket:* ${formData.paket}\n*Olahan Daging:* ${formData.olahanDaging || '-'}\n*Olahan Tulang:* ${formData.olahanTulang || '-'}\n\n*Alamat Pengiriman:*\n${formData.alamat || '-'}\n\nMohon informasi selanjutnya. Terima kasih.`;
        
        // Buka WhatsApp di tab baru
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
        
        // Opsional: Reset form setelah berhasil
        // setFormData({ nama: '', whatsapp: '', gender: 'Laki-laki', paket: '', olahanDaging: '', olahanTulang: '', alamat: '' });
      } else {
        alert('Gagal menyimpan pesanan ke database: ' + (result.message || 'Error tidak diketahui'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan koneksi saat mengirim data. Pastikan URL API sudah benar dan internet lancar.');
    } finally {
      setIsSubmitting(false); // Matikan status loading
    }
  };

  const scrollToForm = () => {
    const formEl = document.getElementById('form-pemesanan');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 flex flex-col overflow-x-hidden">
      
      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100 px-4 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <span className="text-blue-900 font-extrabold text-2xl tracking-tight">Kabsun</span>
          <span className="text-yellow-500 font-extrabold text-2xl tracking-tight">Aqiqah</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-semibold text-gray-600 uppercase tracking-wide">
          <span className="cursor-pointer hover:text-blue-900 transition-colors">Beranda</span>
          <a href="#paket-aqiqah" className="cursor-pointer hover:text-blue-900 transition-colors">Paket</a>
          <span className="cursor-pointer hover:text-blue-900 transition-colors">Menu</span>
        </nav>
        <button
          onClick={scrollToForm}
          className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-full font-bold shadow-sm hover:bg-yellow-500 transition-colors text-sm lg:text-base"
        >
          Pesan Sekarang
        </button>
      </header>

      {/* MAIN LAYOUT (Bento Grid on XL) */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 flex flex-col xl:grid xl:grid-cols-12 xl:gap-4 space-y-4 xl:space-y-0 xl:grid-flow-row-dense">
        
        {/* 2. HERO SECTION */}
        <section className="xl:col-span-8 xl:row-span-2 bg-gradient-to-br from-blue-900 to-blue-800 rounded-3xl p-6 sm:p-10 flex flex-col justify-center relative overflow-hidden min-h-[320px]">
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
              Ibadah Tenang,<br />
              <span className="text-yellow-400">Hati Pun Senang</span>
            </h1>
            <p className="text-blue-100 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
              Paket Jamuan Bayi Ngeberkahan Kabsun Aqiqah Cirebon. Halal, Praktis, dan Lezat.
            </p>
            <a
              href="#paket-aqiqah"
              className="bg-yellow-400 text-blue-900 px-8 py-3.5 rounded-full font-bold text-lg inline-flex items-center justify-center gap-2 shadow-lg hover:bg-yellow-300 transition-colors w-full sm:w-auto"
            >
              Lihat Pilihan Paket
            </a>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-blue-700 opacity-20 transform skew-x-12 translate-x-10 pointer-events-none"></div>
        </section>

        {/* 3. KEUNGGULAN (USP SECTION) */}
        <section className="xl:col-span-4 xl:row-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-100 flex flex-col justify-center">
          <h2 className="text-blue-900 font-bold text-xl mb-6 text-center">Kenapa Memilih Kabsun?</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center flex flex-col items-center justify-center">
              <span className="text-3xl block mb-2">🍽️</span>
              <p className="text-xs sm:text-sm font-bold leading-tight text-gray-700">Bisa TEST FOOD</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center flex flex-col items-center justify-center">
              <span className="text-3xl block mb-2">🐐</span>
              <p className="text-xs sm:text-sm font-bold leading-tight text-gray-700">Pilih Hewan Langsung</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center flex flex-col items-center justify-center">
              <span className="text-3xl block mb-2">🚚</span>
              <p className="text-xs sm:text-sm font-bold leading-tight text-gray-700">FREE ONGKIR Sa-Ciayu</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center flex flex-col items-center justify-center">
              <span className="text-3xl block mb-2">📦</span>
              <p className="text-xs sm:text-sm font-bold leading-tight text-gray-700">Box Elegan & Higienis</p>
            </div>
          </div>
        </section>

        {/* 4. KATALOG PAKET (PAKET AQIQAH SECTION) */}
        <section id="paket-aqiqah" className="xl:col-span-9 xl:row-span-3 bg-blue-900 rounded-3xl p-6 xl:p-8 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-2">
            <h2 className="text-yellow-400 font-bold text-2xl lg:text-3xl">Pilihan Paket Terpopuler 2024</h2>
            <span className="text-blue-200 text-xs italic">*Syarat & Ketentuan Berlaku</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 flex-1">
            
            {/* Card 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col">
              <div className="p-5 border-b border-slate-50 flex-1">
                <div className="text-[11px] uppercase font-bold text-blue-600 mb-1 tracking-wider">Makan Siang</div>
                <h3 className="font-extrabold text-blue-900 text-sm mb-1">PAKET MAKASI</h3>
                <p className="text-yellow-600 font-bold text-base mb-4">Mulai Rp 1.550.000</p>
                <ul className="text-xs text-gray-500 space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> 1 Ekor Betina Musinnah</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> Nasi & Acar (Bening/Kuning)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> Buah (Semangka/Salak)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> Olahan Daging & Tulang</li>
                </ul>
              </div>
              <button onClick={() => { setFormData(prev => ({...prev, paket: 'Paket Makasi (Mulai Rp 1.550.000)'})); scrollToForm(); }} className="bg-blue-50 text-blue-900 text-xs font-bold py-3.5 hover:bg-yellow-400 transition-colors w-full uppercase tracking-wider">Pilih Paket</button>
            </div>

            {/* Card 2 Bestseller */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col border-2 border-yellow-400 transform xl:scale-105 relative z-10">
              <div className="bg-yellow-400 text-blue-900 text-[10px] font-bold text-center py-1.5 uppercase tracking-widest">Bestseller</div>
              <div className="p-5 border-b border-slate-50 flex-1">
                <div className="text-[11px] uppercase font-bold text-blue-600 mb-1 tracking-wider">Ngeberkahan</div>
                <h3 className="font-extrabold text-blue-900 text-sm mb-1">PA JAMBANG</h3>
                <p className="text-yellow-600 font-bold text-base mb-4">Mulai Rp 2.550.000</p>
                <ul className="text-xs text-gray-600 space-y-2 font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" /> 1 Ekor Betina Jadz'ah</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" /> Nasi & Kerupuk Udang</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" /> Pisang Ambon Lumut/Kuning</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" /> Souvenir Kabsun</li>
                </ul>
              </div>
              <button onClick={() => { setFormData(prev => ({...prev, paket: 'Paket Pa Jambang (Mulai Rp 2.550.000)'})); scrollToForm(); }} className="bg-blue-900 text-white text-xs font-bold py-3.5 hover:bg-blue-800 transition-colors w-full uppercase tracking-wider shadow-inner">Pilih Paket</button>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col">
              <div className="p-5 border-b border-slate-50 flex-1">
                <div className="text-[11px] uppercase font-bold text-blue-600 mb-1 tracking-wider">Umum Ekonomis</div>
                <h3 className="font-extrabold text-blue-900 text-sm mb-1">PAKUMIS ISTIMEWA</h3>
                <p className="text-yellow-600 font-bold text-base mb-4">Mulai Rp 3.325.000</p>
                <ul className="text-xs text-gray-500 space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> 1 Ekor Musinnah</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> Sambel Goreng Krewedan</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> Pisang Sunpride & Teh Kotak</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> Bihun / Mie / Soun</li>
                </ul>
              </div>
              <button onClick={() => { setFormData(prev => ({...prev, paket: 'Paket Pakumis Istimewa (Mulai Rp 3.325.000)'})); scrollToForm(); }} className="bg-blue-50 text-blue-900 text-xs font-bold py-3.5 hover:bg-yellow-400 transition-colors w-full uppercase tracking-wider">Pilih Paket</button>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col">
              <div className="p-5 border-b border-slate-50 flex-1">
                <div className="text-[11px] uppercase font-bold text-blue-600 mb-1 tracking-wider">Ekonomis 2</div>
                <h3 className="font-extrabold text-blue-900 text-sm mb-1">PA KUMIS 2</h3>
                <p className="text-yellow-600 font-bold text-base mb-4">Mulai Rp 3.200.000</p>
                <ul className="text-xs text-gray-500 space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> 1 Ekor JANTAN Musinnah</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> Sambel Goreng Krewedan</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> Nasi & Kerupuk Udang</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> Pisang & Acar</li>
                </ul>
              </div>
              <button onClick={() => { setFormData(prev => ({...prev, paket: 'Paket Pa Kumis 2 (Mulai Rp 3.200.000)'})); scrollToForm(); }} className="bg-blue-50 text-blue-900 text-xs font-bold py-3.5 hover:bg-yellow-400 transition-colors w-full uppercase tracking-wider">Pilih Paket</button>
            </div>

          </div>
        </section>

        {/* 6. FORM PEMESANAN (CHECKOUT COMPONENT) */}
        <section id="form-pemesanan" className="xl:col-span-3 xl:row-span-4 bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col order-last xl:order-none">
          <h2 className="text-blue-900 font-bold text-xl mb-6">Mulai Pesan</h2>
          <form className="space-y-4 flex-1 flex flex-col" onSubmit={handlePesanWA}>
            
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Nama Ayah / Ibu</label>
              <input type="text" name="nama" value={formData.nama} onChange={handleInputChange} placeholder="Masukkan nama lengkap" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-900 outline-none text-gray-800" required />
            </div>
            
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">No. WhatsApp</label>
              <input type="number" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder="08xxxxxxxxxx" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-900 outline-none text-gray-800" required />
            </div>
            
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Jenis Kelamin Anak</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="cursor-pointer">
                  <input type="radio" name="gender" value="Laki-laki" checked={formData.gender === 'Laki-laki'} onChange={handleInputChange} className="peer sr-only" />
                  <div className="text-center py-2.5 rounded-xl border border-slate-200 text-gray-500 font-bold text-xs peer-checked:border-blue-900 peer-checked:bg-blue-50 peer-checked:text-blue-900 transition-all">Laki-laki</div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="gender" value="Perempuan" checked={formData.gender === 'Perempuan'} onChange={handleInputChange} className="peer sr-only" />
                  <div className="text-center py-2.5 rounded-xl border border-slate-200 text-gray-500 font-bold text-xs peer-checked:border-blue-900 peer-checked:bg-blue-50 peer-checked:text-blue-900 transition-all">Perempuan</div>
                </label>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Pilih Paket</label>
              <div className="relative">
                <select name="paket" value={formData.paket} onChange={handleInputChange} className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-900 outline-none appearance-none text-gray-800" required>
                  <option value="">Pilih Paket...</option>
                  <option value="Paket Makasi (Mulai Rp 1.550.000)">Paket Makasi - Mulai Rp 1.550.000</option>
                  <option value="Paket Pa Jambang (Mulai Rp 2.550.000)">Paket Pa Jambang - Mulai Rp 2.550.000</option>
                  <option value="Paket Pakumis Istimewa (Mulai Rp 3.325.000)">Paket Pakumis Istimewa - Mulai Rp 3.325.000</option>
                  <option value="Paket Pa Kumis 2 (Mulai Rp 3.200.000)">Paket Pa Kumis 2 - Mulai Rp 3.200.000</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Olahan Daging</label>
                <div className="relative">
                  <select name="olahanDaging" value={formData.olahanDaging} onChange={handleInputChange} className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-900 outline-none appearance-none text-gray-800">
                    <option value="">Pilih...</option>
                    <option value="Bistik">Bistik</option>
                    <option value="Rendang">Rendang</option>
                    <option value="Tongseng">Tongseng</option>
                    <option value="Sate">Sate (+Rp 300rb)</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-3 h-3" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Olahan Tulang</label>
                <div className="relative">
                  <select name="olahanTulang" value={formData.olahanTulang} onChange={handleInputChange} className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-900 outline-none appearance-none text-gray-800">
                    <option value="">Pilih...</option>
                    <option value="Empal">Empal</option>
                    <option value="Gule">Gule</option>
                    <option value="Sop">Sop</option>
                    <option value="Soto">Soto</option>
                    <option value="Rawon">Rawon</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-3 h-3" />
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[120px] xl:min-h-0 flex flex-col">
              <label className="text-[11px] font-bold uppercase text-gray-400 mb-1.5 block">Alamat Pengiriman</label>
              <textarea name="alamat" value={formData.alamat} onChange={handleInputChange} placeholder="Ketik alamat lengkap di sini..." className="w-full flex-1 bg-slate-50 border-none rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-blue-900 outline-none text-gray-800 min-h-[80px]" required></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-yellow-400 text-blue-900 font-extrabold py-4 rounded-2xl shadow-md hover:-translate-y-0.5 hover:bg-yellow-300 transition-all mt-4 xl:mt-auto disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Memproses Pesanan...' : 'Lanjutkan Pemesanan'}
            </button>
          </form>
        </section>

        {/* 5. MENU OLAHAN (INFO SECTION) */}
        <section className="xl:col-span-9 xl:row-span-1 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto flex-1">
            <div className="bg-blue-50 p-3 sm:p-4 rounded-2xl w-full sm:flex-1 text-center sm:text-left border border-blue-100">
              <h4 className="text-xs sm:text-sm font-bold text-blue-900 uppercase mb-1 tracking-wide">Menu Olahan Daging</h4>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Bistik, Rendang, Tongseng</p>
            </div>
            <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl w-full sm:flex-1 text-center sm:text-left border border-slate-100">
              <h4 className="text-xs sm:text-sm font-bold text-blue-900 uppercase mb-1 tracking-wide">Menu Olahan Tulang</h4>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Empal, Gule, Sop, Soto, Rawon</p>
            </div>
          </div>
          <div className="bg-red-50 px-5 py-3 rounded-full border border-red-100 w-full sm:w-auto text-center shrink-0">
            <p className="text-xs font-bold text-red-600 uppercase tracking-wide">*Req Sate +Rp 300rb/ekor</p>
          </div>
        </section>

      </main>

      {/* 7. FOOTER */}
      <footer className="bg-blue-950 text-slate-400 px-4 lg:px-8 py-6 mt-8 sm:mt-auto text-xs border-t border-blue-900">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
            <span className="font-bold text-white text-sm">Kabsun Aqiqah</span>
            <span className="opacity-50 hidden sm:inline">|</span>
            <span className="text-slate-300 font-medium">Cirebon • Indramayu • Majalengka • Kuningan</span>
          </div>
          <p className="font-medium">&copy; {new Date().getFullYear()} Kabsun Aqiqah Cirebon - Amanah & Berkah</p>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/6281221272999?text=Halo%20Admin%20Kabsun%20Aqiqah,%20saya%20ingin%20bertanya%20seputar%20paket%20aqiqah."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center group"
        aria-label="Chat WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.115.55 4.183 1.595 6.002L0 24l6.115-1.564A11.96 11.96 0 0012.031 24c6.645 0 12.031-5.385 12.031-12.031S18.676 0 12.031 0zm0 22.012a9.96 9.96 0 01-5.078-1.385l-.364-.216-3.774.965.98-3.681-.237-.376A9.957 9.957 0 012.02 12.031C2.02 6.495 6.505 2.01 12.031 2.01c5.525 0 10.01 4.485 10.01 10.021s-4.485 10.01-10.01 10.01zm5.495-7.511c-.301-.151-1.782-.879-2.059-.979-.277-.1-.479-.151-.68.151-.201.302-.779.979-.955 1.18-.176.201-.352.226-.653.075-1.427-.714-2.585-1.636-3.567-3.003-.207-.289.176-.271.761-1.424.1-.199.05-.375-.025-.526-.075-.151-.68-1.635-.931-2.241-.243-.585-.49-.505-.68-.515-.176-.01-.378-.01-.579-.01-.201 0-.529.075-.805.376-.277.302-1.057 1.031-1.057 2.515 0 1.484 1.082 2.917 1.233 3.118.151.201 2.124 3.242 5.143 4.542 1.954.843 2.766.905 3.73.76.791-.12 1.782-.729 2.033-1.433.251-.704.251-1.308.176-1.433-.075-.125-.277-.2-.579-.351z" />
        </svg>
      </a>

    </div>
  );
}