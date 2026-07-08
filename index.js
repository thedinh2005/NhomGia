const express = require('express');
const app = express();
const port = 3000;
const morgan = require('morgan'); 
// Cho phép truy cập file tĩnh (ảnh, gif, css...) trong thư mục "D:/video"
// Lưu ý: express.static() phải trỏ tới THƯ MỤC chứa file, không trỏ thẳng vào file gif
app.use(express.static('D:/video'));
app.use(morgan('combined'));
// CSS dùng chung cho toàn bộ trang - Cyberpunk theme
const baseStyle = `
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    @keyframes hueShift {
      0%   { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }

    @keyframes gradientMove {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes flicker {
      0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
      20%, 22%, 24%, 55% { opacity: 0.6; }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes gridMove {
      from { background-position: 0 0; }
      to { background-position: 40px 40px; }
    }

    body {
      font-family: 'Consolas', 'Courier New', monospace;
      min-height: 100vh;
      background-color: #05010d;
      background-image:
        linear-gradient(rgba(255, 0, 200, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 255, 0.08) 1px, transparent 1px);
      background-size: 40px 40px;
      animation: gridMove 6s linear infinite;
      padding: 40px 20px;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .card {
      background: rgba(10, 4, 25, 0.85);
      border-radius: 12px;
      border: 2px solid transparent;
      background-clip: padding-box;
      box-shadow:
        0 0 15px rgba(255, 0, 200, 0.6),
        0 0 35px rgba(0, 255, 255, 0.4),
        inset 0 0 20px rgba(0, 255, 255, 0.05);
      position: relative;
      padding: 50px 40px;
      max-width: 900px;
      width: 100%;
      margin: 0 auto;
      animation: fadeIn 0.6s ease-in-out;
    }

    .card::before {
      content: "";
      position: absolute;
      inset: -2px;
      border-radius: 12px;
      padding: 2px;
      background: linear-gradient(120deg, #ff00c8, #00fff9, #ff00c8, #7000ff, #ff00c8);
      background-size: 300% 300%;
      animation: gradientMove 4s linear infinite;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      z-index: -1;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 10px;
      text-align: center;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      background: linear-gradient(90deg, #ff00c8, #00fff9, #7000ff, #ff00c8, #00fff9);
      background-size: 300% auto;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientMove 3s linear infinite, flicker 5s infinite;
      text-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
    }

    .subtitle {
      text-align: center;
      color: #7fdfff;
      margin-bottom: 30px;
      font-size: 1rem;
      text-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
    }

    .nav {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .nav a {
      text-decoration: none;
      color: #00fff9;
      font-weight: 700;
      padding: 8px 18px;
      border: 2px solid #00fff9;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.25s ease;
      box-shadow: 0 0 8px rgba(0, 255, 255, 0.4);
    }

    .nav a:hover {
      background: #00fff9;
      color: #05010d;
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.9), 0 0 40px rgba(255, 0, 200, 0.5);
      transform: translateY(-2px);
    }

    .info-list {
      list-style: none;
    }

    .info-list li {
      display: flex;
      padding: 14px 0;
      border-bottom: 1px solid rgba(0, 255, 255, 0.15);
      font-size: 1.05rem;
    }

    .info-list li:last-child {
      border-bottom: none;
    }

    .info-list .label {
      min-width: 130px;
      font-weight: 800;
      background: linear-gradient(90deg, #ff00c8, #00fff9, #7000ff, #ff00c8);
      background-size: 300% auto;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientMove 3s linear infinite;
    }

    .info-list .value {
      color: #d9f9ff;
      flex: 1;
    }

    /* Avatar trang chủ / cá nhân dùng ảnh gif */
    .avatar-gif {
      display: block;
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 50%;
      margin: 0 auto 20px auto;
      border: 3px solid transparent;
      box-shadow: 0 0 25px rgba(0, 255, 255, 0.6), 0 0 45px rgba(255, 0, 200, 0.4);
      animation: fadeIn 0.6s ease-in-out;
    }

    .welcome-text {
      text-align: center;
      font-size: 1.2rem;
      color: #d9f9ff;
      line-height: 1.6;
      text-shadow: 0 0 6px rgba(0, 255, 255, 0.3);
    }

    /* Lưới thành viên nhóm */
    .members-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 25px;
    }

    .member-card {
      background: rgba(0, 255, 255, 0.05);
      border-radius: 12px;
      padding: 30px 25px;
      border: 2px solid rgba(0, 255, 255, 0.25);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .member-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 0 20px rgba(255, 0, 200, 0.5), 0 0 30px rgba(0, 255, 255, 0.4);
      border-color: rgba(255, 0, 200, 0.6);
    }

    .member-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff00c8, #00fff9, #7000ff);
      background-size: 300% auto;
      animation: gradientMove 3s linear infinite;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #05010d;
      font-size: 1.8rem;
      font-weight: 800;
      margin: 0 auto 15px auto;
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
    }

    .member-name {
      text-align: center;
      font-size: 1.25rem;
      font-weight: 800;
      margin-bottom: 15px;
      background: linear-gradient(90deg, #ff00c8, #00fff9, #7000ff, #ff00c8);
      background-size: 300% auto;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientMove 3s linear infinite;
    }

    .member-info {
      list-style: none;
    }

    .member-info li {
      display: flex;
      padding: 8px 0;
      font-size: 0.95rem;
    }

    .member-info .label {
      min-width: 90px;
      font-weight: 700;
      color: #ff7fe6;
    }

    .member-info .value {
      color: #d9f9ff;
      flex: 1;
    }
  </style>
`;

