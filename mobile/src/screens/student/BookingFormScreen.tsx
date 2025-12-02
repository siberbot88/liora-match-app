import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StudentScreenNavigationProp, HomeStackParamList } from '../../types/navigation';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useCreateBooking } from '../../hooks/useBookings';

export function BookingFormScreen() {
    const route = useRoute<RouteProp<HomeStackParamList, 'BookingForm'>>();
    const navigation = useNavigation<StudentScreenNavigationProp<'BookingForm'>>();
    const { teacher } = route.params;
    const { mutate: createBooking, isPending } = useCreateBooking();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(teacher.subjects[0]);
    const [duration, setDuration] = useState(60);
    const [mode, setMode] = useState<'ONLINE' | 'OFFLINE'>('ONLINE');

    const durationOptions = [60, 90, 120];
    const modeOptions = [
        { value: 'ONLINE', label: 'Online', icon: 'videocam' },
        { value: 'OFFLINE', label: 'Offline', icon: 'location' },
    ];

    const handleSubmit = () => {
        // Validate future date
        if (selectedDate < new Date()) {
            Alert.alert('Error', 'Pilih tanggal di masa depan');
            return;
        }

        createBooking({
            teacherId: teacher.id,
            subjectId: selectedSubject.subject.id,
            scheduledAt: selectedDate.toISOString(),
            duration,
            mode,
        }, {
            onSuccess: () => {
                Alert.alert(
                    'Berhasil!',
                    'Booking berhasil dibuat. Menunggu konfirmasi guru.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                navigation.navigate('Bookings');
                            },
                        },
                    ]
                );
            },
            onError: (error: any) => {
                Alert.alert('Gagal', error.message || 'Terjadi kesalahan');
            },
        });
    };

    const totalPrice = (teacher.hourlyRate * duration) / 60;

    return (
        <ScrollView style={styles.container}>
            {/* Teacher Info */}
            <View style={styles.teacherCard}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={32} color="#007AFF" />
                </View>
                <View style={styles.teacherInfo}>
                    <Text style={styles.teacherName}>{teacher.user.name}</Text>
                    <Text style={styles.teacherRate}>
                        Rp {teacher.hourlyRate.toLocaleString('id-ID')}/jam
                    </Text>
                </View>
            </View>

            {/* Subject Selection */}
            <View style={styles.section}>
                <Text style={styles.label}>Pilih Mata Pelajaran *</Text>
                <View style={styles.optionsGrid}>
                    {teacher.subjects.map((ts: any) => (
                        <TouchableOpacity
                            key={ts.id}
                            style={[
                                styles.subjectOption,
                                selectedSubject.id === ts.id && styles.subjectOptionSelected,
                            ]}
                            onPress={() => setSelectedSubject(ts)}
                        >
                            <Text style={styles.subjectIcon}>{ts.subject.icon}</Text>
                            <Text
                                style={[
                                    styles.subjectLabel,
                                    selectedSubject.id === ts.id && styles.subjectLabelSelected,
                                ]}
                            >
                                {ts.subject.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Date & Time */}
            <View style={styles.section}>
                <Text style={styles.label}>Tanggal & Waktu *</Text>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShow(true)}>
                    <Ionicons name="calendar" size={20} color="#007AFF" />
                    <Text style={styles.dateText}>
                        {selectedDate.toLocaleString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Text>
                </TouchableOpacity>

                {show && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="datetime"
                        is24Hour={true}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event: DateTimePickerEvent, date?: Date) => {
                            setShow(Platform.OS === 'ios');
                            if (date) setSelectedDate(date);
                        }}
                    />
                )}
            </View>

            {/* Duration */}
            <View style={styles.section}>
                <Text style={styles.label}>Durasi *</Text>
                <View style={styles.optionsRow}>
                    {durationOptions.map((dur) => (
                        <TouchableOpacity
                            key={dur}
                            style={[
                                styles.durationOption,
                                duration === dur && styles.durationOptionSelected,
                            ]}
                            onPress={() => setDuration(dur)}
                        >
                            <Text
                                style={[
                                    styles.durationText,
                                    duration === dur && styles.durationTextSelected,
                                ]}
                            >
                                {dur} menit
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Mode */}
            <View style={styles.section}>
                <Text style={styles.label}>Mode Pembelajaran *</Text>
                <View style={styles.optionsRow}>
                    {modeOptions.map((opt) => (
                        <TouchableOpacity
                            key={opt.value}
                            style={[
                                styles.modeOption,
                                mode === opt.value && styles.modeOptionSelected,
                            ]}
                            onPress={() => setMode(opt.value as any)}
                        >
                            <Ionicons
                                name={opt.icon as any}
                                size={24}
                                color={mode === opt.value ? '#FFFFFF' : '#007AFF'}
                            />
                            <Text
                                style={[
                                    styles.modeText,
                                    mode === opt.value && styles.modeTextSelected,
                                ]}
                            >
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Price Summary */}
            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Ringkasan Pembayaran</Text>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Durasi</Text>
                    <Text style={styles.summaryValue}>{duration} menit</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tarif per jam</Text>
                    <Text style={styles.summaryValue}>
                        Rp {teacher.hourlyRate.toLocaleString('id-ID')}
                    </Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryTotal}>Total</Text>
                    <Text style={styles.summaryPrice}>
                        Rp {totalPrice.toLocaleString('id-ID')}
                    </Text>
                </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
                style={[styles.submitButton, isPending && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isPending}
            >
                <Text style={styles.submitButtonText}>
                    {isPending ? 'Memproses...' : 'Konfirmasi Booking'}
                </Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    teacherCard: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E5F1FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    teacherInfo: {
        justifyContent: 'center',
    },
    teacherName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    teacherRate: {
        fontSize: 14,
        color: '#8E8E93',
    },
    section: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginTop: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 12,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    subjectOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    subjectOptionSelected: {
        backgroundColor: '#E5F1FF',
        borderColor: '#007AFF',
    },
    subjectIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    subjectLabel: {
        fontSize: 15,
        color: '#3A3A3C',
    },
    subjectLabelSelected: {
        color: '#007AFF',
        fontWeight: '600',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        gap: 12,
    },
    dateText: {
        flex: 1,
        fontSize: 15,
        color: '#1C1C1E',
    },
    optionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    durationOption: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'transparent',
        alignItems: 'center',
    },
    durationOptionSelected: {
        backgroundColor: '#E5F1FF',
        borderColor: '#007AFF',
    },
    durationText: {
        fontSize: 15,
        color: '#3A3A3C',
    },
    durationTextSelected: {
        color: '#007AFF',
        fontWeight: '600',
    },
    modeOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'transparent',
        gap: 8,
    },
    modeOptionSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    modeText: {
        fontSize: 15,
        color: '#3A3A3C',
    },
    modeTextSelected: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginTop: 12,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 15,
        color: '#8E8E93',
    },
    summaryValue: {
        fontSize: 15,
        color: '#3A3A3C',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#F2F2F7',
        marginVertical: 12,
    },
    summaryTotal: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    summaryPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        marginHorizontal: 16,
        marginTop: 20,
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
