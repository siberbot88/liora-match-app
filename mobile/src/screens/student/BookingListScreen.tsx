import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMyBookings } from '../../hooks/useBookings';

const STATUS_COLORS = {
    PENDING: '#FF9500',
    CONFIRMED: '#34C759',
    CANCELLED: '#FF3B30',
    COMPLETED: '#8E8E93',
};

const STATUS_LABELS = {
    PENDING: 'Menunggu',
    CONFIRMED: 'Dikonfirmasi',
    CANCELLED: 'Dibatalkan',
    COMPLETED: 'Selesai',
};

export function BookingListScreen() {
    const { data: bookings, isLoading, error, refetch } = useMyBookings();

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Memuat jadwal...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Ionicons name="alert-circle" size={48} color="#FF3B30" />
                <Text style={styles.errorText}>Gagal memuat data</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
                    <Text style={styles.retryText}>Coba Lagi</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={bookings || []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {/* Header */}
                        <View style={styles.cardHeader}>
                            <View style={styles.teacherInfo}>
                                <Text style={styles.teacherName}>
                                    {item.teacher?.user.name || 'Unknown'}
                                </Text>
                                <Text style={styles.subject}>
                                    {item.subject?.name || 'Subject'}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.statusBadge,
                                    { backgroundColor: STATUS_COLORS[item.status] + '20' },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.statusText,
                                        { color: STATUS_COLORS[item.status] },
                                    ]}
                                >
                                    {STATUS_LABELS[item.status]}
                                </Text>
                            </View>
                        </View>

                        {/* Details */}
                        <View style={styles.details}>
                            <View style={styles.detailRow}>
                                <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
                                <Text style={styles.detailText}>
                                    {new Date(item.scheduledAt).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Ionicons name="time-outline" size={16} color="#8E8E93" />
                                <Text style={styles.detailText}>
                                    {new Date(item.scheduledAt).toLocaleTimeString('id-ID', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })} ({item.duration} menit)
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Ionicons
                                    name={item.mode === 'ONLINE' ? 'videocam-outline' : 'location-outline'}
                                    size={16}
                                    color="#8E8E93"
                                />
                                <Text style={styles.detailText}>
                                    {item.mode === 'ONLINE' ? 'Online' : 'Offline'}
                                </Text>
                            </View>
                        </View>

                        {/* Footer */}
                        <View style={styles.cardFooter}>
                            <Text style={styles.price}>
                                Rp {item.totalPrice.toLocaleString('id-ID')}
                            </Text>
                            {item.status === 'PENDING' && (
                                <TouchableOpacity style={styles.cancelButton}>
                                    <Text style={styles.cancelText}>Batalkan</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="calendar" size={64} color="#C7C7CC" />
                        <Text style={styles.emptyTitle}>Belum ada jadwal</Text>
                        <Text style={styles.emptySubtitle}>
                            Booking kelas pertamamu sekarang!
                        </Text>
                    </View>
                }
                contentContainerStyle={!bookings?.length && styles.emptyContainer}
            />
        </View>
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
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#8E8E93',
    },
    errorText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    retryButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#007AFF',
        borderRadius: 8,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    teacherInfo: {
        flex: 1,
    },
    teacherName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    subject: {
        fontSize: 14,
        color: '#8E8E93',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        height: 28,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    details: {
        marginBottom: 12,
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#3A3A3C',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    cancelButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    cancelText: {
        color: '#FF3B30',
        fontSize: 14,
        fontWeight: '600',
    },
    empty: {
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyContainer: {
        flex: 1,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1C1E',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 8,
    },
});
