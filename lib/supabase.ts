import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

if (supabaseUrl.includes('your-project-ref') || supabaseAnonKey.includes('your-anon-key')) {
  throw new Error('Please replace the placeholder values in your .env.local file with actual Supabase credentials.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  tier: 'free' | 'premium' | 'pro'
  created_at: string
  updated_at: string
}

export interface Design {
  id: string
  user_id: string
  slug: string
  title: string
  description?: string
  room_type: string
  design_state: any // JSON object containing 3D scene data
  image_url: string
  thumbnail_url: string
  tags: string[]
  is_public: boolean
  views: number
  likes: number
  created_at: string
  updated_at: string
}

// Auth helpers
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })
  
  if (data.user && !error) {
    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName,
        tier: 'free',
      })
    
    if (profileError) {
      console.error('Error creating user profile:', profileError)
    }
  }
  
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
  
  return data
}

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

// Design helpers
export const createDesign = async (design: Omit<Design, 'id' | 'created_at' | 'updated_at' | 'views' | 'likes'>) => {
  const { data, error } = await supabase
    .from('designs')
    .insert({
      ...design,
      views: 0,
      likes: 0,
    })
    .select()
    .single()
  
  return { data, error }
}

export const getUserDesigns = async (userId: string) => {
  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const getDesignBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('designs')
    .select(`
      *,
      user_profiles (
        full_name,
        avatar_url
      )
    `)
    .eq('slug', slug)
    .single()
  
  return { data, error }
}

export const updateDesign = async (id: string, updates: Partial<Design>) => {
  const { data, error } = await supabase
    .from('designs')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

export const deleteDesign = async (id: string) => {
  const { data, error } = await supabase
    .from('designs')
    .delete()
    .eq('id', id)
  
  return { data, error }
}

export const incrementDesignViews = async (id: string) => {
  const { data, error } = await supabase.rpc('increment_design_views', {
    design_id: id
  })
  
  return { data, error }
}

// File upload helpers
export const uploadImage = async (file: File, bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)
  
  if (error) {
    return { data: null, error }
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return { data: { ...data, publicUrl }, error: null }
}