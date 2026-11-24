"""Sinh 8 trang HTML của Momo Pet Hotel & Spa với header/footer dùng chung.

Chạy từ thư mục gốc dự án:  python tools/gen_pages.py
Sửa header, footer, nội dung trang ở file này rồi chạy lại, không sửa tay từng file .html.
"""
import sys
from pathlib import Path

OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent
ADDR = "177 Tôn Thất Thuyết, Phường Khánh Hội, TP. Hồ Chí Minh"
PHONE, PHONE_TEL = "0968 198 406", "0968198406"
EMAIL = "xinchao@momopet.example"
FACEBOOK = "https://www.facebook.com/profile.php?id=61597136690392"  # Facebook Page của Momo
INSTAGRAM = "https://www.instagram.com/momo_suteki/"
YOUTUBE = "https://www.youtube.com/@MomoPetHotelSpa"
YOUTUBE_VIDEO = "BGgRwsH_8vE"  # video giới thiệu Momo trên kênh YouTube của shop
MAP_Q = "177+T%C3%B4n+Th%E1%BA%A5t+Thuy%E1%BA%BFt,+Kh%C3%A1nh+H%E1%BB%99i,+H%E1%BB%93+Ch%C3%AD+Minh"


def ic(name):
    return f'<svg class="i" aria-hidden="true"><use href="assets/img/icons.svg#{name}"/></svg>'


def head(title, desc):
    return f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} | Momo Pet Hotel &amp; Spa</title>
  <meta name="description" content="{desc}">
  <meta name="theme-color" content="#0E7C7B">
  <link rel="icon" type="image/svg+xml" href="assets/img/logo-mark.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css?v=20261125b">
</head>"""


HEADER = f"""
  <div class="topbar">
    <div class="container topbar-inner">
      <div class="topbar-info">
        <span>{ic('pin')} {ADDR}</span>
        <span>{ic('clock')} 8:00 – 20:00, tất cả các ngày</span>
        <a href="tel:{PHONE_TEL}">{ic('phone')} {PHONE}</a>
      </div>
      <div class="topbar-social">
        <a href="{FACEBOOK}" target="_blank" rel="noopener" aria-label="Facebook">{ic('facebook')}</a>
        <a href="{INSTAGRAM}" target="_blank" rel="noopener" aria-label="Instagram">{ic('instagram')}</a>
        <a href="{YOUTUBE}" target="_blank" rel="noopener" aria-label="YouTube">{ic('youtube')}</a>
      </div>
    </div>
  </div>

  <header class="site-header">
    <div class="container nav-wrap">
      <a href="index.html" class="brand"><img src="assets/img/logo.svg" alt="Momo Pet Hotel &amp; Spa - Trang chủ" width="174" height="48"></a>
      <nav class="nav" id="nav" aria-label="Menu chính">
        <a href="index.html" data-nav="home">Trang chủ</a>
        <a href="about.html" data-nav="about">Về chúng tôi</a>
        <a href="services.html" data-nav="services">Dịch vụ &amp; Bảng giá</a>
        <a href="bookings.html" data-nav="bookings">Lịch hẹn của tôi<span class="badge" id="booking-count" hidden>0</span></a>
        <a href="contact.html" data-nav="contact">Liên hệ</a>
      </nav>
      <div class="header-actions">
        <a class="account-link" href="login.html" data-nav="account" id="account-link">{ic('user')}<span id="account-label">Đăng nhập</span></a>
        <a href="services.html" class="btn">{ic('calendar')} Đặt lịch</a>
        <button class="nav-toggle" type="button" aria-label="Mở menu" aria-expanded="false" aria-controls="nav">☰</button>
      </div>
    </div>
  </header>
"""

FOOTER = f"""
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a href="index.html" class="brand"><img src="assets/img/logo-light.svg" alt="Momo Pet Hotel &amp; Spa" width="188" height="52"></a>
          <p>Khách sạn và spa chăm sóc chó mèo tại Phường Khánh Hội, TP. Hồ Chí Minh. Chăm sóc chuẩn spa, yêu thương như ở nhà.</p>
          <div class="socials">
            <a href="{FACEBOOK}" target="_blank" rel="noopener" aria-label="Facebook">{ic('facebook')}</a>
            <a href="{INSTAGRAM}" target="_blank" rel="noopener" aria-label="Instagram">{ic('instagram')}</a>
            <a href="{YOUTUBE}" target="_blank" rel="noopener" aria-label="YouTube">{ic('youtube')}</a>
          </div>
        </div>
        <div>
          <h4>Dịch vụ</h4>
          <ul>
            <li><a href="service.html?id=1">Tắm gội &amp; sấy thơm</a></li>
            <li><a href="service.html?id=2">Cắt tỉa tạo kiểu</a></li>
            <li><a href="service.html?id=7">Phòng VIP có camera</a></li>
            <li><a href="service.html?id=9">Trông giữ ban ngày</a></li>
            <li><a href="services.html">Tất cả dịch vụ</a></li>
          </ul>
        </div>
        <div>
          <h4>Khám phá</h4>
          <ul>
            <li><a href="index.html">Trang chủ</a></li>
            <li><a href="about.html">Về chúng tôi</a></li>
            <li><a href="services.html">Dịch vụ &amp; Bảng giá</a></li>
            <li><a href="bookings.html">Lịch hẹn của tôi</a></li>
            <li><a href="contact.html">Liên hệ</a></li>
            <li><a href="login.html">Đăng nhập</a> · <a href="register.html">Đăng ký</a></li>
            <li><a href="admin.html">Quản trị</a></li>
          </ul>
        </div>
        <div>
          <h4>Liên hệ</h4>
          <ul class="contact-list">
            <li>{ic('pin')}<span>{ADDR}</span></li>
            <li>{ic('phone')}<a href="tel:{PHONE_TEL}">{PHONE}</a></li>
            <li>{ic('mail')}<a href="mailto:{EMAIL}">{EMAIL}</a></li>
            <li>{ic('clock')}<span>8:00 – 20:00 mỗi ngày<br>Khách sạn trực 24/7</span></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Momo Pet Hotel &amp; Spa. Thương hiệu hư cấu cho bài thi cuối khóa AI Vibe Coding.</span>
        <span>Ảnh: Unsplash, Pexels</span>
      </div>
    </div>
  </footer>

  <a class="fab" href="tel:{PHONE_TEL}" aria-label="Gọi hotline {PHONE}">{ic('phone')}</a>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js"></script>
  <script src="assets/js/config.js?v=20261125b"></script>
  <script src="assets/js/db.js?v=20261125b"></script>
  <script src="assets/js/app.js?v=20261125b"></script>
