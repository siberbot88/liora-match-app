import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LText } from '../ui/LText';
import { theme } from '../../theme/theme';

interface TeacherCardProps {
    id: string;
    name: string;
    subject: string;
    rating: number;
    avatar?: string;
    onPress?: () => void;
}

export function TeacherCard({ name, subject, rating, avatar, onPress }: TeacherCardProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            {/* Avatar protruding above card */}
            <View style={styles.avatarContainer}>
                {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <LText variant="xl" color={theme.colors.white} style={styles.avatarText}>
                            {name.charAt(0).toUpperCase()}
                        </LText>
                    </View>
                )}
            </View>

            {/* White Card Background */}
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    <LText variant="md" style={styles.name} numberOfLines={1}>
                        {name}
                    </LText>

                    <View style={styles.badge}>
                        <LText variant="sm" style={styles.badgeText} numberOfLines={1}>
                            {subject} ⭐ {rating.toFixed(1)}
                        </LText>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginRight: theme.spacing.md,
        width: 120,
        alignItems: 'center',
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: theme.colors.primary,
        zIndex: 2,
        marginBottom: -40, // Half of avatar overlaps card
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FF9966',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontFamily: theme.typography.weights.bold,
        fontSize: 28,
    },
    card: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.radii.xl,
        width: '100%',
        paddingTop: 48, // Space for half avatar
        paddingBottom: theme.spacing.sm,
        paddingHorizontal: theme.spacing.xs,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    cardContent: {
        alignItems: 'center',
    },
    name: {
        fontFamily: theme.typography.weights.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    badge: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radii.lg,
        paddingHorizontal: 12,
        paddingVertical: 8,
        width: '100%',
    },
    badgeText: {
        color: theme.colors.white,
        fontFamily: theme.typography.weights.semibold,
        textAlign: 'center',
        fontSize: 11,
    },
});
