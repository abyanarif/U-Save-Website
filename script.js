const menuIcon = document.getElementById("menu-icon");
const menuList = document.getElementById("menu-list");

menuIcon.addEventListener("click", () => {
  menuList.classList.toggle("hidden");
});

// Fungsi untuk mengubah teks menjadi titik
function maskText() {
  const maskedElements = document.querySelectorAll(".masked-text");

  maskedElements.forEach((element) => {
    // Simpan teks asli di atribut data
    if (!element.dataset.original) {
      element.dataset.original = element.textContent;
    }

    element.textContent = "•".repeat(element.dataset.original.length);
  });
}

// Panggil saat halaman dimuat
document.addEventListener("DOMContentLoaded", maskText);

// Event listener untuk input
document.querySelector(".rupiah-input").addEventListener("input", function (e) {
  const nilai = parseInt(this.value.replace(/\D/g, "")) || 0;
  updateTampilanUangSaku(nilai);
});

// admin-Literasi-Keuangan
document.addEventListener("DOMContentLoaded", function () {
  // Get the type of literacy from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const literacyType = urlParams.get("type");

  // Set title based on type
  const titleMap = {
    dasar: "Pemahaman Dasar Literasi Keuangan",
    tabungan: "Tabungan dan Pinjaman",
    investasi: "Investasi",
    asuransi: "Asuransi",
    perencanaan: "Perencanaan Keuangan Jangka Panjang",
  };

  if (titleMap[literacyType]) {
    document.getElementById(
      "literacyTitle"
    ).textContent = `Edit ${titleMap[literacyType]}`;
    document.getElementById("literacyTitleInput").value =
      titleMap[literacyType];
  }

  // Load existing content (this would come from your backend in a real app)
  function loadContent() {
    // In a real app, you would fetch this from your database/API
    const sampleContent = {
      dasar:
        "<h2>Pemahaman Dasar Literasi Keuangan</h2><p>Literasi keuangan adalah kemampuan untuk memahami dan mengaplikasikan...</p>",
      tabungan:
        "<h2>Tabungan dan Pinjaman</h2><p>Menabung adalah kebiasaan baik yang harus dimulai sejak dini...</p>",
      // Add other sample content
    };

    if (sampleContent[literacyType]) {
      tinymce.get("literacyContent").setContent(sampleContent[literacyType]);
    }
  }

  loadContent();

  // Save button functionality
  document.getElementById("saveContent").addEventListener("click", function () {
    const title = document.getElementById("literacyTitleInput").value;
    const content = tinymce.get("literacyContent").getContent();
    const imageFile = document.getElementById("literacyImage").files[0];

    // In a real app, you would send this data to your server
    console.log("Saving:", {
      type: literacyType,
      title: title,
      content: content,
      image: imageFile ? imageFile.name : "No image selected",
    });

    alert("Perubahan berhasil disimpan!");
  });
});