</body>
</html>
"""


def page_hero(img, crumb, eyebrow_title, text):
    return f"""
    <section class="page-hero" style="background-image:url(assets/img/photos/{img})">
      <div class="container">
        <nav class="crumbs" aria-label="Đường dẫn"><a href="index.html">Trang chủ</a><span>/</span><span>{crumb}</span></nav>
        <h1>{eyebrow_title}</h1>
        <p>{text}</p>
      </div>
    </section>
"""


CTA = f"""
    <section class="section tight">
      <div class="container">
        <div class="cta-band">
          <div>
            <h2>Đặt lịch cho bé ngay hôm nay</h2>
            <p>Đặt trực tuyến trong 1 phút, hoặc gọi hotline để được tư vấn gói phù hợp.</p>
          </div>
          <div class="cta-actions">
            <a href="services.html" class="btn btn-light">{ic('calendar')} Đặt lịch trực tuyến</a>
            <a href="tel:{PHONE_TEL}" class="btn btn-ghost-light">{ic('phone')} {PHONE}</a>
          </div>
        </div>
      </div>
    </section>
"""


# Trang Quản trị dùng header/footer riêng: không có menu khách, nút đặt lịch hay nút gọi.
ADMIN_HEADER = f"""
  <header class="site-header admin-header">
    <div class="container nav-wrap">
      <a href="admin.html" class="brand"><img src="assets/img/logo.svg" alt="Momo Pet Hotel &amp; Spa - Trang quản trị" width="174" height="48"></a>
      <span class="admin-badge">{ic('shield')} Trang quản trị</span>
      <div class="header-actions">
        <a href="index.html" class="btn btn-small btn-outline">{ic('home')} Xem website</a>
      </div>
    </div>
  </header>
"""

SCRIPTS = FOOTER[FOOTER.index('  <div class="toast"'):]
ADMIN_FOOTER = """
  <footer class="admin-footer">
    <div class="container">© 2026 Momo Pet Hotel &amp; Spa · Trang quản trị nội bộ · <a href="index.html">Về website</a></div>
  </footer>

