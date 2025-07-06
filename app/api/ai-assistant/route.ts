import { NextRequest, NextResponse } from 'next/server'
import { processVoiceCommand } from '@/lib/ai-services'

export async function POST(request: NextRequest) {
  try {
    const { command, roomState } = await request.json()
    
    console.log('AI Assistant API called with command:', command)
    console.log('Current room state:', roomState)
    
    // Process command with OpenAI
    const aiResponse = await processVoiceCommand(command, roomState)
    
    console.log('AI Assistant response:', aiResponse)
    
    return NextResponse.json({
      success: true,
      response: aiResponse.message,
      action: aiResponse.action,
      data: aiResponse
    })
    
  } catch (error) {
    console.error('AI Assistant API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process AI command',
        response: "I'm having trouble understanding your request. Please try again."
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Assistant API is running',
    endpoints: [
      'POST /api/ai-assistant - Process voice/text commands'
    ]
  })
}