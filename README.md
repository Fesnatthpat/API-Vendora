# Vendora POS - API Documentation

Backend API สำหรับระบบจัดการการขาย (POS) พัฒนาด้วย Node.js, Express และ Prisma.

## 🚀 ข้อมูลพื้นฐาน
- **Base URL:** `http://localhost:5000/api`
- **Authentication:** ใช้ Bearer Token (JWT) ใน Header สำหรับเส้นที่ต้องใช้สิทธิ์เข้าถึง
- **Supabase Storage:** รูปภาพสินค้าเก็บที่ Bucket: `vendora`

---

## 🛠 รายการ API ทั้งหมด

### 1. ระบบยืนยันตัวตน (Authentication)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/register` | สมัครสมาชิกพนักงานใหม่ | No |
| POST | `/login` | เข้าสู่ระบบและรับ Token | No |

### 2. ระบบจัดการพนักงาน (User Management)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/users` | รายชื่อพนักงานทั้งหมด | Yes |
| GET | `/user/:id` | ดูข้อมูลพนักงานรายบุคคล | Yes |
| PUT | `/user/:id` | แก้ไขข้อมูลพนักงาน | Yes |
| DELETE | `/user/:id` | ลบพนักงาน | Yes (Admin) |

### 3. ระบบจัดการหมวดหมู่ (Category)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/category` | สร้างหมวดหมู่ใหม่ | Yes (Admin) |
| GET | `/categories` | รายชื่อหมวดหมู่ทั้งหมด | No |
| PUT | `/category/:id` | แก้ไขหมวดหมู่ | Yes (Admin) |
| DELETE | `/category/:id` | ลบหมวดหมู่ | Yes (Admin) |

### 4. ระบบจัดการสินค้า (Product)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/product` | เพิ่มสินค้าใหม่ (รองรับการอัปโหลดรูปไป Supabase) | Yes (Admin) |
| GET | `/products` | รายชื่อสินค้าทั้งหมด | No |
| GET | `/product/:id` | รายละเอียดสินค้ารายชิ้น | No |
| PUT | `/product/:id` | แก้ไขข้อมูลสินค้า | Yes (Admin) |
| DELETE | `/product/:id` | ลบสินค้า | Yes (Admin) |

### 5. ระบบจัดการลูกค้า (Customer)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/customer` | เพิ่มข้อมูลลูกค้าใหม่ | Yes |
| GET | `/customers` | รายชื่อลูกค้าทั้งหมด | Yes |
| GET | `/customer/:id` | ข้อมูลลูกค้า ประวัติการซื้อ และแต้ม | Yes |
| GET | `/customer/phone/:phone` | ค้นหาลูกค้าด้วยเบอร์โทรศัพท์ | Yes |
| PUT | `/customer/:id` | แก้ไขข้อมูลลูกค้า | Yes |
| DELETE | `/customer/:id` | ลบข้อมูลลูกค้า | Yes |

### 6. ระบบขายสินค้า (Order / Checkout)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/order` | ทำการขาย (ตัดสต็อก, บันทึกการเคลื่อนไหว, เพิ่มแต้มลูกค้า) | Yes |
| GET | `/orders` | ประวัติการขายทั้งหมด (กรองตามวันที่ได้) | Yes |
| GET | `/order/:id` | ดูรายละเอียดใบเสร็จ/คำสั่งซื้อ | Yes |
| PUT | `/order/void/:id` | ยกเลิกรายการขาย (คืนสต็อก, หักแต้มลูกค้าคืน) | Yes (Admin) |

### 7. ระบบสต็อกสินค้า (Stock Movement)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/stock/movements` | ดูประวัติการเคลื่อนไหวสต็อกทั้งหมด | Yes |
| POST | `/stock/adjust` | ปรับปรุงสต็อกด้วยตนเอง (In/Out/Set) | Yes (Admin) |

### 8. ตั้งค่าร้านค้า (Store Settings)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/settings` | ดูข้อมูลร้านค้าและเงื่อนไขการให้แต้ม | Yes |
| PUT | `/settings` | แก้ไขข้อมูลร้านค้า/ภาษี/แต้มสะสม | Yes (Admin) |

---

## 📦 เทคโนโลยีที่ใช้
- **Framework:** Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Storage:** Supabase Storage
- **Security:** bcryptjs (Hashing), jsonwebtoken (JWT)
- **File Handling:** Multer (Memory Storage)