""" + SCRIPTS


def page(name, key, title, desc, main):
    header, footer = (ADMIN_HEADER, ADMIN_FOOTER) if key == "admin" else (HEADER, FOOTER)
    html = head(title, desc) + f'\n<body data-page="{key}">' + header + "\n  <main>" + main + "  </main>\n" + footer
    if key == "admin":
        html = html.replace('<meta name="theme-color" content="#0E7C7B">',
                            '<meta name="theme-color" content="#0E7C7B">\n  <meta name="robots" content="noindex">')
    (OUT / name).write_text(html, encoding="utf-8", newline="\n")
    print("wrote", name)


# ======================================================== Trang chủ
page("index.html", "home", "Khách sạn & Spa thú cưng tại Khánh Hội, TP.HCM",
     "Momo Pet Hotel & Spa: tắm gội, cắt tỉa, khách sạn có camera cho chó mèo tại 177 Tôn Thất Thuyết, Phường Khánh Hội, TP.HCM.", f"""
    <section class="hero">
      <div class="hero-media"><img src="assets/img/photos/hero-spa.jpg" alt="Chú chó Phốc sóc quấn khăn hồng sau buổi tắm tại spa" width="1400" height="933"></div>
      <div class="container">
        <div class="hero-content">
          <span class="pill">{ic('paw')} Khách sạn &amp; Spa thú cưng tại Khánh Hội, TP.HCM</span>
          <h1>Chăm sóc chuẩn spa,<br><em>yêu thương như ở nhà</em></h1>
          <p class="lead">Tắm gội, cắt tỉa tạo kiểu và phòng lưu trú có camera 24/7 cho chó mèo. Bạn yên tâm đi làm, đi xa; Momo lo cho bé từ bữa ăn đến giấc ngủ.</p>
          <div class="hero-actions">
            <a href="services.html" class="btn">{ic('calendar')} Đặt lịch ngay</a>
            <a href="about.html#bang-gia" class="btn btn-ghost-light">Xem bảng giá</a>
          </div>
          <div class="hero-trust">
            <span><span class="stars">{ic('star')*5}</span> 4,9/5 từ 1.200+ đánh giá</span>
            <span>{ic('camera')} Camera xem bé 24/7</span>
            <span>{ic('shield')} Nhân viên được đào tạo sơ cứu</span>
          </div>
        </div>
      </div>
    </section>

    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat"><span class="ico">{ic('paw')}</span><div><strong>8.500+</strong><span>lượt chăm sóc mỗi năm</span></div></div>
          <div class="stat"><span class="ico">{ic('home')}</span><div><strong>24</strong><span>phòng lưu trú riêng</span></div></div>
          <div class="stat"><span class="ico">{ic('users')}</span><div><strong>12</strong><span>chuyên viên chăm sóc</span></div></div>
          <div class="stat"><span class="ico">{ic('heart')}</span><div><strong>6 năm</strong><span>đồng hành cùng các bé</span></div></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="head-row">
          <div class="section-head left">
            <span class="eyebrow">Dịch vụ nổi bật</span>
            <h2>Các gói được đặt nhiều nhất</h2>
            <p>Giá niêm yết rõ ràng, không phụ thu bất ngờ. Chọn một gói để xem chi tiết và đặt lịch.</p>
          </div>
          <a href="services.html" class="link-arrow">Xem tất cả dịch vụ {ic('arrow')}</a>
        </div>
        <div class="grid grid-4" id="featured-services"><p class="loading">Đang tải dịch vụ…</p></div>
      </div>
    </section>

    <section class="section bg-soft">
      <div class="container split">
        <div class="collage">
          <img class="photo tall" src="assets/img/photos/staff-care.jpg" alt="Chuyên viên Momo kiểm tra sức khỏe cho một chú chó" loading="lazy">
          <img class="small" src="assets/img/photos/svc-bath.jpg" alt="Chú chó ngồi trong bồn tắm tại spa" loading="lazy">
          <div class="badge-card"><span class="ico">{ic('star')}</span><div><strong>4,9/5</strong><span>Đánh giá trên Google</span></div></div>
        </div>
        <div>
          <span class="eyebrow">Vì sao chọn Momo</span>
          <h2>Chăm bé bằng quy trình, giữ bé bằng sự yêu thương</h2>
          <p class="muted">Mỗi bé được một chuyên viên theo suốt buổi, có phiếu theo dõi riêng và ảnh cập nhật gửi về cho bạn.</p>
          <div class="features">
            <div class="feature-row"><span class="ico">{ic('shield')}</span><div><h3>An toàn là ưu tiên số một</h3><p>Kiểm tra sổ tiêm phòng khi nhận bé, khử khuẩn phòng và dụng cụ sau mỗi lượt.</p></div></div>
            <div class="feature-row"><span class="ico">{ic('camera')}</span><div><h3>Luôn nhìn thấy bé</h3><p>Phòng VIP có camera riêng, các phòng khác gửi ảnh và video mỗi ngày qua Zalo.</p></div></div>
            <div class="feature-row"><span class="ico">{ic('leaf')}</span><div><h3>Sản phẩm dịu nhẹ</h3><p>Sữa tắm thảo dược, dầu dưỡng hữu cơ, phù hợp cả với da nhạy cảm.</p></div></div>
          </div>
          <a href="about.html" class="btn btn-brand">Tìm hiểu về Momo</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Quy trình đặt lịch</span>
          <h2>4 bước đơn giản</h2>
          <p>Từ lúc đặt lịch đến khi đón bé về, bạn luôn biết bé đang được chăm sóc thế nào.</p>
        </div>
        <div class="steps">
          <div class="step"><span class="ico">{ic('calendar')}</span><h3>Đặt lịch trực tuyến</h3><p>Chọn gói, ngày giờ và điền thông tin của bé trên website.</p></div>
          <div class="step"><span class="ico">{ic('chat')}</span><h3>Xác nhận qua Zalo</h3><p>Lễ tân gọi hoặc nhắn Zalo xác nhận trong vòng 30 phút.</p></div>
          <div class="step"><span class="ico">{ic('paw')}</span><h3>Đưa bé đến tiệm</h3><p>Chuyên viên kiểm tra sức khỏe và ghi phiếu theo dõi cho bé.</p></div>
          <div class="step"><span class="ico">{ic('heart')}</span><h3>Nhận ảnh và đón bé</h3><p>Bạn nhận ảnh trước và sau, rồi đón bé về thơm tho, khỏe mạnh.</p></div>
        </div>
      </div>
    </section>

    <section class="section bg-ink">
      <div class="container split">
        <div class="embed">
          <iframe src="https://www.youtube-nocookie.com/embed/J9BG0Ea3ccY" title="Video YouTube: quy trình grooming cho chó tại salon" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
        <div>
          <span class="eyebrow">Quy trình chăm sóc</span>
          <h2>Một buổi spa của bé diễn ra thế nào?</h2>
          <p class="muted">Video minh họa các bước của một buổi grooming chuyên nghiệp. Tại Momo, mỗi bước đều có chuyên viên theo sát.</p>
          <ul class="checklist">
            <li>{ic('check')} Kiểm tra da, lông, tai và móng trước khi tắm</li>
            <li>{ic('check')} Tắm sữa tắm thảo dược, nước ấm vừa phải</li>
            <li>{ic('check')} Sấy bằng máy êm tiếng, không nhốt lồng sấy</li>
            <li>{ic('check')} Chải, cắt tỉa và gửi ảnh trước và sau cho bạn</li>
          </ul>
          <a href="service.html?id=1" class="btn">Đặt gói Tắm gội</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Khách hàng nói gì</span>
          <h2>Được tin tưởng bởi hàng nghìn sen</h2>
        </div>
        <div class="grid grid-3">
          <figure class="quote" style="margin:0">
            <span class="stars">{ic('star')*5}</span>
            <p>“Gửi bé Gạo 5 ngày đi công tác, tối nào cũng được xem camera. Về nhà bé vẫn mập mạp, vui vẻ.”</p>
            <figcaption class="quote-by"><img src="assets/img/photos/pet-corgi.jpg" alt="" loading="lazy"><div><strong>Chị Thảo Vy</strong><span>Sen của Gạo, P. Tân Mỹ</span></div></figcaption>
          </figure>
          <figure class="quote" style="margin:0">
            <span class="stars">{ic('star')*5}</span>
            <p>“Mun nhà mình rất sợ máy sấy nhưng ở Momo bé hợp tác lắm. Các bạn nhân viên kiên nhẫn và nhẹ nhàng.”</p>
            <figcaption class="quote-by"><img src="assets/img/photos/pet-cat.jpg" alt="" loading="lazy"><div><strong>Anh Minh Khoa</strong><span>Sen của Mun, P. Sài Gòn</span></div></figcaption>
          </figure>
          <figure class="quote" style="margin:0">
            <span class="stars">{ic('star')*5}</span>
            <p>“Cắt tỉa đẹp, đúng kiểu mình gửi ảnh mẫu. Giá niêm yết rõ ràng, đặt lịch trên web rất nhanh.”</p>
            <figcaption class="quote-by"><img src="assets/img/photos/pet-shihtzu.jpg" alt="" loading="lazy"><div><strong>Chị Ngọc Hân</strong><span>Sen của Bông, P. Vĩnh Hội</span></div></figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="section bg-sand">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Khách quen của Momo</span>
          <h2>Những vị khách bốn chân</h2>
          <p>Vài gương mặt thân quen ở sân chơi, phòng nghỉ và bàn spa.</p>
        </div>
        <div class="gallery">
          <figure class="wide"><img src="assets/img/photos/pet-friends.jpg" alt="Hai chú chó chạy cạnh nhau" loading="lazy"><figcaption>Bơ và Mít<small>Đôi bạn thân lớp trông giữ ban ngày</small></figcaption></figure>
          <figure><img src="assets/img/photos/pet-corgi.jpg" alt="Chú chó Corgi đang cười" loading="lazy"><figcaption>Gạo<small>Corgi, 2 tuổi</small></figcaption></figure>
          <figure><img src="assets/img/photos/pet-cat.jpg" alt="Mèo mướp ngồi trên sàn gỗ" loading="lazy"><figcaption>Mun<small>Mèo mướp, 4 tuổi</small></figcaption></figure>
          <figure><img src="assets/img/photos/pet-shihtzu.jpg" alt="Chú chó nhỏ đeo khăn cổ xanh" loading="lazy"><figcaption>Bông<small>Vừa cắt tỉa xong</small></figcaption></figure>
          <figure><img src="assets/img/photos/pet-ribbon.jpg" alt="Mèo mướp thắt nơ hồng" loading="lazy"><figcaption>Na<small>Khách quen phòng Deluxe</small></figcaption></figure>
          <figure class="wide"><img src="assets/img/photos/momo-beach.jpg" alt="Momo nằm trên bãi biển" loading="lazy" style="object-position:50% 72%"><figcaption>Momo<small>Linh vật và “quản lý” của tiệm</small></figcaption></figure>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Câu hỏi thường gặp</span>
          <h2>Bạn cần biết trước khi gửi bé</h2>
        </div>
        <div class="faq">
          <details open><summary>Bé cần chuẩn bị gì khi đến Momo?</summary><p>Mang theo sổ tiêm phòng (đã tiêm phòng dại và vắc-xin 5 bệnh hoặc 4 bệnh với mèo). Với gói lưu trú, bạn nên mang thức ăn quen thuộc của bé để tránh rối loạn tiêu hóa.</p></details>
          <details><summary>Tôi có thể đổi hoặc hủy lịch không?</summary><p>Có. Vào trang <a href="bookings.html">Lịch hẹn của tôi</a> để đổi ngày giờ, cập nhật cân nặng hoặc hủy lịch. Vui lòng thay đổi trước giờ hẹn ít nhất 2 tiếng.</p></details>
          <details><summary>Giá có thay đổi theo cân nặng không?</summary><p>Giá niêm yết áp dụng cho bé dưới 10 kg. Bé từ 10 kg trở lên phụ thu 30%, lễ tân sẽ báo trước khi xác nhận lịch.</p></details>
          <details><summary>Bé ở khách sạn có được dắt đi dạo không?</summary><p>Có. Tất cả hạng phòng đều được dắt đi dạo hoặc chơi ở sân ít nhất 2 lần mỗi ngày, có nhân viên giám sát.</p></details>
          <details><summary>Momo có nhận chăm sóc mèo không?</summary><p>Có. Momo có khu riêng cho mèo, tách biệt với khu chó để các bé không bị căng thẳng.</p></details>
        </div>
      </div>
    </section>
