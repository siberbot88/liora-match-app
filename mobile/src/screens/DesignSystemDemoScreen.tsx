/**
 * Design System Demo Screen
 * Showcase all components and theme tokens
 */

import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    Button,
    Card,
    Input,
    Heading,
    Text,
    Avatar,
    Badge,
} from '../components/ui';
import { colors, spacing } from '../theme';

export function DesignSystemDemoScreen() {
    const [email, setEmail] = useState('');

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.section}>
                <Heading level="h1">Design System</Heading>
                <Text variant="body" color={colors.textSecondary}>
                    Liora UI Component Library
                </Text>
            </View>

            {/* Colors */}
            <Card variant="elevated" style={styles.section}>
                <Heading level="h3" style={styles.sectionTitle}>Colors</Heading>
                <View style={styles.colorRow}>
                    <View style={[styles.colorBox, { backgroundColor: colors.primary }]} />
                    <Text variant="bodySmall">Primary</Text>
                </View>
                <View style={styles.colorRow}>
                    <View style={[styles.colorBox, { backgroundColor: colors.secondary }]} />
                    <Text variant="bodySmall">Secondary</Text>
                </View>
                <View style={styles.colorRow}>
                    <View style={[styles.colorBox, { backgroundColor: colors.accent }]} />
                    <Text variant="bodySmall">Accent</Text>
                </View>
                <View style={styles.colorRow}>
                    <View style={[styles.colorBox, { backgroundColor: colors.success }]} />
                    <Text variant="bodySmall">Success</Text>
                </View>
                <View style={styles.colorRow}>
                    <View style={[styles.colorBox, { backgroundColor: colors.error }]} />
                    <Text variant="bodySmall">Error</Text>
                </View>
            </Card>

            {/* Typography */}
            <Card variant="elevated" style={styles.section}>
                <Heading level="h3" style={styles.sectionTitle}>Typography</Heading>
                <Heading level="h1">Heading 1</Heading>
                <Heading level="h2">Heading 2</Heading>
                <Heading level="h3">Heading 3</Heading>
                <Heading level="h4">Heading 4</Heading>
                <Text variant="body">Body text - regular</Text>
                <Text variant="body" weight="semibold">Body text - semibold</Text>
                <Text variant="bodySmall">Small body text</Text>
                <Text variant="caption">Caption text</Text>
            </Card>

            {/* Buttons */}
            <Card variant="elevated" style={styles.section}>
                <Heading level="h3" style={styles.sectionTitle}>Buttons</Heading>

                <Text variant="bodySmall" weight="medium" style={styles.label}>Variants</Text>
                <Button variant="primary" onPress={() => { }}>Primary Button</Button>
                <View style={{ height: spacing.sm }} />
                <Button variant="secondary" onPress={() => { }}>Secondary Button</Button>
                <View style={{ height: spacing.sm }} />
                <Button variant="accent" onPress={() => { }}>Accent Button</Button>
                <View style={{ height: spacing.sm }} />
                <Button variant="outline" onPress={() => { }}>Outline Button</Button>
                <View style={{ height: spacing.sm }} />
                <Button variant="ghost" onPress={() => { }}>Ghost Button</Button>

                <Text variant="bodySmall" weight="medium" style={[styles.label, { marginTop: spacing.lg }]}>
                    Sizes
                </Text>
                <Button size="sm" onPress={() => { }}>Small</Button>
                <View style={{ height: spacing.sm }} />
                <Button size="md" onPress={() => { }}>Medium</Button>
                <View style={{ height: spacing.sm }} />
                <Button size="lg" onPress={() => { }}>Large</Button>

                <Text variant="bodySmall" weight="medium" style={[styles.label, { marginTop: spacing.lg }]}>
                    States
                </Text>
                <Button loading onPress={() => { }}>Loading</Button>
                <View style={{ height: spacing.sm }} />
                <Button disabled onPress={() => { }}>Disabled</Button>

                <Text variant="bodySmall" weight="medium" style={[styles.label, { marginTop: spacing.lg }]}>
                    With Icons
                </Text>
                <Button
                    leftIcon={<Ionicons name="checkmark" size={20} color="white" />}
                    onPress={() => { }}
                >
                    Confirm
                </Button>
                <View style={{ height: spacing.sm }} />
                <Button
                    rightIcon={<Ionicons name="arrow-forward" size={20} color="white" />}
                    onPress={() => { }}
                >
                    Next
                </Button>
            </Card>

            {/* Inputs */}
            <Card variant="elevated" style={styles.section}>
                <Heading level="h3" style={styles.sectionTitle}>Inputs</Heading>

                <Input
                    label="Email Address"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    leftIcon={<Ionicons name="mail" size={20} color={colors.textSecondary} />}
                />

                <Input
                    label="Password"
                    placeholder="Enter password"
                    secureTextEntry
                    leftIcon={<Ionicons name="lock-closed" size={20} color={colors.textSecondary} />}
                />

                <Input
                    label="Phone Number"
                    error="Phone number is required"
                    leftIcon={<Ionicons name="call" size={20} color={colors.error} />}
                />

                <Input
                    label="Disabled Input"
                    disabled
                    value="Cannot edit"
                />
            </Card>

            {/* Avatars */}
            <Card variant="elevated" style={styles.section}>
                <Heading level="h3" style={styles.sectionTitle}>Avatars</Heading>
                <View style={styles.avatarRow}>
                    <Avatar name="John Doe" size="sm" />
                    <Avatar name="Jane Smith" size="md" />
                    <Avatar name="Bob Wilson" size="lg" />
                    <Avatar name="Alice Brown" size="xl" />
                </View>
            </Card>

            {/* Badges */}
            <Card variant="elevated" style={styles.section}>
                <Heading level="h3" style={styles.sectionTitle}>Badges</Heading>
                <View style={styles.badgeRow}>
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="success">Success</Badge>
                </View>
                <View style={styles.badgeRow}>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="info">Info</Badge>
                </View>
                <View style={styles.badgeRow}>
                    <Badge size="sm">Small</Badge>
                    <Badge size="md">Medium</Badge>
                </View>
            </Card>

            {/* Cards */}
            <View style={styles.section}>
                <Heading level="h3" style={styles.sectionTitle}>Cards</Heading>

                <Card variant="default" padding="md">
                    <Text variant="body" weight="semibold">Default Card</Text>
                    <Text variant="bodySmall">With medium padding</Text>
                </Card>

                <View style={{ height: spacing.md }} />

                <Card variant="outlined" padding="lg">
                    <Text variant="body" weight="semibold">Outlined Card</Text>
                    <Text variant="bodySmall">With large padding</Text>
                </Card>

                <View style={{ height: spacing.md }} />

                <Card variant="elevated" padding="md" onPress={() => alert('Card pressed!')}>
                    <Text variant="body" weight="semibold">Touchable Card</Text>
                    <Text variant="bodySmall">Tap me!</Text>
                </Card>
            </View>

            <View style={{ height: spacing['4xl'] }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    section: {
        marginTop: spacing.lg,
        marginHorizontal: spacing.lg,
    },
    sectionTitle: {
        marginBottom: spacing.md,
    },
    colorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
        gap: spacing.md,
    },
    colorBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
    },
    label: {
        marginBottom: spacing.sm,
        color: colors.textSecondary,
    },
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    badgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
});
