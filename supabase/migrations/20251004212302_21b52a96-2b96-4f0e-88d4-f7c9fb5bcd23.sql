-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('provider', 'consumer');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL,
  phone TEXT,
  business_name TEXT,
  business_address TEXT,
  verified BOOLEAN DEFAULT FALSE,
  privacy_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food listings table
CREATE TABLE public.food_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  quantity TEXT NOT NULL,
  category TEXT,
  pickup_location TEXT NOT NULL,
  pickup_instructions TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  available_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  available_until TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'completed', 'expired')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create claims table
CREATE TABLE public.claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.food_listings(id) ON DELETE CASCADE,
  consumer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'picked_up', 'cancelled')),
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  picked_up_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  UNIQUE(listing_id, consumer_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Food listings policies
CREATE POLICY "Anyone can view available listings" ON public.food_listings FOR SELECT USING (true);
CREATE POLICY "Providers can insert their own listings" ON public.food_listings FOR INSERT WITH CHECK (auth.uid() = provider_id);
CREATE POLICY "Providers can update their own listings" ON public.food_listings FOR UPDATE USING (auth.uid() = provider_id);
CREATE POLICY "Providers can delete their own listings" ON public.food_listings FOR DELETE USING (auth.uid() = provider_id);

-- Claims policies
CREATE POLICY "Users can view their own claims" ON public.claims FOR SELECT USING (auth.uid() = consumer_id OR auth.uid() IN (SELECT provider_id FROM public.food_listings WHERE id = listing_id));
CREATE POLICY "Consumers can create claims" ON public.claims FOR INSERT WITH CHECK (auth.uid() = consumer_id);
CREATE POLICY "Users can update their own claims" ON public.claims FOR UPDATE USING (auth.uid() = consumer_id OR auth.uid() IN (SELECT provider_id FROM public.food_listings WHERE id = listing_id));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_food_listings_updated_at BEFORE UPDATE ON public.food_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    (NEW.raw_user_meta_data->>'role')::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();