""" + CTA)

# ======================================================== Về chúng tôi
page("about.html", "about", "Về chúng tôi",
     "Câu chuyện, cơ sở vật chất, đội ngũ và bảng giá của Momo Pet Hotel & Spa tại Phường Khánh Hội, TP.HCM.",
     page_hero("momo-sea.jpg", "Về chúng tôi", "Về Momo Pet Hotel &amp; Spa",
               "Bắt đầu từ một chú chó tên Momo, chúng tôi xây dựng nơi mà chính mình cũng yên tâm gửi gắm thú cưng.") + f"""
    <section class="section">
      <div class="container split wide-left">
        <div>
          <span class="eyebrow">Câu chuyện thương hiệu</span>
          <h2>Bắt đầu từ chú chó tên Momo</h2>
          <p>Năm 2019, nhà sáng lập phải đi công tác hai tuần và không tìm được nơi gửi Momo, chú chó nhỏ của gia đình, mà mình thật sự tin tưởng. Momo về nhà gầy đi và sợ người lạ suốt nhiều ngày.</p>
          <p>Năm 2020, Momo Pet Hotel &amp; Spa ra đời tại Phường Khánh Hội với 6 phòng nghỉ và một bàn tắm. Quy tắc đầu tiên vẫn giữ đến hôm nay: mỗi bé được chăm như thú cưng của chính nhân viên.</p>
          <p>Gương mặt trên logo của chúng tôi chính là Momo: lông đen vện vàng, một tai dựng một tai cụp, mõm đã bạc nhưng lúc nào cũng lè lưỡi cười. Momo là linh vật và cũng là “quản lý” đầu tiên của tiệm.</p>
          <ul class="checklist">
            <li>{ic('check')} Mỗi bé có phiếu theo dõi ăn uống, vệ sinh, sức khỏe riêng</li>
            <li>{ic('check')} Cập nhật ảnh và video cho chủ nuôi mỗi ngày</li>
            <li>{ic('check')} Giá niêm yết công khai, không phụ thu bất ngờ</li>
          </ul>
        </div>
        <figure style="margin:0">
          <img class="photo tall" src="assets/img/photos/momo-portrait.jpg" alt="Momo, chú chó đen vện vàng lè lưỡi bên bờ biển" loading="lazy">
          <figcaption class="muted center" style="margin-top:10px">Momo ngoài đời: gương mặt trên logo của tiệm.</figcaption>
        </figure>
      </div>
    </section>

    <section class="section tight bg-soft">
      <div class="container">
        <ol class="timeline">
          <li><strong>2020</strong><span>Mở cửa với 6 phòng nghỉ và 1 bàn tắm tại Phường Khánh Hội.</span></li>
          <li><strong>2022</strong><span>Mở rộng khu spa 3 bàn và dịch vụ cắt tỉa tạo kiểu.</span></li>
          <li><strong>2024</strong><span>Ra mắt phòng VIP có camera xem trực tiếp 24/7.</span></li>
          <li><strong>2026</strong><span>Đặt lịch trực tuyến, quản lý lịch hẹn ngay trên website.</span></li>
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Cơ sở vật chất</span>
          <h2>Không gian dành riêng cho các bé</h2>
          <p>Khu chó và khu mèo tách biệt, máy lạnh trung tâm, khử khuẩn sau mỗi lượt khách.</p>
        </div>
        <div class="grid grid-3">
          <a class="svc-card" href="service.html?id=6"><div class="svc-media"><img src="assets/img/photos/room-deluxe.jpg" alt="Chú chó nằm trên giường nệm trong phòng nghỉ" loading="lazy"><span class="svc-tag">Khách sạn</span></div><div class="svc-body"><h3>24 phòng lưu trú riêng</h3><p>Ba hạng phòng từ 1 đến 4 m², nệm êm, máy lạnh 24/7.</p></div></a>
          <a class="svc-card" href="service.html?id=3"><div class="svc-media"><img src="assets/img/photos/svc-relax.jpg" alt="Chuyên viên sấy và chải lông cho chó tại bàn spa" loading="lazy"><span class="svc-tag">Spa</span></div><div class="svc-body"><h3>Khu spa 3 bàn</h3><p>Bồn tắm nước ấm, máy sấy êm tiếng, dụng cụ tiệt trùng.</p></div></a>
          <a class="svc-card" href="service.html?id=9"><div class="svc-media"><img src="assets/img/photos/svc-daycare.jpg" alt="Nhóm chó vui chơi trong sân có rào" loading="lazy"><span class="svc-tag">Vui chơi</span></div><div class="svc-body"><h3>Sân chơi 60 m²</h3><p>Chia khu cho chó nhỏ, chó lớn và mèo, luôn có người giám sát.</p></div></a>
        </div>
        <div class="grid grid-3" style="margin-top:24px">
          <div class="info-card"><span class="ico">{ic('camera')}</span><h3>Camera 24/7</h3><p>Camera ở khu chung và từng phòng VIP, xem trực tiếp qua điện thoại.</p></div>
          <div class="info-card"><span class="ico">{ic('leaf')}</span><h3>Bếp riêng</h3><p>Chuẩn bị bữa ăn theo khẩu phần chủ nuôi gửi, có tủ lạnh cho đồ tươi.</p></div>
          <div class="info-card"><span class="ico">{ic('shield')}</span><h3>Góc y tế</h3><p>Tủ sơ cứu và liên kết với phòng khám thú y gần tiệm.</p></div>
        </div>
      </div>
    </section>

    <section class="section bg-soft">
      <div class="container split">
        <img class="photo wide" src="assets/img/photos/team.jpg" alt="Hai chuyên viên mặc đồng phục xanh đang bế và chăm sóc một chú chó" loading="lazy">
        <div>
          <span class="eyebrow">Đội ngũ</span>
          <h2>12 chuyên viên, một quy tắc chung</h2>
          <p class="muted">Mọi thành viên đều qua khóa sơ cứu thú cưng và ít nhất 3 tháng kèm cặp trước khi nhận ca một mình.</p>
          <ul class="checklist">
            <li>{ic('check')} 4 thợ grooming có chứng chỉ</li>
            <li>{ic('check')} 6 nhân viên chăm sóc, luôn có người trực đêm</li>
            <li>{ic('check')} 2 lễ tân tư vấn và xác nhận lịch qua Zalo</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section" id="bang-gia">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Bảng giá</span>
          <h2>Giá dịch vụ niêm yết</h2>
          <p>Áp dụng cho bé dưới 10 kg. Bảng giá được lấy trực tiếp từ cơ sở dữ liệu; bấm tên gói để xem chi tiết và đặt lịch.</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Gói dịch vụ</th><th>Nhóm</th><th>Thời lượng</th><th class="num">Giá</th></tr></thead>
            <tbody id="price-table"><tr><td colspan="4" class="loading">Đang tải bảng giá…</td></tr></tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section bg-ink">
      <div class="container split">
        <div>
          <span class="eyebrow">Video giới thiệu</span>
          <h2>Một vòng quanh Momo trong 30 giây</h2>
          <p class="muted">Dịch vụ, bảng giá và gương mặt quen thuộc nhất tiệm. Theo dõi kênh YouTube của Momo để xem thêm video chăm sóc các bé.</p>
          <a href="{YOUTUBE}" class="btn" target="_blank" rel="noopener">{ic('youtube')} Kênh YouTube của Momo</a>
        </div>
        <div class="embed">
          <iframe src="https://www.youtube-nocookie.com/embed/{YOUTUBE_VIDEO}" title="Video YouTube: giới thiệu Momo Pet Hotel &amp; Spa" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
      </div>
    </section>

    <section class="section bg-sand">
      <div class="container split">
        <div>
          <span class="eyebrow">Ghé thăm cửa hàng</span>
          <h2>Momo ở ngay Khánh Hội</h2>
          <p class="muted">Cách chợ Bến Thành khoảng 10 phút. Có chỗ để xe máy trước cửa, mở cửa đón khách tham quan mỗi ngày.</p>
          <ul class="checklist">
            <li>{ic('check')} {ADDR}</li>
            <li>{ic('check')} 8:00 – 20:00, tất cả các ngày trong tuần</li>
          </ul>
          <a href="contact.html" class="btn btn-brand">{ic('pin')} Xem bản đồ</a>
        </div>
        <img class="photo wide" src="assets/img/photos/saigon-scooter.jpg" alt="Chú chó trắng ngồi trên xe máy giữa phố Sài Gòn" loading="lazy">
      </div>
    </section>
