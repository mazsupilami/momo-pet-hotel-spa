-- Đổi hình dịch vụ từ hình vẽ SVG sang ảnh thật.
-- Chạy một lần trong Supabase Dashboard > SQL Editor.
update public.services set image_url = 'assets/img/photos/svc-bath.jpg'      where id = 1;
update public.services set image_url = 'assets/img/photos/svc-groom.jpg'     where id = 2;
update public.services set image_url = 'assets/img/photos/svc-relax.jpg'     where id = 3;
update public.services set image_url = 'assets/img/photos/svc-nails.jpg'     where id = 4;
update public.services set image_url = 'assets/img/photos/room-standard.jpg' where id = 5;
update public.services set image_url = 'assets/img/photos/room-deluxe.jpg'   where id = 6;
update public.services set image_url = 'assets/img/photos/room-vip.jpg'      where id = 7;
update public.services set image_url = 'assets/img/photos/svc-combo.jpg'     where id = 8;
update public.services set image_url = 'assets/img/photos/svc-daycare.jpg'   where id = 9;
