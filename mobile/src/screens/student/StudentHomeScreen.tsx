import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { useTeachers } from '../../hooks/useTeachers';

export function StudentHomeScreen() {
    const navigation = useNavigation();
    const user = useAuthStore(state => state.user);

    // Fetch recommended teachers (top 3)
    const { data: teachersData, isLoading: teachersLoading } = useTeachers({ limit: 3 });
    const recommendedTeachers = teachersData?.data?.slice(0, 3) || [];

    const menuItems = [
        {
            icon: 'search',
            title: 'Cari Guru',
            subtitle: 'Temukan guru terbaik',
            color: '#007AFF',
            onPress: () => navigation.navigate('TeacherList'),
        },
        {
            icon: 'calendar',
            title: 'Jadwal Saya',
            subtitle: 'Lihat jadwal belajar',
            color: '#34C759',
            onPress: () => navigation.navigate('Bookings'),
        },
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Halo,</Text>
                    <Text style={styles.userName}>{user?.name || 'Siswa'}</Text>
                </View>
                <TouchableOpacity style={styles.avatarContainer}>
                    <Ionicons name="person-circle" size={48} color="#007AFF" />
                </TouchableOpacity>
            </View>

            {/* Menu Cards */}
            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.menuCard, { borderLeftColor: item.color }]}
                        onPress={item.onPress}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                            <Ionicons name={item.icon as any} size={32} color={item.color} />
                        </View>
                        <View style={styles.menuText}>
                            <Text style={styles.menuTitle}>{item.title}</Text>
                            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
                <Text style={styles.sectionTitle}>Statistik</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Total Kelas</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Jam Belajar</Text>
                    </View>
                </View>
            </View>

            {/* Recommended Teachers */}
            {!teachersLoading && recommendedTeachers.length > 0 && (
                <View style={styles.recommendedContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Guru Rekomendasi</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('TeacherList')}>
                            <Text style={styles.viewAllText}>Lihat Semua</Text>
                        </TouchableOpacity>
                    </View>
                    {recommendedTeachers.map((teacher) => (
                        <TouchableOpacity
                            key={teacher.id}
                            style={styles.teacherCard}
                            onPress={() => navigation.navigate('TeacherDetail', { id: teacher.id })}
                        >
                            <View style={styles.teacherAvatar}>
                                <Ionicons name="person" size={24} color="#007AFF" />
                            </View>
                            <View style={styles.teacherInfo}>
                                <Text style={styles.teacherName}>{teacher.user.name}</Text>
                                <Text style={styles.teacherSubject}>
                                    {teacher.subjects[0]?.subject.icon} {teacher.subjects[0]?.subject.name}
                                </Text>
                            </View>
                            <View style={styles.teacherRating}>
                                <Ionicons name="star" size={14} color="#FFD700" />
                                <Text style={styles.ratingText}>{teacher.rating.toFixed(1)}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    greeting: {
        fontSize: 16,
        color: '#8E8E93',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1C1C1E',
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        padding: 16,
    },
    menuCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuText: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    menuSubtitle: {
        fontSize: 14,
        color: '#8E8E93',
    },
    statsContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#8E8E93',
    },
    recommendedContainer: {
        padding: 16,
        paddingBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    viewAllText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
    teacherCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    teacherAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E5F1FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    teacherInfo: {
        flex: 1,
    },
    teacherName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 2,
    },
    teacherSubject: {
        fontSize: 13,
        color: '#8E8E93',
    },
    teacherRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    ratingText: {
        fontSize: 13,
        color: '#3A3A3C',
        fontWeight: '500',
    },
});
