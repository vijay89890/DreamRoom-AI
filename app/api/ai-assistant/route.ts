import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { command, roomState } = await request.json()
    
    console.log('AI Assistant API called with command:', command)
    console.log('Current room state:', roomState)
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock AI response based on command
    const responses = {
      'add sofa': {
        action: 'add_furniture',
        item: 'modern_sofa',
        position: { x: 0, y: 0, z: 0 },
        style: 'modern',
        color: 'gray',
        message: "I've added a modern gray sofa to your room. It's positioned perfectly for conversation!"
      },
      'change wall color': {
        action: 'change_wall_color',
        color: 'warm_beige',
        message: "I've changed the wall color to a warm beige. This creates a cozy atmosphere!"
      },
      'add plant': {
        action: 'add_decoration',
        item: 'plant',
        type: 'fiddle_leaf_fig',
        position: { x: 2, y: 0, z: 1 },
        message: "I've added a beautiful fiddle leaf fig plant to brighten up the space!"
      },
      'make it brighter': {
        action: 'adjust_lighting',
        brightness: 80,
        temperature: 'warm',
        message: "I've increased the lighting to make the room brighter and more inviting!"
      },
      'add coffee table': {
        action: 'add_furniture',
        item: 'coffee_table',
        material: 'glass',
        position: { x: 0, y: 0, z: 0.5 },
        message: "I've added a sleek glass coffee table that complements your sofa perfectly!"
      }
    }
    
    // Find matching response based on command keywords
    const lowercaseCommand = command.toLowerCase()
    let response = {
      action: 'unknown',
      message: "I understand you want to make changes to your room. Could you be more specific about what you'd like me to do?"
    }
    
    for (const [key, value] of Object.entries(responses)) {
      if (lowercaseCommand.includes(key.toLowerCase())) {
        response = value
        break
      }
    }
    
    // If no specific match, provide a generic helpful response
    if (response.action === 'unknown') {
      if (lowercaseCommand.includes('add')) {
        response = {
          action: 'suggestion',
          message: "I can help you add furniture, decorations, or plants to your room. Try saying 'add a sofa' or 'add a plant'."
        }
      } else if (lowercaseCommand.includes('change') || lowercaseCommand.includes('color')) {
        response = {
          action: 'suggestion',
          message: "I can help you change colors in your room. Try saying 'change wall color' or 'make it warmer'."
        }
      } else if (lowercaseCommand.includes('light') || lowercaseCommand.includes('bright')) {
        response = {
          action: 'suggestion',
          message: "I can adjust the lighting in your room. Try saying 'make it brighter' or 'add warm lighting'."
        }
      }
    }
    
    console.log('AI Assistant response:', response)
    
    return NextResponse.json({
      success: true,
      response: response.message,
      action: response.action,
      data: response
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