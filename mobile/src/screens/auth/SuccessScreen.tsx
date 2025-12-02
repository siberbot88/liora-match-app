import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { LContainer } from '../../components/ui/LContainer';
import { LText } from '../../components/ui/LText';
import { LButton } from '../../components/ui/LButton';
import { theme } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Success'>;
type SuccessRouteProp = RouteProp<AuthStackParamList, 'Success'>;

export function SuccessScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<SuccessRouteProp>();
    const { message, nextScreen = 'Login' } = route.params;

    const handleNext = () => {
        if (nextScreen === 'Student') {
            // Navigate to main app stack
            // @ts-ignore - Root stack navigation
            navigation.replace('Student');
        } else {
            // @ts-ignore
            navigation.navigate(nextScreen as any);
        }
    };

    return (
        <LContainer style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="checkmark" size={64} color={theme.colors.primary} />
                </View>

                <LText variant="2xl" style={styles.title}>
                    Sukses!
                </LText>

                <LText variant="md" style={styles.message}>
                    {message || 'Proses berhasil.'}
                </LText>

                <LButton
                    title="Selanjutnya"
                    variant="primary"
                    fullWidth
                    onPress={handleNext}
                    style={styles.button}
                />
            </View>
        </LContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.xl,
    },
    title: {
        fontFamily: theme.typography.weights.bold,
        marginBottom: theme.spacing.lg,
        color: theme.colors.text,
    },
    message: {
        textAlign: 'center',
        color: theme.colors.gray[500],
        marginBottom: theme.spacing.xl * 2,
    },
    button: {
        width: '100%',
    }
});