// Danh sách thành viên nhóm
const members = [
  {
    initials: 'TĐ',
    name: 'Trần Thế Đình',
    tuoi: 21,
    gioiTinh: 'Nam',
    ngaySinh: '28/06/2005',
    mssv: '2306022032',
    lop: '17THC',
    diaChi: 'TP.HCM'
  },
  {
    initials: 'TP',
    name: 'Dương Thanh Phong',
    tuoi: 22,
    gioiTinh: 'Nam',
    ngaySinh: '20/12/2004',
    mssv: '2306022002',
    lop: '17THC',
    diaChi: 'Cần Thơ'
  },
  {
    initials: 'TH',
    name: 'Phan Thị Thanh Hoài',
    tuoi: 21,
    gioiTinh: 'Nữ',
    ngaySinh: '26/11/2005',
    mssv: '2306012019',
    lop: '17THC',
    diaChi: 'Dak Lak'
  }
];

function renderMemberCard(m) {
  return `
    <div class="member-card">
      <div class="member-avatar">${m.initials}</div>
      <div class="member-name">${m.name}</div>
      <ul class="member-info">
        <li><span class="label">Tuổi:</span><span class="value">${m.tuoi}</span></li>
        <li><span class="label">Giới tính:</span><span class="value">${m.gioiTinh}</span></li>
        <li><span class="label">Ngày sinh:</span><span class="value">${m.ngaySinh}</span></li>
        <li><span class="label">MSSV:</span><span class="value">${m.mssv}</span></li>
        <li><span class="label">Lớp:</span><span class="value">${m.lop}</span></li>
        <li><span class="label">Địa chỉ:</span><span class="value">${m.diaChi}</span></li>
      </ul>
    </div>
  `;
}

const navHtml = `
  <div class="nav">
    <a href="/">Trang chủ</a>
    <a href="/gioithieu">Giới thiệu</a>
    <a href="/nhom">Nhóm</a>
  </div>
`;

// Trang chủ
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>Blog cá nhân & nhóm</title>
      ${baseStyle}
    </head>
    <body>
      <div class="card">
        <img src="/avatar.gif" alt="Avatar" class="avatar-gif">
        <h1>Chào mừng đến với Blog của tôi!</h1>
        <p class="subtitle">Nơi chia sẻ những điều thú vị trong cuộc sống</p>
        ${navHtml}
        <p class="welcome-text">
          Rất vui khi bạn ghé thăm trang blog. Nhấn vào "Giới thiệu" để biết thêm
          về tôi, hoặc "Nhóm" để xem thông tin cả nhóm nhé!
        </p>
      </div>
    </body>
    </html>
  `);
});

// Giới thiệu cá nhân
app.get('/gioithieu', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>Thông tin cá nhân</title>
      ${baseStyle}
    </head>
    <body>
      <div class="card">
        <img src="/avatar.gif" alt="Avatar" class="avatar-gif">
        <h1>Thông tin cá nhân</h1>
        <p class="subtitle">Một vài điều về tôi</p>
        ${navHtml}
        <ul class="info-list">
          <li><span class="label">Tên:</span><span class="value">Trần Thế Đình</span></li>
          <li><span class="label">Tuổi:</span><span class="value">21</span></li>
          <li><span class="label">Giới tính:</span><span class="value">Nam</span></li>
          <li><span class="label">Ngày sinh:</span><span class="value">28/06/2005</span></li>
          <li><span class="label">Mssv:</span><span class="value">2306022032</span></li>
          <li><span class="label">Lớp:</span><span class="value">17THC</span></li>
          <li><span class="label">Địa chỉ:</span><span class="value">Tp.HCM</span></li>
          <li><span class="label">Sở thích:</span><span class="value">Lập trình, đọc sách, du lịch, edit video, youtube, lắp ráp và sửa máy tính</span></li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

// Giới thiệu nhóm
app.get('/nhom', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>Giới thiệu nhóm</title>
      ${baseStyle}
    </head>
    <body>
      <div class="container">
        <div class="card">
          <h1>Giới thiệu về nhóm chúng tôi</h1>
          <p class="subtitle">Nhóm có ${members.length} thành viên</p>
          ${navHtml}
          <div class="members-grid">
            ${members.map(renderMemberCard).join('')}
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});