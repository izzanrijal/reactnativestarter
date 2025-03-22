import Button from '@components/Buttons/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import supabase from '@config/supabase';

const HomeScreen = ({navigation}) => {
    const [userUuid, setUserUuid] = useState('');
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        AsyncStorage.getItem('userUuid', (err, result) => {
            result ? setUserUuid(result) : setUserUuid('');
        });
    }, []);
    
    const handleLogout = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            await AsyncStorage.removeItem('userUuid');
            navigation.replace('SignInScreen');
        } catch (error) {
            Alert.alert('Error signing out', error.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home Screen</Text>
            <Button 
                title="Button Examples"
                variant="primary"
                size="small"
                onPress={() => navigation.navigate('ButtonExamples')}
            />
            <Button 
                title="Change Password"
                onPress={() => {navigation.navigate('ChangePasswordScreen')}}
                variant="secondary"
                size="small"
            />
            <Button 
                title={loading ? "Logging out..." : "Logout"}
                onPress={handleLogout}
                variant="secondary"
                size="small"
                disabled={loading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default HomeScreen;