""" + CTA)

# ======================================================== Dịch vụ
page("services.html", "services", "Dịch vụ & Bảng giá",
     "Các gói spa, khách sạn và combo chăm sóc chó mèo tại Momo Pet Hotel & Spa, Khánh Hội.",
     page_hero("room-deluxe.jpg", "Dịch vụ &amp; Bảng giá", "Dịch vụ &amp; Bảng giá",
               "Spa, khách sạn và combo cho chó mèo. Chọn một gói để xem chi tiết và đặt lịch trực tuyến.") + f"""
    <section class="section">
      <div class="container">
        <div class="filters" id="filters" role="group" aria-label="Lọc theo nhóm dịch vụ"></div>
        <div class="grid grid-3" id="service-list"><p class="loading">Đang tải dịch vụ…</p></div>
      </div>
    </section>

    <section class="section bg-soft">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Chính sách</span>
          <h2>Lưu ý trước khi đặt lịch</h2>
        </div>
        <div class="grid grid-3">
          <div class="info-card"><span class="ico">{ic('shield')}</span><h3>Sổ tiêm phòng</h3><p>Bé cần tiêm phòng dại và vắc-xin cơ bản. Mang theo sổ khi đến tiệm.</p></div>
          <div class="info-card"><span class="ico">{ic('paw')}</span><h3>Phụ thu theo cân nặng</h3><p>Giá niêm yết cho bé dưới 10 kg. Bé từ 10 kg trở lên phụ thu 30%.</p></div>
          <div class="info-card"><span class="ico">{ic('calendar')}</span><h3>Đổi và hủy lịch</h3><p>Miễn phí khi thay đổi trước giờ hẹn 2 tiếng, ngay trên trang <a href="bookings.html">Lịch hẹn của tôi</a>.</p></div>
        </div>
      </div>
    </section>
