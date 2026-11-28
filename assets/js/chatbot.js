// Chatbot tư vấn Momo: trả lời tự động theo từ khóa, giá lấy trực tiếp từ database (DB.getServices).
// Không cần máy chủ hay khóa API nên chạy được trên GitHub Pages. Câu hỏi ngoài phạm vi được chuyển sang Zalo.
(function () {
  if (document.body.dataset.page === "admin") return;

  const ZALO = "https://zalo.me/0968198406";
  const PHONE = "0968 198 406";
  const ADDR = "177 Tôn Thất Thuyết, Phường Khánh Hội, TP. Hồ Chí Minh";
  const STORE_KEY = "momo-chat-v1";

  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ic = (name) => `<svg class="i" aria-hidden="true"><use href="assets/img/icons.svg#${name}"/></svg>`;
  const money = (n) => Number(n).toLocaleString("vi-VN") + "đ";
  // Bỏ dấu tiếng Việt để so khớp từ khóa: "Cắt tỉa" -> "cat tia"
  const norm = (t) =>
    String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/\s+/g, " ").trim();
  const has = (text, words) => words.some((w) => text.includes(w));

  // Từ khóa nhận diện từng gói dịch vụ (theo id trong bảng services)
  const SERVICE_KEYS = [
    { id: 8, keys: ["combo"] },
    { id: 3, keys: ["massage", "thu gian", "u long", "spa toan than"] },
    { id: 4, keys: ["ve sinh", "tai", "mong", "tuyen hoi"] },
    { id: 2, keys: ["cat tia", "cat long", "tia long", "tao kieu", "grooming", "cat"] },
    { id: 1, keys: ["tam", "say", "goi"] },
    { id: 7, keys: ["vip", "camera"] },
    { id: 6, keys: ["deluxe"] },
    { id: 5, keys: ["tieu chuan", "phong thuong"] },
    { id: 9, keys: ["ban ngay", "trong giu", "daycare", "gui ban ngay"] },
  ];

  const CHIPS = ["Bảng giá", "Đặt lịch thế nào?", "Giờ mở cửa & địa chỉ", "Khách sạn cho bé", "Đưa đón tận nhà", "Gặp nhân viên"];

  let services = null;
  async function getServices() {
    if (!services) services = await window.DB.getServices();
    return services;
  }
  const serviceLine = (s) =>
    `<li><a href="service.html?id=${Number(s.id)}">${esc(s.name)}</a>: <strong>${money(s.price)}</strong> / ${esc(s.unit)}</li>`;
  const zaloBtn = (label = "Chat Zalo với nhân viên") =>
    `<a class="cb-action" href="${ZALO}" target="_blank" rel="noopener">${ic("zalo")} ${label}</a>`;

  async function answer(raw) {
    const t = norm(raw);
    if (!t) return null;

    if (has(t, ["cam on", "thank", "thanks", "tks"])) {
      return "Dạ không có gì ạ! Momo luôn sẵn sàng hỗ trợ. Chúc bé nhà mình luôn khỏe và thơm tho 🐾";
    }
    if (/^(xin chao|chao|hello|hi|alo|hey)\b/.test(t) && t.length < 25) {
      return "Chào bạn! Mình là trợ lý của Momo Pet Hotel &amp; Spa. Bạn muốn hỏi về <strong>bảng giá</strong>, <strong>đặt lịch</strong>, <strong>khách sạn</strong> hay <strong>địa chỉ</strong> của tiệm ạ?";
    }
    if (has(t, ["nhan vien", "tu van vien", "nguoi that", "zalo", "messenger", "hotline", "so dien thoai", "sdt", "goi dien", "lien he"])) {
      return `Bạn có thể nói chuyện trực tiếp với lễ tân Momo:<br>${zaloBtn()}<a class="cb-action" href="tel:${PHONE.replace(/\s/g, "")}">${ic("phone")} Gọi ${PHONE}</a><br>Lễ tân trực từ 8:00 đến 20:00 mỗi ngày.`;
    }
    if (has(t, ["huy lich", "doi lich", "sua lich", "doi gio", "doi ngay", "lich cua toi", "lich hen cua toi"])) {
      return `Bạn vào trang <a href="bookings.html">Lịch hẹn của tôi</a> để đổi ngày giờ, cập nhật cân nặng hoặc hủy lịch. Vui lòng thay đổi trước giờ hẹn ít nhất 2 tiếng nhé.`;
    }
    if (has(t, ["dat lich", "dat hen", "book", "hen lich", "dang ky dich vu", "lam sao de dat"])) {
      return `Đặt lịch rất nhanh ạ:<ol><li>Vào <a href="services.html">Dịch vụ &amp; Bảng giá</a>, chọn gói.</li><li>Điền tên, số điện thoại, thông tin bé, ngày giờ.</li><li>Lễ tân xác nhận qua Zalo trong 30 phút.</li></ol>Không cần tạo tài khoản. Nếu cần tư vấn chọn gói:<br>${zaloBtn("Hỏi lễ tân qua Zalo")}`;
    }
    if (has(t, ["gio mo", "mo cua", "dong cua", "may gio", "dia chi", "o dau", "duong nao", "ban do", "chi duong", "cho nao"])) {
      return `📍 ${ADDR}<br>⏰ 8:00 – 20:00 tất cả các ngày (khách sạn có người trực 24/7)<br><a href="contact.html">Xem bản đồ và chỉ đường</a>`;
    }
    if (has(t, ["dua don", "don tan nha", "ruoc", "tan nha", "ship"])) {
      return "Momo <strong>miễn phí đưa đón</strong> trong bán kính 3 km quanh tiệm, xa hơn tính 10.000đ/km. Bạn ghi địa chỉ vào ô ghi chú khi đặt lịch, hoặc nhắn Zalo để lễ tân sắp xếp.<br>" + zaloBtn();
    }
    if (has(t, ["tiem", "vaccine", "vac xin", "so tiem", "chuan bi", "mang theo", "can gi"])) {
      return "Khi đến Momo, bạn mang theo <strong>sổ tiêm phòng</strong> của bé (đã tiêm dại và vắc-xin cơ bản). Với gói lưu trú, nên mang thức ăn quen thuộc để bé không bị rối loạn tiêu hóa.";
    }
    if (has(t, ["can nang", "kg", "ky", "cho lon", "cho to", "phu thu", "beo"])) {
      return `Giá niêm yết áp dụng cho bé <strong>dưới 10 kg</strong>. Bé 10–20 kg phụ thu 30%, trên 20 kg phụ thu 60%. Xem <a href="services.html#bang-gia-can-nang">bảng giá theo cân nặng</a>.`;
    }
    if (has(t, ["thuc an", "do an", "hat", "pate", "phu kien", "do choi", "vong co", "ban do", "mua"])) {
      return "Momo tập trung vào <strong>spa và khách sạn</strong> nên hiện chưa bán thức ăn, phụ kiện. Khi gửi bé lưu trú, bạn mang theo thức ăn quen thuộc của bé; Momo chuẩn bị bữa theo đúng khẩu phần bạn dặn.";
    }
    if (has(t, ["meo"]) && !has(t, ["gia", "bao nhieu"])) {
      return "Momo có nhận chăm sóc <strong>mèo</strong> ạ. Khu mèo tách riêng với khu chó để các bé không căng thẳng. Bạn có thể đặt tắm, vệ sinh hoặc phòng lưu trú cho mèo như với chó.";
    }

    // Hỏi về một gói cụ thể
    const list = await getServices();
    const hit = SERVICE_KEYS.find((k) => has(t, k.keys));
    if (hit) {
      const s = list.find((x) => x.id === hit.id);
      if (s) {
        const inc = String(s.includes || "").split("|").filter(Boolean).slice(0, 3).map(esc).join(", ");
        return `<strong>${esc(s.name)}</strong>: ${money(s.price)} / ${esc(s.unit)} (${esc(s.duration)}).<br>${esc(s.description)}${inc ? `<br>Gói gồm: ${inc}.` : ""}<br><a class="cb-action" href="service.html?id=${Number(s.id)}#dat-lich">${ic("calendar")} Đặt lịch gói này</a>`;
      }
    }
    if (has(t, ["khach san", "luu tru", "gui cho", "gui meo", "gui be", "phong", "qua dem", "di cong tac", "di du lich"])) {
      const rooms = list.filter((x) => x.category === "Khách sạn");
      return `Momo có ${rooms.length} hạng phòng lưu trú, tất cả có máy lạnh và được dắt đi dạo 2 lần mỗi ngày:<ul>${rooms.map(serviceLine).join("")}</ul>Phòng VIP có camera để bạn xem bé 24/7 qua điện thoại.`;
    }
    if (has(t, ["gia", "bao nhieu", "bang gia", "chi phi", "phi", "tien", "dich vu"])) {
      return `Bảng giá dịch vụ (bé dưới 10 kg):<ul>${list.map(serviceLine).join("")}</ul><a href="services.html#bang-gia-can-nang">Xem giá theo cân nặng</a>`;
    }
    return null;
  }

  // ---------- Giao diện ----------
  const wrap = document.createElement("div");
  wrap.className = "chatbot";
  wrap.innerHTML = `
    <button type="button" class="cb-launcher" aria-expanded="false" aria-controls="cb-panel">
      ${ic("chat")}<span>Tư vấn</span>
    </button>
    <section class="cb-panel" id="cb-panel" role="dialog" aria-label="Trợ lý tư vấn Momo" hidden>
      <header class="cb-head">
        <img src="assets/img/logo-mark.svg" alt="" width="40" height="40">
        <div><strong>Trợ lý Momo</strong><span>Trả lời tự động · Lễ tân trực 8:00 – 20:00</span></div>
        <button type="button" class="cb-close" aria-label="Đóng khung chat">${ic("close")}</button>
      </header>
      <div class="cb-body" id="cb-body" aria-live="polite"></div>
      <div class="cb-chips" id="cb-chips"></div>
      <form class="cb-form" id="cb-form" autocomplete="off">
        <input id="cb-input" maxlength="200" placeholder="Nhập câu hỏi, ví dụ: giá cắt tỉa?" aria-label="Câu hỏi">
        <button type="submit" aria-label="Gửi">${ic("send")}</button>
      </form>
    </section>`;
  document.body.appendChild(wrap);

  const panel = wrap.querySelector(".cb-panel");
  const launcher = wrap.querySelector(".cb-launcher");
  const body = wrap.querySelector("#cb-body");
  const input = wrap.querySelector("#cb-input");
  wrap.querySelector("#cb-chips").innerHTML = CHIPS.map((c) => `<button type="button">${c}</button>`).join("");

  let history = [];
  try {
    history = JSON.parse(sessionStorage.getItem(STORE_KEY) || "[]");
  } catch {
    history = [];
  }
  const save = () => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(history.slice(-30)));
    } catch {}
  };

  function bubble(who, html) {
    const el = document.createElement("div");
    el.className = `cb-msg ${who}`;
    el.innerHTML = html;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }
  function addMsg(who, html) {
    history.push({ who, html });
    save();
    bubble(who, html);
  }

  const GREETING =
    "Chào bạn 👋 Mình là trợ lý tự động của <strong>Momo Pet Hotel &amp; Spa</strong>. Mình có thể báo giá, hướng dẫn đặt lịch, giờ mở cửa, khách sạn cho bé… Bạn chọn câu hỏi bên dưới hoặc gõ câu hỏi nhé!";

  function open() {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    wrap.classList.add("open");
    if (!body.childElementCount) {
      if (history.length) history.forEach((m) => bubble(m.who, m.html));
      else addMsg("bot", GREETING);
    }
    setTimeout(() => input.focus(), 50);
  }
  function close() {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    wrap.classList.remove("open");
  }

  async function ask(text) {
    const q = text.trim();
    if (!q) return;
    addMsg("user", esc(q));
    const typing = document.createElement("div");
    typing.className = "cb-msg bot typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;
    let reply;
    try {
      reply = await answer(q);
    } catch {
      reply = null;
    }
    await new Promise((r) => setTimeout(r, 450));
    typing.remove();
    addMsg(
      "bot",
      reply ||
        `Câu này mình chưa trả lời chính xác được 🙏 Bạn nhắn lễ tân để được tư vấn ngay nhé:<br>${zaloBtn()}<br>Hoặc thử hỏi: “giá tắm”, “phòng VIP”, “đặt lịch”, “giờ mở cửa”.`
    );
  }

  launcher.addEventListener("click", () => (panel.hidden ? open() : close()));
  wrap.querySelector(".cb-close").addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) close();
  });
  wrap.querySelector("#cb-chips").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) ask(b.textContent);
  });
  wrap.querySelector("#cb-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = "";
    ask(v);
  });

  // Cho phép kiểm thử: window.MomoBot.answer("giá cắt tỉa")
  window.MomoBot = { answer, open, close };
})();
