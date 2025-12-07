import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    const adminEmail = 'admin@liora.com';
    const existingAdmin = await prisma.admin.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.admin.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: 'Super Admin',
                role: 'SUPER_ADMIN',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
            },
        });
        console.log(`Created super admin: ${adminEmail}`);
    } else {
        console.log(`Admin ${adminEmail} already exists.`);
    }

    // ========== SEED SAMPLE CLASSES ==========
    console.log('\nSeeding sample classes...');

    // 1. Create sample teacher user & profile
    const teacherEmail = 'rendi.pertama@liora.com';
    let teacher = await prisma.user.findUnique({
        where: { email: teacherEmail },
        include: { teacherProfile: true },
    });

    if (!teacher) {
        teacher = await prisma.user.create({
            data: {
                email: teacherEmail,
                firebaseUid: 'seed-teacher-rendi-001',
                name: 'Rendi Pertama',
                role: 'TEACHER',
                phone: '+6281234567890',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rendi',
                teacherProfile: {
                    create: {
                        bio: 'Guru Biologi berpengalaman 10+ tahun dengan spesialisasi di Biologi SMP & SMA. Lulusan S2 Pendidikan Biologi dari Universitas Indonesia.',
                        title: 'M.Pd',
                        experience: 10,
                        hourlyRate: 150000,
                        rating: 4.8,
                        totalReviews: 124,
                        isVerified: true,
                        country: 'Indonesia',
                        city: 'Jakarta',
                        education: [
                            {
                                degree: 'S2',
                                institution: 'Universitas Indonesia',
                                year: '2015-2017',
                                field: 'Pendidikan Biologi',
                            },
                            {
                                degree: 'S1',
                                institution: 'Universitas Negeri Jakarta',
                                year: '2010-2014',
                                field: 'Biologi',
                            },
                        ],
                        languages: ['Indonesian', 'English'],
                    },
                },
            },
            include: { teacherProfile: true },
        });
        console.log(`Created teacher: ${teacherEmail}`);
    } else {
        console.log(`Teacher ${teacherEmail} already exists`);
    }

    // 2. Create ONLINE_COURSE: Biologi SMP & SMA
    const onlineCourseTitle = 'Biologi SMP & SMA: Konsep Dasar & Latihan Soal bersama Rendi Pertama';
    let onlineCourse = await prisma.class.findFirst({
        where: { title: onlineCourseTitle },
    });

    if (!onlineCourse) {
        onlineCourse = await prisma.class.create({
            data: {
                teacherProfileId: teacher.teacherProfile!.id,
                title: onlineCourseTitle,
                subtitle: 'Bangun fondasi Biologi yang kuat dengan penjelasan sederhana, eksperimen ringan, dan latihan soal setara ujian sekolah',
                descriptionShort: 'Kursus ini dirancang untuk siswa SMP yang ingin mempelajari Biologi secara cuma menghafal. Rendi Pertama, guru IPA di Bimbel Prestasi Nusantara dan Biologi Pengalaman, akan membantu kamu mulai dari konsep dasar hingga latihan soal setara ujian sekolah. Setiap bab dilengkapi contoh sehari-hari, hari, eksperimen sederhana, dan latihan soal berahap agar konsep benar-benar melekat.',
                descriptionLong: `Kursus ini dirancang untuk siswa SMP yang ingin mempelajari Biologi secara mendalam tanpa hanya menghafal. Setiap bab dilengkapi dengan:
- Penjelasan konsep yang mudah dipahami
- Contoh dalam kehidupan sehari-hari
- Eksperimen sederhana yang aman dilakukan di rumah
- Latihan soal bertahap dari mudah hingga level ujian sekolah

Setelah menyelesaikan kursus ini, kamu akan menguasai konsep dasar Biologi dan siap menghadapi ujian dengan percaya diri.`,
                subject: 'Biologi',
                jenjang: 'SMP',
                levelRange: 'Semua Tingkat (SD akhir, SMP)',
                teachingType: 'ONLINE_COURSE',
                mainLanguage: 'Indonesian',
                captionAvailable: true,
                certificateAvailable: true,
                features: [
                    'Akses seumur hidup ke semua video & materi',
                    'Latihan soal & kuis interaktif',
                    'File PDF rangkuman per bab',
                    'Bisa diakses di mobile & desktop',
                ],
                isPublished: true,
                isPremium: false,
            },
        });
        console.log(`Created ONLINE_COURSE: ${onlineCourseTitle}`);

        // Create sections & lessons for online course
        const sections = [
            {
                title: 'Bagian 1: Pengantar Biologi',
                lessons: [
                    { title: 'Apa itu Biologi dan apa yang dipelajari?', duration: 4, type: 'VIDEO', previewable: true },
                    { title: 'Cabang-cabang ilmu Biologi', duration: 4, type: 'VIDEO', previewable: false },
                    { title: 'Metode ilmiah dalam Biologi', duration: 4, type: 'VIDEO', previewable: false },
                    { title: 'Biologi di kehidupan sehari-hari', duration: 4, type: 'VIDEO', previewable: false },
                    { title: 'Tips belajar Biologi agar tidak sekadar hafalan', duration: 3, type: 'VIDEO', previewable: false },
                ],
            },
            {
                title: 'Bagian 2: Ciri Makhluk Hidup & Tingkatan Organisasi',
                lessons: [
                    { title: 'Ciri-ciri makhluk hidup (MH)', duration: 5, type: 'VIDEO', previewable: false },
                    { title: 'Tingkatan organisasi kehidupan', duration: 6, type: 'VIDEO', previewable: false },
                    { title: 'Sel sebagai unit terkecil makhluk hidup', duration: 7, type: 'VIDEO', previewable: false },
                    { title: 'Organisasi sel, jaringan, organ, sistem organ', duration: 8, type: 'VIDEO', previewable: false },
                    { title: 'Latihan Soal: Ciri MH & Tingkatan Organisasi', duration: null, type: 'QUIZ', previewable: false },
                ],
            },
            {
                title: 'Bagian 3: Sel dan Struktur Dasarnya',
                lessons: [
                    { title: 'Struktur sel (prokariotik vs eukariotik)', duration: 8, type: 'VIDEO', previewable: false },
                    { title: 'Organel sel dan fungsinya', duration: 10, type: 'VIDEO', previewable: false },
                    { title: 'Perbedaan sel hewan dan sel tumbuhan', duration: 6, type: 'VIDEO', previewable: false },
                ],
            },
        ];

        for (let i = 0; i < sections.length; i++) {
            const sectionData = sections[i];
            const section = await prisma.classSection.create({
                data: {
                    classId: onlineCourse.id,
                    title: sectionData.title,
                    order: i + 1,
                },
            });

            for (let j = 0; j < sectionData.lessons.length; j++) {
                const lessonData = sectionData.lessons[j];
                await prisma.classLesson.create({
                    data: {
                        sectionId: section.id,
                        title: lessonData.title,
                        durationMinutes: lessonData.duration,
                        contentType: lessonData.type as any,
                        videoUrl: lessonData.type === 'VIDEO' ? `https://example.com/videos/biology-${i}-${j}.mp4` : null,
                        isPreviewable: lessonData.previewable,
                        order: j + 1,
                    },
                });
            }
        }
        console.log(`Created ${sections.length} sections with lessons`);
    } else {
        console.log(`ONLINE_COURSE already exists`);
    }

    // 3. Create TAKE_HOME class
    const takeHomeTitle = 'Matematika SMA: Paket Latihan Soal Intensif';
    let takeHomeClass = await prisma.class.findFirst({
        where: { title: takeHomeTitle },
    });

    if (!takeHomeClass) {
        takeHomeClass = await prisma.class.create({
            data: {
                teacherProfileId: teacher.teacherProfile!.id,
                title: takeHomeTitle,
                subtitle: 'Latihan soal Matematika SMA untuk persiapan ujian',
                descriptionShort: 'Paket latihan soal Matematika SMA yang bisa dikerjakan di rumah dengan pembahasan lengkap.',
                descriptionLong: 'Paket ini berisi kumpulan soal Matematika SMA dari berbagai topik yang dibutuhkan untuk persiapan ujian. Setiap soal dilengkapi dengan pembahasan detail.',
                subject: 'Matematika',
                jenjang: 'SMA',
                levelRange: 'Menengah - Lanjutan',
                teachingType: 'TAKE_HOME',
                mainLanguage: 'Indonesian',
                captionAvailable: false,
                certificateAvailable: false,
                features: ['PDF soal & pembahasan', 'Akses 6 bulan'],
                isPublished: true,
            },
        });
        console.log(`Created TAKE_HOME: ${takeHomeTitle}`);

        // Add resources for take-home class
        await prisma.classResource.create({
            data: {
                classId: takeHomeClass.id,
                type: 'FILE',
                title: 'Paket Soal Aljabar (50 soal)',
                description: 'Kumpulan soal aljabar dengan pembahasan lengkap',
                url: 'https://example.com/resources/math-algebra.pdf',
                order: 1,
            },
        });
        await prisma.classResource.create({
            data: {
                classId: takeHomeClass.id,
                type: 'FILE',
                title: 'Paket Soal Trigonometri (40 soal)',
                description: 'Soal-soal trigonometri tingkat SMA',
                url: 'https://example.com/resources/math-trigonometry.pdf',
                order: 2,
            },
        });
        console.log(`Created resources for TAKE_HOME class`);
    } else {
        console.log(`TAKE_HOME class already exists`);
    }

    // 4. Create sample student for enrollments
    const studentEmail = 'dina.p@student.liora.com';
    let student = await prisma.user.findUnique({
        where: { email: studentEmail },
        include: { studentProfile: true },
    });

    if (!student) {
        student = await prisma.user.create({
            data: {
                email: studentEmail,
                firebaseUid: 'seed-student-dina-001',
                name: 'Dina Permata',
                role: 'STUDENT',
                phone: '+6281298765432',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dina',
                studentProfile: {
                    create: {
                        grade: 'SMP Kelas 8',
                        school: 'SMPN 1 Jakarta',
                    },
                },
            },
            include: { studentProfile: true },
        });
        console.log(`Created student: ${studentEmail}`);
    } else {
        console.log(`Student already exists`);
    }

    // 5. Create enrollment & feedback for online course
    if (onlineCourse && student?.studentProfile) {
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                studentProfileId_classId: {
                    studentProfileId: student.studentProfile.id,
                    classId: onlineCourse.id,
                },
            },
        });

        if (!existingEnrollment) {
            await prisma.enrollment.create({
                data: {
                    studentProfileId: student.studentProfile.id,
                    classId: onlineCourse.id,
                    progressPercent: 35,
                },
            });
            console.log(`Created enrollment for ${student.name}`);

            // Add feedback
            await prisma.classFeedback.create({
                data: {
                    classId: onlineCourse.id,
                    studentProfileId: student.studentProfile.id,
                    rating: 5,
                    comment: 'Materi Biologi yang biasanya saya pusing jadi terasa lebih mudah dimengerti. Pak Ren dijelaskan pelan-pelan dan pakai contoh sehari-hari. Latihan soalnya mirip banget sama di ulangan di sekolah.',
                },
            });
            console.log(`Created feedback`);
        }
    }

    console.log('\n✅ Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
