import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
import { theme } from '../../theme/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = 180; // Increased height to prevent cropping

const banners = [
    require('../../../assets/hero_promotion/hero_1.png'),
    require('../../../assets/hero_promotion/hero_2.png'),
    require('../../../assets/hero_promotion/hero_3.png'),
    require('../../../assets/hero_promotion/hero_4.png'),
];

export function HeroBanner() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % banners.length;
            setCurrentIndex(nextIndex);
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        }, 4000); // Auto-scroll every 4 seconds

        return () => clearInterval(interval);
    }, [currentIndex]);

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.bannerContainer}>
            <Image source={item} style={styles.banner} resizeMode="cover" />
        </View>
    );

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index || 0);
        }
    }).current;

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={banners}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + theme.spacing.md}
                decelerationRate="fast"
                contentContainerStyle={styles.listContent}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            />

            <View style={styles.dotsContainer}>
                {banners.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index && styles.activeDot,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    listContent: {
        paddingHorizontal: (width - CARD_WIDTH) / 2,
    },
    bannerContainer: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginHorizontal: theme.spacing.sm,
        borderRadius: theme.radii.lg,
        overflow: 'hidden',
    },
    banner: {
        width: '100%',
        height: '100%',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.md,
        gap: theme.spacing.xs,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.gray[300],
    },
    activeDot: {
        backgroundColor: theme.colors.primary,
        width: 24,
    },
});
