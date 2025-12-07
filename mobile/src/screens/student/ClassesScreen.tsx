import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LContainer } from '../../components/ui/LContainer';
import { LText } from '../../components/ui/LText';
import { theme } from '../../theme/theme';

export function ClassesScreen() {
    return (
        <LContainer style={styles.container}>
            <LText variant="2xl" color={theme.colors.primary} style={styles.title}>
                Classes
            </LText>
            <LText variant="md" color={theme.colors.gray[600]}>
                My classes will appear here...
            </LText>
        </LContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    title: {
        marginBottom: theme.spacing.md,
        fontFamily: theme.typography.weights.bold,
    },
});
