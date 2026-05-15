# Vendora POS - Multi-tenant API Documentation

Backend API สำหรับระบบจัดการการขาย (POS) แบบหลายร้านค้า (Multi-tenant) พัฒนาด้วย Node.js, Express และ Prisma.

## 🚀 ข้อมูลพื้นฐาน
- **Base URL:** `http://localhost:5000/api`
- **Multi-tenancy:** ข้อมูลจะถูกแยกตามร้านค้า (`Store`) โดยใช้ `storeId` จาก Token ของผู้ใช้งาน
- **Authentication:** ใช้ Bearer Token (JWT) ใน Header. Token จะระบุ `storeId` เพื่อกรองข้อมูลอัตโนมัติ
- **Security Features:**
    - **Helmet:** ป้องกันการโจมตีผ่าน HTTP Headers
    - **Rate Limiting:** จำกัดการเรียก API 100 ครั้งต่อ 15 นาที เพื่อป้องกัน Brute-force
    - **Input Isolation:** กรองข้อมูลตาม `storeId` ทุก Endpoint
    - **Account/Store Status Check:** ตรวจสอบสถานะการใช้งานของพนักงานและร้านค้าก่อน Login
- **Supabase Storage:** 
    - รูปภาพสินค้าเก็บที่ Bucket: `vendora`
    - รูปภาพสลิปการชำระเงินเก็บที่ Bucket: `paymentSlip`

## 👥 ลำดับสิทธิ์ (Roles)
- **Dev:** ผู้ดูแลระบบภาพรวม (System Admin) จัดการได้ข้ามร้านค้า และควบคุมฟีเจอร์ของระบบ
- **Admin:** เจ้าของร้าน (Owner) จัดการได้ทุกอย่างภายในร้านของตนเอง
- **Manager:** จัดการสต๊อก, สินค้า, หมวดหมู่ และดูรายงานยอดขายได้
- **Cashier:** ทำรายการขาย และสามารถช่วยจัดการสินค้า/ปรับสต๊อกได้ (Full Product Management Access)

---

## 🛠 รายการ API ทั้งหมด

### 1. ระบบสำหรับผู้พัฒนา (Developer Admin API) - **ใหม่**
สิทธิ์ระดับ **Dev** เท่านั้นที่เข้าถึงได้
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/dev/stats` | สรุปข้อมูลภาพรวมทั้งระบบ (รวมทุกร้านค้า) | Dev Only |
| GET | `/dev/stores` | รายชื่อร้านค้าทั้งหมดพร้อมสถานะ, ข้อมูลพนักงาน (staff) และสรุปยอดจำนวน (_count) | Dev Only |
| PUT | `/dev/stores/:storeId/features` | เปิด/ปิด ฟีเจอร์แยกตามร้านค้า (JSON) | Dev Only |
| PUT | `/dev/stores/:storeId/status` | ระงับการใช้งานหรือเปิดใช้งานร้านค้า | Dev Only |
| GET | `/dev/stores/:storeId/staff` | ดูรายชื่อพนักงานทั้งหมดของร้านที่ระบุ | Dev Only |
| DELETE | `/dev/users/:userId` | ลบผู้ใช้งานใดๆ ออกจากระบบ (Global) | Dev Only |

### 2. ระบบจัดการร้านค้า (Store Management)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/stores` | สร้างร้านค้าใหม่ (ต้องทำหลังจากสมัครสมาชิกครั้งแรก) | Yes |
| GET | `/stores/me` | ดูข้อมูลร้านค้าของตนเอง | Yes |
| PUT | `/stores` | แก้ไขข้อมูลและการตั้งค่าร้านค้า | Yes (Admin/Dev) |

### 3. ระบบยืนยันตัวตน (Authentication)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/register` | สมัครสมาชิกพนักงานใหม่ | No |
| POST | `/login` | เข้าสู่ระบบ (ตรวจสอบสถานะพนักงานและร้านค้า) | No |
| GET | `/me` | ดูข้อมูลพนักงานที่กำลังล็อกอินอยู่ | Yes |
| PUT | `/change-password` | เปลี่ยนรหัสผ่านพนักงาน | Yes |

