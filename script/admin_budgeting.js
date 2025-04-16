document.addEventListener("DOMContentLoaded", function () {
  // Sample data - in real app, this would come from API
  let cities = [
    { id: 1, name: "Jakarta", umr: 4901798, updatedAt: "15 Jan 2024" },
    { id: 2, name: "Bandung", umr: 3623478, updatedAt: "10 Jan 2024" },
    { id: 3, name: "Surabaya", umr: 3892456, updatedAt: "12 Jan 2024" },
    { id: 4, name: "Medan", umr: 3456789, updatedAt: "5 Jan 2024" },
  ];

  // DOM Elements
  const umrTable = document.getElementById("umrTable");
  const addCityForm = document.getElementById("addCityForm");
  const editUmrForm = document.getElementById("editUmrForm");
  const saveCityBtn = document.getElementById("saveCityBtn");
  const updateUmrBtn = document.getElementById("updateUmrBtn");
  const addCityModal = new bootstrap.Modal(
    document.getElementById("addCityModal")
  );
  const editUmrModal = new bootstrap.Modal(
    document.getElementById("editUmrModal")
  );

  // Format number to Indonesian currency
  function formatCurrency(num) {
    return new Intl.NumberFormat("id-ID").format(num);
  }

  // Render cities table
  function renderCities() {
    const tbody = umrTable.querySelector("tbody");
    tbody.innerHTML = "";

    cities.forEach((city, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${index + 1}</td>
              <td>${city.name}</td>
              <td>${formatCurrency(city.umr)}</td>
              <td>${city.updatedAt}</td>
              <td>
                  <button class="btn btn-sm btn-warning me-1 edit-umr" data-id="${
                    city.id
                  }">
                      <i class="bi bi-pencil"></i> Edit
                  </button>
                  <button class="btn btn-sm btn-danger delete-umr" data-id="${
                    city.id
                  }">
                      <i class="bi bi-trash"></i> Hapus
                  </button>
              </td>
          `;
      tbody.appendChild(row);
    });

    // Add event listeners to edit buttons
    document.querySelectorAll(".edit-umr").forEach((btn) => {
      btn.addEventListener("click", function () {
        const cityId = parseInt(this.getAttribute("data-id"));
        editCity(cityId);
      });
    });

    // Add event listeners to delete buttons
    document.querySelectorAll(".delete-umr").forEach((btn) => {
      btn.addEventListener("click", function () {
        const cityId = parseInt(this.getAttribute("data-id"));
        deleteCity(cityId);
      });
    });
  }

  // Add new city
  saveCityBtn.addEventListener("click", function () {
    const cityName = document.getElementById("cityName").value.trim();
    const umrValue = parseInt(document.getElementById("umrValue").value);

    if (cityName && umrValue) {
      const newCity = {
        id: cities.length + 1,
        name: cityName,
        umr: umrValue,
        updatedAt: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      };

      cities.push(newCity);
      renderCities();
      addCityForm.reset();
      addCityModal.hide();
    } else {
      alert("Harap isi semua field!");
    }
  });

  // Edit city UMR
  function editCity(cityId) {
    const city = cities.find((c) => c.id === cityId);
    if (city) {
      document.getElementById("editCityId").value = city.id;
      document.getElementById("editCityName").value = city.name;
      document.getElementById("editUmrValue").value = city.umr;
      editUmrModal.show();
    }
  }

  // Update city UMR
  updateUmrBtn.addEventListener("click", function () {
    const cityId = parseInt(document.getElementById("editCityId").value);
    const newUmr = parseInt(document.getElementById("editUmrValue").value);

    if (newUmr) {
      const cityIndex = cities.findIndex((c) => c.id === cityId);
      if (cityIndex !== -1) {
        cities[cityIndex].umr = newUmr;
        cities[cityIndex].updatedAt = new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        renderCities();
        editUmrModal.hide();
      }
    } else {
      alert("Harap isi nilai UMR!");
    }
  });

  // Delete city
  function deleteCity(cityId) {
    if (confirm("Apakah Anda yakin ingin menghapus kota ini?")) {
      cities = cities.filter((c) => c.id !== cityId);
      renderCities();
    }
  }

  // Initial render
  renderCities();
});
