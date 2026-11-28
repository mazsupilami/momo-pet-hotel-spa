-- Thêm nhóm dịch vụ "Tại nhà" (chạy một lần trong Supabase > SQL Editor).
-- Chạy lại nhiều lần cũng không sao: dòng đã có sẽ được cập nhật.
insert into public.services (id, name, category, price, unit, duration, short_desc, description, includes, image_url, color, is_featured) values
(10, 'Tắm & vệ sinh tại nhà', 'Tại nhà', 350000, 'lần', '90 phút', 'Thợ đến tận nhà, bé không phải di chuyển', 'Thợ Momo mang đủ dụng cụ đến nhà bạn trong bán kính 7 km quanh tiệm: tắm gội, sấy khô, vệ sinh tai và cắt móng. Phù hợp với bé nhút nhát, say xe hoặc lớn tuổi.', 'Tắm gội và sấy khô|Vệ sinh tai, cắt móng|Dọn sạch khu vực tắm|Miễn phí đi lại trong 7 km', 'assets/img/photos/home-bath.jpg', '#3BB4A8', false),
(11, 'Cắt tỉa tại nhà', 'Tại nhà', 550000, 'lần', '150 phút', 'Grooming trọn gói ngay tại nhà', 'Tắm và cắt tỉa tạo kiểu tại nhà bạn. Thợ mang theo bàn grooming, máy sấy và tông đơ êm tiếng, gửi ảnh trước và sau khi làm xong.', 'Tắm gội và sấy khô|Cắt tỉa tạo kiểu|Vệ sinh tai, móng|Chụp ảnh trước và sau', 'assets/img/photos/home-groom.jpg', '#FF8A5B', false)
on conflict (id) do update set
  name = excluded.name, category = excluded.category, price = excluded.price, unit = excluded.unit,
  duration = excluded.duration, short_desc = excluded.short_desc, description = excluded.description,
  includes = excluded.includes, image_url = excluded.image_url, color = excluded.color, is_featured = excluded.is_featured;
