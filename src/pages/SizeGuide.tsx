import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const SizeGuide = () => {
  const sizeData = [
    { size: 'S', chest: '36-38', waist: '30-32', length: '27-28', shoulder: '16-17' },
    { size: 'M', chest: '40-42', waist: '34-36', length: '29-30', shoulder: '17-18' },
    { size: 'L', chest: '44-46', waist: '38-40', length: '31-32', shoulder: '18-19' },
    { size: 'XL', chest: '48-50', waist: '42-44', length: '33-34', shoulder: '19-20' },
    { size: 'XXL', chest: '52-54', waist: '46-48', length: '35-36', shoulder: '20-21' },
  ]

  const measurementTips = [
    {
      title: "Chest",
      description: "Measure around the fullest part of your chest, keeping the tape parallel to the ground."
    },
    {
      title: "Waist", 
      description: "Measure around your natural waistline, which is the narrowest part of your torso."
    },
    {
      title: "Length",
      description: "Measure from the highest point of your shoulder straight down to your desired length."
    },
    {
      title: "Shoulder",
      description: "Measure from one shoulder point to the other across your back."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight mb-4">
              Size Guide
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find your perfect fit with our comprehensive size guide. All measurements are in inches for the best accuracy.
            </p>
          </div>

          {/* Size Chart */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Size Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black">
                      <th className="text-left p-4 font-semibold">Size</th>
                      <th className="text-left p-4 font-semibold">Chest (inches)</th>
                      <th className="text-left p-4 font-semibold">Waist (inches)</th>
                      <th className="text-left p-4 font-semibold">Length (inches)</th>
                      <th className="text-left p-4 font-semibold">Shoulder (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeData.map((size, index) => (
                      <tr key={size.size} className={`border-b ${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                        <td className="p-4 font-medium text-black">{size.size}</td>
                        <td className="p-4">{size.chest}</td>
                        <td className="p-4">{size.waist}</td>
                        <td className="p-4">{size.length}</td>
                        <td className="p-4">{size.shoulder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Measurement Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-6">How to Measure</h2>
              <div className="space-y-4">
                {measurementTips.map((tip, index) => (
                  <div key={index} className="border-l-2 border-black pl-4">
                    <h3 className="font-semibold text-black mb-2">{tip.title}</h3>
                    <p className="text-muted-foreground">{tip.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-muted/30 p-6">
              <h2 className="text-2xl font-serif font-semibold mb-4">Fitting Tips</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-black font-medium">•</span>
                  <span>Measure yourself in undergarments for the most accurate fit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black font-medium">•</span>
                  <span>Keep the measuring tape snug but not tight</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black font-medium">•</span>
                  <span>If you're between sizes, we recommend choosing the larger size</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black font-medium">•</span>
                  <span>Our garments are designed with a comfortable, relaxed fit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black font-medium">•</span>
                  <span>For any questions about sizing, contact our customer service</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Care Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Care Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🧺</span>
                  </div>
                  <h3 className="font-semibold mb-2">Machine Wash</h3>
                  <p className="text-sm text-muted-foreground">Cold water, gentle cycle</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">☀️</span>
                  </div>
                  <h3 className="font-semibold mb-2">Air Dry</h3>
                  <p className="text-sm text-muted-foreground">Hang or lay flat to dry</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <h3 className="font-semibold mb-2">Iron Low</h3>
                  <p className="text-sm text-muted-foreground">Low heat if needed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SizeGuide