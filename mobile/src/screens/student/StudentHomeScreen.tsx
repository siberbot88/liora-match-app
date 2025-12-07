import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    StatusBar,
    RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LText } from '../../components/ui/LText';
import { LevelCard } from '../../components/home/LevelCard';
import { TeacherCard } from '../../components/home/TeacherCard';
import { ClassCard } from '../../components/home/ClassCard';
import { SubjectGrid } from '../../components/home/SubjectGrid';
import { HeroBanner } from '../../components/home/HeroBanner';
import { theme } from '../../theme/theme';
import { dashboardApi, StudentDashboard, Subject, Banner } from '../../api/dashboard';

// Mock data - will be replaced with API calls
const mockTeachers = [
    { id: '1', name: 'Joni David', subject: 'Seni Rupa', rating: 4.8 },
    { id: '2', name: 'Elias Syah..', subject: 'Fisika Das..', rating: 4.8 },
    { id: '3', name: 'Kadir Alam', subject: 'Renang', rating: 4.8 },
    { id: '4', name: 'Herman', subject: 'Matematika', rating: 4.9 },
];

const mockClasses = [
    { id: '1', title: 'FISIKA | LIORA', subject: 'FISIKA | LIORA' },
    { id: '2', title: 'MATEMATIKA DASAR', subject: 'MATEMATIKA DASAR' },
];


export function StudentHomeScreen() {
    // State management
    const [dashboard, setDashboard] = useState<StudentDashboard | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            const [dashboardData, subjectsData, bannersData] = await Promise.all([
                dashboardApi.getStudentDashboard(),
                dashboardApi.getSubjects(),
                dashboardApi.getBanners('HERO'),
            ]);

            setDashboard(dashboardData);
            setSubjects(subjectsData);
            setBanners(bannersData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Fallback to mock data if API fails
            setDashboard({
                level: 1,
                levelName: 'Level 1',
                tier: 'Free',
                points: 500,
                nextLevelPoints: 500,
                progressPercentage: 50,
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Load data on mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Pull to refresh handler
    const onRefresh = () => {
        setRefreshing(true);
        fetchDashboardData();
    };

    // Show loading state
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <LText variant="lg">Loading...</LText>
                </View>
            </SafeAreaView>
        );
    }
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 18) return 'Selamat Siang';
        return 'Selamat Malam';
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

            {/* Header with Gradient Background */}
            <LinearGradient
                colors={[theme.colors.primary, theme.colors.primary]}
                style={styles.header}
            >
                <SafeAreaView>
                    <View style={styles.headerContent}>
                        <View>
                            <LText variant="sm" style={styles.greeting}>
                                {getGreeting()}
                            </LText>
                            <LText variant="xl" style={styles.userName}>
                                Indra Frimawan
                            </LText>
                        </View>

                        <View style={styles.headerIcons}>
                            <TouchableOpacity style={styles.iconButton}>
                                <Ionicons name="notifications-outline" size={24} color={theme.colors.white} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <Ionicons name="cart-outline" size={24} color={theme.colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Level Card - Using Real API Data */}
                    <LevelCard
                        level={dashboard?.level || 1}
                        levelName={dashboard?.levelName || 'Level 1'}
                        tier={dashboard?.tier || 'Free'}
                        points={dashboard?.points || 0}
                    />
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Popular Teachers Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <LText variant="lg" style={styles.sectionTitle}>
                            Guru Terpopuler
                        </LText>
                        <TouchableOpacity>
                            <LText variant="sm" color={theme.colors.primary} style={styles.seeAll}>
                                Lainnya
                            </LText>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={mockTeachers}
                        renderItem={({ item }) => <TeacherCard {...item} />}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                    />
                </View>

                {/* Popular Classes Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <LText variant="lg" style={styles.sectionTitle}>
                            Pelajaran Terpopuler
                        </LText>
                        <TouchableOpacity>
                            <LText variant="sm" color={theme.colors.primary} style={styles.seeAll}>
                                Lainnya
                            </LText>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={mockClasses}
                        renderItem={({ item }) => <ClassCard {...item} />}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                    />
                </View>

                {/* Subject Grid Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <LText variant="lg" style={styles.sectionTitle}>
                            Minat dan Bakat
                        </LText>
                        <TouchableOpacity>
                            <LText variant="sm" color={theme.colors.primary} style={styles.seeAll}>
                                Lainnya
                            </LText>
                        </TouchableOpacity>
                    </View>

                    <SubjectGrid />
                </View>

                {/* Hero Banner */}
                <HeroBanner />

                {/* Bottom padding for tab bar */}
                <View style={{ height: 32 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingBottom: theme.spacing.lg,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        marginTop: theme.spacing.md,
    },
    greeting: {
        color: theme.colors.white,
        opacity: 0.9,
        marginBottom: 4,
    },
    userName: {
        color: theme.colors.white,
        fontFamily: theme.typography.weights.bold,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: theme.spacing.lg,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontFamily: theme.typography.weights.bold,
        color: theme.colors.text,
    },
    seeAll: {
        fontFamily: theme.typography.weights.semibold,
    },
    horizontalList: {
        paddingHorizontal: theme.spacing.lg,
    },
});
