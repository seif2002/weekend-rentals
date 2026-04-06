
-- Create workers table
CREATE TABLE public.workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  skills text[] NOT NULL DEFAULT '{}',
  hourly_rate numeric(10,2) NOT NULL,
  bio text,
  portfolio_urls text[] DEFAULT '{}',
  certifications text[] DEFAULT '{}',
  availability text DEFAULT 'available',
  location text,
  rating numeric(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  total_jobs integer DEFAULT 0,
  worker_type text DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view workers" ON public.workers FOR SELECT TO public USING (true);
CREATE POLICY "Users can insert own worker profile" ON public.workers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own worker profile" ON public.workers FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own worker profile" ON public.workers FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create worker_bookings table
CREATE TABLE public.worker_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid REFERENCES public.workers(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending',
  description text,
  scheduled_date date,
  scheduled_time text,
  estimated_hours numeric(5,2),
  total_price numeric(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.worker_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can view their bookings" ON public.worker_bookings FOR SELECT TO authenticated USING (
  client_id = auth.uid() OR worker_id IN (SELECT id FROM public.workers WHERE user_id = auth.uid())
);
CREATE POLICY "Clients can create bookings" ON public.worker_bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Participants can update bookings" ON public.worker_bookings FOR UPDATE TO authenticated USING (
  client_id = auth.uid() OR worker_id IN (SELECT id FROM public.workers WHERE user_id = auth.uid())
);
