import Button from '@components/Buttons/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import supabase from '@config/supabase';
import { callEmailVerifyFunction } from '@hooks/callEmailVerifyFunction';

const HomeScreen = ({navigation}) => {
    const [userUuid, setUserUuid] = useState('');
    const [loading, setLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    
    // Verify the user is authorized to access this screen
    useEffect(() => {
        const checkVerificationStatus = async () => {
            setIsChecking(true);
            try {
                // Get current session
                const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
                
                if (sessionError || !sessionData.session) {
                    // No session, redirect to sign in
                    console.log('No active session, redirecting to sign in');
                    navigation.replace('SignInScreen');
                    return;
                }
                
                const userId = sessionData.session.user.id;
                const userEmail = sessionData.session.user.email;
                setUserUuid(userId);
                
                // Check verification status in database
                try {
                    const { data: profile, error: profileError } = await supabase
                        .from('user_profile')
                        .select('is_verified')
                        .eq('user_uuid', userId)
                        .single();
                    
                    if (profileError) {
                        if (profileError.code === 'PGRST116') {
                            // Profile doesn't exist, redirect to splash which will handle creating it
                            console.log('Profile not found, redirecting to splash');
                            navigation.replace('SplashScreen');
                            return;
                        }
                    } else if (profile && profile.is_verified === false) {
                        // User is not verified, send verification email and redirect
                        console.log('User not verified, sending verification email');
                        
                        try {
                            // Send verification email using Resend
                            callEmailVerifyFunction(userEmail, (verificationCode) => {
                                console.log('Verification code sent to email:', verificationCode);
                                
                                // Set global verification variables
                                global.verificationCode = verificationCode.toString();
                                global.userEmail = userEmail;
                                
                                // Alert the user and navigate to verification
                                Alert.alert(
                                    'Verification Required',
                                    'You need to verify your email before accessing this screen. Please check your email for the verification code.',
                                    [
                                        { text: 'OK', onPress: () => navigation.replace('VerificationScreen') }
                                    ]
                                );
                            });
                        } catch (emailError) {
                            console.error('Failed to send verification email:', emailError);
                            
                            // Fallback to local code generation
                            const fallbackCode = Math.floor(1000 + Math.random() * 9000).toString();
                            global.verificationCode = fallbackCode;
                            global.userEmail = userEmail;
                            
                            Alert.alert(
                                'Verification Required',
                                `We couldn't send an email. Your verification code is: ${fallbackCode}`,
                                [
                                    { text: 'OK', onPress: () => navigation.replace('VerificationScreen') }
                                ]
                            );
                        }
                        return;
                    }
                    
                    // User is verified, allow access
                    setIsChecking(false);
                    await AsyncStorage.setItem('userUuid', userId);
                    
                } catch (error) {
                    console.error('Error checking verification status:', error);
                    setIsChecking(false);
                }
            } catch (error) {
                console.error('Error in auth check:', error);
                setIsChecking(false);
            }
        };
        
        checkVerificationStatus();
    }, [navigation]);
    
    const handleLogout = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            // Clear any verification state
            if (global.verificationCode) delete global.verificationCode;
            if (global.userEmail) delete global.userEmail;
            if (global.tempPassword) delete global.tempPassword;
            
            await AsyncStorage.removeItem('userUuid');
            navigation.replace('SignInScreen');
        } catch (error) {
            Alert.alert('Error signing out', error.message);
        } finally {
            setLoading(false);
        }
    };
    
    // Show loading screen while checking verification
    if (isChecking) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Checking authorization...</Text>
            </View>
        );
    }
    
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
    loadingContainer: {
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