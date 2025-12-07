import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { LText } from '../ui/LText';
import { theme } from '../../theme/theme';

interface Subject {
    id: string;
    name: string;
    icon: any;
}

// Subjects mapped to icons in assets/learn_icon
const subjects: Subject[] = [
    { id: '1', name: 'Geografi', icon: require('../../../assets/learn_icon/geografi.png') },
    { id: '2', name: 'Biologi', icon: require('../../../assets/learn_icon/Biologi.png') },
    { id: '3', name: 'Kimia', icon: require('../../../assets/learn_icon/Kimia.png') },
    { id: '4', name: 'PKN', icon: require('../../../assets/learn_icon/PKN.png') },
    { id: '5', name: 'Sejarah', icon: require('../../../assets/learn_icon/sejarah.png') },
    { id: '6', name: 'Matematika', icon: require('../../../assets/learn_icon/Matematika.png') },
    { id: '7', name: 'Ekonomi', icon: require('../../../assets/learn_icon/Ekonomi.png') },
    { id: '8', name: 'Fisika', icon: require('../../../assets/learn_icon/Fisika.png') },
    { id: '9', name: 'Komputer', icon: require('../../../assets/learn_icon/TIK.png') },
    { id: '10', name: 'B. Indonesia', icon: require('../../../assets/learn_icon/Bahasa Indonesia.png') },
];

interface SubjectGridProps {
    onSubjectPress?: (subject: Subject) => void;
}

export function SubjectGrid({ onSubjectPress }: SubjectGridProps) {
    const renderItem = ({ item }: { item: Subject }) => (
        <TouchableOpacity
            style={styles.subjectItem}
            onPress={() => onSubjectPress?.(item)}
        >
            <View style={styles.iconCircle}>
                <Image source={item.icon} style={styles.icon} resizeMode="contain" />
            </View>
            <LText variant="sm" style={styles.subjectName} numberOfLines={2}>
                {item.name}
            </LText>
        </TouchableOpacity>
    );

    return (
        <View style={styles.cardContainer}>
            <FlatList
                data={subjects}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={5}
                scrollEnabled={false}
                contentContainerStyle={styles.grid}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.radii.xl,
        marginHorizontal: theme.spacing.lg,
        padding: theme.spacing.md,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    grid: {
        paddingVertical: theme.spacing.xs,
    },
    subjectItem: {
        width: '20%',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    icon: {
        width: 36,
        height: 36,
    },
    subjectName: {
        textAlign: 'center',
        color: theme.colors.text,
        fontFamily: theme.typography.weights.medium,
        fontSize: 9,
    },
});
