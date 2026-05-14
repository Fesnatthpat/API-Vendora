# Vendora POS - Multi-tenant API Documentation

Backend API สำหรับระบบจัดการการขาย (POS) แบบหลายร้านค้า (Multi-tenant) พัฒนาด้วย Node.js, Express และ Prisma.

## 🚀 ข้อมูลพื้นฐาน
- **Base URL:** `http://localhost:5000/api`
- **Multi-tenancy:** ข้อมูลจะถูกแยกตามร้านค้า (`Store`) โดยใช้ `storeId` จาก Token ของผู้ใช้งาน
- **Authentication:** ใช้ Bearer Token (JWT) ใน Header. Token จะระบุ `storeId` เพื่อกรองข้อมูลอัตโนมัติ
- **Supabase Storage:** 
    - รูปภาพสินค้าเก็บที่ Bucket: `vendora`
    - รูปภาพสลิปการชำระเงินเก็บที่ Bucket: `paymentSlip`

## 👥 ลำดับสิทธิ์ (Roles)
- **Dev:** ผู้ดูแลระบบภาพรวม (สิทธิ์สูงสุด) - บัญชีเริ่มต้น: `devfes@devfes.com` / `123456`
- **Admin:** เจ้าของร้าน (Owner) จัดการได้ทุกอย่างภายในร้านของตนเอง
- **Manager:** จัดการสต๊อก, สินค้า, หมวดหมู่ และดูรายงานยอดขายได้
- **Cashier:** ทำรายการขาย และสามารถช่วยจัดการสินค้า/ปรับสต๊อกได้ (อัปเดตใหม่)

---

## 🛠 รายการ API ทั้งหมด

### 1. ระบบจัดการร้านค้า (Store Management) - **ใหม่**
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/stores` | สร้างร้านค้าใหม่ (ต้องทำหลังจากสมัครสมาชิกครั้งแรก) | Yes |
| GET | `/stores/me` | ดูข้อมูลร้านค้าของตนเอง | Yes |
| PUT | `/stores` | แก้ไขข้อมูลและการตั้งค่าร้านค้า | Yes (Admin/Dev) |

### 2. ระบบยืนยันตัวตน (Authentication)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/register` | สมัครสมาชิกพนักงานใหม่ | No |
| POST | `/login` | เข้าสู่ระบบและรับ Token (ระบุ `storeId`) | No |
| GET | `/me` | ดูข้อมูลพนักงานที่กำลังล็อกอินอยู่ | Yes |
| PUT | `/change-password` | เปลี่ยนรหัสผ่านพนักงาน | Yes |

### 3. ระบบแดชบอร์ดและรายงาน (Dashboard & Analytics)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/dashboard/summary` | สรุปยอดขาย กำไร และจำนวนสินค้าสต็อกต่ำ | Yes |
| GET | `/dashboard/top-products` | รายชื่อ 5 อันดับสินค้าขายดีที่สุด | Yes |
| GET | `/dashboard/sales-chart` | ข้อมูลกราฟยอดขายย้อนหลัง 7 วัน | Yes |

### 4. ระบบจัดการพนักงาน (User Management)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/user` | สร้างพนักงานใหม่ในร้าน | Yes (Admin/Dev) |
| GET | `/users` | รายชื่อพนักงานทั้งหมดในร้าน | Yes |
| GET | `/user/:id` | ดูข้อมูลพนักงานรายบุคคล | Yes |
| PUT | `/user/:id` | แก้ไขข้อมูลพนักงาน | Yes (Admin/Dev) |
| DELETE | `/user/:id` | ลบพนักงาน | Yes (Admin/Dev) |

### 5. ระบบจัดการหมวดหมู่ (Category)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/category` | สร้างหมวดหมู่ใหม่ | Yes (ทุก Role) |
| GET | `/categories` | รายชื่อหมวดหมู่ทั้งหมดในร้าน | Yes |
| PUT | `/category/:id` | แก้ไขหมวดหมู่ | Yes (ทุก Role) |
| DELETE | `/category/:id` | ลบหมวดหมู่ | Yes (ทุก Role) |

### 6. ระบบจัดการสินค้า (Product)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/product` | เพิ่มสินค้าใหม่ (รองรับการอัปโหลดรูปไป Supabase) | Yes (ทุก Role) |
| GET | `/products` | รายชื่อสินค้าทั้งหมดในร้าน | Yes |
| GET | `/products/low-stock` | รายชื่อสินค้าที่สต็อกใกล้หมด | Yes |
| GET | `/product/:id` | รายละเอียดสินค้ารายชิ้น | Yes |
| PUT | `/product/:id` | แก้ไขข้อมูลสินค้า | Yes (ทุก Role) |
| DELETE | `/product/:id` | ลบสินค้า | Yes (ทุก Role) |

### 7. ระบบจัดการลูกค้า (Customer)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/customer` | เพิ่มข้อมูลลูกค้าใหม่ | Yes |
| GET | `/customers` | รายชื่อลูกค้าทั้งหมดในร้าน | Yes |
| GET | `/customer/:id` | ข้อมูลลูกค้า ประวัติการซื้อ และแต้ม | Yes |
| GET | `/customer/phone/:phone` | ค้นหาลูกค้าด้วยเบอร์โทรศัพท์ | Yes |
| PUT | `/customer/:id` | แก้ไขข้อมูลลูกค้า | Yes |
| DELETE | `/customer/:id` | ลบข้อมูลลูกค้า | Yes |
| POST | `/customer/:id/redeem` | แลกแต้มรางวัล | Yes |
| POST | `/customer/:id/adjust-points` | ปรับปรุงแต้มด้วยตนเอง | Yes |

### 8. ระบบขายสินค้า (Order / Checkout)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/order` | ทำการขาย (แยกสต็อกตามร้าน) | Yes |
| GET | `/orders` | ประวัติการขายของร้าน (กรองตามวันที่ได้) | Yes |
| GET | `/order/:id` | ดูรายละเอียดใบเสร็จ | Yes |
| PUT | `/order/void/:id` | ยกเลิกรายการขาย | Yes (Admin/Dev) |

### 9. ระบบสต็อกสินค้า (Stock Movement)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/stock/movements` | ดูประวัติการเคลื่อนไหวสต็อก | Yes |
| POST | `/stock/adjust` | ปรับปรุงสต็อกด้วยตนเอง (In/Out/Set) | Yes (ทุก Role) |

### 10. ตั้งค่าร้านค้า (Store Settings)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/settings` | ดูข้อมูลการตั้งค่าร้านค้าปัจจุบัน | Yes |
| PUT | `/settings` | แก้ไขข้อมูลร้านค้า/ภาษี/แต้มสะสม | Yes (Admin/Dev) |

---

## 📦 เทคโนโลยีที่ใช้
- **Framework:** Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Multi-tenancy:** Isolated Data Strategy (Store-based)
- **Storage:** Supabase Storage
- **Security:** bcryptjs, jsonwebtoken (JWT)
