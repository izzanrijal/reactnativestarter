-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('profile-photos', 'profile-photos', true),
    ('child-avatars', 'child-avatars', true),
    ('voice-notes', 'voice-notes', false),
    ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;

-- Profile Photos Policies
CREATE POLICY "Profile photos are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload their own profile photo"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'profile-photos' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can update their own profile photo"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'profile-photos' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their own profile photo"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'profile-photos' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Child Avatars Policies
CREATE POLICY "Child avatars are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'child-avatars');

CREATE POLICY "Parents can upload their children's avatars"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'child-avatars' AND
        EXISTS (
            SELECT 1 FROM public.children
            WHERE id::text = (storage.foldername(name))[1]
            AND parent_id = auth.uid()
        )
    );

CREATE POLICY "Parents can update their children's avatars"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'child-avatars' AND
        EXISTS (
            SELECT 1 FROM public.children
            WHERE id::text = (storage.foldername(name))[1]
            AND parent_id = auth.uid()
        )
    );

CREATE POLICY "Parents can delete their children's avatars"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'child-avatars' AND
        EXISTS (
            SELECT 1 FROM public.children
            WHERE id::text = (storage.foldername(name))[1]
            AND parent_id = auth.uid()
        )
    );

-- Voice Notes Policies
CREATE POLICY "Voice notes are accessible by consultation participants"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'voice-notes' AND
        EXISTS (
            SELECT 1 FROM public.consultations c
            WHERE c.id::text = (storage.foldername(name))[1]
            AND (c.parent_id = auth.uid() OR c.doctor_id = auth.uid())
        )
    );

CREATE POLICY "Users can upload voice notes to their consultations"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'voice-notes' AND
        EXISTS (
            SELECT 1 FROM public.consultations c
            WHERE c.id::text = (storage.foldername(name))[1]
            AND (c.parent_id = auth.uid() OR c.doctor_id = auth.uid())
        )
    );

-- Receipts Policies
CREATE POLICY "Users can view their own receipts"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'receipts' AND
        EXISTS (
            SELECT 1 FROM public.payments p
            WHERE p.id::text = (storage.foldername(name))[1]
            AND p.parent_id = auth.uid()
        )
    );

CREATE POLICY "System can create receipts"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'receipts' AND
        auth.is_admin()
    ); 