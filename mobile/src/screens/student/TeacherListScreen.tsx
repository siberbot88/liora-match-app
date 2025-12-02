import React from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTeachers } from '../../hooks/useTeachers';
import { Card, Text, Avatar, Badge, Button } from '../../components/ui';
import { theme } from '../../theme';

export function TeacherListScreen() {
    const navigation = useNavigation();
    const { data, isLoading, error, refetch } = useTeachers();

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text variant="body" color={theme.colors.textSecondary} style={styles.loadingText}>
                    Memuat daftar guru...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
                <Text variant="body" weight="semibold" style={styles.errorText}>
                    Gagal memuat data
                </Text>
                <Text variant="bodySmall" color={theme.colors.textSecondary} style={styles.errorSubtext}>
                    {error.message}
                </Text>
                <Button variant="primary" onPress={() => refetch()} style={styles.retryButton}>
                    Coba Lagi
                </Button>
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
                    <Card
                        variant="elevated"
                        padding="md"
                        style={styles.card}
                        onPress={() => navigation.navigate('TeacherDetail', { id: item.id })}
                    >
                        <View style={styles.cardHeader}>
                            <Avatar name={item.user.name} size="lg" />
                            <View style={styles.cardInfo}>
                                <Text variant="body" weight="semibold">
                                    {item.user.name}
                                </Text>
                                <Text variant="bodySmall" color={theme.colors.textSecondary} numberOfLines={1}>
                                    {item.education}
                                </Text>
                            </View>
                        </View>

                        <Text variant="bodySmall" color={theme.colors.text} numberOfLines={2} style={styles.bio}>
                            {item.bio}
                        </Text>

                        <View style={styles.subjects}>
                            {item.subjects.slice(0, 3).map((ts) => (
                                <Badge key={ts.id} variant="neutral" size="sm">
                                    {`${ts.subject.icon} ${ts.subject.name}`}
                                </Badge>
                            ))}
                        </View>

                        <View style={styles.cardFooter}>
                            <View style={styles.rating}>
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Text variant="bodySmall" style={styles.ratingText}>
                                    {item.rating.toFixed(1)} ({item.totalReviews})
                                </Text>
                            </View>
                            <Text variant="body" weight="semibold" color={theme.colors.primary}>
                                Rp {item.hourlyRate.toLocaleString('id-ID')}/jam
                            </Text>
                        </View>
                    </Card>
                )}
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Ionicons name="school" size={64} color={theme.colors.border} />
                        <Text variant="body" color={theme.colors.textSecondary} style={styles.emptyText}>
                            Belum ada guru tersedia
                        </Text>
                    </View>
                }
                contentContainerStyle={teachers.length === 0 && styles.emptyContainer}
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
        marginHorizontal: theme.spacing.lg,
        marginVertical: theme.spacing.sm,
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
    },
    subjects: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm,
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
