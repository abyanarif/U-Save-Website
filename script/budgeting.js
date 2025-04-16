// Input Rupiah
document.querySelectorAll(".rupiah-input").forEach((input) => {
  input.addEventListener("keyup", function (e) {
    // Hapus karakter selain angka
    let value = this.value.replace(/\D/g, "");
    // Mengembalikan placeholder jika input kosong
    if (value === "") {
      input.value = "";
      input.placeholder = "Uang Saku";
      return;
    }

    // Format dengan titik sebagai pemisah ribuan
    value = new Intl.NumberFormat("id-ID").format(value);

    // Tambahkan 'Rp ' di depan
    this.value = value ? "Rp. " + value : "";
  });
});

// Global variables
let customCategories = [];

document.addEventListener("DOMContentLoaded", function () {
  // Modal functionality
  const modal = document.getElementById("customCategoryModal");
  const lainnyaCheckbox = document.getElementById("lainnya");
  const closeBtn = document.querySelector(".close");
  const addBtn = document.getElementById("addCustomCategory");
  const confirmBtn = document.getElementById("confirmCategories");
  const customList = document.getElementById("customCategoriesList");

  // Show modal when "Lainnya" is checked
  lainnyaCheckbox.addEventListener("change", function () {
    if (this.checked) {
      modal.style.display = "block";
      renderCustomCategoriesList();
    } else {
      customCategories = [];
      updateResultsDisplay();
    }
  });

  confirmBtn.addEventListener("click", function () {
    modal.style.display = "none";
    hitungAnggaran(); // Langsung hitung setelah konfirmasi
  });

  // Update status tombol konfirmasi berdasarkan ada/tidaknya custom categories
  function updateConfirmButton() {
    confirmBtn.disabled = customCategories.length === 0;
  }

  // Close modal
  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
    if (customCategories.length === 0) {
      lainnyaCheckbox.checked = false;
    }
  });

  // Add custom category
  // Di dalam DOMContentLoaded event listener:
  addBtn.addEventListener("click", function (e) {
    e.preventDefault(); // Tambahkan ini untuk mencegah form submission

    const name = document.getElementById("customCategoryName").value.trim();
    const amount = parseFloat(
      document.getElementById("customCategoryAmount").value
    );

    if (name && !isNaN(amount) && amount > 0) {
      // Cek duplikasi
      if (
        customCategories.some(
          (cat) => cat.name.toLowerCase() === name.toLowerCase()
        )
      ) {
        alert("Kebutuhan ini sudah ada!");
        return;
      }

      customCategories.push({
        id: Date.now().toString(),
        name: name,
        amount: amount,
      });

      // Clear inputs
      document.getElementById("customCategoryName").value = "";
      document.getElementById("customCategoryAmount").value = "";

      renderCustomCategoriesList();

      // Fokus kembali ke input nama
      document.getElementById("customCategoryName").focus();
    } else {
      alert(
        "Mohon isi nama dan nominal dengan benar!\nNominal harus lebih dari 0."
      );
    }
  });

  // Pastikan ini ada di fungsi renderCustomCategoriesList():
  function renderCustomCategoriesList() {
    customList.innerHTML = "";

    if (customCategories.length === 0) {
      customList.innerHTML =
        '<p class="no-categories">Belum ada kebutuhan lainnya</p>';
      updateConfirmButton();
      return;
    }

    const listHeader = document.createElement("h4");
    listHeader.textContent = "Kebutuhan yang Telah Ditambahkan:";
    customList.appendChild(listHeader);

    customCategories.forEach((category) => {
      const item = document.createElement("div");
      item.className = "custom-category-item";
      item.innerHTML = `
      <span>${category.name}: Rp ${formatNumber(category.amount)}</span>
      <button data-id="${category.id}" class="delete-btn">Hapus</button>
    `;
      customList.appendChild(item);
    });

    updateConfirmButton();
  }
});

function hitungAnggaran() {
  // Get pocket money amount
  const uangSakuInput = document.querySelector(".rupiah-input");
  let uangSaku = parseFloat(uangSakuInput.value.replace(/[^\d]/g, "")) || 0;

  // Validate input
  if (uangSaku <= 0) {
    alert("Masukkan jumlah uang saku yang valid!");
    return;
  }

  // Validasi jika ada checkbox lainnya dicentang tapi belum ada custom category
  if (
    document.getElementById("lainnya").checked &&
    customCategories.length === 0
  ) {
    if (
      !confirm(
        'Anda memilih "Lainnya" tapi belum menambahkan kebutuhan. Lanjutkan tanpa kebutuhan tambahan?'
      )
    ) {
      return; // Batalkan jika user tidak ingin melanjutkan
    }
  }

  // Get selected standard categories
  const checkedCategories = Array.from(
    document.querySelectorAll(
      'input[name="budgetCategory"]:checked:not(#lainnya)'
    )
  ).map((el) => el.value);

  // Calculate allocations
  const allocations = calculateAllocations(uangSaku, checkedCategories);

  // Display results
  displayResults(allocations, checkedCategories, uangSaku);
}

