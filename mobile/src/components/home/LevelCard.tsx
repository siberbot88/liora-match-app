import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { LText } from '../ui/LText';
import { theme } from '../../theme/theme';

interface LevelCardProps {
    level: number;
    levelName: string;
    tier: string;
    points: number;
}

export function LevelCard({ level, levelName, tier, points }: LevelCardProps) {
    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={require('../../../assets/icon.png')}
                        style={styles.avatar}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.levelInfo}>
                    <LText variant="md" style={styles.levelText}>
                        {levelName}
                    </LText>
                    <LText variant="sm" style={styles.tierText}>
                        {tier}
                    </LText>
                </View>
            </View>

            <View style={styles.pointsSection}>
                <LText variant="sm" style={styles.pointsLabel}>
                    Poin belajar
                </LText>
                <LText variant="xl" style={styles.pointsValue}>
                    {points}
                </LText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: theme.radii.xl,
        padding: theme.spacing.md,
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    avatar: {
        width: 40,
        height: 40,
    },
    levelInfo: {
        flex: 1,
    },
    levelText: {
        fontFamily: theme.typography.weights.bold,
        color: theme.colors.white,
        marginBottom: 2,
    },
    tierText: {
        fontFamily: theme.typography.weights.medium,
        color: theme.colors.white,
        opacity: 0.9,
    },
    pointsSection: {
        alignItems: 'flex-end',
    },
    pointsLabel: {
        color: theme.colors.white,
        opacity: 0.9,
        marginBottom: 2,
    },
    pointsValue: {
        fontFamily: theme.typography.weights.bold,
        color: theme.colors.white,
    },
});
