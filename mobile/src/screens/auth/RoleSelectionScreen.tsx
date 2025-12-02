import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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
    onPress: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ title, imagePlaceholder, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
        <View style={styles.cardImagePlaceholder}>
            <LText variant="sm" color={theme.colors.gray[500]}>{imagePlaceholder}</LText>
        </View>
        <LText variant="lg" style={styles.cardTitle}>{title}</LText>
    </TouchableOpacity>
);

export function RoleSelectionScreen() {
    const navigation = useNavigation<NavigationProp>();

    const handleRoleSelect = (role: 'STUDENT' | 'PARENT' | 'TEACHER') => {
        navigation.navigate('Register', { role });
    };

    return (
        <LContainer style={styles.container}>
            <View style={styles.content}>
                <LText variant="xl" color={theme.colors.white} style={styles.headerTitle}>
                    Pilih Peran Anda untuk Melanjutkan ke Liora
                </LText>

                <View style={styles.cardsContainer}>
                    <RoleCard
                        title="Murid"
                        imagePlaceholder="role_student"
                        onPress={() => handleRoleSelect('STUDENT')}
                    />
                    <RoleCard
                        title="Orang Tua"
                        imagePlaceholder="role_parent"
                        onPress={() => handleRoleSelect('PARENT')}
                    />
                    <RoleCard
                        title="Guru"
                        imagePlaceholder="role_teacher"
                        onPress={() => handleRoleSelect('TEACHER')}
                    />
                </View>

                <LButton
                    title="Lanjut"
                    variant="primary"
                    fullWidth
                    onPress={() => { }} // Logic to confirm selection if needed, or just navigate directly from cards
                    style={{ marginTop: theme.spacing.xl }}
                />
            </View>
        </LContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary, // Teal background as per design
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.xl,
        alignItems: 'center',
    },
    headerTitle: {
        textAlign: 'center',
        fontWeight: theme.typography.weights.bold,
        marginBottom: theme.spacing.xl,
        paddingHorizontal: theme.spacing.xl,
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: theme.spacing.lg,
        width: '100%',
    },
    card: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.radii.lg,
        padding: theme.spacing.md,
        alignItems: 'center',
        width: '45%', // 2 columns roughly
        aspectRatio: 0.8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
        fontWeight: theme.typography.weights.semibold,
    }
});
