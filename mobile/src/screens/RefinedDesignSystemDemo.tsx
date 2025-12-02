import React from 'react';
import { ScrollView, View } from 'react-native';
import { LContainer } from '../components/ui/LContainer';
import { LText } from '../components/ui/LText';
import { LButton } from '../components/ui/LButton';
import { TeacherCard } from '../components/ui/TeacherCard';
import { SubjectChip } from '../components/ui/SubjectChip';
import { theme } from '../theme/theme';

export function RefinedDesignSystemDemo() {
    return (
        <LContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginBottom: 24 }}>
                    <LText variant="3xl" style={{ marginBottom: 8 }}>Design System Refined</LText>
                    <LText variant="md" color={theme.colors.gray[500]}>
                        Implementation of L-components based on user specs.
                    </LText>
                </View>

                {/* Typography Section */}
                <View style={{ marginBottom: 32 }}>
                    <LText variant="xl" style={{ marginBottom: 16 }}>Typography</LText>
                    <LText variant="5xl">Heading 5xl</LText>
                    <LText variant="4xl">Heading 4xl</LText>
                    <LText variant="3xl">Heading 3xl</LText>
                    <LText variant="2xl">Heading 2xl</LText>
                    <LText variant="xl">Heading xl</LText>
                    <LText variant="lg">Body Large (lg)</LText>
                    <LText variant="md">Body Medium (md)</LText>
                    <LText variant="sm">Caption (sm)</LText>
                </View>

                {/* Buttons Section */}
                <View style={{ marginBottom: 32 }}>
                    <LText variant="xl" style={{ marginBottom: 16 }}>Buttons</LText>
                    <LButton title="Primary Button" style={{ marginBottom: 12 }} />
                    <LButton title="Full Width Button" fullWidth style={{ marginBottom: 12 }} />
                    <LButton title="Disabled Button" disabled style={{ marginBottom: 12 }} />
                </View>

                {/* Chips Section */}
                <View style={{ marginBottom: 32 }}>
                    <LText variant="xl" style={{ marginBottom: 16 }}>Subject Chips</LText>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <SubjectChip label="Matematika" />
                        <SubjectChip label="Fisika" />
                        <SubjectChip label="Bahasa Inggris" />
                        <SubjectChip label="Kimia" />
                    </View>
                </View>

                {/* Cards Section */}
                <View style={{ marginBottom: 32 }}>
                    <LText variant="xl" style={{ marginBottom: 16 }}>Teacher Card</LText>
                    <TeacherCard
                        name="Sarah Johnson"
                        subjects={['Matematika', 'Fisika', 'Kimia', 'Biologi']}
                        rating={4.8}
                        reviewCount={124}
                        hourlyRate={150000}
                        onPress={() => console.log('Card pressed')}
                    />
                    <TeacherCard
                        name="Budi Santoso"
                        subjects={['Bahasa Inggris', 'TOEFL']}
                        rating={4.9}
                        reviewCount={89}
                        hourlyRate={125000}
                    />
                </View>

                {/* Usage Example from Request */}
                <View style={{ marginBottom: 32, padding: 16, backgroundColor: theme.colors.white, borderRadius: theme.radii.lg }}>
                    <LText variant="sm" color={theme.colors.gray[500]} style={{ marginBottom: 8 }}>Usage Example:</LText>
                    <LText variant="xl" style={{ marginBottom: 16 }}>Halo, Fadil</LText>
                    <LButton title="Mulai Belajar" onPress={() => { }} />
                </View>

            </ScrollView>
        </LContainer>
    );
}
