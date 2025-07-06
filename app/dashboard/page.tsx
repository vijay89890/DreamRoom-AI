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
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  console.log('Dashboard page rendered')
  
  const [designs, setDesigns] = useState([
    {
      id: '1',
      title: 'Modern Living Room',
      description: 'Contemporary design with clean lines',
      thumbnail: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'completed',
      views: 128,
      likes: 24,
      createdAt: '2024-01-15',
      isPublic: true
    },
    {
      id: '2',
      title: 'Cozy Bedroom Retreat',
      description: 'Warm and inviting bedroom design',
      thumbnail: 'https://images.pexels.com/photos/1571452/pexels-photo-1571452.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'in_progress',
      views: 45,
      likes: 12,
      createdAt: '2024-01-12',
      isPublic: false
    },
    {
      id: '3',
      title: 'Minimalist Office Space',
      description: 'Clean and productive workspace',
      thumbnail: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'completed',
      views: 89,
      likes: 18,
      createdAt: '2024-01-10',
      isPublic: true
    }
  ])
  const [loading, setLoading] = useState(false)

  const handleUploadRoom = () => {
    console.log('Upload room clicked')
    router.push('/upload')
  }

  const handleOpenDesign = (designId: string) => {
    console.log('Opening design:', designId)
    router.push(`/editor/${designId}`)
  }

  const handleDeleteDesign = (designId: string) => {
    console.log('Delete design:', designId)
    setDesigns(designs.filter(d => d.id !== designId))
    toast({
      title: "Design deleted",
      description: "Your design has been successfully deleted.",
    })
  }

  const handleTogglePublic = (designId: string) => {
    console.log('Toggle public:', designId)
    const design = designs.find(d => d.id === designId)
    const newPublicStatus = !design?.isPublic
    
    setDesigns(designs.map(d => 
      d.id === designId ? { ...d, isPublic: newPublicStatus } : d
    ))
    
    toast({
      title: newPublicStatus ? "Design made public" : "Design made private",
      description: newPublicStatus 
        ? "Your design is now visible to everyone." 
        : "Your design is now private.",
    })
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
                <span className="text-2xl font-bold text-white" data-macaly="dashboard-logo">DreamRoom AI</span>
              </Link>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                Pro Member
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
                <AvatarImage src="/api/placeholder/40/40" />
                <AvatarFallback className="bg-purple-600 text-white">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2" data-macaly="dashboard-title">
            Welcome back, John!
          </h1>
          <p className="text-gray-300 text-lg" data-macaly="dashboard-subtitle">
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
                  <p className="text-2xl font-bold text-white">3</p>
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
                  <p className="text-2xl font-bold text-white">262</p>
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
                  <p className="text-2xl font-bold text-white">18</p>
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
                  <p className="text-2xl font-bold text-white">54</p>
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
            <TabsTrigger value="in-progress" className="text-white">In Progress</TabsTrigger>
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
                          src={design.thumbnail}
                          alt={design.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                          data-macaly={`design-thumbnail-${design.id}`}
                        />
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <Badge 
                            variant={design.status === 'completed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {design.status === 'completed' ? 'Completed' : 'In Progress'}
                          </Badge>
                          {design.isPublic && (
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
                                {design.isPublic ? 'Make Private' : 'Make Public'}
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
                          <span>{design.createdAt}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {designs.length === 0 && (
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
            <Link href="/upload">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First Room
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}