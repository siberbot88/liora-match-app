import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';

export function ProfileScreen() {
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);

    const handleLogout = () => {
        logout();
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={48} color="#007AFF" />
                </View>
                <Text style={styles.name}>{user?.name || 'User'}</Text>
                <Text style={styles.email}>{user?.email || ''}</Text>
            </View>

            {/* Menu Items */}
            <View style={styles.section}>
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="person-outline" size={24} color="#007AFF" />
                    <Text style={styles.menuText}>Edit Profil</Text>
                    <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="notifications-outline" size={24} color="#007AFF" />
                    <Text style={styles.menuText}>Notifikasi</Text>
                    <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="settings-outline" size={24} color="#007AFF" />
                    <Text style={styles.menuText}>Pengaturan</Text>
                    <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
                </TouchableOpacity>
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                <Text style={styles.logoutText}>Keluar</Text>
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
    header: {
        backgroundColor: '#FFFFFF',
        padding: 32,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E5F1FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    email: {
        fontSize: 15,
        color: '#8E8E93',
    },
    section: {
        backgroundColor: '#FFFFFF',
        marginTop: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F2F2F7',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#1C1C1E',
        marginLeft: 12,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 20,
        padding: 16,
        borderRadius: 10,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF3B30',
    },
});
