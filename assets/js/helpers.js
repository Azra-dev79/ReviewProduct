function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(Number(num || 0));
}

function renderStars(rating) {
  const r = Number(rating || 0);
  let stars = '';

  for (let i = 1; i <= 5; i++) {
    stars += i <= Math.round(r) ? '★' : '☆';
  }

  return stars;
}

function escapeHtml(str) {
  if (!str) return '';

  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getNamaProduk(produk, id) {
  const item = produk.find(p => String(p.id) === String(id));
  return item ? item.nama_produk : 'Produk tidak ditemukan';
}

const Session = {
  KEY: "review_product_user",

  set(user) {
    localStorage.setItem(
      this.KEY,
      JSON.stringify(user)
    );
  },

  get() {
    try {
      return JSON.parse(
        localStorage.getItem(this.KEY)
      );
    } catch (error) {
      return null;
    }
  },

  remove() {
    localStorage.removeItem(this.KEY);
  },

  isLogin() {
    return this.get() !== null;
  },

  isAdmin() {
    const user = this.get();

    return (
      user &&
      user.role &&
      user.role.toLowerCase() === "admin"
    );
  }
};