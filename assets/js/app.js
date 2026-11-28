// Giao diện và xử lý từng trang. Trang hiện tại lấy từ <body data-page="...">.
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const page = document.body.dataset.page;

  // ---------- Tiện ích ----------
  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ic = (name) => `<svg class="i" aria-hidden="true"><use href="assets/img/icons.svg#${name}"/></svg>`;
  const money = (n) => Number(n).toLocaleString("vi-VN") + "đ";
  // Phụ thu theo cân nặng: dưới 10 kg giá niêm yết, 10–20 kg +30%, trên 20 kg +60%
  const WEIGHT_TIERS = [1, 1.3, 1.6];
  const roundK = (n) => Math.round(n / 1000) * 1000;
  const ZALO_URL = "https://zalo.me/0968198406";
  const pad = (n) => String(n).padStart(2, "0");
  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };
  const dateVN = (iso) => {
    const [y, m, d] = String(iso).split("-");
    return `${d}/${m}/${y}`;
  };
  const TIME_SLOTS = Array.from({ length: 12 }, (_, i) => `${pad(i + 8)}:00`);
  const timeOptions = (selected) =>
    TIME_SLOTS.map((t) => `<option value="${t}"${t === selected ? " selected" : ""}>${t}</option>`).join("");

  const STATUS = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    done: "Hoàn thành",
    cancelled: "Đã hủy",
  };
  const statusBadge = (st) => `<span class="status ${esc(st || "pending")}">${STATUS[st] || STATUS.pending}</span>`;

  const pwField = (id, name, label, autocomplete) => `
    <div class="field"><label for="${id}">${label}</label>
      <div class="pw-wrap"><input id="${id}" name="${name}" type="password" required minlength="6" autocomplete="${autocomplete}">
        <button type="button" class="pw-toggle" aria-label="Hiện mật khẩu" aria-pressed="false">${ic("eye")}</button></div></div>`;

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".pw-toggle");
    if (!btn) return;
    const input = btn.parentElement.querySelector("input");
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.setAttribute("aria-pressed", String(show));
    btn.setAttribute("aria-label", show ? "Ẩn mật khẩu" : "Hiện mật khẩu");
    btn.innerHTML = ic(show ? "eye-off" : "eye");
    input.focus();
  });

  const wantsAdmin = () => new URLSearchParams(location.search).get("next") === "admin";
  const afterLogin = async () => location.replace((await DB.isAdmin()) ? "admin.html" : "account.html");

  function authNotice(html, isError = false) {
    const el = $("#auth-notice");
    if (!el) return;
    el.hidden = !html;
    el.classList.toggle("error", isError);
    el.innerHTML = html || "";
  }

  let toastTimer;
  function toast(message, isError = false) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.toggle("error", isError);
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3500);
  }

  function showDbNotice() {
    const el = $("#db-notice");
    if (el && !DB.isConfigured()) {
      el.hidden = false;
      el.textContent = "Website chưa kết nối được Supabase nên chưa lưu được lịch hẹn. Xem hướng dẫn ở DATABASE.md mục 4.";
    }
  }

  async function withButton(button, busyText, task) {
    const original = button.innerHTML;
    button.disabled = true;
    button.textContent = busyText;
    try {
      return await task();
    } finally {
      button.disabled = false;
      button.innerHTML = original;
    }
  }

  async function refreshBookingCount() {
    const badge = $("#booking-count");
    if (!badge) return;
    const count = await DB.countMyBookings();
    badge.textContent = count;
    badge.hidden = count === 0;
  }

  const serviceCard = (s) => `
    <a class="svc-card" href="service.html?id=${Number(s.id)}">
      <div class="svc-media"><img src="${esc(s.image_url)}" alt="${esc(s.name)}" loading="lazy"><span class="svc-tag">${esc(s.category)}</span></div>
      <div class="svc-body">
        <h3>${esc(s.name)}</h3>
        <p>${esc(s.short_desc)}</p>
        <div class="svc-meta"><span>${ic("clock")} ${esc(s.duration)}</span></div>
        <div class="svc-foot">
          <span class="price">${money(s.price)} <small>/ ${esc(s.unit)}</small></span>
          <span class="link-arrow">Đặt lịch ${ic("arrow")}</span>
        </div>
      </div>
    </a>`;

  // ---------- Header ----------
  async function refreshAccountLink() {
    const label = $("#account-label");
    if (!label) return;
    try {
      const auth = await DB.getAuth();
      if (!auth.loggedIn) {
        label.textContent = "Đăng nhập";
        $("#account-link").href = "login.html";
        return;
      }
      $("#account-link").href = "account.html";
      if (await DB.isAdmin()) {
        label.textContent = "Quản trị";
        $("#account-link").href = "admin.html";
        return;
      }
      const profile = await DB.getProfile().catch(() => null);
      label.textContent = (profile && profile.full_name) || auth.email.split("@")[0];
    } catch {
      label.textContent = "Đăng nhập";
    }
  }

  function initHeader() {
    const current = page === "service" ? "services" : page;
    const authPages = ["account", "login", "register", "forgot", "reset"];
    if (authPages.includes(current) && $("#account-link")) $("#account-link").setAttribute("aria-current", "page");
    const link = $(`.nav [data-nav="${current}"]`);
    if (link) link.setAttribute("aria-current", "page");

    const toggle = $(".nav-toggle");
    const nav = $("#nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "✕" : "☰";
    });
  }

  // ---------- Trang chủ ----------
  async function initHome() {
    const services = await DB.getServices();
    $("#featured-services").innerHTML = services.filter((s) => s.is_featured).slice(0, 4).map(serviceCard).join("");
  }

  // ---------- Về chúng tôi: bảng giá ----------
  async function initAbout() {
    const services = await DB.getServices();
    $("#price-table").innerHTML = services
      .map(
        (s) => `<tr>
          <td><a href="service.html?id=${Number(s.id)}">${esc(s.name)}</a></td>
          <td><span class="chip">${esc(s.category)}</span></td>
          <td>${esc(s.duration)}</td>
          <td class="num"><span class="price">${money(s.price)}</span> <small class="muted">/ ${esc(s.unit)}</small></td>
        </tr>`
      )
      .join("");
  }

  // ---------- Danh sách dịch vụ ----------
  async function initServices() {
    const services = await DB.getServices();
    const categories = ["Tất cả", ...new Set(services.map((s) => s.category))];
    const filters = $("#filters");
    const list = $("#service-list");

    function render(category) {
      const shown = category === "Tất cả" ? services : services.filter((s) => s.category === category);
      list.innerHTML = shown.map(serviceCard).join("");
      filters.innerHTML = categories
        .map((c) => `<button type="button" data-cat="${esc(c)}" aria-pressed="${c === category}">${esc(c)}</button>`)
        .join("");
    }

    filters.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-cat]");
      if (btn) render(btn.dataset.cat);
    });
    render("Tất cả");

    const wt = $("#weight-table");
    if (wt) {
      wt.innerHTML = services
        .map(
          (s) => `<tr>
            <td><a href="service.html?id=${Number(s.id)}">${esc(s.name)}</a> <span class="chip">${esc(s.category)}</span></td>
            ${WEIGHT_TIERS.map((k) => `<td class="num"><span class="price">${money(roundK(s.price * k))}</span> <small class="muted">/ ${esc(s.unit)}</small></td>`).join("")}
          </tr>`
        )
        .join("");
    }
  }

  // ---------- Chi tiết dịch vụ + đặt lịch + đánh giá ----------
  async function initService() {
    const id = new URLSearchParams(location.search).get("id");
    const service = id ? await DB.getService(id) : null;
    const detail = $("#service-detail");

    if (!service) {
      $("#crumb").textContent = "Không tìm thấy";
      detail.innerHTML = `<div class="panel empty"><img src="assets/img/logo-mark.svg" alt=""><h2>Không tìm thấy dịch vụ</h2><p class="muted">Gói dịch vụ này không tồn tại hoặc đã ngừng.</p><a class="btn" href="services.html">Xem tất cả dịch vụ</a></div>`;
      return;
    }

    document.title = `${service.name} | Momo Pet Hotel & Spa`;
    $("#crumb").textContent = service.name;
    const includes = String(service.includes || "").split("|").filter(Boolean);
    detail.innerHTML = `
      <div class="detail">
        <div class="detail-media"><img src="${esc(service.image_url)}" alt="${esc(service.name)}"></div>
        <div class="detail-info">
          <span class="chip">${esc(service.category)}</span>
          <h1>${esc(service.name)}</h1>
          <p class="muted">${esc(service.description)}</p>
          <div class="price-box">
            <span class="price">${money(service.price)} <small>/ ${esc(service.unit)}</small></span>
            <span class="meta"><span>${ic("clock")} ${esc(service.duration)}</span></span>
          </div>
          <h3>Gói bao gồm</h3>
          <ul class="checklist">${includes.map((i) => `<li>${ic("check")} ${esc(i)}</li>`).join("")}</ul>
          <div class="detail-actions">
            <a href="#dat-lich" class="btn">${ic("calendar")} Đặt lịch gói này</a>
            <a href="${ZALO_URL}" target="_blank" rel="noopener" class="btn btn-zalo">${ic("zalo")} Tư vấn qua Zalo</a>
          </div>
          <div class="assure">
            <span>${ic("shield")} Kiểm tra sức khỏe trước dịch vụ</span>
            <span>${ic("camera")} Gửi ảnh trước và sau</span>
            <span>${ic("calendar")} Đổi lịch miễn phí</span>
          </div>
        </div>
      </div>`;

    $("#booking-section").hidden = false;
    showDbNotice();

    const isAdmin = await DB.isAdmin();
    if (isAdmin) {
      const bookPanel = $("#dat-lich");
      bookPanel.querySelector("form").remove();
      bookPanel.querySelector("p.muted").outerHTML = `
        <div class="notice">${ic("shield")} Bạn đang đăng nhập bằng <strong>tài khoản quản trị</strong>. Form này dành cho khách tự đặt lịch.</div>
        <p class="muted">Khách gọi hotline hoặc đến tiệm? Hãy tạo lịch hộ khách trong trang Quản trị.</p>
        <a class="btn btn-brand" href="admin.html#tao-lich">${ic("calendar")} Tạo lịch hẹn cho khách</a>`;
      const rf = $("#review-form");
      rf.outerHTML = `<p class="notice" style="margin-top:20px">${ic("shield")} Tài khoản quản trị không viết đánh giá. Bạn có thể xóa đánh giá không phù hợp trong trang <a href="admin.html">Quản trị</a>.</p>`;
    }

    // Form đặt lịch (INSERT bookings)
    const form = $("#booking-form");
    if (form) {
    form.booking_date.min = todayISO();
    form.booking_date.value = todayISO();
    form.booking_time.innerHTML = timeOptions("09:00");
    DB.getProfile()
      .then((pr) => {
        if (!pr) return;
        if (pr.full_name && !form.owner_name.value) form.owner_name.value = pr.full_name;
        if (pr.phone && !form.phone.value) form.phone.value = pr.phone;
      })
      .catch(() => {});

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      if (form.booking_date.value < todayISO()) return toast("Ngày hẹn không được ở trong quá khứ.", true);
      const booking = {
        service_id: service.id,
        owner_name: form.owner_name.value.trim(),
        phone: form.phone.value.trim(),
        pet_name: form.pet_name.value.trim(),
        pet_type: form.pet_type.value,
        pet_weight: Number(form.pet_weight.value),
        booking_date: form.booking_date.value,
        booking_time: form.booking_time.value,
        note: form.note.value.trim() || null,
      };
      try {
        await withButton(form.querySelector("button[type=submit]"), "Đang đặt lịch…", () => DB.createBooking(booking));
        toast(`Đã đặt lịch cho bé ${booking.pet_name} lúc ${booking.booking_time} ngày ${dateVN(booking.booking_date)}.`);
        form.pet_name.value = "";
        form.pet_weight.value = "";
        form.note.value = "";
        refreshBookingCount();
      } catch (err) {
        toast(err.message, true);
      }
    });

    }

    // Đánh giá (SELECT + INSERT reviews)
    const reviewList = $("#review-list");
    async function loadReviews() {
      try {
        const reviews = await DB.getReviews(service.id);
        reviewList.innerHTML = reviews.length
          ? reviews
              .map(
                (r) => `<div class="review">
                  <div class="review-head"><strong>${esc(r.author_name)}</strong><span class="star-text" aria-label="${Number(r.rating)} trên 5 sao">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span></div>
                  <p>${esc(r.comment)}</p>
                </div>`
              )
              .join("")
          : `<p class="muted">Chưa có đánh giá nào cho gói này. Hãy là người đầu tiên.</p>`;
      } catch (err) {
        reviewList.innerHTML = `<p class="notice error">${esc(err.message)}</p>`;
      }
    }
    loadReviews();

    const reviewForm = $("#review-form");
    if (reviewForm) reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!reviewForm.reportValidity()) return;
      const review = {
        service_id: service.id,
        author_name: reviewForm.author_name.value.trim(),
        rating: Number(reviewForm.rating.value),
        comment: reviewForm.comment.value.trim(),
      };
      try {
        await withButton(reviewForm.querySelector("button[type=submit]"), "Đang gửi…", () => DB.addReview(review));
        toast("Cảm ơn bạn đã đánh giá.");
        reviewForm.reset();
        loadReviews();
      } catch (err) {
        toast(err.message, true);
      }
    });
  }

  // ---------- Lịch hẹn của tôi: xem, sửa (UPDATE), hủy (DELETE) ----------
  async function initBookings() {
    showDbNotice();
    DB.getAuth().then(async (auth) => {
      const el = $("#db-notice");
      if (!el || !DB.isConfigured()) return;
      if (!auth.loggedIn) {
        el.hidden = false;
        el.innerHTML = 'Bạn đang dùng phiên khách nên lịch hẹn chỉ hiện trên trình duyệt này. <a href="login.html">Đăng nhập</a> hoặc <a href="register.html">tạo tài khoản</a> để xem lịch trên mọi thiết bị.';
      } else if (await DB.isAdmin()) {
        el.hidden = false;
        el.innerHTML = `${ic("shield")} Đây là trang lịch hẹn của khách. Toàn bộ lịch hẹn của tiệm nằm trong <a href="admin.html">trang Quản trị</a>.`;
      }
    });
    const list = $("#booking-list");

    const bookingCard = (b) => {
      const s = b.services || {};
      const time = String(b.booking_time).slice(0, 5);
      const past = b.booking_date < todayISO();
      return `
      <article class="booking" data-id="${Number(b.id)}">
        <div class="booking-top">
          <div class="booking-media"><img src="${esc(s.image_url)}" alt=""></div>
          <div>
            ${statusBadge(b.status)}${past ? ' <span class="status past">Đã qua ngày</span>' : ""}
            <h3><a href="service.html?id=${Number(s.id)}">${esc(s.name)}</a></h3>
            <span class="muted">${esc(b.owner_name)} · ${esc(b.phone)} · ${money(s.price || 0)} / ${esc(s.unit)}</span>
          </div>
        </div>
        <div class="booking-info">
          <div><span>Ngày hẹn</span><strong>${dateVN(b.booking_date)}</strong></div>
          <div><span>Giờ hẹn</span><strong>${time}</strong></div>
          <div><span>Thú cưng</span><strong>${esc(b.pet_name)} (${esc(b.pet_type)})</strong></div>
          <div><span>Cân nặng</span><strong>${Number(b.pet_weight)} kg</strong></div>
        </div>
        ${b.note ? `<p class="muted">Ghi chú: ${esc(b.note)}</p>` : ""}
        <div class="booking-actions">
          <button type="button" class="btn btn-small btn-outline" data-action="edit">Sửa lịch</button>
          <button type="button" class="btn btn-small btn-danger" data-action="delete">Hủy lịch</button>
        </div>
        <form hidden novalidate>
          <div class="form-grid">
            <div class="field"><label>Ngày hẹn<input type="date" name="booking_date" required min="${todayISO()}" value="${esc(b.booking_date)}"></label></div>
            <div class="field"><label>Giờ hẹn<select name="booking_time" required>${timeOptions(time)}</select></label></div>
            <div class="field"><label>Cân nặng (kg)<input type="number" name="pet_weight" required min="0.1" max="99" step="0.1" value="${Number(b.pet_weight)}"></label></div>
            <div class="field"><label>Ghi chú<input name="note" maxlength="300" value="${esc(b.note)}"></label></div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-small btn-brand">Lưu thay đổi</button>
            <button type="button" class="btn btn-small btn-outline" data-action="cancel-edit">Đóng</button>
          </div>
        </form>
      </article>`;
    };

    async function load() {
      try {
        const bookings = await DB.getMyBookings();
        list.innerHTML = bookings.length
          ? bookings.map(bookingCard).join("")
          : `<div class="panel empty">
               <img src="assets/img/logo-mark.svg" alt="">
               <h2>Bạn chưa có lịch hẹn nào</h2>
               <p class="muted">Chọn một gói dịch vụ để đặt lịch cho bé.</p>
               <a class="btn" href="services.html">Xem dịch vụ</a>
             </div>`;
      } catch (err) {
        list.innerHTML = `<p class="notice error">${esc(err.message)}</p>`;
      }
      refreshBookingCount();
    }

    list.addEventListener("click", async (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const card = btn.closest(".booking");
      const form = card.querySelector("form");
      const action = btn.dataset.action;

      if (action === "edit") form.hidden = !form.hidden;
      if (action === "cancel-edit") form.hidden = true;
      if (action === "delete") {
        if (!confirm("Hủy lịch hẹn này? Thao tác không thể hoàn tác.")) return;
        try {
          await withButton(btn, "Đang hủy…", () => DB.deleteBooking(card.dataset.id));
          toast("Đã hủy lịch hẹn.");
          load();
        } catch (err) {
          toast(err.message, true);
        }
      }
    });

    list.addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      if (!form.reportValidity()) return;
      if (form.booking_date.value < todayISO()) return toast("Ngày hẹn không được ở trong quá khứ.", true);
      const changes = {
        booking_date: form.booking_date.value,
        booking_time: form.booking_time.value,
        pet_weight: Number(form.pet_weight.value),
        note: form.note.value.trim() || null,
      };
      try {
        await withButton(form.querySelector("button[type=submit]"), "Đang lưu…", () =>
          DB.updateBooking(form.closest(".booking").dataset.id, changes)
        );
        toast("Đã cập nhật lịch hẹn.");
        load();
      } catch (err) {
        toast(err.message, true);
      }
    });

    load();
  }

  // ---------- Đăng nhập ----------
  async function initLogin() {
    showDbNotice();
    if (wantsAdmin()) authNotice(`${ic("shield")} Đăng nhập bằng tài khoản quản trị viên để vào trang Quản trị.`);
    if ((await DB.getAuth()).loggedIn) return afterLogin();
    const f = $("#login-form");
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!f.reportValidity()) return;
      try {
        await withButton(f.querySelector('button[type="submit"]'), "Đang đăng nhập…", () =>
          DB.signIn(f.email.value.trim(), f.password.value)
        );
        if (wantsAdmin() && !(await DB.isAdmin())) toast("Tài khoản này không có quyền quản trị.", true);
        await afterLogin();
      } catch (err) {
        authNotice(esc(err.message), true);
      }
    });
  }

  // ---------- Đăng ký ----------
  async function initRegister() {
    showDbNotice();
    if ((await DB.getAuth()).loggedIn) return afterLogin();
    const f = $("#register-form");
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!f.reportValidity()) return;
      if (f.password.value !== f.password2.value) return authNotice("Hai mật khẩu không khớp.", true);
      try {
        await withButton(f.querySelector('button[type="submit"]'), "Đang tạo tài khoản…", () =>
          DB.signUp({
            email: f.email.value.trim(),
            password: f.password.value,
            full_name: f.full_name.value.trim(),
            phone: f.phone.value.trim(),
          })
        );
        toast("Tạo tài khoản thành công.");
        location.replace("account.html");
      } catch (err) {
        authNotice(esc(err.message), true);
      }
    });
  }

  // ---------- Quên mật khẩu: gửi email ----------
  async function initForgot() {
    showDbNotice();
    const f = $("#forgot-form");
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!f.reportValidity()) return;
      const email = f.email.value.trim();
      try {
        await withButton(f.querySelector('button[type="submit"]'), "Đang gửi…", () => DB.sendPasswordReset(email));
        authNotice("");
        f.hidden = true;
        $("#forgot-email").textContent = email;
        $("#forgot-done").hidden = false;
      } catch (err) {
        authNotice(esc(err.message), true);
      }
    });
  }

  // ---------- Đặt lại mật khẩu (mở từ liên kết trong email) ----------
  async function initReset() {
    showDbNotice();
    const hash = new URLSearchParams(location.hash.slice(1));
    const query = new URLSearchParams(location.search);
    const linkError = hash.get("error") || query.get("error");
    const auth = await DB.getAuth();
    $("#reset-loading").hidden = true;
    if (linkError || !auth.loggedIn) {
      $("#reset-invalid").hidden = false;
      return;
    }
    history.replaceState(null, "", location.pathname);
    const f = $("#reset-form");
    f.hidden = false;
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!f.reportValidity()) return;
      if (f.password.value !== f.password2.value) return authNotice("Hai mật khẩu không khớp.", true);
      try {
        await withButton(f.querySelector('button[type="submit"]'), "Đang lưu…", () => DB.changePassword(f.password.value));
        toast("Đã đặt mật khẩu mới.");
        setTimeout(afterLogin, 800);
      } catch (err) {
        authNotice(esc(err.message), true);
      }
    });
  }

  // ---------- Tài khoản: hồ sơ, đổi mật khẩu, đăng xuất ----------
  async function initAccount() {
    showDbNotice();
    const root = $("#account-root");
    if (!DB.isConfigured()) {
      root.innerHTML = "";
      return;
    }

    async function render() {
      const auth = await DB.getAuth();
      if (!auth.loggedIn) {
        location.replace("login.html");
        return;
      }
      const [profile, count, admin] = await Promise.all([
        DB.getProfile().catch(() => null),
        DB.countMyBookings(),
        DB.isAdmin(),
      ]);
      renderMember(auth, profile || {}, count, admin);
    }

    function renderMember(auth, profile, count, admin) {
      const name = profile.full_name || auth.email.split("@")[0];
      root.innerHTML = `
        <div class="split top">
          <div class="panel">
            <div class="account-hello">
              <span class="avatar">${esc(name.charAt(0).toUpperCase())}</span>
              <div><h2 style="margin:0">Xin chào, ${esc(name)}</h2><span class="muted">${esc(auth.email)}</span></div>
            </div>
            <form id="profile-form" novalidate>
              <h3>Thông tin tài khoản</h3>
              <div class="form-grid">
                <div class="field"><label for="pf-name">Họ và tên</label><input id="pf-name" name="full_name" required maxlength="60" value="${esc(profile.full_name)}"></div>
                <div class="field"><label for="pf-phone">Số điện thoại</label><input id="pf-phone" name="phone" type="tel" required pattern="[0-9+ ]{8,15}" maxlength="15" value="${esc(profile.phone)}"></div>
                <div class="field full"><label for="pf-email">Email</label><input id="pf-email" value="${esc(auth.email)}" disabled></div>
              </div>
              <div class="form-actions"><button type="submit" class="btn btn-brand">Lưu thông tin</button></div>
            </form>
            <form id="password-form" novalidate style="margin-top:28px;padding-top:24px;border-top:1px solid var(--line)">
              <h3>Đổi mật khẩu</h3>
              <div class="form-grid">
                ${pwField("pw-new", "password", "Mật khẩu mới", "new-password")}
                ${pwField("pw-again", "again", "Nhập lại", "new-password")}
              </div>
              <div class="form-actions"><button type="submit" class="btn btn-outline">Đổi mật khẩu</button></div>
            </form>
          </div>
          <div class="account-side">
            ${
              admin
                ? `<div class="info-card"><span class="ico">${ic("shield")}</span><h3>Tài khoản quản trị viên</h3><p>Quản lý lịch hẹn, bảng giá và đánh giá của khách.</p><p style="margin-top:16px"><a class="btn btn-brand" href="admin.html">${ic("shield")} Vào trang quản trị</a></p></div>`
                : `<div class="info-card"><span class="ico">${ic("calendar")}</span><h3>Lịch hẹn của tôi</h3><p>Bạn có ${count} lịch hẹn.</p><p style="margin-top:12px"><a class="link-arrow" href="bookings.html">Xem và quản lý ${ic("arrow")}</a></p></div>
            <div class="info-card"><span class="ico">${ic("paw")}</span><h3>Đặt lịch mới</h3><p>Tên và số điện thoại sẽ được điền sẵn khi bạn đặt lịch.</p><p style="margin-top:12px"><a class="link-arrow" href="services.html">Chọn dịch vụ ${ic("arrow")}</a></p></div>`
            }
            <button type="button" class="btn btn-outline" id="logout-btn">${ic("logout")} Đăng xuất</button>
          </div>
        </div>`;

      const pf = $("#profile-form");
      pf.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!pf.reportValidity()) return;
        try {
          await withButton(pf.querySelector("button"), "Đang lưu…", () =>
            DB.saveProfile({ full_name: pf.full_name.value.trim(), phone: pf.phone.value.trim() })
          );
          toast("Đã cập nhật thông tin tài khoản.");
          refreshAccountLink();
        } catch (err) {
          toast(err.message, true);
        }
      });

      const pw = $("#password-form");
      pw.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!pw.reportValidity()) return;
        if (pw.password.value !== pw.again.value) return toast("Hai mật khẩu không khớp.", true);
        try {
          await withButton(pw.querySelector("button"), "Đang đổi…", () => DB.changePassword(pw.password.value));
          toast("Đã đổi mật khẩu.");
          pw.reset();
        } catch (err) {
          toast(err.message, true);
        }
      });

      $("#logout-btn").addEventListener("click", async () => {
        await DB.signOut();
        toast("Đã đăng xuất.");
        location.href = "login.html";
      });
    }

    render().catch((err) => (root.innerHTML = `<p class="notice error">${esc(err.message)}</p>`));
  }

  // ---------- Quản trị: lịch hẹn, dịch vụ, đánh giá ----------
  async function initAdmin() {
    showDbNotice();
    const root = $("#admin-root");
    if (!DB.isConfigured()) {
      root.innerHTML = "";
      return;
    }

    async function render() {
      const auth = await DB.getAuth();
      if (!auth.loggedIn) {
        location.replace("login.html?next=admin");
        return;
      }
      if (!(await DB.isAdmin())) {
        root.innerHTML = `<div class="panel empty"><img src="assets/img/logo-mark.svg" alt=""><h2>Không có quyền truy cập</h2>
          <p class="muted">Tài khoản ${esc(auth.email)} không phải quản trị viên.</p>
          <button type="button" class="btn btn-outline" id="admin-logout">${ic("logout")} Đăng xuất</button></div>`;
        $("#admin-logout").addEventListener("click", async () => { await DB.signOut(); location.href = "login.html"; });
        return;
      }
      renderDashboard(auth);
    }

    async function renderDashboard(auth) {
      let tab = "bookings";
      let bookings = [];
      let services = [];
      let reviews = [];

      root.innerHTML = `
        <div class="admin-bar">
          <span class="muted">Đăng nhập: <strong>${esc(auth.email)}</strong></span>
          <button type="button" class="btn btn-small btn-outline" id="admin-logout">${ic("logout")} Đăng xuất</button>
        </div>
        <div class="admin-stats" id="admin-stats"></div>
        <div class="tabs" role="tablist">
          <button type="button" role="tab" data-tab="bookings" aria-selected="true">Lịch hẹn</button>
          <button type="button" role="tab" data-tab="services" aria-selected="false">Dịch vụ &amp; giá</button>
          <button type="button" role="tab" data-tab="reviews" aria-selected="false">Đánh giá</button>
          <button type="button" role="tab" data-tab="create" aria-selected="false">${ic("calendar")} Tạo lịch hẹn</button>
        </div>
        <div id="admin-panel"><p class="loading">Đang tải dữ liệu…</p></div>`;

      $("#admin-logout").addEventListener("click", async () => {
        await DB.signOut();
        location.href = "login.html";
      });

      const panel = $("#admin-panel");

      function renderStats() {
        const today = todayISO();
        const active = bookings.filter((b) => b.status !== "cancelled");
        const revenue = bookings
          .filter((b) => b.status === "confirmed" || b.status === "done")
          .reduce((sum, b) => sum + Number((b.services && b.services.price) || 0), 0);
        $("#admin-stats").innerHTML = `
          <div class="info-card"><strong>${bookings.length}</strong><span>Tổng lịch hẹn</span></div>
          <div class="info-card"><strong>${bookings.filter((b) => b.status === "pending").length}</strong><span>Chờ xác nhận</span></div>
          <div class="info-card"><strong>${active.filter((b) => b.booking_date === today).length}</strong><span>Lịch hôm nay</span></div>
          <div class="info-card"><strong>${money(revenue)}</strong><span>Doanh thu dự kiến (đã xác nhận)</span></div>`;
      }

      function bookingsView() {
        panel.innerHTML = `
          <div class="toolbar">
            <select id="f-status"><option value="">Tất cả trạng thái</option>${Object.entries(STATUS).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select>
            <input id="f-search" type="search" placeholder="Tìm tên khách, số điện thoại, tên bé…">
          </div>
          <div class="table-wrap"><table class="admin-table">
            <thead><tr><th>Ngày giờ</th><th>Dịch vụ</th><th>Khách hàng</th><th>Thú cưng</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody id="bk-rows"></tbody>
          </table></div>`;
        const rows = $("#bk-rows");
        const draw = () => {
          const st = $("#f-status").value;
          const q = $("#f-search").value.trim().toLowerCase();
          const shown = bookings.filter(
            (b) =>
              (!st || b.status === st) &&
              (!q || [b.owner_name, b.phone, b.pet_name].join(" ").toLowerCase().includes(q))
          );
          rows.innerHTML = shown.length
            ? shown
                .map(
                  (b) => `<tr data-id="${Number(b.id)}">
                    <td><strong>${dateVN(b.booking_date)}</strong><span class="sub">${String(b.booking_time).slice(0, 5)}</span></td>
                    <td>${esc(b.services && b.services.name)}<span class="sub">${money((b.services && b.services.price) || 0)}</span></td>
                    <td>${esc(b.owner_name)}<span class="sub">${esc(b.phone)}</span></td>
                    <td>${esc(b.pet_name)} (${esc(b.pet_type)})<span class="sub">${Number(b.pet_weight)} kg${b.note ? " · " + esc(b.note) : ""}</span></td>
                    <td><select data-act="status" aria-label="Trạng thái">${Object.entries(STATUS)
                      .map(([k, v]) => `<option value="${k}"${k === (b.status || "pending") ? " selected" : ""}>${v}</option>`)
                      .join("")}</select></td>
                    <td><button type="button" class="icon-btn" data-act="delete" aria-label="Xóa lịch hẹn">${ic("trash")}</button></td>
                  </tr>`
                )
                .join("")
            : `<tr><td colspan="6" class="loading">Không có lịch hẹn phù hợp.</td></tr>`;
        };
        $("#f-status").addEventListener("change", draw);
        $("#f-search").addEventListener("input", draw);
        rows.addEventListener("change", async (e) => {
          const sel = e.target.closest('select[data-act="status"]');
          if (!sel) return;
          const id = Number(sel.closest("tr").dataset.id);
          try {
            await DB.adminSetStatus(id, sel.value);
            bookings.find((b) => b.id === id).status = sel.value;
            renderStats();
            toast(`Đã chuyển lịch #${id} sang "${STATUS[sel.value]}".`);
          } catch (err) {
            toast(err.message, true);
            draw();
          }
        });
        rows.addEventListener("click", async (e) => {
          const btn = e.target.closest('button[data-act="delete"]');
          if (!btn) return;
          const id = Number(btn.closest("tr").dataset.id);
          if (!confirm(`Xóa vĩnh viễn lịch hẹn #${id}? Thao tác không thể hoàn tác.`)) return;
          try {
            await DB.adminDeleteBooking(id);
            bookings = bookings.filter((b) => b.id !== id);
            renderStats();
            draw();
            toast("Đã xóa lịch hẹn.");
          } catch (err) {
            toast(err.message, true);
          }
        });
        draw();
      }

      function servicesView() {
        panel.innerHTML = `
          <div class="table-wrap"><table class="admin-table">
            <thead><tr><th>Dịch vụ</th><th>Nhóm</th><th>Giá (đồng)</th><th>Nổi bật</th><th></th></tr></thead>
            <tbody id="sv-rows">${services
              .map(
                (s) => `<tr data-id="${Number(s.id)}">
                  <td><strong>${esc(s.name)}</strong><span class="sub">${esc(s.duration)} · / ${esc(s.unit)}</span></td>
                  <td><span class="chip">${esc(s.category)}</span></td>
                  <td><input type="number" min="0" step="1000" value="${Number(s.price)}" aria-label="Giá ${esc(s.name)}"></td>
                  <td><input type="checkbox"${s.is_featured ? " checked" : ""} aria-label="Hiện ở Trang chủ"></td>
                  <td><button type="button" class="btn btn-small btn-brand" data-act="save">Lưu</button></td>
                </tr>`
              )
              .join("")}</tbody>
          </table></div>
          <p class="hint">Dịch vụ "Nổi bật" hiện ở Trang chủ (tối đa 4). Giá mới hiện ngay trên website.</p>`;
        $("#sv-rows").addEventListener("click", async (e) => {
          const btn = e.target.closest('button[data-act="save"]');
          if (!btn) return;
          const tr = btn.closest("tr");
          const id = Number(tr.dataset.id);
          const price = Number(tr.querySelector('input[type="number"]').value);
          if (!Number.isFinite(price) || price < 0) return toast("Giá không hợp lệ.", true);
          const is_featured = tr.querySelector('input[type="checkbox"]').checked;
          try {
            await withButton(btn, "Đang lưu…", () => DB.adminUpdateService(id, { price, is_featured }));
            Object.assign(services.find((s) => s.id === id), { price, is_featured });
            toast("Đã lưu dịch vụ.");
          } catch (err) {
            toast(err.message, true);
          }
        });
      }

      function reviewsView() {
        panel.innerHTML = reviews.length
          ? `<div class="table-wrap"><table class="admin-table">
              <thead><tr><th>Ngày</th><th>Dịch vụ</th><th>Khách</th><th>Đánh giá</th><th></th></tr></thead>
              <tbody id="rv-rows">${reviews
                .map(
                  (r) => `<tr data-id="${Number(r.id)}">
                    <td>${dateVN(String(r.created_at).slice(0, 10))}</td>
                    <td>${esc(r.services && r.services.name)}</td>
                    <td>${esc(r.author_name)}</td>
                    <td><span class="star-text">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span><span class="sub">${esc(r.comment)}</span></td>
                    <td><button type="button" class="icon-btn" data-act="delete" aria-label="Xóa đánh giá">${ic("trash")}</button></td>
                  </tr>`
                )
                .join("")}</tbody></table></div>`
          : `<div class="panel empty"><h3>Chưa có đánh giá nào</h3></div>`;
        const tbody = $("#rv-rows");
        if (!tbody) return;
        tbody.addEventListener("click", async (e) => {
          const btn = e.target.closest('button[data-act="delete"]');
          if (!btn) return;
          const id = Number(btn.closest("tr").dataset.id);
          if (!confirm("Xóa đánh giá này?")) return;
          try {
            await DB.adminDeleteReview(id);
            reviews = reviews.filter((r) => r.id !== id);
            reviewsView();
            toast("Đã xóa đánh giá.");
          } catch (err) {
            toast(err.message, true);
          }
        });
      }

      // Tạo lịch hẹn hộ khách gọi điện hoặc đến tiệm (INSERT bookings)
      function createView() {
        panel.innerHTML = `
          <form class="panel" id="admin-create" novalidate style="max-width:820px">
            <h2>Tạo lịch hẹn cho khách</h2>
            <p class="muted">Dùng khi khách gọi hotline hoặc đến trực tiếp. Lịch được lưu dưới tài khoản quản trị và hiện ngay trong tab Lịch hẹn.</p>
            <div class="form-grid">
              <div class="field full"><label for="ac-service">Dịch vụ</label><select id="ac-service" name="service_id" required>${services
                .map((s) => `<option value="${Number(s.id)}">${esc(s.name)} — ${money(s.price)} / ${esc(s.unit)}</option>`)
                .join("")}</select></div>
              <div class="field"><label for="ac-name">Tên khách</label><input id="ac-name" name="owner_name" required maxlength="60"></div>
              <div class="field"><label for="ac-phone">Số điện thoại</label><input id="ac-phone" name="phone" type="tel" required pattern="[0-9+ ]{8,15}" maxlength="15"></div>
              <div class="field"><label for="ac-pet">Tên thú cưng</label><input id="ac-pet" name="pet_name" required maxlength="40"></div>
              <div class="field"><label for="ac-type">Loài</label><select id="ac-type" name="pet_type"><option>Chó</option><option>Mèo</option><option>Khác</option></select></div>
              <div class="field"><label for="ac-weight">Cân nặng (kg)</label><input id="ac-weight" name="pet_weight" type="number" required min="0.1" max="99" step="0.1"></div>
              <div class="field"><label for="ac-status">Trạng thái</label><select id="ac-status" name="status">${Object.entries(STATUS)
                .map(([k, v]) => `<option value="${k}"${k === "confirmed" ? " selected" : ""}>${v}</option>`)
                .join("")}</select></div>
              <div class="field"><label for="ac-date">Ngày hẹn</label><input id="ac-date" name="booking_date" type="date" required min="${todayISO()}" value="${todayISO()}"></div>
              <div class="field"><label for="ac-time">Giờ hẹn</label><select id="ac-time" name="booking_time">${timeOptions("09:00")}</select></div>
              <div class="field full"><label for="ac-note">Ghi chú</label><input id="ac-note" name="note" maxlength="300" placeholder="Ví dụ: khách gọi hotline, bé sợ máy sấy"></div>
            </div>
            <div class="form-actions"><button type="submit" class="btn">${ic("calendar")} Tạo lịch hẹn</button></div>
          </form>`;
        const f = $("#admin-create");
        f.addEventListener("submit", async (e) => {
          e.preventDefault();
          if (!f.reportValidity()) return;
          if (f.booking_date.value < todayISO()) return toast("Ngày hẹn không được ở trong quá khứ.", true);
          const booking = {
            service_id: Number(f.service_id.value),
            owner_name: f.owner_name.value.trim(),
            phone: f.phone.value.trim(),
            pet_name: f.pet_name.value.trim(),
            pet_type: f.pet_type.value,
            pet_weight: Number(f.pet_weight.value),
            booking_date: f.booking_date.value,
            booking_time: f.booking_time.value,
            note: f.note.value.trim() || null,
            status: f.status.value,
          };
          try {
            const created = await withButton(f.querySelector('button[type="submit"]'), "Đang tạo…", () => DB.adminCreateBooking(booking));
            bookings.unshift(created);
            renderStats();
            toast(`Đã tạo lịch cho bé ${booking.pet_name} lúc ${booking.booking_time} ngày ${dateVN(booking.booking_date)}.`);
            f.reset();
            f.booking_date.value = todayISO();
            f.status.value = "confirmed";
          } catch (err) {
            toast(err.message, true);
          }
        });
      }

      const views = { bookings: bookingsView, services: servicesView, reviews: reviewsView, create: createView };
      root.querySelector(".tabs").addEventListener("click", (e) => {
        const b = e.target.closest("button[data-tab]");
        if (!b) return;
        tab = b.dataset.tab;
        root.querySelectorAll(".tabs button").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
        views[tab]();
      });

      if (location.hash === "#tao-lich") {
        tab = "create";
        root.querySelectorAll(".tabs button").forEach((x) => x.setAttribute("aria-selected", String(x.dataset.tab === "create")));
      }

      try {
        [bookings, services, reviews] = await Promise.all([DB.adminGetBookings(), DB.getServices(true), DB.adminGetReviews()]);
        renderStats();
        views[tab]();
      } catch (err) {
        panel.innerHTML = `<p class="notice error">${esc(err.message)}</p>`;
      }
    }

    render().catch((err) => (root.innerHTML = `<p class="notice error">${esc(err.message)}</p>`));
  }

  // ---------- Số điện thoại: điện thoại gọi trực tiếp, máy tính mở Zalo ----------
  function initPhoneLinks() {
    const canCall = matchMedia("(pointer: coarse)").matches;
    if (canCall) return;
    document.querySelectorAll('a[href^="tel:"]').forEach((a) => {
      a.href = ZALO_URL;
      a.target = "_blank";
      a.rel = "noopener";
      a.title = "Mở Zalo để chat với Momo";
    });
  }

  // ---------- Hiệu ứng: hiện dần khi cuộn, nút lên đầu trang, pop-up ưu đãi ----------
  function initEffects() {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = document.querySelectorAll(
      ".section-head, .svc-card, .info-card, .step, .quote, .gallery figure, .feature-row, .stat, .timeline li, .collage, .split > .photo"
    );
    if (!reduce && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              io.unobserve(en.target);
            }
          }),
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      targets.forEach((el, i) => {
        el.classList.add("reveal");
        el.style.transitionDelay = `${(i % 4) * 70}ms`;
        io.observe(el);
      });
      // Thẻ dịch vụ vẽ sau khi tải database: theo dõi thêm khi DOM thay đổi
      new MutationObserver((muts) =>
        muts.forEach((m) =>
          m.addedNodes.forEach((n) => {
            if (n.nodeType === 1 && n.matches(".svc-card")) {
              n.classList.add("reveal");
              io.observe(n);
            }
          })
        )
      ).observe(document.body, { childList: true, subtree: true });
    }

    const top = $(".to-top");
    if (top) {
      addEventListener("scroll", () => (top.hidden = scrollY < 600), { passive: true });
      top.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
    }

    // Pop-up ưu đãi: chỉ ở trang chủ, mỗi phiên một lần, sau 6 giây
    if (page !== "home") return;
    let seen = false;
    try {
      seen = sessionStorage.getItem("momo-promo") === "1";
    } catch {}
    if (seen) return;
    setTimeout(() => {
      if (document.querySelector(".cb-panel:not([hidden])")) return;
      const m = document.createElement("div");
      m.className = "promo";
      m.innerHTML = `
        <div class="promo-box" role="dialog" aria-modal="true" aria-labelledby="promo-title">
          <button type="button" class="promo-close" aria-label="Đóng">${ic("close")}</button>
          <div class="promo-media"><img src="assets/img/photos/hero-spa.jpg" alt=""></div>
          <div class="promo-body">
            <span class="eyebrow">Ưu đãi khách mới</span>
            <h2 id="promo-title">Giảm 20% Combo Tắm &amp; Cắt tỉa</h2>
            <p class="muted">Dành cho bé lần đầu đến Momo. Tặng kèm nơ hoặc khăn cổ xinh xắn. Lễ tân áp dụng ưu đãi khi xác nhận lịch.</p>
            <div class="detail-actions">
              <a class="btn" href="service.html?id=8#dat-lich">${ic("calendar")} Đặt lịch ngay</a>
              <a class="btn btn-zalo" href="${ZALO_URL}" target="_blank" rel="noopener">${ic("zalo")} Hỏi qua Zalo</a>
            </div>
          </div>
        </div>`;
      document.body.appendChild(m);
      requestAnimationFrame(() => m.classList.add("show"));
      const close = () => {
        m.classList.remove("show");
        setTimeout(() => m.remove(), 250);
        document.removeEventListener("keydown", onKey);
      };
      const onKey = (e) => e.key === "Escape" && close();
      document.addEventListener("keydown", onKey);
      m.addEventListener("click", (e) => {
        if (e.target === m || e.target.closest(".promo-close")) close();
      });
      try {
        sessionStorage.setItem("momo-promo", "1");
      } catch {}
    }, 6000);
  }

  // ---------- Khởi động ----------
  initHeader();
  initPhoneLinks();
  initEffects();
  refreshAccountLink();
  const inits = {
    home: initHome,
    about: initAbout,
    services: initServices,
    service: initService,
    bookings: initBookings,
    account: initAccount,
    login: initLogin,
    register: initRegister,
    forgot: initForgot,
    reset: initReset,
    admin: initAdmin,
  };
  Promise.resolve(inits[page] ? inits[page]() : null).catch((err) => {
    console.error(err);
    toast(err.message || "Có lỗi xảy ra khi tải trang.", true);
  });
  if (page !== "bookings") refreshBookingCount();
})();
