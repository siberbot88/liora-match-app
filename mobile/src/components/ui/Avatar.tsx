/**
 * Avatar Component - Liora Design System
 * User avatar with image, initials, or icon fallback
 */

import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { Text } from './Typography';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
    size?: AvatarSize;
    source?: ImageSourcePropType | string;
    name?: string;
    style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
    size = 'md',
    source,
    name,
    style,
}) => {
    const sizeStyle = getSizeStyle(size);
    const initials = name ? getInitials(name) : '';

    const imageSource = typeof source === 'string' ? { uri: source } : source;

    return (
        <View style={[styles.container, sizeStyle.container, style]}>
            {imageSource ? (
                <Image source={imageSource} style={styles.image} />
            ) : name ? (
                <Text
                    variant="body"
                    weight="semibold"
                    color={colors.primary}
                    style={sizeStyle.text}
                >
                    {initials}
                </Text>
            ) : (
                <Ionicons name="person" size={sizeStyle.iconSize} color={colors.primary} />
            )}
        </View>
    );
};

const getSizeStyle = (size: AvatarSize) => {
    switch (size) {
        case 'sm':
            return {
                container: { width: 32, height: 32 },
                text: { fontSize: 12 },
                iconSize: 16,
            };
        case 'md':
            return {
                container: { width: 48, height: 48 },
                text: { fontSize: 18 },
                iconSize: 24,
            };
        case 'lg':
            return {
                container: { width: 64, height: 64 },
                text: { fontSize: 24 },
                iconSize: 32,
            };
        case 'xl':
            return {
                container: { width: 96, height: 96 },
                text: { fontSize: 36 },
                iconSize: 48,
            };
        default:
            return {
                container: { width: 48, height: 48 },
                text: { fontSize: 18 },
                iconSize: 24,
            };
    }
};

const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const styles = StyleSheet.create({
    container: {
        borderRadius: radius.full,
        backgroundColor: colors.primaryLight + '20', // 20% opacity
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});
