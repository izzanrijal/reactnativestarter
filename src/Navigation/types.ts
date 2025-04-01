/**
 * @description
 * Type definitions for navigation
 */

export type RootStackParamList = {
  Home: undefined;
  Riwayat: {
    screen?: string;
    params?: {
      consultationId?: string;
    };
  };
  AddChild: undefined;
  ChildDetails: {
    childId: string;
  };
  ConsultationDetails: {
    consultationId: string;
  };
  Blog: undefined;
  BlogPost: {
    postId: string;
  };
}; 