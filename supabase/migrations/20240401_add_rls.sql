-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles FOR SELECT
    USING (id = auth.uid() OR auth.is_admin());

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Children Policies
CREATE POLICY "Parents can view their own children"
    ON public.children FOR SELECT
    USING (parent_id = auth.uid() OR auth.is_admin());

CREATE POLICY "Parents can create children"
    ON public.children FOR INSERT
    WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Parents can update their own children"
    ON public.children FOR UPDATE
    USING (parent_id = auth.uid())
    WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Parents can delete their own children"
    ON public.children FOR DELETE
    USING (parent_id = auth.uid());

-- Doctor Profiles Policies
CREATE POLICY "Doctor profiles are viewable by all authenticated users"
    ON public.doctor_profiles FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Doctors can update their own profile"
    ON public.doctor_profiles FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Consultations Policies
CREATE POLICY "Users can view their own consultations"
    ON public.consultations FOR SELECT
    USING (
        parent_id = auth.uid() OR 
        doctor_id = auth.uid() OR 
        auth.is_admin()
    );

CREATE POLICY "Parents can create consultations"
    ON public.consultations FOR INSERT
    WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Involved users can update consultations"
    ON public.consultations FOR UPDATE
    USING (
        parent_id = auth.uid() OR 
        doctor_id = auth.uid()
    )
    WITH CHECK (
        parent_id = auth.uid() OR 
        doctor_id = auth.uid()
    );

-- Consultation Messages Policies
CREATE POLICY "Involved users can view messages"
    ON public.consultation_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.consultations c
            WHERE c.id = consultation_id
            AND (c.parent_id = auth.uid() OR c.doctor_id = auth.uid())
        ) OR auth.is_admin()
    );

CREATE POLICY "Involved users can create messages"
    ON public.consultation_messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.consultations c
            WHERE c.id = consultation_id
            AND (c.parent_id = auth.uid() OR c.doctor_id = auth.uid())
        )
    );

-- Payments Policies
CREATE POLICY "Users can view their own payments"
    ON public.payments FOR SELECT
    USING (parent_id = auth.uid() OR auth.is_admin());

CREATE POLICY "Users can create their own payments"
    ON public.payments FOR INSERT
    WITH CHECK (parent_id = auth.uid());

-- Feedback Policies
CREATE POLICY "Feedback is viewable by involved users"
    ON public.feedback FOR SELECT
    USING (
        parent_id = auth.uid() OR 
        doctor_id = auth.uid() OR 
        auth.is_admin()
    );

CREATE POLICY "Parents can create feedback"
    ON public.feedback FOR INSERT
    WITH CHECK (parent_id = auth.uid());

-- Notifications Policies
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid()); 