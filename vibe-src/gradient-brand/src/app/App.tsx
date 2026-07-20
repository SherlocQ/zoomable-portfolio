import { useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Type, Palette, ArrowRight } from 'lucide-react';
import TypographyPage from './components/TypographyPage';
import ColorsPage from './components/ColorsPage';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { typographyStyles } from './components/TypographyHelpers';
import typographyOverlay from 'figma:asset/63ca5d6710e689bdcf398c738c0dc42dedd360b3.png';
import overlayImage from 'figma:asset/d86a257bea60241a0733e37ddd0fc7f715877845.png';

type Page = 'landing' | 'typography' | 'colors';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const handleNavigateToTypography = () => {
    setCurrentPage('typography');
  };

  const handleNavigateToColors = () => {
    setCurrentPage('colors');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  if (currentPage === 'typography') {
    return <TypographyPage onBack={handleBackToLanding} />;
  }

  if (currentPage === 'colors') {
    return <ColorsPage onBack={handleBackToLanding} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 
            className="mb-4 text-gray-900"
            style={typographyStyles.h1Jumbo}
          >
            Brand 2.0 Arc & Seismic Analysis
          </h1>
          <p 
            className="text-gray-600 max-w-3xl mx-auto"
            style={typographyStyles.bodyLarge}
          >
            Explore our comprehensive design system with interactive tools for typography and colors. 
            Analyze design tokens, CSS mappings, and implementation guidelines.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Typography Card */}
          <Card 
            className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm flex flex-col"
            onClick={handleNavigateToTypography}
          >
            <CardContent className="p-8 flex flex-col flex-1">
              <div className="flex-1">
                <div className="relative overflow-hidden rounded-xl mb-6">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1664255431351-273fd79b2c1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0eXBvZ3JhcGh5JTIwbGV0dGVycyUyMGRlc2lnbnxlbnwxfHx8fDE3NTk4MDg0NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Typography design illustration"
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <img src={typographyOverlay} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full">
                      <Type className="h-6 w-6 text-gray-900" />
                    </div>
                  </div>
                </div>
                
                <h3 
                  className="mb-3 group-hover:text-gray-900 transition-colors"
                  style={typographyStyles.h4}
                >
                  Typography Explorer
                </h3>
                <p 
                  className="text-gray-600 mb-6"
                  style={typographyStyles.bodyMedium}
                >
                  Click any typography style to view detailed CSS properties across 6 responsive breakpoints. 
                  Explore font-family mappings, weight conversions, and copy ready-to-use CSS code with syntax highlighting. 
                  Includes Figma variable mapping, combined CSS classes, and live previews.
                </p>
              </div>

              <Button 
                className="w-full group-hover:bg-gray-900 transition-colors"
                size="lg"
              >
                Explore Typography
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Colors Card */}
          <Card 
            className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm flex flex-col"
            onClick={handleNavigateToColors}
          >
            <CardContent className="p-8 flex flex-col flex-1">
              <div className="flex-1">
                <div className="relative overflow-hidden rounded-xl mb-6">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1650402268468-7526b2502a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvciUyMHBhbGV0dGUlMjBkZXNpZ258ZW58MXx8fHwxNzU5ODM5MDE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Color palette design illustration"
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <img src={overlayImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full">
                      <Palette className="h-6 w-6 text-gray-900" />
                    </div>
                  </div>
                </div>
                
                <h3 
                  className="mb-3 group-hover:text-gray-900 transition-colors"
                  style={typographyStyles.h4}
                >
                  Color System
                </h3>
                <p 
                  className="text-gray-600 mb-6"
                  style={typographyStyles.bodyMedium}
                >
                  Side-by-side comparison of Seismic and Arc color tokens with visual swatches. 
                  Search, filter by category, and instantly copy hex values or token names. 
                  View match status with Delta E accuracy scores. Switch between list and card layouts.
                </p>
              </div>

              <Button 
                className="w-full group-hover:bg-gray-900 transition-colors"
                size="lg"
              >
                Explore Colors
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>


      </div>
    </div>
  );
}