### 4. ระบบแดชบอร์ดและรายงาน (Dashboard & Analytics)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/dashboard/summary` | สรุปยอดขาย กำไร และจำนวนสินค้าสต็อกต่ำ | Yes |
| GET | `/dashboard/top-products` | รายชื่อ 5 อันดับสินค้าขายดีที่สุด | Yes |
| GET | `/dashboard/sales-chart` | ข้อมูลกราฟยอดขายย้อนหลัง 7 วัน | Yes |

### 5. ระบบจัดการพนักงาน (User Management)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/user` | สร้างพนักงานใหม่ในร้าน | Yes (Admin/Dev) |
| GET | `/users` | รายชื่อพนักงานทั้งหมดในร้าน | Yes |
| GET | `/user/:id` | ดูข้อมูลพนักงานรายบุคคล | Yes |
| PUT | `/user/:id` | แก้ไขข้อมูลพนักงาน | Yes (Admin/Dev) |
| DELETE | `/user/:id` | ลบพนักงาน | Yes (Admin/Dev) |
| PATCH | `/change-password/:id` | แอดมินเปลี่ยนรหัสผ่านให้พนักงาน | Yes (Admin/Dev) |

### 6. ระบบจัดการหมวดหมู่ (Category)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/category` | สร้างหมวดหมู่ใหม่ | Yes |
| GET | `/categories` | รายชื่อหมวดหมู่ทั้งหมดในร้าน | Yes |
| PUT | `/category/:id` | แก้ไขหมวดหมู่ | Yes |
| DELETE | `/category/:id` | ลบหมวดหมู่ | Yes |

### 7. ระบบจัดการสินค้า (Product)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/product` | เพิ่มสินค้าใหม่ (รองรับรูปภาพ) | Yes (ทุก Role) |
| GET | `/products` | รายชื่อสินค้าทั้งหมดในร้าน | Yes |
| GET | `/products/low-stock` | รายชื่อสินค้าที่สต็อกใกล้หมด | Yes |
| GET | `/product/:id` | รายละเอียดสินค้ารายชิ้น | Yes |
| PUT | `/product/:id` | แก้ไขข้อมูลสินค้า | Yes (ทุก Role) |
| DELETE | `/product/:id` | ลบสินค้า | Yes (ทุก Role) |

### 8. ระบบจัดการลูกค้า (Customer)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/customer` | เพิ่มข้อมูลลูกค้าใหม่ | Yes |
| GET | `/customers` | รายชื่อลูกค้าทั้งหมดในร้าน | Yes |
| GET | `/customer/:id` | ข้อมูลลูกค้า ประวัติการซื้อ และแต้ม | Yes |
| GET | `/customer/phone/:phone` | ค้นหาลูกค้าด้วยเบอร์โทรศัพท์ | Yes |
| PUT | `/customer/:id` | แก้ไขข้อมูลลูกค้า | Yes |
| DELETE | `/customer/:id` | ลบข้อมูลลูกค้า | Yes (Manager/Admin/Dev) |
| POST | `/customer/:id/redeem` | แลกแต้มรางวัล | Yes |
| POST | `/customer/:id/adjust-points` | ปรับปรุงแต้มด้วยตนเอง | Yes (Manager/Admin/Dev) |
| GET | `/customer/:id/point-history` | ดูประวัติแต้มสะสมทั้งหมดของลูกค้า | Yes |

### 9. ระบบขายสินค้า (Order / Checkout)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/order` | ทำการขาย (หักสต็อกอัตโนมัติ) | Yes |
| GET | `/orders` | ประวัติการขายของร้าน | Yes |
| GET | `/order/:id` | ดูรายละเอียดใบเสร็จ | Yes |
| PUT | `/order/void/:id` | ยกเลิกรายการขาย (คืนสต็อก/หักแต้ม) | Yes (Admin/Dev) |

### 10. ระบบสต็อกสินค้า (Stock Movement)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/stock/movements` | ดูประวัติการเคลื่อนไหวสต็อก | Yes |
| POST | `/stock/adjust` | ปรับปรุงสต็อกด้วยตนเอง (In/Out/Set) | Yes (ทุก Role) |

---

## 📦 เทคโนโลยีที่ใช้
- **Framework:** Express.js (v5+)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Security:** Helmet, Express-Rate-Limit, Bcryptjs, JWT
- **Storage:** Supabase Storage
