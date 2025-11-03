document.addEventListener("DOMContentLoaded", async () => {
  const surahListContainer = document.getElementById("surah-list");
  const searchInput = document.getElementById("search-input");
  const paginationInfo = document.getElementById("pagination-info");
  const paginationInfoBottom = document.getElementById("pagination-info-bottom");
  const paginationControls = document.getElementById("pagination-controls");
  const paginationControlsBottom = document.getElementById("pagination-controls-bottom");

  const itemsPerPage = 12;
  let currentPage = 1;
  let allSurahs = [];
  let filteredSurahs = [];

  async function fetchSurahList() {
    try {
      const response = await fetch("https://quran-api.santrikoding.com/api/surah");
      allSurahs = await response.json();
      filteredSurahs = [...allSurahs];
      renderSurahList();
      renderPaginationControls();
    } catch (error) {
      console.error("Gagal mengambil data surat", error);
      surahListContainer.innerHTML = `<p class="text-red-500 text-center p-8 bg-rose-50 rounded-xl">Gagal memuat data. Silakan coba lagi.</p>`;
    }
  }

  function renderSurahList() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const surahsToShow = filteredSurahs.slice(startIndex, endIndex);

    surahListContainer.innerHTML = "";

    if (surahsToShow.length === 0) {
      surahListContainer.innerHTML = `<p class="col-span-full text-center text-brown-600 p-8 bg-amber-50 rounded-xl">Tidak ada surat yang ditemukan.</p>`;
      return;
    }

    surahsToShow.forEach((surah) => {
      const surahItem = document.createElement("div");
      surahItem.classList = "p-5 surah-card";
      surahItem.innerHTML = `
                <div class="flex items-start">
                    <div class="verse-number rounded-full w-10 h-10 flex items-center justify-center mr-4 mt-1 font-bold">
                        ${surah.nomor}
                    </div>
                    <div>
                        <h3 class="font-bold text-lg text-brown-800">${surah.nama_latin}</h3>
                        <p class="text-brown-600">${surah.arti}</p>
                        <div class="mt-2 flex items-center text-sm text-brown-500">
                            <span class="mr-3"><i class="fas fa-list-ol mr-1"></i>${surah.jumlah_ayat} ayat</span>
                            <span><i class="fas fa-map-marker-alt mr-1"></i>${surah.tempat_turun}</span>
                        </div>
                    </div>
                </div>
                <div class="mt-3 text-right text-brown-700 arabic-font text-xl">
                    ${surah.nama}
                </div>
            `;
      surahItem.addEventListener("click", () => {
        window.location.href = `detail.html?nomor=${surah.nomor}`;
      });
      surahListContainer.appendChild(surahItem);
    });

    const totalItems = filteredSurahs.length;
    const startItem = startIndex + 1;
    const endItem = Math.min(endIndex, totalItems);
    const paginationText = `Menampilkan ${startItem}-${endItem} dari ${totalItems} surat`;

    paginationInfo.textContent = paginationText;
    paginationInfoBottom.textContent = paginationText;
  }

  function renderPaginationControls() {
    const totalPages = Math.ceil(filteredSurahs.length / itemsPerPage);
    paginationControls.innerHTML = "";
    paginationControlsBottom.innerHTML = "";

    if (totalPages <= 1) return;

    function createPaginationControls(container) {
      const prevButton = document.createElement("button");
      prevButton.innerHTML = `<i class="fas fa-chevron-left"></i>`;
      prevButton.classList = "px-3 py-2 rounded-lg pagination-btn";
      prevButton.disabled = currentPage === 1;
      prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          renderSurahList();
          renderPaginationControls();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
      container.appendChild(prevButton);

      const maxVisiblePages = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      if (startPage > 1) {
        const firstPageButton = document.createElement("button");
        firstPageButton.textContent = "1";
        firstPageButton.classList = "px-3 py-2 rounded-lg pagination-btn";
        firstPageButton.addEventListener("click", () => {
          currentPage = 1;
          renderSurahList();
          renderPaginationControls();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        container.appendChild(firstPageButton);

        if (startPage > 2) {
          const ellipsis = document.createElement("span");
          ellipsis.textContent = "...";
          ellipsis.classList = "px-2 self-center text-brown-600";
          container.appendChild(ellipsis);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.classList = `px-3 py-2 rounded-lg pagination-btn ${
          currentPage === i ? "bg-amber-700 text-white" : ""
        }`;
        pageButton.addEventListener("click", () => {
          currentPage = i;
          renderSurahList();
          renderPaginationControls();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        container.appendChild(pageButton);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          const ellipsis = document.createElement("span");
          ellipsis.textContent = "...";
          ellipsis.classList = "px-2 self-center text-brown-600";
          container.appendChild(ellipsis);
        }

        const lastPageButton = document.createElement("button");
        lastPageButton.textContent = totalPages;
        lastPageButton.classList = "px-3 py-2 rounded-lg pagination-btn";
        lastPageButton.addEventListener("click", () => {
          currentPage = totalPages;
          renderSurahList();
          renderPaginationControls();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        container.appendChild(lastPageButton);
      }

      const nextButton = document.createElement("button");
      nextButton.innerHTML = `<i class="fas fa-chevron-right"></i>`;
      nextButton.classList = "px-3 py-2 rounded-lg pagination-btn";
      nextButton.disabled = currentPage === totalPages;
      nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderSurahList();
          renderPaginationControls();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
      container.appendChild(nextButton);
    }

    createPaginationControls(paginationControls);
    createPaginationControls(paginationControlsBottom);
  }

  // Fungsi pencarian
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm.trim() === "") {
      filteredSurahs = [...allSurahs];
    } else {
      filteredSurahs = allSurahs.filter(
        (surah) =>
          surah.nama_latin.toLowerCase().includes(searchTerm) ||
          surah.arti.toLowerCase().includes(searchTerm) ||
          surah.nomor.toString().includes(searchTerm)
      );
    }

    currentPage = 1;
    renderSurahList();
    renderPaginationControls();
  });

  fetchSurahList();
});
