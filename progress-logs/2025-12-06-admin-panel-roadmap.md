# Admin Panel Feature Roadmap
**Date:** 2025-12-06

## Overview
Admin panel untuk Liora edutech platform dengan fokus pada master data management, content management, verification system, dan reporting.

## Feature Breakdown

### Phase 1: Core Features (Current Sprint)
**Priority: High**

#### 1.1 Dashboard
- [x] Overview statistics (teachers, classes, students, sessions)
- [x] Real-time data from API
- [x] Quick action cards
- [ ] Activity timeline

#### 1.2 Data Master
- [x] Teachers CRUD with enhanced profile fields
- [ ] Classes CRUD
- [ ] Students view & management
- [ ] Subjects CRUD

---

### Phase 2: Content & Marketing (Next Sprint)
**Priority: High**

#### 2.1 Content Management
- [ ] **Banner Management**
  - Upload/edit banners for mobile app home screen
  - Schedule banner display periods
  - A/B testing support
  - Analytics tracking

- [ ] **Promotions Management**
  - Create discount campaigns
  - Set promotion rules & validity
  - Target specific user segments
  - Track promotion usage

- [ ] **Announcements**
  - System-wide announcements
  - Push notification integration
  - Scheduling & auto-publish

#### 2.2 Marketing Tools
- [ ] Push notification composer
- [ ] Email campaign builder
- [ ] Voucher/discount code generator
- [ ] Referral program management

---

### Phase 3: Verification & Quality Control
**Priority: High**

#### 3.1 Teacher Verification System
- [ ] **Application Queue**
  - View pending teacher registrations
  - Review profile completeness
  - Document verification (ijazah, sertifikat)
  - Status workflow (Pending → Review → Approved/Rejected)

- [ ] **Document Management**
  - Upload and view teacher documents
  - Verification checklist
  - Comment/feedback system
  - Rejection reason templates

- [ ] **Approval Dashboard**
  - Batch approval/rejection
  - Verification history
  - Performance metrics (approval rate, avg review time)

#### 3.2 Content Moderation
- [ ] Review moderation (approve/reject reviews)
- [ ] Class content review
- [ ] Inappropriate content flagging

---

### Phase 4: Reports & Analytics
**Priority: Medium**

#### 4.1 Business Intelligence
- [ ] **Enrollment Reports**
  - Student registration trends
  - Class enrollment metrics
  - Conversion funnel analysis

- [ ] **Revenue Reports**
  - Payment transactions
  - Revenue by class/teacher
  - Refund tracking

- [ ] **Teacher Performance**
  - Rating & review analytics
  - Class completion rates
  - Student satisfaction scores

- [ ] **Platform Analytics**
  - User engagement metrics
  - Popular classes/subjects
  - Geographic distribution

#### 4.2 Export & Visualization
- [ ] Excel/CSV export
- [ ] Interactive charts & graphs
- [ ] Custom report builder
- [ ] Scheduled email reports

---

### Phase 5: Support & Communication
**Priority: Medium**

#### 5.1 Support Ticket System
- [ ] **Complaint Management**
  - Student complaints queue
  - Teacher support requests
  - Category & priority tagging
  - Assignment to support staff

- [ ] **Ticket Workflow**
  - Status tracking (New → In Progress → Resolved)
  - Internal notes & comments
  - Escalation rules
  - SLA monitoring

- [ ] **Knowledge Base**
  - FAQ management
  - Help article editor
  - Category organization
  - Search functionality

#### 5.2 Communication Tools
- [ ] Chat monitoring
- [ ] Bulk email sender
- [ ] SMS notification system
- [ ] WhatsApp integration

---

### Phase 6: System Settings & Configuration
**Priority: Low**

#### 6.1 Platform Configuration
- [ ] **General Settings**
  - Platform name, logo, branding
  - Time zone & localization
  - Default language settings

- [ ] **Payment Gateway**
  - Configure payment providers (Midtrans, etc)
  - Payment fee settings
  - Refund policies

- [ ] **Email Templates**
  - Welcome email template
  - Notification templates
  - Verification email template
  - Custom HTML editor

#### 6.2 Access Control
- [ ] Admin user management
- [ ] Role-based permissions
- [ ] Activity audit logs
- [ ] IP whitelisting

---

## Recommended Menu Structure

```
📊 Dashboard
   └── Overview & Quick Actions

📚 Data Master
   ├── Teachers
   ├── Classes
   ├── Students
   └── Subjects

🎨 Content Management
   ├── Banners
   ├── Promotions
   └── Announcements

✅ Verification
   ├── Teacher Applications
   ├── Document Review
   └── Approval Queue

📊 Reports
   ├── Enrollment
   ├── Revenue
   ├── Performance
   └── Analytics

🎧 Support
   ├── Tickets & Complaints
   ├── Review Moderation
   └── Knowledge Base

⚙️ Settings
   ├── Platform Config
   ├── Payment Gateway
   ├── Email Templates
   └── Admin Users
```

---

## Implementation Priority

### Must Have (Sprint 1-2)
1. Teacher Verification System
2. Banner Management
3. Basic Reports (enrollment, revenue)

### Should Have (Sprint 3-4)
1. Promotions Management
2. Support Ticket System
3. Advanced Analytics

### Nice to Have (Sprint 5+)
1. A/B Testing
2. Advanced Marketing Tools
3. Custom Report Builder

---

## Technical Stack

**Frontend:**
- Next.js 14 (App Router)
- Ant Design Pro
- Refine Framework
- React Hook Form

**Backend:**
- NestJS API
- PostgreSQL
- Prisma ORM

**Third-party Services:**
- Cloud storage (for banners, documents)
- Push notification service
- Email service provider
- Map preview API

---

## Notes

- All features follow mobile app color theme (Turquoise #00ADB5)
- Consistent with Ant Design Pro styling
- Real-time data sync with backend API
- Responsive design for tablet/desktop
- Role-based access control for security
