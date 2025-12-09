import { PrismaClient, PaymentStatus } from '@prisma/client';
import { subDays, subMonths } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Transactions...');

    // 1. Get some existing bookings (or create if none)
    const bookings = await prisma.booking.findMany({
        take: 10,
        where: { status: 'CONFIRMED' }
    });

    if (bookings.length === 0) {
        console.log('⚠️ No confirmed bookings found. Please seed bookings first or create some manually.');
        // Optional: could create bookings here too, but keeping it simple for now
        return;
    }

    console.log(`Found ${bookings.length} bookings to attach transactions to.`);

    // 2. Create Transactions with mixed dates
    const transactionsData = [
        { amount: 150000, date: new Date(), status: PaymentStatus.PAID }, // Today
        { amount: 300000, date: new Date(), status: PaymentStatus.PAID }, // Today
        { amount: 200000, date: subDays(new Date(), 2), status: PaymentStatus.PAID }, // This Week
        { amount: 500000, date: subDays(new Date(), 5), status: PaymentStatus.PAID }, // This Week
        { amount: 1000000, date: subDays(new Date(), 20), status: PaymentStatus.PAID }, // This Month
        { amount: 750000, date: subMonths(new Date(), 2), status: PaymentStatus.PAID }, // Last Month (Past)
        { amount: 150000, date: new Date(), status: PaymentStatus.PENDING }, // Pending (should not count)
    ];

    for (const [index, data] of transactionsData.entries()) {
        // Cycle through bookings if we have more transactions than bookings
        const booking = bookings[index % bookings.length];

        // Check if transaction already exists for this booking to avoid unique constraint error
        const existing = await prisma.transaction.findUnique({
            where: { bookingId: booking.id }
        });

        if (existing) {
            console.log(`Skipping booking ${booking.id}, already has transaction.`);
            continue;
        }

        await prisma.transaction.create({
            data: {
                bookingId: booking.id,
                amount: data.amount,
                status: data.status,
                provider: 'manual_seed',
                providerRef: `SEED-${Math.random().toString(36).substring(7)}`,
                createdAt: data.date,
                updatedAt: data.date,
            },
        });
        console.log(`✅ Created ${data.status} transaction: Rp ${data.amount.toLocaleString()} for Booking ${booking.id}`);
    }

    console.log('🎉 Transaction Seeding Completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
