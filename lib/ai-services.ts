import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AICommand {
  action: string
  item?: string
  position?: { x: number; y: number; z: number }
  style?: string
  color?: string
  material?: string
  size?: string
  message: string
}

export const processVoiceCommand = async (command: string, roomState: any): Promise<AICommand> => {
  try {
    const prompt = `
You are an AI interior design assistant. Parse the following user command and return a JSON response with the appropriate action.

User command: "${command}"
Current room state: ${JSON.stringify(roomState)}

Available actions:
- add_furniture: Add furniture items (sofa, chair, table, bed, etc.)
- remove_furniture: Remove existing furniture
- change_wall_color: Change wall colors
- change_flooring: Change floor materials
- adjust_lighting: Modify lighting settings
- move_furniture: Reposition existing items
- change_style: Apply style themes (modern, traditional, minimalist, etc.)

Return JSON in this format:
{
  "action": "action_type",
  "item": "item_name",
  "position": {"x": 0, "y": 0, "z": 0},
  "style": "style_name",
  "color": "color_name",
  "material": "material_name",
  "size": "size_description",
  "message": "Friendly response to user about what you're doing"
}

Only include relevant fields for the action. Be creative and helpful!
`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful interior design AI assistant. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    try {
      return JSON.parse(content)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        action: 'unknown',
        message: "I understand you want to make changes to your room. Could you be more specific about what you'd like me to do?",
      }
    }
  } catch (error) {
    console.error('Error processing voice command:', error)
    return {
      action: 'error',
      message: "I'm having trouble processing your request right now. Please try again.",
    }
  }
}

export const generateRoomDescription = async (imageUrl: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this room image and provide a detailed description of the space, including furniture, colors, style, and layout. Keep it concise but informative.',
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    })

    return response.choices[0]?.message?.content || 'A beautiful room space ready for redesign.'
  } catch (error) {
    console.error('Error generating room description:', error)
    return 'A room space ready for your creative touch.'
  }
}

// Mock 3D generation service (replace with Replicate API)
export const generateRoom3D = async (imageUrl: string): Promise<{ modelUrl: string; thumbnailUrl: string }> => {
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  // For now, return mock data
  // In production, this would call Replicate API or similar service
  return {
    modelUrl: '/models/room-placeholder.glb', // Mock 3D model
    thumbnailUrl: imageUrl, // Use original image as thumbnail for now
  }
}

// Replicate API integration (uncomment when ready to use)
/*
export const generateRoom3DWithReplicate = async (imageUrl: string) => {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'your-model-version-here',
      input: {
        image: imageUrl,
        // Add other parameters as needed
      },
    }),
  })
  
  const prediction = await response.json()
  
  // Poll for completion
  let result = prediction
  while (result.status === 'starting' || result.status === 'processing') {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
    })
    result = await pollResponse.json()
  }
  
  return result
}
*/