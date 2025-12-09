import { PrismaClient, UserRole, TeachingType, Jenjang } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed process...\n');

    // 1. Create 6 Teachers
    const teachers = [];
    const teacherData = [
        {
            name: 'Dr. Sarah Mitchell',
            email: 'sarah.mitchell@liora.com',
            firebaseUid: 'seed-teacher-sarah',
            phone: '+6281234567801',
            bio: 'PhD in Mathematics Education with 15 years of teaching experience. Specializes in advanced calculus, algebra, and statistics. Has published multiple research papers on mathematics pedagogy.',
            hourlyRate: 250000,
            experience: 15,
            title: 'Ph.D',
            subjects: ['Matematika', 'Statistika']
        },
        {
            name: 'Prof. David Chen',
            email: 'david.chen@liora.com',
            firebaseUid: 'seed-teacher-david',
            phone: '+6281234567802',
            bio: 'Computer Science professor with expertise in web development and data structures. Former senior software engineer at major tech companies. Passionate about making programming accessible to everyone.',
            hourlyRate: 300000,
            experience: 12,
            title: 'M.Sc',
            subjects: ['Informatika', 'Pemrograman']
        },
        {
            name: 'Ms. Amanda Rodriguez',
            email: 'amanda.rodriguez@liora.com',
            firebaseUid: 'seed-teacher-amanda',
            phone: '+6281234567803',
            bio: 'Native English speaker with TESOL certification and 10 years of experience teaching English as a second language. Specialized in TOEFL preparation and academic writing. Former high school English teacher in the United States.',
            hourlyRate: 200000,
            experience: 10,
            title: 'B.A',
            subjects: ['Bahasa Inggris']
        },
        {
            name: 'Dr. Michael Thompson',
            email: 'michael.thompson@liora.com',
            firebaseUid: 'seed-teacher-michael',
            phone: '+6281234567804',
            bio: 'Physics doctorate with a passion for making complex concepts accessible to students. Specializes in mechanics, electromagnetism, and modern physics. Former university lecturer with extensive research background.',
            hourlyRate: 275000,
            experience: 14,
            title: 'Ph.D',
            subjects: ['Fisika']
        },
        {
            name: 'Mrs. Lisa Anderson',
            email: 'lisa.anderson@liora.com',
            firebaseUid: 'seed-teacher-lisa',
            phone: '+6281234567805',
            bio: 'Experienced chemistry educator with laboratory research background. Makes chemistry fun and practical through hands-on experiments. Specializes in organic chemistry and laboratory techniques.',
            hourlyRate: 225000,
            experience: 11,
            title: 'M.Sc',
            subjects: ['Kimia']
        },
        {
            name: 'Mr. James Wilson',
            email: 'james.wilson@liora.com',
            firebaseUid: 'seed-teacher-james',
            phone: '+6281234567806',
            bio: 'Biology teacher with field research experience in ecology and environmental science. Enthusiastic about nature and wildlife conservation. Makes biology engaging through real-world examples and case studies.',
            hourlyRate: 220000,
            experience: 9,
            title: 'M.Sc',
            subjects: ['Biologi', 'IPA']
        }
    ];

    for (const teacher of teacherData) {
        const user = await prisma.user.create({
            data: {
                name: teacher.name,
                email: teacher.email,
                firebaseUid: teacher.firebaseUid,
                phone: teacher.phone,
                role: UserRole.TEACHER,
            }
        });

        const teacherProfile = await prisma.teacherProfile.create({
            data: {
                userId: user.id,
                bio: teacher.bio,
                title: teacher.title,
                hourlyRate: teacher.hourlyRate,
                experience: teacher.experience,
                rating: Math.floor(Math.random() * 10 + 40) / 10,
                isVerified: true,
            }
        });

        teachers.push({ user, profile: teacherProfile, subjectNames: teacher.subjects });
        console.log(`Created teacher: ${teacher.name}`);
    }

    const allSubjects = await prisma.subject.findMany();

    for (let i = 0; i < teachers.length; i++) {
        const teacher = teachers[i];
        for (const subjectName of teacher.subjectNames) {
            const subject = allSubjects.find(s => s.name === subjectName);
            if (subject) {
                await prisma.teacherSubject.create({
                    data: {
                        teacherProfileId: teacher.profile.id,
                        subjectId: subject.id,
                    }
                });
            }
        }
    }

    console.log('');

    // 2. Create 10 Students
    const students = [];
    const studentData = [
        { name: 'Alice Johnson', email: 'alice.johnson@student.com', firebaseUid: 'seed-student-alice', phone: '+6281234560001', grade: 'Kelas 11', school: 'SMA Negeri 1 Jakarta' },
        { name: 'Brian Lee', email: 'brian.lee@student.com', firebaseUid: 'seed-student-brian', phone: '+6281234560002', grade: 'Kelas 12', school: 'SMA Negeri 8 Jakarta' },
        { name: 'Catherine Zhang', email: 'catherine.zhang@student.com', firebaseUid: 'seed-student-catherine', phone: '+6281234560003', grade: 'Kelas 10', school: 'SMA Labschool Kebayoran' },
        { name: 'Daniel Martinez', email: 'daniel.martinez@student.com', firebaseUid: 'seed-student-daniel', phone: '+6281234560004', grade: 'Kelas 12', school: 'SMA Santa Ursula BSD' },
        { name: 'Emma Williams', email: 'emma.williams@student.com', firebaseUid: 'seed-student-emma', phone: '+6281234560005', grade: 'Kelas 11', school: 'SMA Negeri 3 Jakarta' },
        { name: 'Felix Kumar', email: 'felix.kumar@student.com', firebaseUid: 'seed-student-felix', phone: '+6281234560006', grade: 'Kelas 10', school: 'SMA Budi Mulia Padu' },
        { name: 'Grace Tan', email: 'grace.tan@student.com', firebaseUid: 'seed-student-grace', phone: '+6281234560007', grade: 'Kelas 12', school: 'SMA Al-Azhar Kelapa Gading' },
        { name: 'Henry Park', email: 'henry.park@student.com', firebaseUid: 'seed-student-henry', phone: '+6281234560008', grade: 'Kelas 11', school: 'SMA Kanisius Jakarta' },
        { name: 'Isabella Santos', email: 'isabella.santos@student.com', firebaseUid: 'seed-student-isabella', phone: '+6281234560009', grade: 'Kelas 10', school: 'SMA Negeri 5 Jakarta' },
        { name: 'Jack Thompson', email: 'jack.thompson@student.com', firebaseUid: 'seed-student-jack', phone: '+6281234560010', grade: 'Kelas 12', school: 'SMA Pelita Harapan Tangerang' }
    ];

    for (const student of studentData) {
        const user = await prisma.user.create({
            data: {
                name: student.name,
                email: student.email,
                firebaseUid: student.firebaseUid,
                phone: student.phone,
                role: UserRole.STUDENT,
            }
        });

        await prisma.studentProfile.create({
            data: {
                userId: user.id,
                grade: student.grade,
                school: student.school,
            }
        });

        console.log(`Created student: ${student.name}`);
    }

    console.log('');

    // 3. Create 7 Courses/Classes
    const classData = [
        { title: 'Advanced Calculus and Mathematical Analysis', shortDesc: 'Comprehensive calculus course covering limits, derivatives, integrals, and applications.', longDesc: 'Comprehensive calculus course covering limits, derivatives, integrals, and applications. Perfect for students preparing for university-level mathematics. Includes practice problems and solutions.', subject: 'Matematika', teacherIndex: 0, jenjang: Jenjang.SMA, teachingType: TeachingType.ONLINE_COURSE, price: 899000, duration: 40, isPremium: true, certif: true },
        { title: 'Web Development Fundamentals', shortDesc: 'Learn to build modern websites from scratch.', longDesc: 'Learn to build modern websites from scratch. Covers HTML5, CSS3, JavaScript ES6, responsive design, and basic DOM manipulation. Projects included throughout the course.', subject: 'Informatika', teacherIndex: 1, jenjang: Jenjang.SMA, teachingType: TeachingType.ONLINE_COURSE, price: 1200000, duration: 60, isPremium: true, certif: true },
        { title: 'TOEFL Preparation Course', shortDesc: 'Intensive preparation for TOEFL iBT exam.', longDesc: 'Intensive preparation for TOEFL iBT exam covering all sections: Reading, Listening, Speaking, and Writing. Includes practice tests, personalized feedback, and test-taking strategies.', subject: 'Bahasa Inggris', teacherIndex: 2, jenjang: Jenjang.SMA, teachingType: TeachingType.ONLINE_PRIVATE, price: 250000, duration: 90, isPremium: false, certif: true },
        { title: 'Physics: Classical Mechanics', shortDesc: 'Master the principles of classical mechanics.', longDesc: 'Master the principles of classical mechanics including Newtons laws, energy, momentum, and rotational motion. Features practical examples from everyday life and engineering applications.', subject: 'Fisika', teacherIndex: 3, jenjang: Jenjang.SMA, teachingType: TeachingType.PUBLIC_LESSON, price: 150000, duration: 25, isPremium: false, certif: false },
        { title: 'Organic Chemistry Essentials', shortDesc: 'Introduction to organic chemistry.', longDesc: 'Introduction to organic chemistry covering hydrocarbons, functional groups, reactions, and nomenclature. Includes virtual lab demonstrations and real-world applications in medicine and industry.', subject: 'Kimia', teacherIndex: 4, jenjang: Jenjang.SMA, teachingType: TeachingType.ONLINE_COURSE, price: 750000, duration: 35, isPremium: true, certif: true },
        { title: 'Biology: Cell Structure and Function', shortDesc: 'Detailed study of cell biology.', longDesc: 'Detailed study of cell biology including cellular organelles, membrane transport, cellular respiration, and photosynthesis. Perfect for students preparing for university entrance exams.', subject: 'Biologi', teacherIndex: 5, jenjang: Jenjang.SMA, teachingType: TeachingType.TAKE_HOME, price: 0, duration: 20, isPremium: false, certif: true },
        { title: 'Data Structures and Algorithms', shortDesc: 'Learn fundamental data structures and algorithms in Python.', longDesc: 'Learn fundamental data structures including arrays, linked lists, trees, and graphs. Master algorithms for sorting, searching, and dynamic programming. All explained using Python with practical coding exercises.', subject: 'Informatika', teacherIndex: 1, jenjang: Jenjang.SMA, teachingType: TeachingType.ONLINE_PRIVATE, price: 350000, duration: 50, isPremium: true, certif: true }
    ];

    for (const classInfo of classData) {
        const teacher = teachers[classInfo.teacherIndex];

        await prisma.class.create({
            data: {
                title: classInfo.title,
                descriptionShort: classInfo.shortDesc,
                descriptionLong: classInfo.longDesc,
                subject: classInfo.subject,
                teacherProfileId: teacher.profile.id,
                jenjang: classInfo.jenjang,
                teachingType: classInfo.teachingType,
                price: classInfo.price,
                duration: classInfo.duration,
                isPremium: classInfo.isPremium,
                certificateAvailable: classInfo.certif,
                isPublished: true,
            }
        });

        console.log(`Created class: ${classInfo.title}`);
    }

    console.log('\n=================================');
    console.log('Seed completed successfully!');
    console.log('=================================\n');
    console.log('Summary:');
    console.log(`  - Teachers: ${teachers.length}`);
    console.log(`  - Students: ${studentData.length}`);
    console.log(`  - Classes: ${classData.length}`);
    console.log('');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