""" + CTA)

# ======================================================== Chi tiết dịch vụ
page("service.html", "service", "Chi tiết dịch vụ",
     "Chi tiết gói dịch vụ, đặt lịch và đánh giá tại Momo Pet Hotel & Spa.", f"""
    <section class="section tight bg-soft">
      <div class="container">
        <nav class="crumbs" aria-label="Đường dẫn" style="color:var(--muted)"><a href="index.html" style="color:var(--ink)">Trang chủ</a><span>/</span><a href="services.html" style="color:var(--ink)">Dịch vụ</a><span>/</span><span id="crumb">…</span></nav>
        <div id="service-detail"><p class="loading">Đang tải dịch vụ…</p></div>
      </div>
    </section>

    <section class="section" id="booking-section" hidden>
      <div class="container split top">
        <div class="panel" id="dat-lich">
          <span class="eyebrow">Đặt lịch</span>
          <h2>Đặt lịch hẹn cho bé</h2>
          <p class="muted">Lễ tân sẽ xác nhận qua điện thoại hoặc Zalo trong 30 phút. Bạn có thể sửa hoặc hủy lịch ở trang <a href="bookings.html">Lịch hẹn của tôi</a>.</p>
          <div class="notice" id="db-notice" hidden></div>
          <form id="booking-form" novalidate>
            <div class="form-grid">
              <div class="field"><label for="owner_name">Tên của bạn</label><input id="owner_name" name="owner_name" required maxlength="60" autocomplete="name"></div>
              <div class="field"><label for="phone">Số điện thoại</label><input id="phone" name="phone" type="tel" required pattern="[0-9+ ]{{8,15}}" maxlength="15" autocomplete="tel" placeholder="0901234567"></div>
              <div class="field"><label for="pet_name">Tên thú cưng</label><input id="pet_name" name="pet_name" required maxlength="40"></div>
              <div class="field"><label for="pet_type">Loài</label><select id="pet_type" name="pet_type" required><option>Chó</option><option>Mèo</option><option>Khác</option></select></div>
              <div class="field"><label for="pet_weight">Cân nặng (kg)</label><input id="pet_weight" name="pet_weight" type="number" required min="0.1" max="99" step="0.1" placeholder="4.5"></div>
              <div class="field"><label for="booking_date">Ngày hẹn</label><input id="booking_date" name="booking_date" type="date" required></div>
              <div class="field full"><label for="booking_time">Giờ hẹn</label><select id="booking_time" name="booking_time" required></select></div>
              <div class="field full"><label for="note">Ghi chú (không bắt buộc)</label><textarea id="note" name="note" maxlength="300" placeholder="Ví dụ: bé sợ tiếng máy sấy"></textarea></div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn">{ic('calendar')} Xác nhận đặt lịch</button>
              <a href="bookings.html" class="link-arrow">Lịch hẹn của tôi {ic('arrow')}</a>
            </div>
          </form>
        </div>

        <div class="panel">
          <span class="eyebrow">Đánh giá</span>
          <h2>Khách hàng nói gì về gói này</h2>
          <div id="review-list"><p class="muted">Đang tải đánh giá…</p></div>
          <form id="review-form" novalidate style="margin-top:20px;padding-top:20px;border-top:1px solid var(--line)">
            <h3>Viết đánh giá</h3>
            <div class="form-grid">
              <div class="field"><label for="author_name">Tên của bạn</label><input id="author_name" name="author_name" required maxlength="60"></div>
              <div class="field"><label for="rating">Số sao</label><select id="rating" name="rating"><option value="5">5 sao</option><option value="4">4 sao</option><option value="3">3 sao</option><option value="2">2 sao</option><option value="1">1 sao</option></select></div>
              <div class="field full"><label for="comment">Nhận xét</label><textarea id="comment" name="comment" required maxlength="500"></textarea></div>
            </div>
            <div class="form-actions"><button type="submit" class="btn btn-outline">Gửi đánh giá</button></div>
          </form>
        </div>
      </div>
    </section>
