/**
 * @description 
 * Widget component for displaying recent consultations on the dashboard.
 * 
 * @dependencies
 * - react-native: Core components
 * - @expo/vector-icons: Icons
 * - @react-navigation/native: Navigation
 * 
 * @notes
 * - Shows recent consultation cards
 * - Displays consultation status
 * - Links to consultation details
 */

import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Consultation } from '../../Hooks/useDashboard';
import { theme } from '../../Config/theme';
import { formatRelativeTime } from '../../utils/date';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ConsultationNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ConsultationWidgetProps {
  consultations: Consultation[];
}

export const ConsultationWidget: React.FC<ConsultationWidgetProps> = ({ 
  consultations 
}) => {
  const navigation = useNavigation<ConsultationNavigationProp>();

  const handleViewAll = () => {
    navigation.navigate('Riwayat');
  };

  const handlePressConsultation = (consultationId: string) => {
    navigation.navigate('Riwayat', { 
      screen: 'ConsultationDetails', 
      params: { consultationId } 
    });
  };

  const getStatusColor = (status: Consultation['status']) => {
    switch (status) {
      case 'pending':
        return theme.colors.semantic.warning;
      case 'in_progress':
        return theme.colors.semantic.info;
      case 'completed':
        return theme.colors.semantic.success;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusText = (status: Consultation['status']) => {
    switch (status) {
      case 'pending':
        return 'Menunggu';
      case 'in_progress':
        return 'Berlangsung';
      case 'completed':
        return 'Selesai';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Konsultasi Terbaru</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAllText}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>

      {consultations.map((consultation) => (
        <TouchableOpacity
          key={consultation.id}
          style={styles.consultationCard}
          onPress={() => handlePressConsultation(consultation.id)}
        >
          <View style={styles.doctorInfo}>
            {consultation.doctor.photo_url ? (
              <Image 
                source={{ uri: consultation.doctor.photo_url }} 
                style={styles.doctorAvatar}
              />
            ) : (
              <View style={styles.placeholderAvatar}>
                <FontAwesome5 
                  name="user-md" 
                  size={20} 
                  color={theme.colors.neutral.gray400} 
                />
              </View>
            )}
            <View style={styles.doctorDetails}>
              <Text style={styles.doctorName}>
                {consultation.doctor.name}
              </Text>
              <Text style={styles.specialty}>
                {consultation.doctor.specialty}
              </Text>
            </View>
          </View>

          <View style={styles.consultationInfo}>
            <Text style={styles.childName}>
              Untuk: {consultation.child.name}
            </Text>
            <View style={styles.statusContainer}>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: getStatusColor(consultation.status) }
                ]} 
              />
              <Text style={styles.statusText}>
                {getStatusText(consultation.status)}
              </Text>
              <Text style={styles.timeText}>
                • {formatRelativeTime(new Date(consultation.created_at))}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {consultations.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Belum ada konsultasi
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  viewAllText: {
    fontSize: 14,
    color: theme.colors.primary.main,
    fontWeight: '500',
  },
  consultationCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  placeholderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.neutral.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorDetails: {
    marginLeft: 12,
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  consultationInfo: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.gray200,
    paddingTop: 12,
  },
  childName: {
    fontSize: 14,
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  timeText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginLeft: 6,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
}); 