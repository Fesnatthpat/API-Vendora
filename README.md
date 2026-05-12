# Vendora POS - API Documentation

Backend API สำหรับระบบจัดการการขาย (POS) พัฒนาด้วย Node.js, Express และ Prisma.

## 🚀 ข้อมูลพื้นฐาน
- **Base URL:** `http://localhost:5000/api`
- **Authentication:** ใช้ Bearer Token (JWT) ใน Header สำหรับเส้นที่ต้องใช้สิทธิ์เข้าถึง
- **Supabase Storage:** 
    - รูปภาพสินค้าเก็บที่ Bucket: `vendora`
    - รูปภาพสลิปการชำระเงินเก็บที่ Bucket: `paymentSlip`

---

## 🛠 รายการ API ทั้งหมด

### 1. ระบบยืนยันตัวตน (Authentication)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/register` | สมัครสมาชิกพนักงานใหม่ | No |
| POST | `/login` | เข้าสู่ระบบและรับ Token | No |
| GET | `/me` | ดูข้อมูลพนักงานที่กำลังล็อกอินอยู่ | Yes |
| PUT | `/change-password` | เปลี่ยนรหัสผ่านพนักงาน | Yes |

### 2. ระบบแดชบอร์ดและรายงาน (Dashboard & Analytics)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/dashboard/summary` | สรุปยอดขาย กำไร และจำนวนสินค้าสต็อกต่ำ | Yes (Admin) |
| GET | `/dashboard/top-products` | รายชื่อ 5 อันดับสินค้าขายดีที่สุด | Yes (Admin) |
| GET | `/dashboard/sales-chart` | ข้อมูลกราฟยอดขายย้อนหลัง 7 วัน | Yes (Admin) |

### 3. ระบบจัดการพนักงาน (User Management)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/users` | รายชื่อพนักงานทั้งหมด | Yes |
| GET | `/user/:id` | ดูข้อมูลพนักงานรายบุคคล | Yes |
| PUT | `/user/:id` | แก้ไขข้อมูลพนักงาน | Yes |
| DELETE | `/user/:id` | ลบพนักงาน | Yes (Admin) |

### 4. ระบบจัดการหมวดหมู่ (Category)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/category` | สร้างหมวดหมู่ใหม่ | Yes (Admin) |
| GET | `/categories` | รายชื่อหมวดหมู่ทั้งหมด | No |
| PUT | `/category/:id` | แก้ไขหมวดหมู่ | Yes (Admin) |
| DELETE | `/category/:id` | ลบหมวดหมู่ | Yes (Admin) |

### 5. ระบบจัดการสินค้า (Product)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/product` | เพิ่มสินค้าใหม่ (รองรับการอัปโหลดรูปไป Supabase) | Yes (Admin) |
| GET | `/products` | รายชื่อสินค้าทั้งหมด | No |
| GET | `/products/low-stock` | รายชื่อสินค้าที่สต็อกใกล้หมด (ต่ำกว่าเกณฑ์) | Yes |
| GET | `/product/:id` | รายละเอียดสินค้ารายชิ้น | No |
| PUT | `/product/:id` | แก้ไขข้อมูลสินค้า | Yes (Admin) |
| DELETE | `/product/:id` | ลบสินค้า | Yes (Admin) |

### 6. ระบบจัดการลูกค้า (Customer)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/customer` | เพิ่มข้อมูลลูกค้าใหม่ | Yes |
| GET | `/customers` | รายชื่อลูกค้าทั้งหมด | Yes |
| GET | `/customer/:id` | ข้อมูลลูกค้า ประวัติการซื้อ และแต้ม | Yes |
| GET | `/customer/phone/:phone` | ค้นหาลูกค้าด้วยเบอร์โทรศัพท์ | Yes |
| PUT | `/customer/:id` | แก้ไขข้อมูลลูกค้า | Yes |
| DELETE | `/customer/:id` | ลบข้อมูลลูกค้า | Yes |

### 7. ระบบขายสินค้า (Order / Checkout)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/order` | ทำการขาย (รองรับการอัปโหลด `paymentSlip` ไป Supabase) | Yes |
| GET | `/orders` | ประวัติการขายทั้งหมด (กรองตามวันที่ได้) | Yes |
| GET | `/order/:id` | ดูรายละเอียดใบเสร็จ/คำสั่งซื้อ | Yes |
| PUT | `/order/void/:id` | ยกเลิกรายการขาย (คืนสต็อก, หักแต้มลูกค้าคืน) | Yes (Admin) |

### 8. ระบบสต็อกสินค้า (Stock Movement)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/stock/movements` | ดูประวัติการเคลื่อนไหวสต็อกทั้งหมด | Yes |
| POST | `/stock/adjust` | ปรับปรุงสต็อกด้วยตนเอง (In/Out/Set) | Yes (Admin) |

### 9. ตั้งค่าร้านค้า (Store Settings)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/settings` | ดูข้อมูลร้านค้าและเงื่อนไขการให้แต้ม | Yes |
| PUT | `/settings` | แก้ไขข้อมูลร้านค้า/ภาษี/แต้มสะสม | Yes (Admin) |
| POST | `/settings` | บันทึกข้อมูลร้านค้า (รองรับ `loyaltyPointType`, `loyaltyPointRate`, `loyaltyPointThreshold`) | Yes (Admin) |

---

## 📦 เทคโนโลยีที่ใช้
- **Framework:** Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Storage:** Supabase Storage
- **Security:** bcryptjs (Hashing), jsonwebtoken (JWT)
- **File Handling:** Multer (Memory Storage)
