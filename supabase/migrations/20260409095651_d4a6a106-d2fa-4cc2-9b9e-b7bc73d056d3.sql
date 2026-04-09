
INSERT INTO storage.buckets (id, name, public) VALUES ('listings', 'listings', true);

CREATE POLICY "Listing photos are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'listings');
CREATE POLICY "Authenticated users can upload listing photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own listing photos" ON storage.objects FOR UPDATE USING (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own listing photos" ON storage.objects FOR DELETE USING (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);
