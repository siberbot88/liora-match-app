import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Resetting admin password...');

    // Hash password "admin123"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = await prisma.admin.update({
        where: { email: 'admin@liora.com' },
        data: {
            password: hashedPassword,
        },
    });

    console.log('✅ Admin password has been reset to: admin123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
