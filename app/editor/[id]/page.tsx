'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Save, 
  Share2, 
  Undo, 
  Redo, 
  Home, 
  Sparkles, 
  Settings,
  Play,
  Pause,
  VolumeX,
  Volume2,
  MessageCircle,
  Send
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const designId = params.id as string
  
  console.log('Editor page rendered for design:', designId)
  
  const [isRecording, setIsRecording] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [roomCommand, setRoomCommand] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [chatHistory, setChatHistory] = useState([
    { type: 'ai', message: 'Hello! I\'m your AI design assistant. Tell me how you\'d like to transform your room!' }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [cameraAngle, setCameraAngle] = useState([0])
  const [lighting, setLighting] = useState([50])
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isAvatarVisible, setIsAvatarVisible] = useState(true)
  const [roomState, setRoomState] = useState({
    furniture: [],
    walls: { color: 'white' },
    lighting: { brightness: 50 }
  })
  
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simulate 3D scene rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawScene = () => {
      // Clear canvas
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw room outline
      ctx.strokeStyle = '#475569'
      ctx.lineWidth = 2
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100)
      
      // Draw furniture (simplified)
      ctx.fillStyle = '#8b5cf6'
      ctx.fillRect(100, 200, 150, 80) // Sofa
      
      ctx.fillStyle = '#059669'
      ctx.fillRect(300, 150, 60, 60) // Table
      
      ctx.fillStyle = '#dc2626'
      ctx.fillRect(400, 100, 80, 20) // Wall decoration
      
      // Draw AI avatar indicator
      if (isAvatarVisible) {
        ctx.fillStyle = '#06b6d4'
        ctx.beginPath()
        ctx.arc(50, 50, 20, 0, 2 * Math.PI)
        ctx.fill()
        
        ctx.fillStyle = '#ffffff'
        ctx.font = '12px Arial'
        ctx.fillText('AI', 44, 55)
      }
      
      // Add lighting effect
      const lightIntensity = lighting[0] / 100
      ctx.fillStyle = `rgba(255, 255, 255, ${lightIntensity * 0.1})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    drawScene()
  }, [lighting, isAvatarVisible])

  const handleVoiceCommand = async () => {
    if (isRecording) {
      setIsRecording(false)
      setIsProcessing(true)
      console.log('Processing voice command')
      
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const responses = [
        "I've added a modern sofa to your living room. How does it look?",
        "The wall color has been changed to a warmer tone. What do you think?",
        "I've placed a beautiful plant in the corner. It adds great ambiance!",
        "The lighting has been adjusted for a cozier atmosphere."
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setAiResponse(randomResponse)
      setChatHistory(prev => [...prev, 
        { type: 'user', message: 'Voice command processed' },
        { type: 'ai', message: randomResponse }
      ])
      
      setIsProcessing(false)
    } else {
      setIsRecording(true)
      console.log('Started voice recording')
    }
  }

  const handleTextCommand = async () => {
    if (!currentMessage.trim()) return
    
    setIsProcessing(true)
    const userMessage = currentMessage
    setChatHistory(prev => [...prev, { type: 'user', message: userMessage }])
    
    console.log('Processing text command:', userMessage)
    
    try {
      // Call AI assistant API
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: userMessage,
          roomState: roomState
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to process command')
      }

      const data = await response.json()
      
      if (data.success) {
        setChatHistory(prev => [...prev, { type: 'ai', message: data.response }])
        
        // Update room state based on AI response
        if (data.data && data.action !== 'unknown') {
          setRoomState(prev => ({ ...prev, lastAction: data.data }))
        }
        
        toast({
          title: "Command processed",
          description: "Your room has been updated!",
        })
      } else {
        throw new Error(data.error || 'Command processing failed')
      }
    } catch (error) {
      console.error('Error processing command:', error)
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        message: "I'm having trouble processing that request. Could you try rephrasing it?" 
      }])
      
      toast({
        title: "Command failed",
        description: "There was an error processing your request.",
        variant: "destructive",
      })
    } finally {
      setCurrentMessage('')
      setIsProcessing(false)
    }
  }

  const handleSaveDesign = async () => {
    console.log('Saving design:', designId)
    try {
      toast({
        title: "Design saved",
        description: "Your room design has been saved successfully.",
      })
    } catch (error) {
      console.error('Save error:', error)
      toast({
        title: "Save failed",
        description: "There was an error saving your design.",
        variant: "destructive",
      })
    }
  }

  const handleShareDesign = async () => {
    console.log('Sharing design:', designId)
    try {
      const shareUrl = `${window.location.origin}/designs/modern-living-room-${designId}`
      await navigator.clipboard.writeText(shareUrl)
      
      toast({
        title: "Share link copied",
        description: "The share link has been copied to your clipboard.",
      })
    } catch (error) {
      console.error('Share error:', error)
      toast({
        title: "Share failed",
        description: "There was an error creating the share link.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-white">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white" data-macaly="editor-title">
                Modern Living Room
              </h1>
              <p className="text-sm text-gray-400">Last saved 2 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-white">
              <Undo className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <Redo className="h-5 w-5" />
            </Button>
            <Button 
              onClick={handleSaveDesign}
              variant="outline" 
              className="text-white border-white hover:bg-white hover:text-gray-900"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              onClick={handleShareDesign}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* 3D Viewport */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-full bg-slate-800"
            data-macaly="3d-viewport"
          />
          
          {/* 3D Controls Overlay */}
          <div className="absolute top-4 left-4 space-y-2">
            <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 text-white text-sm">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span>3D Room View</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700">
              <CardContent className="p-3">
                <div className="space-y-2">
                  <Label className="text-white text-xs">Camera Angle</Label>
                  <Slider
                    value={cameraAngle}
                    onValueChange={setCameraAngle}
                    max={360}
                    step={1}
                    className="w-20"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700">
              <CardContent className="p-3">
                <div className="space-y-2">
                  <Label className="text-white text-xs">Lighting</Label>
                  <Slider
                    value={lighting}
                    onValueChange={setLighting}
                    max={100}
                    step={1}
                    className="w-20"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Voice Recording Indicator */}
          {isRecording && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4"
            >
              <Card className="bg-red-600 border-red-500">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2 text-white text-sm">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>Recording...</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {/* Processing Indicator */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 text-white">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
                    <span>AI is processing your request...</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-96 bg-slate-800/50 backdrop-blur-xl border-l border-slate-700">
          <Tabs defaultValue="chat" className="h-full flex flex-col">
            <TabsList className="bg-slate-800 border-slate-700 m-4 mb-0">
              <TabsTrigger value="chat" className="text-white">AI Chat</TabsTrigger>
              <TabsTrigger value="settings" className="text-white">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col p-4 space-y-4">
              {/* AI Avatar */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">AI Assistant</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-400">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                        className="text-gray-400 hover:text-white"
                      >
                        {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsAvatarVisible(!isAvatarVisible)}
                        className="text-gray-400 hover:text-white"
                      >
                        {isAvatarVisible ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Chat History */}
              <div className="flex-1 overflow-y-auto space-y-3">
                {chatHistory.map((chat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs p-3 rounded-lg ${
                      chat.type === 'user' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-slate-700 text-white'
                    }`}>
                      <p className="text-sm">{chat.message}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Voice Control */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      onClick={handleVoiceCommand}
                      className={`${
                        isRecording 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-purple-600 hover:bg-purple-700'
                      } text-white`}
                      disabled={isProcessing}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="h-4 w-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Voice Command
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Text Input */}
              <div className="flex space-x-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Type your design request..."
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleTextCommand()}
                />
                <Button
                  onClick={handleTextCommand}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={!currentMessage.trim() || isProcessing}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="flex-1 p-4 space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4 space-y-4">
                  <div>
                    <Label className="text-white">Room Style</Label>
                    <select className="w-full mt-1 p-2 bg-slate-700 border-slate-600 text-white rounded-md">
                      <option>Modern</option>
                      <option>Contemporary</option>
                      <option>Minimalist</option>
                      <option>Scandinavian</option>
                      <option>Industrial</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label className="text-white">Color Scheme</Label>
                    <select className="w-full mt-1 p-2 bg-slate-700 border-slate-600 text-white rounded-md">
                      <option>Neutral</option>
                      <option>Warm</option>
                      <option>Cool</option>
                      <option>Monochrome</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label className="text-white">Budget Range</Label>
                    <select className="w-full mt-1 p-2 bg-slate-700 border-slate-600 text-white rounded-md">
                      <option>Under $1,000</option>
                      <option>$1,000 - $5,000</option>
                      <option>$5,000 - $10,000</option>
                      <option>$10,000+</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}