import { Metadata } from 'next'
import { Eye, Share2, Heart, Download, Sparkles, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

// This would typically come from a database
const getDesignData = (slug: string) => {
  return {
    id: slug,
    title: 'Modern Living Room Makeover',
    description: 'A stunning transformation of a traditional living room into a modern, minimalist space with clean lines and warm lighting.',
    author: {
      name: 'Sarah Mitchell',
      avatar: '/api/placeholder/40/40',
      username: 'sarahm_design'
    },
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    thumbnail: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
    roomType: 'Living Room',
    style: 'Modern Minimalist',
    tags: ['modern', 'minimalist', 'living room', 'neutral colors', 'clean lines'],
    stats: {
      views: 2847,
      likes: 156,
      shares: 43
    },
    createdAt: '2024-01-15T10:30:00Z',
    furniture: [
      { name: 'Modern Sectional Sofa', price: '$1,299', brand: 'West Elm' },
      { name: 'Glass Coffee Table', price: '$349', brand: 'CB2' },
      { name: 'Floor Lamp', price: '$199', brand: 'IKEA' },
      { name: 'Area Rug', price: '$249', brand: 'Rugs USA' }
    ]
  }
}

interface Props {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const design = getDesignData(params.slug)
  
  return {
    title: `${design.title} - DreamRoom AI`,
    description: design.description,
    openGraph: {
      title: `${design.title} - DreamRoom AI`,
      description: design.description,
      images: [
        {
          url: design.image,
          width: 1260,
          height: 750,
          alt: design.title,
        },
      ],
      type: 'article',
      authors: [design.author.name],
      publishedTime: design.createdAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${design.title} - DreamRoom AI`,
      description: design.description,
      images: [design.image],
      creator: `@${design.author.username}`,
    },
  }
}

export default function SharedDesignPage({ params }: Props) {
  const design = getDesignData(params.slug)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Sparkles className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold text-white" data-macaly="shared-logo">DreamRoom AI</span>
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-white">Shared Design</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                Sign In
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Create Your Own
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={design.image}
                    alt={design.title}
                    className="w-full h-[600px] object-cover"
                    data-macaly="shared-design-image"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-purple-600 text-white">
                          {design.roomType}
                        </Badge>
                        <Badge variant="outline" className="text-white border-white">
                          {design.style}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-white">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm">{design.stats.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{design.stats.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share2 className="h-4 w-4" />
                          <span className="text-sm">{design.stats.shares}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Design Info */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-white mb-3" data-macaly="shared-design-title">
                  {design.title}
                </h1>
                <p className="text-gray-300 mb-4" data-macaly="shared-design-description">
                  {design.description}
                </p>
                
                <div className="flex items-center space-x-3 mb-6">
                  <Avatar>
                    <AvatarImage src={design.author.avatar} />
                    <AvatarFallback className="bg-purple-600 text-white">
                      {design.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-semibold">{design.author.name}</p>
                    <p className="text-gray-400 text-sm">@{design.author.username}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {design.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Heart className="h-4 w-4 mr-2" />
                    Like
                  </Button>
                  <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Furniture List */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Featured Furniture</h3>
                <div className="space-y-3">
                  {design.furniture.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium text-sm">{item.name}</p>
                        <p className="text-gray-400 text-xs">{item.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-purple-400 font-semibold">{item.price}</p>
                        <Button size="sm" variant="ghost" className="text-xs text-gray-400 hover:text-white">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Shop All Items
                </Button>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-0">
              <CardContent className="p-6 text-center">
                <Sparkles className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Create Your Own</h3>
                <p className="text-purple-100 text-sm mb-4">
                  Upload your room photo and start designing with AI
                </p>
                <Button className="bg-white text-purple-600 hover:bg-gray-100">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}