// Giao diện và xử lý từng trang. Trang hiện tại lấy từ <body data-page="...">.
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const page = document.body.dataset.page;

  // ---------- Tiện ích ----------
  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ic = (name) => `<svg class="i" aria-hidden="true"><use href="assets/img/icons.svg?v=20261128l#${name}"/></svg>`;
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
    const current = page === "service" ? "services" : page === "article" ? "news" : page;
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

    // Menu sổ xuống: rê chuột (CSS) hoặc bấm mũi tên; Esc, bấm ra ngoài hay chọn mục thì đóng.
    const items = [...nav.querySelectorAll(".has-menu")];
    const closeAll = (except) =>
      items.forEach((it) => {
        if (it === except) return;
        it.classList.remove("open");
        it.querySelector(".sub-toggle").setAttribute("aria-expanded", "false");
      });
    items.forEach((it) => {
      const btn = it.querySelector(".sub-toggle");
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        it.classList.remove("closed");
        const open = !it.classList.contains("open");
        closeAll(it);
        it.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", String(open));
      });
      it.addEventListener("mouseleave", () => it.classList.remove("closed"));
      it.addEventListener("focusout", (e) => {
        if (!it.contains(e.relatedTarget)) it.classList.remove("closed");
      });
      it.querySelectorAll(".mega a").forEach((a) =>
        a.addEventListener("click", () => {
          closeAll();
          it.classList.add("closed");
          a.blur();
          nav.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.textContent = "☰";
        })
      );
    });
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target)) closeAll();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const open = items.find((it) => it.classList.contains("open") || it.contains(document.activeElement));
      closeAll();
      if (open) {
        open.classList.add("closed");
        open.querySelector(".nav-link").focus();
      }
    });
  }


  // ---------- Cấu hình chung ----------
  const CFG = window.APP_CONFIG || {};
  const STORE = { lat: Number(CFG.STORE_LAT) || 10.7545, lon: Number(CFG.STORE_LON) || 106.7075 };
  const STORE_ADDR = "177 Tôn Thất Thuyết, Phường Khánh Hội, TP. Hồ Chí Minh";

  // ---------- Captcha chống spam (Cloudflare Turnstile) ----------
  let turnstileLoading = null;
  function loadTurnstile() {
    if (!turnstileLoading)
      turnstileLoading = new Promise((resolve, reject) => {
        const sc = document.createElement("script");
        sc.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        sc.async = true;
        sc.onload = () => resolve(window.turnstile);
        sc.onerror = () => reject(new Error("Không tải được captcha."));
        document.head.append(sc);
      });
    return turnstileLoading;
  }
  // Gắn captcha vào form (ô [data-captcha]). Không cấu hình khóa thì trả về token null, form chạy như cũ.
  function mountCaptcha(form) {
    const box = form && form.querySelector("[data-captcha]");
    if (!CFG.TURNSTILE_SITE_KEY || !box) return { token: () => null, reset() {} };
    box.hidden = false;
    let token = null;
    let id = null;
    loadTurnstile()
      .then((ts) => {
        id = ts.render(box, {
          sitekey: CFG.TURNSTILE_SITE_KEY,
          language: "vi",
          callback: (t) => (token = t),
          "expired-callback": () => (token = null),
        });
      })
      .catch(() => (box.textContent = "Không tải được captcha, vui lòng tải lại trang."));
    return {
      token() {
        if (!token) throw new Error('Vui lòng tích ô xác nhận "Tôi không phải robot".');
        return token;
      },
      reset() {
        token = null;
        if (id !== null && window.turnstile) window.turnstile.reset(id);
      },
    };
  }

  // ---------- Thêm vào lịch (Google Calendar, file .ics) ----------
  function calendarLinks(b, serviceName) {
    const [y, m, d] = String(b.booking_date).split("-").map(Number);
    const [hh, mm] = String(b.booking_time).split(":").map(Number);
    // Giờ Việt Nam (UTC+7) -> UTC
    const start = new Date(Date.UTC(y, m - 1, d, hh - 7, mm));
    const end = new Date(start.getTime() + 60 * 60000);
    const fmt = (dt) => dt.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const title = `Momo Pet: ${serviceName} cho bé ${b.pet_name}`;
    const details = `Lịch hẹn tại Momo Pet Hotel & Spa. Mang theo sổ tiêm phòng của bé. Hotline/Zalo 0968 198 406.`;
    const g = new URL("https://calendar.google.com/calendar/render");
    g.searchParams.set("action", "TEMPLATE");
    g.searchParams.set("text", title);
    g.searchParams.set("dates", `${fmt(start)}/${fmt(end)}`);
    g.searchParams.set("details", details);
    g.searchParams.set("location", STORE_ADDR);
    const icsText = (t) => String(t).replace(/([,;\\])/g, "\\$1");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Momo Pet Hotel & Spa//VI", "BEGIN:VEVENT",
      `UID:momo-${b.id || Date.now()}@momo-pet`, `DTSTAMP:${fmt(new Date())}`, `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
      `SUMMARY:${icsText(title)}`, `DESCRIPTION:${icsText(details)}`, `LOCATION:${icsText(STORE_ADDR)}`,
      "BEGIN:VALARM", "TRIGGER:-PT2H", "ACTION:DISPLAY", "DESCRIPTION:Sắp đến giờ hẹn ở Momo", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const icsHref = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
    return `<span class="cal-links">
      <a class="btn btn-small btn-outline" href="${esc(g.toString())}" target="_blank" rel="noopener">${ic("calendar")} Google Calendar</a>
      <a class="btn btn-small btn-outline" href="${icsHref}" download="momo-lich-hen.ics">${ic("calendar")} Tải file .ics</a>
    </span>`;
  }

  // ---------- Đưa đón: tính khoảng cách bằng OpenStreetMap (Nominatim + OSRM) ----------
  const pickupFee = (km) => (km <= 3 ? 0 : Math.ceil(km - 3) * 10000);
  async function geocodeAddress(addr) {
    // Thử lần lượt: đủ địa chỉ, bỏ số nhà, chỉ tên đường (tên phường mới có thể chưa có trên bản đồ)
    const noNumber = addr.replace(/^\s*[\d\/\-]+[a-zA-Z]?\s*/, "");
    const tries = [...new Set([addr, noNumber, noNumber.split(",")[0].trim()])].filter((q) => q.length >= 3);
    for (const q of tries) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=vn&accept-language=vi&viewbox=106.55,10.95,106.90,10.60&bounded=1&q=${encodeURIComponent(q + ", Thành phố Hồ Chí Minh")}`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const [hit] = await res.json();
      if (hit) return { lat: Number(hit.lat), lon: Number(hit.lon), label: hit.display_name };
    }
    throw new Error("Không tìm thấy địa chỉ. Hãy ghi rõ tên đường và phường.");
  }
  async function reverseGeocode(lat, lon) {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&accept-language=vi&lat=${lat}&lon=${lon}`);
    const j = res.ok ? await res.json() : null;
    return j && j.display_name ? j.display_name.split(",").slice(0, 3).join(",") : `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  }
  async function routeKm(lat, lon) {
    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${STORE.lon},${STORE.lat};${lon},${lat}?overview=false`);
    const j = res.ok ? await res.json() : null;
    if (!j || j.code !== "Ok" || !j.routes.length) throw new Error("Không tính được quãng đường, vui lòng thử lại.");
    return j.routes[0].distance / 1000;
  }
  function setupPickup(form) {
    const box = $("#pickup-box");
    const out = $("#pickup-result");
    if (!box) return () => null;
    let info = null;
    const show = (html, err = false) => {
      out.innerHTML = html;
      out.classList.toggle("error", err);
    };
    form.pickup.addEventListener("change", () => {
      box.hidden = !form.pickup.checked;
      if (form.pickup.checked) form.pickup_address.focus();
    });
    form.pickup_address.addEventListener("input", () => (info = null));
    async function calcFrom(lat, lon, address) {
      const km = await routeKm(lat, lon);
      if (km > 15) {
        info = null;
        show(`Địa chỉ cách tiệm khoảng <strong>${km.toFixed(1)} km</strong>, ngoài khu vực đưa đón. Vui lòng nhắn <a href="${ZALO_URL}" target="_blank" rel="noopener">Zalo</a> để lễ tân sắp xếp.`, true);
        return null;
      }
      const fee = pickupFee(km);
      info = { km, fee, address };
      show(`${ic("pin")} Cách tiệm khoảng <strong>${km.toFixed(1)} km</strong> · Phí đưa đón: <strong>${fee ? money(fee) : "Miễn phí"}</strong> (mỗi chiều)`);
      return info;
    }
    $("#pickup-calc").addEventListener("click", async (e) => {
      const addr = form.pickup_address.value.trim();
      if (addr.length < 5) return show("Nhập địa chỉ đón bé trước.", true);
      try {
        await withButton(e.currentTarget, "Đang tính…", async () => {
          const g = await geocodeAddress(addr);
          await calcFrom(g.lat, g.lon, addr);
        });
      } catch (err) {
        show(esc(err.message), true);
      }
    });
    $("#pickup-geo").addEventListener("click", (e) => {
      if (!navigator.geolocation) return show("Trình duyệt không hỗ trợ lấy vị trí.", true);
      const btn = e.currentTarget;
      btn.disabled = true;
      show("Đang lấy vị trí của bạn…");
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude: lat, longitude: lon } = pos.coords;
            const address = await reverseGeocode(lat, lon);
            form.pickup_address.value = address.slice(0, 120);
            await calcFrom(lat, lon, form.pickup_address.value);
          } catch (err) {
            show(esc(err.message), true);
          }
          btn.disabled = false;
        },
        () => {
          btn.disabled = false;
          show("Không lấy được vị trí. Bạn hãy cho phép truy cập vị trí hoặc nhập địa chỉ.", true);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
    // Trả về thông tin đưa đón khi gửi form (tự tính nếu khách chưa bấm "Tính phí").
    return async () => {
      if (!form.pickup.checked) return null;
      const addr = form.pickup_address.value.trim();
      if (addr.length < 5) throw new Error("Vui lòng nhập địa chỉ đón bé.");
      if (info && info.address === addr) return info;
      const g = await geocodeAddress(addr);
      const r = await calcFrom(g.lat, g.lon, addr);
      if (!r) throw new Error("Địa chỉ ngoài khu vực đưa đón, vui lòng nhắn Zalo.");
      return r;
    };
  }

  // ---------- Thời tiết TP.HCM (Open-Meteo, không cần khóa) ----------
  const WEATHER_TEXT = (c) =>
    c === 0 ? "Trời quang" : c <= 2 ? "Ít mây" : c === 3 ? "Nhiều mây" : c <= 48 ? "Sương mù" : c <= 57 ? "Mưa phùn" : c <= 67 ? "Có mưa" : c <= 82 ? "Mưa rào" : "Có dông";
  async function initWeather() {
    const box = $("#weather");
    if (!box) return;
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${STORE.lat}&longitude=${STORE.lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,precipitation&daily=uv_index_max,precipitation_probability_max&timezone=Asia%2FHo_Chi_Minh&forecast_days=1`;
      const res = await fetch(url);
      if (!res.ok) return;
      const w = await res.json();
      const c = w.current;
      const uv = w.daily.uv_index_max[0];
      const rain = w.daily.precipitation_probability_max[0];
      const code = Number(c.weather_code);
      let tip;
      if (c.precipitation > 0 || code >= 51) tip = "Trời mưa: lau khô lông và bàn chân bé sau khi ra ngoài. Xe đưa đón của Momo có áo mưa cho bé.";
      else if (c.apparent_temperature >= 35) tip = 'Nắng nóng: dắt bé đi dạo trước 9:00 hoặc sau 17:00, luôn mang theo nước. <a href="bai-viet.html?slug=giu-be-mat-me-mua-nang-nong">Xem mẹo giữ bé mát mẻ</a>';
      else if (uv >= 8) tip = "Chỉ số UV cao: tránh cho bé ra nắng gắt buổi trưa, nhất là bé lông trắng, lông ngắn.";
      else if (rain >= 60) tip = "Chiều nay dễ có mưa: nên đặt lịch spa buổi sáng hoặc chọn đưa đón tận nhà.";
      else tip = "Thời tiết dễ chịu, rất hợp để dắt bé đi dạo.";
      box.innerHTML = `
        <div class="weather-now"><span class="weather-temp">${Math.round(c.temperature_2m)}°C</span>
          <span><strong>Sài Gòn hôm nay · ${WEATHER_TEXT(code)}</strong><small>Cảm giác như ${Math.round(c.apparent_temperature)}°C · Độ ẩm ${c.relative_humidity_2m}% · UV ${Math.round(uv)} · Khả năng mưa ${rain}%</small></span></div>
        <p class="weather-tip">${ic("paw")} ${tip}</p>`;
      box.hidden = false;
    } catch {
      /* Không có thời tiết thì ẩn khung, không ảnh hưởng trang */
    }
  }

  // Âm báo ngắn cho trang Quản trị khi có lịch mới
  function ding() {
    try {
      const a = new (window.AudioContext || window.webkitAudioContext)();
      const o = a.createOscillator();
      const g = a.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.15, a.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.5);
      o.connect(g).connect(a.destination);
      o.start();
      o.stop(a.currentTime + 0.5);
    } catch {}
  }

  // ---------- Cẩm nang (data/articles.json) ----------
  let articlesCache = null;
  async function getArticles() {
    if (!articlesCache) {
      const res = await fetch("data/articles.json?v=20261128l");
      if (!res.ok) throw new Error("Không tải được bài viết.");
      articlesCache = (await res.json()).sort((a, b) => b.date.localeCompare(a.date));
    }
    return articlesCache;
  }
  const articleCard = (a) => `
    <a class="svc-card article-card" href="bai-viet.html?slug=${encodeURIComponent(a.slug)}">
      <div class="svc-media"><img src="${esc(a.image)}" alt="" loading="lazy"><span class="svc-tag">${esc(a.category)}</span></div>
      <div class="svc-body">
        <span class="muted" style="font-size:.85rem">${dateVN(a.date)}</span>
        <h3>${esc(a.title)}</h3>
        <p>${esc(a.excerpt)}</p>
        <div class="svc-foot"><span class="link-arrow">Đọc tiếp ${ic("arrow")}</span></div>
      </div>
    </a>`;

  async function initNews() {
    const list = await getArticles();
    const cats = ["Tất cả", ...new Set(list.map((a) => a.category))];
    const filters = $("#article-filters");
    const box = $("#article-list");
    const render = (cat) => {
      box.innerHTML = list.filter((a) => cat === "Tất cả" || a.category === cat).map(articleCard).join("");
      filters.innerHTML = cats
        .map((c) => `<button type="button" data-cat="${esc(c)}" aria-pressed="${c === cat}">${esc(c)}</button>`)
        .join("");
    };
    filters.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-cat]");
      if (b) render(b.dataset.cat);
    });
    const wanted = new URLSearchParams(location.search).get("chu-de");
    render(cats.includes(wanted) ? wanted : "Tất cả");
  }

  async function initArticle() {
    const slug = new URLSearchParams(location.search).get("slug");
    const list = await getArticles();
    const a = list.find((x) => x.slug === slug);
    const box = $("#article");
    if (!a) {
      $("#crumb").textContent = "Không tìm thấy";
      box.innerHTML = `<div class="panel empty"><img src="assets/img/logo-mark.svg" alt=""><h2>Không tìm thấy bài viết</h2><a class="btn" href="cam-nang.html">Xem cẩm nang</a></div>`;
      return;
    }
    document.title = `${a.title} | Momo Pet Hotel & Spa`;
    $("#crumb").textContent = a.title;
    // Nội dung bài viết do Momo soạn trong data/articles.json (không phải nội dung khách nhập)
    box.innerHTML = `
      <span class="chip">${esc(a.category)}</span>
      <h1>${esc(a.title)}</h1>
      <p class="muted">${dateVN(a.date)} · Momo Pet Hotel &amp; Spa</p>
      <img class="photo wide" src="${esc(a.image)}" alt="" style="margin:18px 0 26px">
      <div class="article-body">${a.content.map((c) => (c.startsWith("<") ? c : `<p>${c}</p>`)).join("")}</div>
      <p class="muted article-note">Bài viết mang tính tham khảo chung. Khi bé có dấu hiệu bất thường, hãy đưa bé đến bác sĩ thú y.</p>`;
    $("#related").innerHTML = list
      .filter((x) => x.slug !== a.slug)
      .slice(0, 3)
      .map((x) => `<a class="related-item" href="bai-viet.html?slug=${encodeURIComponent(x.slug)}"><img src="${esc(x.image)}" alt=""><span>${esc(x.title)}</span></a>`)
      .join("");
  }

  // ---------- Trang chủ ----------
  async function initHome() {
    initWeather();
    const services = await DB.getServices();
    $("#featured-services").innerHTML = services.filter((s) => s.is_featured).slice(0, 4).map(serviceCard).join("");
    const latest = $("#latest-articles");
    if (latest) getArticles().then((l) => (latest.innerHTML = l.slice(0, 3).map(articleCard).join(""))).catch(() => (latest.innerHTML = ""));
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
    const wanted = new URLSearchParams(location.search).get("nhom");
    render(categories.includes(wanted) ? wanted : "Tất cả");

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
    const cap = (await DB.hasSession()) ? { token: () => null, reset() {} } : mountCaptcha(form);
    const getPickup = setupPickup(form);
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
      let pickup = null;
      let captchaToken = null;
      try {
        pickup = await getPickup();
        captchaToken = (await DB.hasSession()) ? null : cap.token();
      } catch (err) {
        return toast(err.message, true);
      }
      const noteParts = [form.note.value.trim()];
      if (pickup) noteParts.push(`Đưa đón: ${pickup.address} (~${pickup.km.toFixed(1)} km, phí ${pickup.fee ? money(pickup.fee) : "miễn phí"}/chiều)`);
      const booking = {
        service_id: service.id,
        owner_name: form.owner_name.value.trim(),
        phone: form.phone.value.trim(),
        pet_name: form.pet_name.value.trim(),
        pet_type: form.pet_type.value,
        pet_weight: Number(form.pet_weight.value),
        booking_date: form.booking_date.value,
        booking_time: form.booking_time.value,
        note: noteParts.filter(Boolean).join(" | ").slice(0, 300) || null,
      };
      try {
        const saved = await withButton(form.querySelector("button[type=submit]"), "Đang đặt lịch…", () => DB.createBooking(booking, captchaToken));
        toast(`Đã đặt lịch cho bé ${booking.pet_name} lúc ${booking.booking_time} ngày ${dateVN(booking.booking_date)}.`);
        const auth = await DB.getAuth();
        const done = $("#booking-done");
        done.innerHTML = `
          <h3>${ic("check")} Đã nhận lịch hẹn của bé ${esc(booking.pet_name)}</h3>
          <p>${esc(service.name)} · ${booking.booking_time} ngày ${dateVN(booking.booking_date)}${pickup ? ` · Đưa đón ${pickup.fee ? money(pickup.fee) : "miễn phí"}/chiều` : ""}. Lễ tân sẽ xác nhận qua Zalo trong 30 phút.</p>
          <p class="muted">Thêm lịch hẹn vào điện thoại để không quên:</p>
          ${calendarLinks({ ...booking, id: saved && saved.id }, service.name)}
          ${auth.loggedIn ? "" : `<p class="muted" style="margin-top:14px"><a href="register.html">Tạo tài khoản</a> để xem lịch trên mọi thiết bị và viết đánh giá sau khi dùng dịch vụ.</p>`}`;
        done.hidden = false;
        done.scrollIntoView({ behavior: "smooth", block: "nearest" });
        form.pet_name.value = "";
        form.pet_weight.value = "";
        form.note.value = "";
        refreshBookingCount();
      } catch (err) {
        toast(err.message, true);
      }
      cap.reset();
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
                  <div class="review-head"><strong>${esc(r.author_name)}</strong>${r.booking_id ? `<span class="verified">${ic("check")} Đã sử dụng dịch vụ</span>` : ""}<span class="star-text" aria-label="${Number(r.rating)} trên 5 sao">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span></div>
                  <p>${esc(r.comment)}</p>
                  ${r.photo_url ? `<a href="${esc(r.photo_url)}" target="_blank" rel="noopener"><img class="review-photo" src="${esc(r.photo_url)}" alt="Ảnh bé của ${esc(r.author_name)}" loading="lazy"></a>` : ""}
                </div>`
              )
              .join("")
          : `<p class="muted">Chưa có đánh giá nào cho gói này.</p>`;
      } catch (err) {
        reviewList.innerHTML = `<p class="notice error">${esc(err.message)}</p>`;
      }
    }
    loadReviews();

    // Chỉ khách có lịch hẹn "Hoàn thành" của gói này mới thấy form (database cũng kiểm tra lại).
    const reviewForm = $("#review-form");
    const gate = $("#review-gate");
    async function setupReviewForm() {
      if (!reviewForm || !gate) return;
      reviewForm.hidden = true;
      const auth = await DB.getAuth();
      if (!auth.loggedIn) {
        gate.innerHTML = `<p class="notice" style="margin-top:20px">${ic("lock")} Đánh giá dành cho khách đã sử dụng dịch vụ. <a href="login.html">Đăng nhập</a> để đánh giá sau khi Momo hoàn thành dịch vụ cho bé.</p>`;
        return;
      }
      const list = await DB.getReviewableBookings(service.id);
      if (!list.length) {
        gate.innerHTML = `<p class="muted" style="margin-top:20px">${ic("star")} Bạn có thể đánh giá gói này sau khi Momo hoàn thành dịch vụ cho bé (lịch hẹn ở trạng thái "Hoàn thành").</p>`;
        return;
      }
      const want = Number(new URLSearchParams(location.search).get("review"));
      reviewForm.booking_id.innerHTML = list
        .map((b) => `<option value="${Number(b.id)}"${b.id === want ? " selected" : ""}>Bé ${esc(b.pet_name)} · ${dateVN(b.booking_date)}</option>`)
        .join("");
      if (!reviewForm.author_name.value) {
        const pr = await DB.getProfile().catch(() => null);
        if (pr && pr.full_name) reviewForm.author_name.value = pr.full_name;
      }
      gate.innerHTML = "";
      reviewForm.hidden = false;
      if (want && location.hash === "#danh-gia") reviewForm.scrollIntoView({ behavior: "smooth" });
    }
    setupReviewForm().catch(() => {});

    if (reviewForm) {
      const preview = $("#photo-preview");
      reviewForm.photo.addEventListener("change", () => {
        const f = reviewForm.photo.files[0];
        preview.hidden = !f;
        if (f) preview.src = URL.createObjectURL(f);
      });
      reviewForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!reviewForm.reportValidity()) return;
        try {
          await withButton(reviewForm.querySelector("button[type=submit]"), "Đang gửi…", async () => {
            const file = reviewForm.photo.files[0];
            const photo_url = file ? await DB.uploadReviewPhoto(file) : null;
            await DB.addReview({
              service_id: service.id,
              booking_id: Number(reviewForm.booking_id.value),
              author_name: reviewForm.author_name.value.trim(),
              rating: Number(reviewForm.rating.value),
              comment: reviewForm.comment.value.trim(),
              photo_url,
            });
          });
          toast("Cảm ơn bạn đã đánh giá.");
          reviewForm.reset();
          preview.hidden = true;
          loadReviews();
          setupReviewForm();
        } catch (err) {
          toast(err.message, true);
        }
      });
    }
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
    let canReview = new Set();

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
          ${
            b.status === "done"
              ? canReview.has(b.id)
                ? `<a class="btn btn-small btn-brand" href="service.html?id=${Number(s.id)}&review=${Number(b.id)}#danh-gia">${ic("star")} Đánh giá dịch vụ</a>`
                : `<span class="muted">${ic("check")} Đã hoàn thành, cảm ơn bạn</span>`
              : `<button type="button" class="btn btn-small btn-outline" data-action="edit">Sửa lịch</button>
          <button type="button" class="btn btn-small btn-danger" data-action="delete">Hủy lịch</button>
          ${b.status !== "cancelled" && !past ? calendarLinks(b, s.name || "Dịch vụ") : ""}`
          }
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
        const [bookings, reviewable] = await Promise.all([DB.getMyBookings(), DB.getReviewableBookings().catch(() => [])]);
        canReview = new Set(reviewable.map((b) => b.id));
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
    const cap = mountCaptcha(f);
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!f.reportValidity()) return;
      try {
        await withButton(f.querySelector('button[type="submit"]'), "Đang đăng nhập…", () =>
          DB.signIn(f.email.value.trim(), f.password.value, cap.token())
        );
        if (wantsAdmin() && !(await DB.isAdmin())) toast("Tài khoản này không có quyền quản trị.", true);
        await afterLogin();
      } catch (err) {
        authNotice(esc(err.message), true);
        cap.reset();
      }
    });
  }

  // ---------- Đăng ký ----------
  async function initRegister() {
    showDbNotice();
    if ((await DB.getAuth()).loggedIn) return afterLogin();
    const f = $("#register-form");
    const cap = mountCaptcha(f);
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
            captchaToken: cap.token(),
          })
        );
        toast("Tạo tài khoản thành công.");
        location.replace("account.html");
      } catch (err) {
        authNotice(esc(err.message), true);
        cap.reset();
      }
    });
  }

  // ---------- Quên mật khẩu: gửi email ----------
  async function initForgot() {
    showDbNotice();
    const f = $("#forgot-form");
    const cap = mountCaptcha(f);
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!f.reportValidity()) return;
      const email = f.email.value.trim();
      try {
        await withButton(f.querySelector('button[type="submit"]'), "Đang gửi…", () => DB.sendPasswordReset(email, cap.token()));
        authNotice("");
        f.hidden = true;
        $("#forgot-email").textContent = email;
        $("#forgot-done").hidden = false;
      } catch (err) {
        authNotice(esc(err.message), true);
        cap.reset();
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
        // Realtime: lịch mới / thay đổi hiện ngay, không cần tải lại trang
        const tabsEl = root.querySelector(".tabs");
        if (tabsEl && !root.querySelector(".live")) tabsEl.insertAdjacentHTML("beforebegin", `<p class="live"><span class="live-dot"></span> Đang cập nhật trực tiếp</p>`);
        DB.subscribeBookings(async (p) => {
          try {
            bookings = await DB.adminGetBookings();
            renderStats();
            if (tab === "bookings") views.bookings();
            if (p.eventType === "INSERT" && p.new) {
              toast(`Lịch hẹn mới: bé ${p.new.pet_name} lúc ${String(p.new.booking_time).slice(0, 5)} ngày ${dateVN(p.new.booking_date)}`);
              ding();
            }
          } catch {}
        });
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
    }, 3000);
  }

  // ---------- Khởi động ----------
  initHeader();
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
    news: initNews,
    article: initArticle,
    admin: initAdmin,
  };
  // Link có #mục (ví dụ services.html#uu-dai): nội dung tải từ database làm trang dài ra sau khi trình duyệt
  // đã cuộn, nên cuộn lại đúng mục sau khi trang tải xong dữ liệu.
  const scrollToHash = () => {
    if (!location.hash || location.hash.length < 2) return;
    let el = null;
    try {
      el = document.querySelector(decodeURIComponent(location.hash));
    } catch {}
    if (el) el.scrollIntoView({ block: "start", behavior: "instant" });
  };
  Promise.resolve(inits[page] ? inits[page]() : null)
    .catch((err) => {
      console.error(err);
      toast(err.message || "Có lỗi xảy ra khi tải trang.", true);
    })
    .finally(() => {
      scrollToHash();
      // Ảnh lazy-load có thể làm lệch thêm một chút: kiểm tra lại sau khi tải xong
      window.addEventListener("load", scrollToHash, { once: true });
    });
  if (page !== "bookings") refreshBookingCount();
})();