function calculateAllocations(total, categories) {
  const weights = {
    kos: 1.2,
    makan: 1.2,
    hiburan: 0.7,
    internet: 0.5,
    darurat: 0.6,
  };

  // Calculate total of custom categories first
  const totalCustom = customCategories.reduce(
    (sum, cat) => sum + cat.amount,
    0
  );
  const remainingBudget = total - totalCustom;

  // If remaining budget is negative, alert user
  if (remainingBudget < 0) {
    alert("Total kebutuhan lainnya melebihi uang saku!");
    return null;
  }

  // Calculate total weight for automatic categories
  const totalWeight = categories.reduce(
    (sum, cat) => sum + (weights[cat] || 1),
    0
  );

  // Calculate allocations
  const result = {
    total: total,
    kos: 0,
    makan: 0,
    hiburan: 0,
    internet: 0,
    darurat: 0,
    custom: [...customCategories], // Copy of custom categories
  };

  // Only calculate if there's remaining budget and categories selected
  if (remainingBudget > 0 && categories.length > 0) {
    categories.forEach((cat) => {
      result[cat] = (remainingBudget * weights[cat]) / totalWeight;
    });
  }

  return result;
}

function displayResults(data, selectedCategories, originalAmount) {
  if (!data) return; // Exit if calculation failed

  // Format currency
  const format = (num) =>
    num ? num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0";

  // Update main categories
  document.querySelectorAll("#uang-saku .hasil-amount span").forEach((el) => {
    el.textContent = format(data.total);
  });

  // Standard categories
  const standardCategories = {
    kos: {
      element: "#uang-tempat-tinggal",
      message: "Biaya kos/akomodasi bulanan",
    },
    makan: {
      element: "#uang-makan",
      message: "Biaya makan bulanan",
    },
    hiburan: {
      element: "#uang-hiburan",
      message: "Alokasi hiburan bulanan",
    },
    internet: {
      element: "#uang-internet",
      message: "Biaya internet bulanan",
    },
    darurat: {
      element: "#dana-darurat",
      message: "Tabungan darurat bulanan",
    },
  };

  // Update standard categories
  Object.entries(standardCategories).forEach(([category, info]) => {
    const element = document.querySelector(
      `${info.element} .hasil-amount span`
    );
    const messageElement = document.querySelector(
      `${info.element} .hasil-pesan`
    );

    if (element && messageElement) {
      element.textContent = format(data[category]);
      messageElement.textContent = selectedCategories.includes(category)
        ? info.message
        : "Tidak dialokasikan";
    }
  });

  // Display custom categories
  displayCustomCategories(data.custom);
}

function displayCustomCategories(customCategories) {
  const customContainer = document.createElement("div");
  customContainer.className = "hasil-container custom-results";
  customContainer.id = "custom-categories-container";

  // Remove existing custom categories display if any
  const existingContainer = document.getElementById(
    "custom-categories-container"
  );
  if (existingContainer) {
    existingContainer.remove();
  }

  if (customCategories.length > 0) {
    const header = document.createElement("h2");
    header.className = "custom-header";
    header.textContent = "Kebutuhan Tambahan";
    customContainer.appendChild(header);

    customCategories.forEach((category) => {
      const categoryBox = document.createElement("div");
      categoryBox.className = "hasil-box custom-box";
      categoryBox.innerHTML = `
        <h3 class="hasil-title">${category.name}</h3>
        <div class="hasil-amount">
          Rp <span>${formatNumber(category.amount)}</span>
        </div>
        <p class="hasil-pesan">Kebutuhan tambahan</p>
      `;
      customContainer.appendChild(categoryBox);
    });

    // Insert after the existing results
    const cekWrapper = document.querySelector(".cek-wrapper");
    if (cekWrapper) {
      cekWrapper.appendChild(customContainer);
    }
  }
}

function formatNumber(num) {
  return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function updateResultsDisplay() {
  // This function can be called when custom categories change
  const uangSakuInput = document.querySelector(".rupiah-input");
  const uangSaku = parseFloat(uangSakuInput.value.replace(/[^\d]/g, "")) || 0;

  if (uangSaku > 0) {
    hitungAnggaran();
  }
}
