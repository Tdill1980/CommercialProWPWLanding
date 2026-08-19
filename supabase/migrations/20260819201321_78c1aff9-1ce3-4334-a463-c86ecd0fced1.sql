CREATE POLICY "Anon can upload wall wrap artwork"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'wall-wrap-artwork');