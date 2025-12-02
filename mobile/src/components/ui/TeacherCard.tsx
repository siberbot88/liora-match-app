import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { LText } from './LText';
import { SubjectChip } from './SubjectChip';

export interface TeacherCardProps {
    name: string;
    avatarUrl?: string | null;
    subjects: string[];
    rating: number;
    reviewCount?: number;
    hourlyRate: number;
    onPress?: () => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
    name,
    avatarUrl,
    subjects,
    rating,
    reviewCount,
    hourlyRate,
    onPress
}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    {avatarUrl ? (
                        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <LText variant="xl" color={theme.colors.primary}>
                                {name.charAt(0).toUpperCase()}
                            </LText>
                        </View>
                    )}
                </View>

                {/* Info */}
                <View style={styles.infoContainer}>
                    <View style={styles.nameRow}>
                        <LText variant="lg" style={styles.name}>{name}</LText>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <LText variant="sm" style={styles.ratingText}>
                                {rating.toFixed(1)}
                                {reviewCount ? ` (${reviewCount})` : ''}
                            </LText>
                        </View>
                    </View>

                    <LText variant="sm" color={theme.colors.gray[500]} style={styles.rate}>
                        Rp {hourlyRate.toLocaleString('id-ID')}/jam
                    </LText>
                </View>
            </View>

            {/* Subjects */}
            <View style={styles.subjectsContainer}>
                {subjects.slice(0, 3).map((subject, index) => (
                    <SubjectChip key={index} label={subject} />
                ))}
                {subjects.length > 3 && (
                    <LText variant="sm" color={theme.colors.gray[500]} style={{ alignSelf: 'center', marginLeft: 4 }}>
                        +{subjects.length - 3}
                    </LText>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.radii.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        // Minimal shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        marginBottom: theme.spacing.md,
    },
    avatarContainer: {
        marginRight: theme.spacing.md,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28, // Circular
    },
    avatarPlaceholder: {
        backgroundColor: theme.colors.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    name: {
        fontFamily: theme.typography.weights.semibold,
        flex: 1,
        marginRight: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.gray[100],
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: theme.radii.sm,
    },
    ratingText: {
        marginLeft: 4,
        fontFamily: theme.typography.weights.medium,
    },
    rate: {
        marginTop: 2,
    },
    subjectsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    }
});
