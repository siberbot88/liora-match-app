import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTeacherDetail } from '../../hooks/useTeachers';
import { theme } from '../../theme';

export function TeacherDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params as { id: string };
    const { data: teacher, isLoading } = useTeacherDetail(id);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!teacher) {
        return (
            <View style={styles.centered}>
                <Text>Guru tidak ditemukan</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={48} color={theme.colors.primary} />
                </View>
                <Text style={styles.name}>{teacher.user.name}</Text>
                <Text style={styles.education}>{teacher.education}</Text>

                <View style={styles.stats}>
                    <View style={styles.statItem}>
                        <Ionicons name="star" size={20} color="#FFD700" />
                        <Text style={styles.statText}>{teacher.rating.toFixed(1)}</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Ionicons name="time" size={20} color={theme.colors.primary} />
                        <Text style={styles.statText}>{teacher.experience} tahun</Text>
                    </View>
                </View>
            </View>

            {/* Bio */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tentang</Text>
                <Text style={styles.bio}>{teacher.bio}</Text>
            </View>

            {/* Subjects */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mata Pelajaran</Text>
                {teacher.subjects.map((ts) => (
                    <View key={ts.id} style={styles.subjectCard}>
                        <Text style={styles.subjectIcon}>{ts.subject.icon}</Text>
                        <Text style={styles.subjectName}>{ts.subject.name}</Text>
                    </View>
                ))}
            </View>

            {/* Availability */}
            {teacher.availabilitySlots && teacher.availabilitySlots.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Jadwal Tersedia</Text>
                    {teacher.availabilitySlots.slice(0, 3).map((slot) => (
                        <View key={slot.id} style={styles.slotCard}>
                            <Text style={styles.slotDay}>
                                {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][slot.dayOfWeek]}
                            </Text>
                            <Text style={styles.slotTime}>
                                {slot.startTime} - {slot.endTime}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Price */}
            <View style={styles.priceSection}>
                <View>
                    <Text style={styles.priceLabel}>Tarif per Jam</Text>
                    <Text style={styles.price}>
                        Rp {teacher.hourlyRate.toLocaleString('id-ID')}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => navigation.navigate('BookingForm', { teacher })}
                >
                    <Text style={styles.bookButtonText}>Booking Sekarang</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: theme.colors.white,
        padding: theme.spacing.xl,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    name: {
        fontSize: theme.typography.sizes['2xl'],
        fontFamily: theme.typography.weights.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    education: {
        fontSize: theme.typography.sizes.lg,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    statDivider: {
        width: 1,
        height: 20,
        backgroundColor: theme.colors.gray[300],
    },
    statText: {
        fontSize: theme.typography.sizes.lg,
        fontFamily: theme.typography.weights.semibold,
        color: theme.colors.secondary,
    },
    section: {
        backgroundColor: theme.colors.white,
        marginTop: theme.spacing.sm,
        padding: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: theme.typography.sizes.xl,
        fontFamily: theme.typography.weights.semibold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    bio: {
        fontSize: theme.typography.sizes.md,
        lineHeight: theme.typography.lineHeights.md,
        color: theme.colors.secondary,
    },
    subjectCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.background,
        borderRadius: theme.radii.md,
        marginBottom: theme.spacing.sm,
    },
    subjectIcon: {
        fontSize: theme.typography.sizes['2xl'],
        marginRight: theme.spacing.sm,
    },
    subjectName: {
        fontSize: theme.typography.sizes.lg,
        color: theme.colors.text,
    },
    slotCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.background,
        borderRadius: theme.radii.md,
        marginBottom: theme.spacing.sm,
    },
    slotDay: {
        fontSize: theme.typography.sizes.md,
        fontFamily: theme.typography.weights.medium,
        color: theme.colors.text,
    },
    slotTime: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textSecondary,
    },
    priceSection: {
        backgroundColor: theme.colors.white,
        padding: theme.spacing.lg,
        marginTop: theme.spacing.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    price: {
        fontSize: theme.typography.sizes['2xl'],
        fontFamily: theme.typography.weights.bold,
        color: theme.colors.primary,
    },
    bookButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radii.md,
    },
    bookButtonText: {
        color: theme.colors.white,
        fontSize: theme.typography.sizes.lg,
        fontFamily: theme.typography.weights.semibold,
    },
});
