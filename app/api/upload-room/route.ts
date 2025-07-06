import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const roomTitle = formData.get('roomTitle') as string
    const roomType = formData.get('roomType') as string
    const roomDescription = formData.get('roomDescription') as string
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      )
    }
    
    console.log('Room upload request:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      roomTitle,
      roomType,
      roomDescription
    })
    
    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock AI processing response
    const designId = `design-${Date.now()}`
    const mockDesignData = {
      id: designId,
      title: roomTitle || 'Untitled Room',
      description: roomDescription || 'AI-generated room design',
      roomType,
      thumbnail: `https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400`,
      status: 'completed',
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      designState: {
        furniture: [
          { type: 'sofa', position: { x: 0, y: 0, z: 0 }, style: 'modern' },
          { type: 'coffee_table', position: { x: 0, y: 0, z: 1 }, material: 'wood' }
        ],
        walls: { color: 'white', material: 'paint' },
        lighting: { brightness: 70, temperature: 'warm' },
        camera: { position: { x: 5, y: 2, z: 5 }, rotation: { x: 0, y: 0, z: 0 } }
      }
    }
    
    console.log('Generated design data:', mockDesignData)
    
    return NextResponse.json({
      success: true,
      message: 'Room uploaded and processed successfully',
      designId,
      designData: mockDesignData
    })
    
  } catch (error) {
    console.error('Room upload error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process room upload',
        message: 'There was an error processing your room photo. Please try again.'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Room Upload API is running',
    endpoints: [
      'POST /api/upload-room - Upload and process room photos'
    ]
  })
}