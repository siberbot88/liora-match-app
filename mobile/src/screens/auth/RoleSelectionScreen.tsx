import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image, ImageSourcePropType } from 'react-native';
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
    imageSource: ImageSourcePropType;
    selected: boolean;
    onPress: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ title, imageSource, selected, onPress }) => (
    <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <View style={styles.cardImageContainer}>
            <Image source={imageSource} style={styles.cardImage} resizeMode="contain" />
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
            <View style={styles.headerBackground} />

            <View style={styles.content}>
                <LText variant="xl" color={theme.colors.white} style={styles.headerTitle}>
                    Pilih Peran Anda untuk Melanjutkan ke Liora
                </LText>

                <View style={styles.rolesContainer}>
                    {/* Top Row: Murid */}
                    <View style={styles.topRoleRow}>
                        <RoleCard
                            title="Murid"
                            imageSource={require('../../../assets/role_img/murid-role.png')}
                            selected={selectedRole === 'STUDENT'}
                            onPress={() => setSelectedRole('STUDENT')}
                        />
                    </View>

                    {/* Bottom Row: Orang Tua & Guru */}
                    <View style={styles.bottomRoleRow}>
                        <RoleCard
                            title="Orang Tua"
                            imageSource={require('../../../assets/role_img/orangtua-role.png')}
                            selected={selectedRole === 'PARENT'}
                            onPress={() => setSelectedRole('PARENT')}
                        />
                        <RoleCard
                            title="Guru"
                            imageSource={require('../../../assets/role_img/guru-role.png')}
                            selected={selectedRole === 'TEACHER'}
                            onPress={() => setSelectedRole('TEACHER')}
                        />
                    </View>
                </View>

                <View style={styles.footer}>
                    <LButton
                        title="Lanjut"
                        variant="primary"
                        fullWidth
                        disabled={!selectedRole}
                        onPress={handleContinue}
                    />

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
        top: -width * 3 + 260, // Position the bottom of the huge circle at Y=260
        left: -width,
        width: width * 3,
        height: width * 3,
        borderRadius: width * 1.5,
        backgroundColor: theme.colors.primary,
        zIndex: 0,
    },
    // headerCurve removed as it's no longer needed
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: 80, // Adjusted for new header height
        zIndex: 1,
    },
    headerTitle: {
        textAlign: 'center',
        fontFamily: theme.typography.weights.bold,
        marginBottom: theme.spacing.xl,
        paddingHorizontal: theme.spacing.xl,
        lineHeight: 28,
    },
    rolesContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: theme.spacing.lg,
        marginTop: theme.spacing.md,
    },
    topRoleRow: {
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    bottomRoleRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: theme.spacing.lg,
    },
    card: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.radii.lg,
        padding: theme.spacing.sm,
        alignItems: 'center',
        width: 140, // Fixed width for consistency
        height: 160,
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
        backgroundColor: '#E0F7FA',
    },
    cardImageContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.xs,
    },
    cardImage: {
        width: 100,
        height: 100,
    },
    cardTitle: {
        fontFamily: theme.typography.weights.medium,
        marginBottom: theme.spacing.xs,
        fontSize: 16,
    },
    footer: {
        width: '100%',
        marginTop: 'auto',
        marginBottom: 40, // Increased bottom margin
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

