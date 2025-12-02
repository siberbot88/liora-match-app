import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { LContainer } from '../../components/ui/LContainer';
import { LText } from '../../components/ui/LText';
import { LButton } from '../../components/ui/LButton';
import { theme } from '../../theme/theme';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'RoleSelection'>;

interface RoleCardProps {
    title: string;
    imagePlaceholder: string;
    selected: boolean;
    onPress: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ title, imagePlaceholder, selected, onPress }) => (
    <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <View style={styles.cardImagePlaceholder}>
            <LText variant="sm" color={theme.colors.gray[500]}>{imagePlaceholder}</LText>
        </View>
        <LText variant="lg" style={styles.cardTitle}>{title}</LText>
    </TouchableOpacity>
);

const { width } = Dimensions.get('window');

export function RoleSelectionScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'PARENT' | 'TEACHER' | null>(null);

    const handleContinue = () => {
        if (selectedRole) {
            navigation.navigate('Register', { role: selectedRole });
        }
    };

    return (
        <LContainer style={styles.container}>
            {/* Curved Header Background */}
            <View style={styles.headerBackground}>
                <View style={styles.headerCurve} />
            </View>

            <View style={styles.content}>
                <LText variant="xl" color={theme.colors.white} style={styles.headerTitle}>
                    Pilih Peran Anda untuk Melanjutkan ke Liora
                </LText>

                <View style={styles.cardsContainer}>
                    <RoleCard
                        title="Murid"
                        imagePlaceholder="role_student"
                        selected={selectedRole === 'STUDENT'}
                        onPress={() => setSelectedRole('STUDENT')}
                    />
                    <RoleCard
                        title="Orang Tua"
                        imagePlaceholder="role_parent"
                        selected={selectedRole === 'PARENT'}
                        onPress={() => setSelectedRole('PARENT')}
                    />
                    <RoleCard
                        title="Guru"
                        imagePlaceholder="role_teacher"
                        selected={selectedRole === 'TEACHER'}
                        onPress={() => setSelectedRole('TEACHER')}
                    />
                </View>

                <View style={styles.footer}>
                    <LButton
                        title="Lanjut"
                        variant="primary"
                        fullWidth
                        disabled={!selectedRole}
                        onPress={handleContinue}
                    />

                    {/* Pagination dots indicator (static for now as per design) */}
                    <View style={styles.pagination}>
                        <View style={[styles.dot, styles.dotActive]} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>
                </View>
            </View>
        </LContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200, // Adjust height as needed
        backgroundColor: theme.colors.primary,
        zIndex: 0,
    },
    headerCurve: {
        position: 'absolute',
        bottom: -50, // Push it down to create the curve
        left: -width * 0.5, // Center the curve
        width: width * 2, // Make it wider than screen
        height: 100,
        backgroundColor: theme.colors.primary,
        borderBottomLeftRadius: width,
        borderBottomRightRadius: width,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: 60, // Push content down
        alignItems: 'center',
        zIndex: 1,
    },
    headerTitle: {
        textAlign: 'center',
        fontFamily: theme.typography.weights.bold,
        marginBottom: theme.spacing.xl,
        paddingHorizontal: theme.spacing.xl,
        lineHeight: 30,
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: theme.spacing.lg,
        width: '100%',
        marginTop: theme.spacing.xl,
    },
    card: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.radii.lg,
        padding: theme.spacing.md,
        alignItems: 'center',
        width: '45%',
        aspectRatio: 0.8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    cardSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: '#E0F7FA', // Light turquoise tint
    },
    cardImagePlaceholder: {
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.gray[100],
        borderRadius: theme.radii.md,
        marginBottom: theme.spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontFamily: theme.typography.weights.semibold,
    },
    footer: {
        width: '100%',
        marginTop: 'auto',
        marginBottom: theme.spacing.xl,
        gap: theme.spacing.lg,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: theme.spacing.sm,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.gray[300],
    },
    dotActive: {
        backgroundColor: theme.colors.primary,
    }
});
