import React from 'react';
import { View, ViewProps, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { theme } from '../../theme/theme';

export interface LContainerProps extends ViewProps {
    children: React.ReactNode;
    safeArea?: boolean;
}

export const LContainer: React.FC<LContainerProps> = ({
    children,
    style,
    safeArea = true,
    ...props
}) => {
    const ContainerComponent = safeArea ? SafeAreaView : View;

    return (
        <ContainerComponent
            style={[styles.container, style]}
            {...props}
        >
            <View style={styles.content}>
                {children}
            </View>
        </ContainerComponent>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    content: {
        flex: 1,
        padding: theme.spacing.lg,
    }
});
