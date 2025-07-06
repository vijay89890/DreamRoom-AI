'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Image, CheckCircle, AlertCircle, Sparkles, ArrowRight, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/lib/auth-context'
import { uploadImage, createDesign } from '@/lib/supabase'
import { generateRoom3D, generateRoomDescription } from '@/lib/ai-services'

export default function UploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading: authLoading } = useAuth()
  
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [roomTitle, setRoomTitle] = useState('')
  const [roomDescription, setRoomDescription] = useState('')
  const [roomType, setRoomType] = useState('living_room')
  const [uploadComplete, setUploadComplete] = useState(false)
  const [generatedDesignId, setGeneratedDesignId] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
    }
  }, [user, authLoading, router])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (droppedFiles.length > 0) {
      setFiles(droppedFiles)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleUpload = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload your room.",
        variant: "destructive",
      })
      return
    }

    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select a room photo to upload.",
        variant: "destructive",
      })
      return
    }
    
    setUploading(true)
    setProgress(0)
    
    try {
      const file = files[0]
      const fileName = `${user.id}/${Date.now()}-${file.name}`
      
      // Upload image to Supabase Storage
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setProgress(i)
      }
      
      const { data: uploadData, error: uploadError } = await uploadImage(
        file,
        'room-images',
        fileName
      )
      
      if (uploadError) {
        throw uploadError
      }
      
      setUploading(false)
      setProcessing(true)
      setProgress(0)
      
      // Generate AI description if not provided
      let finalDescription = roomDescription
      if (!finalDescription) {
        finalDescription = await generateRoomDescription(uploadData.publicUrl)
      }
      
      // Generate 3D model (mock for now)
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 150))
        setProgress(i)
      }
      
      const { modelUrl, thumbnailUrl } = await generateRoom3D(uploadData.publicUrl)
      
      // Create design record
      const designTitle = roomTitle || 'My Room Design'
      const designSlug = `${generateSlug(designTitle)}-${Date.now()}`
      
      const { data: designData, error: designError } = await createDesign({
        user_id: user.id,
        slug: designSlug,
        title: designTitle,
        description: finalDescription,
        room_type: roomType,
        design_state: {
          originalImage: uploadData.publicUrl,
          modelUrl,
          furniture: [],
          walls: { color: '#ffffff' },
          lighting: { brightness: 70, temperature: 'warm' },
          camera: { position: { x: 5, y: 2, z: 5 }, rotation: { x: 0, y: 0, z: 0 } }
        },
        image_url: uploadData.publicUrl,
        thumbnail_url: thumbnailUrl,
        tags: [roomType, 'ai-generated'],
        is_public: false,
      })
      
      if (designError) {
        throw designError
      }
      
      setGeneratedDesignId(designData.id)
      setProcessing(false)
      setUploadComplete(true)
      
      toast({
        title: "Room uploaded successfully!",
        description: "Your room has been transformed into a 3D environment.",
      })
      
    } catch (error: any) {
      console.error('Upload error:', error)
      setUploading(false)
      setProcessing(false)
      toast({
        title: "Upload failed",
        description: error.message || "There was an error processing your room photo. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleViewDesign = () => {
    if (generatedDesignId) {
      router.push(`/editor/${generatedDesignId}`)
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">DreamRoom AI</span>
            </div>
            <span className="text-gray-400">/</span>
            <h1 className="text-xl font-semibold text-white">
              Upload Room Photo
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {!uploadComplete ? (
          <div className="space-y-8">
            {/* Instructions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Transform Your Room with AI</CardTitle>
                <CardDescription className="text-gray-400">
                  Upload a photo of your room and watch our AI create a stunning 3D environment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">High Quality Photo</h3>
                    <p className="text-gray-400 text-sm">
                      Use good lighting and capture the entire room for best results
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">AI Processing</h3>
                    <p className="text-gray-400 text-sm">
                      Our AI analyzes your room and creates a 3D model instantly
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Image className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">3D Environment</h3>
                    <p className="text-gray-400 text-sm">
                      Start redesigning with voice commands and AI assistance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Section */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Upload Photo</CardTitle>
                  <CardDescription className="text-gray-400">
                    Drag and drop or click to select your room photo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? 'border-purple-400 bg-purple-400/10'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-white mb-2">Drop your room photo here</p>
                      <p className="text-gray-400 text-sm mb-4">
                        or click to browse files
                      </p>
                      <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                        Select Photos
                      </Button>
                    </label>
                  </div>

                  {/* File List */}
                  {files.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Image className="h-5 w-5 text-purple-400" />
                            <div>
                              <p className="text-white text-sm font-medium">{file.name}</p>
                              <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-gray-400 hover:text-white"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Room Details */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Room Details</CardTitle>
                  <CardDescription className="text-gray-400">
                    Tell us about your room to get better AI suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="room-title" className="text-white">Room Title</Label>
                    <Input
                      id="room-title"
                      value={roomTitle}
                      onChange={(e) => setRoomTitle(e.target.value)}
                      placeholder="e.g., My Living Room"
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room-type" className="text-white">Room Type</Label>
                    <select
                      id="room-type"
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="w-full p-2 bg-slate-700 border-slate-600 text-white rounded-md"
                    >
                      <option value="living_room">Living Room</option>
                      <option value="bedroom">Bedroom</option>
                      <option value="kitchen">Kitchen</option>
                      <option value="bathroom">Bathroom</option>
                      <option value="dining_room">Dining Room</option>
                      <option value="office">Office</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room-description" className="text-white">Description (Optional)</Label>
                    <Textarea
                      id="room-description"
                      value={roomDescription}
                      onChange={(e) => setRoomDescription(e.target.value)}
                      placeholder="Describe your room style, preferences, or any specific requirements..."
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upload Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleUpload}
                disabled={files.length === 0 || uploading || processing}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
              >
                {uploading ? (
                  'Uploading...'
                ) : processing ? (
                  'Processing with AI...'
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Transform Room
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {/* Progress */}
            {(uploading || processing) && (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">
                        {uploading ? 'Uploading photo...' : 'AI processing...'}
                      </span>
                      <span className="text-gray-400">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-gray-400 text-sm">
                      {uploading 
                        ? 'Uploading your room photo to our secure servers'
                        : 'Our AI is analyzing your room and creating a 3D model'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Success State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Room Transformation Complete!
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                      Your room has been successfully converted into a 3D environment. 
                      Start designing with our AI assistant now!
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleViewDesign}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Start Designing
                    </Button>
                    <Button
                      onClick={() => router.push('/dashboard')}
                      variant="outline"
                      className="text-white border-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg"
                    >
                      View All Designs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}