""" + CTA)

# ======================================================== Lịch hẹn
page("bookings.html", "bookings", "Lịch hẹn của tôi",
     "Xem, sửa và hủy lịch hẹn chăm sóc thú cưng tại Momo Pet Hotel & Spa.",
     page_hero("svc-bath-2.jpg", "Lịch hẹn của tôi", "Lịch hẹn của tôi",
               "Đổi ngày giờ, cập nhật cân nặng của bé hoặc hủy lịch. Đăng nhập để xem lịch hẹn trên mọi thiết bị.") + f"""
    <section class="section">
      <div class="container">
        <div class="notice" id="db-notice" hidden></div>
        <div class="stack" id="booking-list"><p class="loading">Đang tải lịch hẹn…</p></div>
      </div>
    </section>

    <section class="section tight bg-soft">
      <div class="container grid grid-3">
        <div class="info-card"><span class="ico">{ic('calendar')}</span><h3>Đổi lịch miễn phí</h3><p>Thay đổi trước giờ hẹn ít nhất 2 tiếng để Momo sắp xếp chuyên viên.</p></div>
        <div class="info-card"><span class="ico">{ic('chat')}</span><h3>Xác nhận qua Zalo</h3><p>Mọi thay đổi đều được lễ tân nhắn xác nhận lại qua số điện thoại bạn để lại.</p></div>
        <div class="info-card"><span class="ico">{ic('phone')}</span><h3>Cần hỗ trợ gấp?</h3><p>Gọi hotline <a href="tel:{PHONE_TEL}">{PHONE}</a> từ 8:00 đến 20:00.</p></div>
      </div>
    </section>
""")

# ======================================================== Liên hệ
page("contact.html", "contact", "Liên hệ",
     "Địa chỉ, giờ mở cửa và bản đồ đường đi tới Momo Pet Hotel & Spa, 177 Tôn Thất Thuyết, Phường Khánh Hội, TP.HCM.",
     page_hero("storefront.jpg", "Liên hệ", "Liên hệ &amp; Đường đi",
               "Ghé Momo tại Phường Khánh Hội, gọi hotline hoặc đặt lịch trực tuyến. Chúng tôi luôn sẵn sàng đón bé.") + f"""
    <section class="section">
      <div class="container">
        <div class="grid grid-4">
          <div class="info-card"><span class="ico">{ic('pin')}</span><h3>Địa chỉ</h3><p>{ADDR}</p></div>
          <div class="info-card"><span class="ico">{ic('phone')}</span><h3>Hotline</h3><p><a href="tel:{PHONE_TEL}">{PHONE}</a><br>Tư vấn và đặt lịch</p></div>
          <div class="info-card"><span class="ico">{ic('mail')}</span><h3>Email</h3><p><a href="mailto:{EMAIL}">{EMAIL}</a><br>Phản hồi trong 24 giờ</p></div>
          <div class="info-card"><span class="ico">{ic('clock')}</span><h3>Giờ mở cửa</h3><p>8:00 – 20:00 mỗi ngày<br>Khách sạn trực 24/7</p></div>
        </div>
      </div>
    </section>

    <section class="section bg-soft">
      <div class="container split top">
        <div>
          <span class="eyebrow">Cửa hàng</span>
          <h2>Ghé thăm Momo</h2>
          <img class="photo wide" src="assets/img/photos/storefront.jpg" alt="Chó và mèo ngồi trước cửa kính của cửa hàng thú cưng" loading="lazy" style="margin-bottom:20px">
          <ul class="checklist">
            <li>{ic('check')} Có chỗ để xe máy trước cửa</li>
            <li>{ic('check')} Khu chờ cho chủ nuôi có nước uống miễn phí</li>
            <li>{ic('check')} Đón khách tham quan phòng nghỉ trước khi gửi bé</li>
          </ul>
          <div class="detail-actions">
            <a class="btn btn-brand" href="https://www.google.com/maps/dir/?api=1&amp;destination={MAP_Q}" target="_blank" rel="noopener">{ic('pin')} Chỉ đường</a>
            <a class="btn btn-outline" href="tel:{PHONE_TEL}">{ic('phone')} Gọi ngay</a>
          </div>
        </div>
        <div class="embed map">
          <iframe src="https://www.google.com/maps?q={MAP_Q}&amp;z=16&amp;hl=vi&amp;output=embed" title="Google Map: vị trí Momo Pet Hotel &amp; Spa tại 177 Tôn Thất Thuyết, Khánh Hội" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
        </div>
      </div>
    </section>
""" + CTA)


# ======================================================== Tài khoản khách hàng
page("account.html", "account", "Tài khoản của tôi",
     "Đăng nhập, đăng ký và cập nhật thông tin tài khoản khách hàng Momo Pet Hotel & Spa.",
     page_hero("momo-beach.jpg", "Tài khoản", "Tài khoản của tôi",
               "Cập nhật họ tên, số điện thoại, đổi mật khẩu và xem lịch hẹn của bạn.") + f"""
    <section class="section">
      <div class="container">
        <div class="notice" id="db-notice" hidden></div>
        <div id="account-root"><p class="loading">Đang tải…</p></div>
      </div>
    </section>
""")

# ======================================================== Quản trị
page("admin.html", "admin", "Quản trị",
     "Trang quản trị nội bộ của Momo Pet Hotel & Spa.", f"""
    <section class="admin-head">
      <div class="container">
        <span class="eyebrow">Nội bộ</span>
        <h1>Trang quản trị</h1>
        <p class="muted">Quản lý lịch hẹn, bảng giá dịch vụ và đánh giá của khách. Chỉ tài khoản quản trị viên mới truy cập được.</p>
      </div>
    </section>
    <section class="section tight">
      <div class="container">
        <div class="notice" id="db-notice" hidden></div>
        <div id="admin-root"><p class="loading">Đang kiểm tra quyền truy cập…</p></div>
      </div>
    </section>
