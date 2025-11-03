document.addEventListener("DOMContentLoaded", async () => {
  const surahTitle = document.getElementById("surah-title");
  const surahInfo = document.getElementById("surah-info");
  const surahAudio = document.getElementById("surah-audio");
  const ayatList = document.getElementById("ayat-list");

  // Ambil nomor surat dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const surahNumber = urlParams.get("nomor");

  if (!surahNumber) {
    window.location.href = "index.html";
    return;
  }

  // Fetch detail surat
  async function fetchSurahDetail() {
    try {
      const response = await fetch(`https://quran-api.santrikoding.com/api/surah/${surahNumber}`);
      const data = await response.json();

      // Set judul dan info surat
      surahTitle.innerHTML = `${data.nomor}. ${data.nama_latin} (${data.arti})`;
      surahInfo.innerHTML = `${data.jumlah_ayat} ayat - ${data.tempat_turun}`;
      surahAudio.src = data.audio;

      // Set judul halaman
      document.title = `${data.nama_latin} - Al-Qur'an Digital`;

      // Render ayat-ayat
      data.ayat.forEach((ayat) => {
        const ayatItem = document.createElement("div");
        ayatItem.classList = "p-6 verse-container";
        ayatItem.innerHTML = `
                    <div class="flex items-start mb-4">
                        <div class="verse-number rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 text-sm font-bold">
                            ${ayat.nomor}
                        </div>
                        <p class="text-right text-2xl arabic-font leading-loose flex-1">${ayat.ar}</p>
                    </div>
                    <p class="text-brown-700 pl-11 border-t border-amber-200 pt-3">${ayat.idn}</p>
                `;
        ayatList.appendChild(ayatItem);
      });
    } catch (error) {
      console.error("Gagal mengambil detail surat", error);
      ayatList.innerHTML = `
                <div class="text-center py-8 text-red-500 bg-rose-50 rounded-xl p-6">
                    <p class="mb-4">Gagal memuat detail surat. Silakan coba lagi.</p>
                    <button onclick="window.location.href='index.html'" class="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors">
                        Kembali ke Daftar Surat
                    </button>
                </div>
            `;
    }
  }

  fetchSurahDetail();
});
