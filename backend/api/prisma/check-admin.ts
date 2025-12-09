import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking for admin user...');

    const admin = await prisma.admin.findUnique({
        where: { email: 'admin@liora.com' },
    });

    if (admin) {
        console.log('✅ Admin found:', admin.email);
        console.log('ID:', admin.id);
        console.log('Role:', admin.role);
    } else {
        console.log('❌ Admin user NOT found');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
