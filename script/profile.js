// Toggle untuk menampilkan/menyembunyikan password
function togglePasswordVisibility() {
  const elements = document.querySelectorAll(".masked-text");

  elements.forEach((element) => {
    if (element.textContent === element.dataset.original) {
      element.textContent = "•".repeat(element.dataset.original.length);
    } else {
      element.textContent = element.dataset.original;
    }
  });
}
