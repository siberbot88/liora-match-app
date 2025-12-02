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

export function TeacherDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params as { id: string };
    const { data: teacher, isLoading } = useTeacherDetail(id);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
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
                    <Ionicons name="person" size={48} color="#007AFF" />
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
                        <Ionicons name="time" size={20} color="#007AFF" />
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
        backgroundColor: '#F9F9F9',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E5F1FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    education: {
        fontSize: 16,
        color: '#8E8E93',
        marginBottom: 16,
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statDivider: {
        width: 1,
        height: 20,
        backgroundColor: '#C7C7CC',
    },
    statText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3A3A3C',
    },
    section: {
        backgroundColor: '#FFFFFF',
        marginTop: 12,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 12,
    },
    bio: {
        fontSize: 15,
        lineHeight: 22,
        color: '#3A3A3C',
    },
    subjectCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        marginBottom: 8,
    },
    subjectIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    subjectName: {
        fontSize: 16,
        color: '#1C1C1E',
    },
    slotCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        marginBottom: 8,
    },
    slotDay: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1C1C1E',
    },
    slotTime: {
        fontSize: 14,
        color: '#8E8E93',
    },
    priceSection: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 4,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    bookButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 10,
    },
    bookButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
