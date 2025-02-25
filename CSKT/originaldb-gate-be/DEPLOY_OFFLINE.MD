B1: Chuyển docker images
1. Xem danh sách docker images bằng lệnh:
docker images

2. Xem các image sử dụng trong file docker-compose.yml mỗi service sẽ dùng 1 image
- nginx:stable-alpine
- postgres:alpine3.18
- dpage/pgadmin4:8.4
- redis:alpine
- directus/directus:10.10.2

3. Xuất từng image ra file bằng lệnh
docker save [ten-image] | gzip > ten_file_image.docker.tar.gz
Ví dụ:
docker save directus/directus:10.10.2 | gzip > directus-10.10.2.docker.tar.gz

4. Copy toàn bộ file images sang máy mới

5. Kiểm tra và dừng các docker container không sử dung bên máy mới
docker ps -a #Hiện danh sách container
docker stop [id-container] #Dừng container
docker system prune #Xóa toàn bộ container đã dừng

6. Load từng image vào máy mới bằng lệnh
docker load < /duong-dan/ten_file_image.docker.tar.gz
Ví dụ:
docker load < directus-10.10.2.docker.tar.gz

B2: Chuyển project
1. Phân quyền thư mục project hiện tại trước khi copy
sudo chown -R $(id -u):$(id -g) ./

2. Zip lại folder project rồi copy sang máy mới

3. Kiểm tra lại file .env xem có trường nào cần sửa đổi hay thiếu không

4. Sửa lại ip api ở front-end .env.production
VITE_PUBLIC_API_URL=http://x.x.x.x:8055 #Thay x.x.x.x bằng IP server mới
VITE_APP_URL=http://x.x.x.x:3000 #Thay x.x.x.x bằng IP server mới
VITE_PORT=3000

5. Build lại front-end bằng lệnh: npm run build

6. Copy dist của front-end thành folder web trong directus

B3: Chạy lại docker
docker compose up
