import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { sendTestEmail, recordEmailInboxPlacement } from '../utils/emailTester';
import { isValidEmail } from '../utils/emailUtils';

const EmailTestScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showFeedbackButtons, setShowFeedbackButtons] = useState(false);
  const [showHeaderInfo, setShowHeaderInfo] = useState(false);

  const handleSendTest = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const testResult = await sendTestEmail(email);
      setResult(testResult);
      
      if (testResult.success) {
        // Show feedback buttons after successful send
        setShowFeedbackButtons(true);
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Unexpected error: ${(error as Error).message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInboxFeedback = (placement: 'primary' | 'promotions' | 'spam' | 'other') => {
    recordEmailInboxPlacement(email, placement);
    setShowFeedbackButtons(false);
    
    // Reset the test state for another test
    setResult(null);
  };

  const toggleHeaderInfo = () => {
    setShowHeaderInfo(!showHeaderInfo);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Email Deliverability Test</Text>
      
      <Text style={styles.description}>
        This screen lets you test email deliverability to see if emails are reaching the primary inbox.
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Test Email Address:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSendTest}
        disabled={loading || !email}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Test Email</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.infoButton}
        onPress={toggleHeaderInfo}
      >
        <Text style={styles.infoButtonText}>
          {showHeaderInfo ? "Hide Email Format Info" : "Show Email Format Info"}
        </Text>
      </TouchableOpacity>
      
      {showHeaderInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Current Email Format</Text>
          
          <Text style={styles.infoSubtitle}>Email Content:</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>Beautiful HTML template with responsive design. The verification code is displayed in a highlighted box for easy visibility.</Text>
          </View>
          
          <Text style={styles.infoSubtitle}>Subject Line:</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>Email Verification Code</Text>
          </View>
          
          <Text style={styles.infoSubtitle}>From Address:</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>YourAppName &lt;onboarding@ahlianak.com&gt;</Text>
          </View>
          
          <Text style={styles.infoSubtitle}>Headers:</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>Content-Transfer-Encoding: quoted-printable</Text>
            <Text style={styles.codeText}>MIME-Version: 1.0</Text>
            <Text style={styles.codeText}>Content-Type: text/html; charset=utf-8</Text>
          </View>
        </View>
      )}
      
      {result && (
        <View style={[
          styles.resultContainer,
          result.success ? styles.successResult : styles.errorResult
        ]}>
          <Text style={styles.resultTitle}>
            {result.success ? 'Success!' : 'Error'}
          </Text>
          <Text style={styles.resultMessage}>{result.message}</Text>
        </View>
      )}
      
      {showFeedbackButtons && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>Where did the email land?</Text>
          <Text style={styles.feedbackDescription}>
            Check your inbox and let us know where the test email appeared:
          </Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.feedbackButton, styles.primaryButton]}
              onPress={() => handleInboxFeedback('primary')}
            >
              <Text style={styles.buttonText}>Primary</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.feedbackButton, styles.promotionsButton]}
              onPress={() => handleInboxFeedback('promotions')}
            >
              <Text style={styles.buttonText}>Promotions</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.feedbackButton, styles.spamButton]}
              onPress={() => handleInboxFeedback('spam')}
            >
              <Text style={styles.buttonText}>Spam</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.feedbackButton, styles.otherButton]}
              onPress={() => handleInboxFeedback('other')}
            >
              <Text style={styles.buttonText}>Other</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    minHeight: '100%',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#b3d7ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  successResult: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  errorResult: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 14,
  },
  feedbackContainer: {
    padding: 16,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    marginBottom: 24,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  feedbackDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  feedbackButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  primaryButton: {
    backgroundColor: '#28a745',
  },
  promotionsButton: {
    backgroundColor: '#fd7e14',
  },
  spamButton: {
    backgroundColor: '#dc3545',
  },
  otherButton: {
    backgroundColor: '#6c757d',
  },
  backButton: {
    padding: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
  infoButton: {
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  infoButtonText: {
    color: '#007bff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  infoContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  codeBlock: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 4,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#333',
  },
});

export default EmailTestScreen; 