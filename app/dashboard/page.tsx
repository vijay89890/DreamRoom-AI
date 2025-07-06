'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Upload, Eye, Share2, Trash2, Edit, Sparkles, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/lib/auth-context'
import { getUserDesigns, deleteDesign, updateDesign, Design } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, profile, loading: authLoading } = useAuth()
  
  const [designs, setDesigns] = useState<Design[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalDesigns: 0,
    totalViews: 0,
    totalShares: 0,
    totalLikes: 0,
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
      return
    }

    if (user) {
      loadUserDesigns()
    }
  }, [user, authLoading, router])

  const loadUserDesigns = async () => {
    if (!user) return

    try {
      const { data, error } = await getUserDesigns(user.id)
      
      if (error) {
        throw error
      }

      setDesigns(data || [])
      
      // Calculate stats
      const totalViews = data?.reduce((sum, design) => sum + design.views, 0) || 0
      const totalLikes = data?.reduce((sum, design) => sum + design.likes, 0) || 0
      
      setStats({
        totalDesigns: data?.length || 0,
        totalViews,
        totalShares: Math.floor(totalLikes * 0.3), // Estimate shares
        totalLikes,
      })
    } catch (error) {
      console.error('Error loading designs:', error)
      toast({
        title: "Error loading designs",
        description: "There was an error loading your designs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUploadRoom = () => {
    router.push('/upload')
  }

  const handleOpenDesign = (designId: string) => {
    router.push(`/editor/${designId}`)
  }

  const handleDeleteDesign = async (designId: string) => {
    try {
      const { error } = await deleteDesign(designId)
      
      if (error) {
        throw error
      }

      setDesigns(designs.filter(d => d.id !== designId))
      toast({
        title: "Design deleted",
        description: "Your design has been successfully deleted.",
      })
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: "Delete failed",
        description: "There was an error deleting your design.",
        variant: "destructive",
      })
    }
  }

  const handleTogglePublic = async (designId: string) => {
    const design = designs.find(d => d.id === designId)
    if (!design) return

    const newPublicStatus = !design.is_public
    
    try {
      const { error } = await updateDesign(designId, { is_public: newPublicStatus })
      
      if (error) {
        throw error
      }

      setDesigns(designs.map(d => 
        d.id === designId ? { ...d, is_public: newPublicStatus } : d
      ))
      
      toast({
        title: newPublicStatus ? "Design made public" : "Design made private",
        description: newPublicStatus 
          ? "Your design is now visible to everyone." 
          : "Your design is now private.",
      })
    } catch (error) {
      console.error('Toggle public error:', error)
      toast({
        title: "Update failed",
        description: "There was an error updating your design.",
        variant: "destructive",
      })
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Sparkles className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold text-white">DreamRoom AI</span>
              </Link>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                {profile.tier === 'free' ? 'Free' : profile.tier === 'premium' ? 'Premium' : 'Pro'} Member
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleUploadRoom}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Room
              </Button>
              <Avatar>
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="bg-purple-600 text-white">
                  {profile.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {profile.full_name.split(' ')[0]}!
          </h1>
          <p className="text-gray-300 text-lg">
            Continue creating amazing room designs with AI
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Designs</p>
                  <p className="text-2xl font-bold text-white">{stats.totalDesigns}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Eye className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-white">{stats.totalViews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Share2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Shares</p>
                  <p className="text-2xl font-bold text-white">{stats.totalShares}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-600 rounded-lg">
                  <Play className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Likes</p>
                  <p className="text-2xl font-bold text-white">{stats.totalLikes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Designs Section */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="all" className="text-white">All Designs</TabsTrigger>
            <TabsTrigger value="public" className="text-white">Public</TabsTrigger>
            <TabsTrigger value="private" className="text-white">Private</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Your Designs</h2>
              <Button
                onClick={handleUploadRoom}
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-gray-900"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>
            
            {designs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="mb-4">
                  <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">No designs yet</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Upload your first room photo to start creating amazing designs with AI
                  </p>
                </div>
                <Button
                  onClick={handleUploadRoom}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your First Room
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {designs.map((design, index) => (
                  <motion.div
                    key={design.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-800 border-slate-700 hover:bg-slate-700 transition-colors group">
                      <CardContent className="p-0">
                        <div className="relative">
                          <img
                            src={design.thumbnail_url}
                            alt={design.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="absolute top-2 right-2 flex space-x-2">
                            <Badge 
                              variant="default"
                              className="text-xs"
                            >
                              Completed
                            </Badge>
                            {design.is_public && (
                              <Badge variant="outline" className="text-xs border-green-500 text-green-500">
                                Public
                              </Badge>
                            )}
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button 
                              size="sm" 
                              className="bg-white text-black hover:bg-gray-100"
                              onClick={() => handleOpenDesign(design.id)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Open
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">{design.title}</h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                                <DropdownMenuItem 
                                  onClick={() => handleTogglePublic(design.id)}
                                  className="text-white hover:bg-slate-700"
                                >
                                  <Share2 className="h-4 w-4 mr-2" />
                                  {design.is_public ? 'Make Private' : 'Make Public'}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteDesign(design.id)}
                                  className="text-red-400 hover:bg-slate-700"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{design.description}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center space-x-1">
                                <Eye className="h-3 w-3" />
                                <span>{design.views}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Play className="h-3 w-3" />
                                <span>{design.likes}</span>
                              </span>
                            </div>
                            <span>{new Date(design.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="public" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.filter(d => d.is_public).map((design, index) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800 border-slate-700 hover:bg-slate-700 transition-colors group">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={design.thumbnail_url}
                          alt={design.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button 
                            size="sm" 
                            className="bg-white text-black hover:bg-gray-100"
                            onClick={() => handleOpenDesign(design.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Open
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white mb-2">{design.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{design.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{design.views}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Play className="h-3 w-3" />
                              <span>{design.likes}</span>
                            </span>
                          </div>
                          <span>{new Date(design.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="private" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.filter(d => !d.is_public).map((design, index) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800 border-slate-700 hover:bg-slate-700 transition-colors group">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={design.thumbnail_url}
                          alt={design.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button 
                            size="sm" 
                            className="bg-white text-black hover:bg-gray-100"
                            onClick={() => handleOpenDesign(design.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Open
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white mb-2">{design.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{design.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{design.views}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Play className="h-3 w-3" />
                              <span>{design.likes}</span>
                            </span>
                          </div>
                          <span>{new Date(design.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}