import React from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTeachers } from '../../hooks/useTeachers';
import { LText, LButton } from '../../components/ui';
import { theme } from '../../theme';
import { HomeStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export function TeacherListScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { data, isLoading, error, refetch } = useTeachers();

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <LText variant="md" color={theme.colors.textSecondary} style={styles.loadingText}>
                    Memuat daftar guru...
                </LText>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <LText variant="lg" color={theme.colors.error} style={styles.errorText}>
                    Gagal memuat data
                </LText>
                <LText variant="md" color={theme.colors.textSecondary} style={styles.errorSubtext}>
                    {error.message || 'Terjadi kesalahan'}
                </LText>
                <LButton
                    title="Coba Lagi"
                    variant="primary"
                    onPress={() => refetch()}
                    style={styles.retryButton}
                />
            </View>
        );
    }

    const teachers = data?.data || [];

    return (
        <View style={styles.container}>
            <FlatList
                data={teachers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('TeacherDetail', { id: item.id })}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.avatar}>
                                <LText variant="xl" color={theme.colors.primary}>
                                    {item.user.name.charAt(0).toUpperCase()}
                                </LText>
                            </View>
                            <View style={styles.cardInfo}>
                                <LText variant="lg" style={{ fontFamily: theme.typography.weights.semibold }}>
                                    {item.user.name}
                                </LText>
                                <LText variant="sm" color={theme.colors.textSecondary} numberOfLines={1}>
                                    {item.education}
                                </LText>
                            </View>
                        </View>

                        <LText variant="sm" numberOfLines={2} style={styles.bio}>
                            {item.bio}
                        </LText>

                        <View style={styles.subjects}>
                            {item.subjects.slice(0, 3).map((ts) => (
                                <View key={ts.id} style={styles.badge}>
                                    <LText variant="sm" color={theme.colors.primary}>
                                        {`${ts.subject.icon} ${ts.subject.name}`}
                                    </LText>
                                </View>
                            ))}
                        </View>

                        <View style={styles.cardFooter}>
                            <View style={styles.rating}>
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <LText variant="sm" style={styles.ratingText}>
                                    {item.rating.toFixed(1)} ({item.totalReviews})
                                </LText>
                            </View>
                            <LText variant="md" style={{ fontFamily: theme.typography.weights.semibold }} color={theme.colors.primary}>
                                Rp {item.hourlyRate.toLocaleString('id-ID')}/jam
                            </LText>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Ionicons name="school" size={64} color={theme.colors.border} />
                        <LText variant="md" color={theme.colors.textSecondary} style={styles.emptyText}>
                            Belum ada guru tersedia
                        </LText>
                    </View>
                }
                contentContainerStyle={teachers.length === 0 ? styles.emptyContainer : undefined}
            />
        </View>
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
        padding: theme.spacing.xl,
    },
    loadingText: {
        marginTop: theme.spacing.lg,
    },
    errorText: {
        marginTop: theme.spacing.lg,
    },
    errorSubtext: {
        marginTop: theme.spacing.sm,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: theme.spacing.xl,
    },
    card: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.radii.lg,
        padding: theme.spacing.md,
        marginHorizontal: theme.spacing.lg,
        marginVertical: theme.spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.md,
    },
    cardInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    bio: {
        marginBottom: theme.spacing.md,
        lineHeight: 20,
        color: theme.colors.secondary,
    },
    subjects: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    badge: {
        backgroundColor: `${theme.colors.primary}26`,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: theme.radii.full,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    ratingText: {
        marginLeft: theme.spacing.xs,
    },
    emptyContainer: {
        flex: 1,
    },
    emptyText: {
        marginTop: theme.spacing.lg,
    },
});
