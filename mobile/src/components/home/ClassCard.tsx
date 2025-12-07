import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LText } from '../ui/LText';
import { theme } from '../../theme/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.65;

interface ClassCardProps {
    id: string;
    title: string;
    subject: string;
    thumbnail?: string;
    onPress?: () => void;
}

export function ClassCard({ title, subject, thumbnail, onPress }: ClassCardProps) {
    // Select thumbnail based on subject
    const getThumbnail = () => {
        if (thumbnail) return { uri: thumbnail };
        if (title.includes('FISIKA') || subject.includes('FISIKA')) {
            return require('../../../assets/thumbnail_class/fisika.png');
        }
        if (title.includes('MATEMATIKA') || subject.includes('MATEMATIKA')) {
            return require('../../../assets/thumbnail_class/matematika.png');
        }
        return require('../../../assets/thumbnail_class/matematika.png');
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image
                source={getThumbnail()}
                style={styles.thumbnail}
                resizeMode="cover"
            />
            <View style={styles.badge}>
                <LText variant="sm" style={styles.badgeText}>
                    {subject}
                </LText>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        height: 140,
        borderRadius: theme.radii.lg,
        overflow: 'hidden',
        marginRight: theme.spacing.md,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    badge: {
        position: 'absolute',
        bottom: theme.spacing.sm,
        left: theme.spacing.sm,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radii.full,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
    },
    badgeText: {
        color: theme.colors.white,
        fontFamily: theme.typography.weights.bold,
        textTransform: 'uppercase',
        fontSize: 10,
    },
});
