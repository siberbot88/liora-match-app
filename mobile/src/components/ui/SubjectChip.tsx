import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';
import { LText } from './LText';

export interface SubjectChipProps {
    label: string;
}

export const SubjectChip: React.FC<SubjectChipProps> = ({ label }) => {
    return (
        <View style={styles.container}>
            <LText
                variant="sm"
                style={styles.text}
            >
                {label}
            </LText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: `${theme.colors.primary}26`, // 15% opacity (approx 26 in hex)
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: theme.radii.full,
        alignSelf: 'flex-start',
        marginRight: 6,
        marginBottom: 6,
    },
    text: {
        color: theme.colors.primary,
        fontFamily: theme.typography.weights.medium,
    }
});