""")


# ======================================================== Trang xác thực (đăng nhập, đăng ký, quên/đặt lại mật khẩu)
def pw_field(fid, name, label, autocomplete, hint=""):
    hint_html = f'<p class="hint">{hint}</p>' if hint else ""
    return f"""<div class="field"><label for="{fid}">{label}</label>
              <div class="pw-wrap"><input id="{fid}" name="{name}" type="password" required minlength="6" autocomplete="{autocomplete}">
                <button type="button" class="pw-toggle" aria-label="Hiện mật khẩu" aria-pressed="false">{ic('eye')}</button></div>{hint_html}</div>"""


AUTH_ASIDE = f"""
        <aside class="auth-aside" style="background-image:url(assets/img/photos/momo-sea.jpg)">
          <div class="auth-aside-body">
            <h2>Tài khoản Momo giúp bạn</h2>
            <ul class="checklist">
              <li>{ic('check')} Xem và quản lý lịch hẹn trên mọi thiết bị</li>
              <li>{ic('check')} Điền sẵn tên, số điện thoại khi đặt lịch</li>
              <li>{ic('check')} Giữ lại các lịch đã đặt trước khi tạo tài khoản</li>
            </ul>
            <p>Không có tài khoản bạn vẫn đặt lịch được bình thường.</p>
          </div>
        </aside>"""


def auth_page(name, key, title, desc, heading, sub, body):
    page(name, key, title, desc, f"""
    <section class="section auth-section">
      <div class="container auth-wrap">
        <div class="panel auth-card">
          <a href="index.html" class="auth-logo"><img src="assets/img/logo-mark.svg" alt="Momo Pet Hotel &amp; Spa" width="56" height="56"></a>
          <h1>{heading}</h1>
          <p class="muted">{sub}</p>
          <div class="notice" id="db-notice" hidden></div>
          <div class="notice" id="auth-notice" hidden></div>
{body}
        </div>{AUTH_ASIDE}
      </div>
    </section>
""")


auth_page("login.html", "login", "Đăng nhập",
          "Đăng nhập tài khoản khách hàng hoặc quản trị viên Momo Pet Hotel & Spa.",
          "Đăng nhập", "Chào mừng bạn quay lại Momo.", f"""
          <form id="login-form" class="form-stack" novalidate>
            <div class="field"><label for="li-email">Email</label><input id="li-email" name="email" type="email" required autocomplete="email"></div>
            {pw_field('li-pass', 'password', 'Mật khẩu', 'current-password')}
            <div class="auth-row"><a href="forgot-password.html">Quên mật khẩu?</a></div>
            <button type="submit" class="btn btn-brand btn-block">Đăng nhập</button>
          </form>
          <p class="auth-switch">Chưa có tài khoản? <a href="register.html">Đăng ký ngay</a></p>""")

auth_page("register.html", "register", "Đăng ký",
          "Tạo tài khoản khách hàng Momo Pet Hotel & Spa.",
          "Tạo tài khoản", "Chỉ mất 1 phút. Lịch hẹn bạn đã đặt trên trình duyệt này sẽ được chuyển vào tài khoản mới.", f"""
          <form id="register-form" novalidate>
            <div class="form-grid">
              <div class="field"><label for="su-name">Họ và tên</label><input id="su-name" name="full_name" required maxlength="60" autocomplete="name"></div>
              <div class="field"><label for="su-phone">Số điện thoại</label><input id="su-phone" name="phone" type="tel" required pattern="[0-9+ ]{{8,15}}" maxlength="15" autocomplete="tel"></div>
              <div class="field full"><label for="su-email">Email</label><input id="su-email" name="email" type="email" required autocomplete="email"></div>
              {pw_field('su-pass', 'password', 'Mật khẩu', 'new-password', 'Ít nhất 6 ký tự.')}
              {pw_field('su-pass2', 'password2', 'Nhập lại mật khẩu', 'new-password')}
            </div>
            <button type="submit" class="btn btn-block" style="margin-top:20px">Tạo tài khoản</button>
          </form>
          <p class="auth-switch">Đã có tài khoản? <a href="login.html">Đăng nhập</a></p>""")

auth_page("forgot-password.html", "forgot", "Quên mật khẩu",
          "Khôi phục mật khẩu tài khoản Momo Pet Hotel & Spa qua email.",
          "Quên mật khẩu?", "Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.", f"""
          <form id="forgot-form" class="form-stack" novalidate>
            <div class="field"><label for="fg-email">Email</label><input id="fg-email" name="email" type="email" required autocomplete="email"></div>
            <button type="submit" class="btn btn-brand btn-block">{ic('mail')} Gửi email khôi phục</button>
          </form>
          <div id="forgot-done" class="auth-done" hidden>
            <span class="ico">{ic('mail')}</span>
            <h2>Kiểm tra hộp thư của bạn</h2>
            <p class="muted">Nếu email <strong id="forgot-email"></strong> đã đăng ký, bạn sẽ nhận được thư có liên kết đặt lại mật khẩu trong vài phút. Nhớ xem cả mục Thư rác.</p>
          </div>
          <p class="auth-switch"><a href="login.html">← Quay lại đăng nhập</a></p>""")

auth_page("reset-password.html", "reset", "Đặt lại mật khẩu",
          "Đặt mật khẩu mới cho tài khoản Momo Pet Hotel & Spa.",
          "Đặt lại mật khẩu", "Nhập mật khẩu mới cho tài khoản của bạn.", f"""
          <p class="loading" id="reset-loading">Đang kiểm tra liên kết…</p>
          <form id="reset-form" class="form-stack" novalidate hidden>
            {pw_field('rs-pass', 'password', 'Mật khẩu mới', 'new-password', 'Ít nhất 6 ký tự.')}
            {pw_field('rs-pass2', 'password2', 'Nhập lại mật khẩu mới', 'new-password')}
            <button type="submit" class="btn btn-brand btn-block">Lưu mật khẩu mới</button>
          </form>
          <div id="reset-invalid" class="auth-done" hidden>
            <span class="ico">{ic('lock')}</span>
            <h2>Liên kết không hợp lệ hoặc đã hết hạn</h2>
            <p class="muted">Liên kết đặt lại mật khẩu chỉ dùng được một lần và có thời hạn. Hãy yêu cầu liên kết mới.</p>
            <a class="btn btn-brand" href="forgot-password.html">Gửi lại email khôi phục</a>
          </div>""")
