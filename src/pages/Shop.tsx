
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, Settings } from 'lucide-react'
import { useProducts } from '@/contexts/ProductsContext'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { useAdmin } from '@/contexts/AdminContext'
import AdminShopManager from '@/components/AdminShopManager'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const Shop = () => {
  const { user } = useAuth()
  const { products, categories } = useProducts()
  const { sections, getProductSections } = useAdmin()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [adminDialogOpen, setAdminDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(10)

  const isAdmin = user?.email === 'hehe@me.pk'
  
  // Use ProductsContext categories
  const availableCategories = categories
  const activeSections = sections.filter(section => section.isActive)

  // Initialize state from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    const urlCategory = searchParams.get('category')
    const urlSort = searchParams.get('sort')
    
    if (urlSearch) {
      setSearchQuery(urlSearch)
    }
    if (urlCategory && availableCategories.includes(urlCategory)) {
      setSelectedCategory(urlCategory)
    }
    if (urlSort) {
      setSortBy(urlSort)
    }
  }, [searchParams, availableCategories])

  // Update URL when filters change
  const updateURL = (newSearch?: string, newCategory?: string, newSort?: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (newSearch !== undefined) {
      if (newSearch.trim()) {
        params.set('search', newSearch.trim())
      } else {
        params.delete('search')
      }
    }
    
    if (newCategory !== undefined) {
      if (newCategory !== "All") {
        params.set('category', newCategory)
      } else {
        params.delete('category')
      }
    }
    
    if (newSort !== undefined) {
      if (newSort !== "name") {
        params.set('sort', newSort)
      } else {
        params.delete('sort')
      }
    }
    
    setSearchParams(params)
  }

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesSearch = searchQuery.trim() === "" || 
                           product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (product.colors && Array.isArray(product.colors) && product.colors.some(color => color.toLowerCase().includes(searchQuery.toLowerCase())))
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "popularity":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        default:
          return 0
      }
    })

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    updateURL(value, undefined, undefined)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    updateURL(undefined, value, undefined)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    updateURL(undefined, undefined, value)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-container py-16">
        {/* Page Header */}
        <div className="text-center mb-12 relative">
          {/* Admin button positioned top right */}
          {isAdmin && (
            <div className="absolute top-0 right-0">
              <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Shop
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Shop Management</DialogTitle>
                  </DialogHeader>
                  <AdminShopManager />
                </DialogContent>
              </Dialog>
            </div>
          )}
          
          {/* Centered title */}
          <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight mb-4">
            Shop Collection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of premium designs crafted with exceptional quality and timeless elegance.
          </p>
        </div>

        {/* Global Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {availableCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-12">
          {availableCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Shop Sections */}
        {activeSections.length > 0 ? (
          activeSections.map((section, sectionIndex) => {
            // Filter products by section
            const sectionProducts = products.filter(product => {
              const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
              const matchesSearch = searchQuery.trim() === "" || 
                               product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                               product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               (product.colors && Array.isArray(product.colors) && product.colors.some(color => color.toLowerCase().includes(searchQuery.toLowerCase())))
              
              // Check if product is assigned to this specific section
              const assignedSections = getProductSections(product.id)
              const matchesSection = assignedSections.length === 0 
                ? section.categories.includes("All") || section.categories.includes(product.category) // No assignment means use category matching
                : assignedSections.includes(section.id) // Has assignment, check if this section is included
              
              return matchesCategory && matchesSearch && matchesSection
            }).sort((a, b) => {
              switch (sortBy) {
                case "price-low":
                  return a.price - b.price
                case "price-high":
                  return b.price - a.price
                case "name":
                  return a.name.localeCompare(b.name)
                case "popularity":
                  return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
                default:
                  return 0
              }
            })

            if (sectionProducts.length === 0 && (searchQuery || selectedCategory !== "All")) {
              return null // Hide empty sections when filtering
            }

            // Pagination for section products
            const totalPages = Math.ceil(sectionProducts.length / productsPerPage)
            const startIndex = (currentPage - 1) * productsPerPage
            const endIndex = startIndex + productsPerPage
            const paginatedProducts = sectionProducts.slice(startIndex, endIndex)

            return (
              <section key={section.id} className={sectionIndex > 0 ? "mt-16" : ""}>
                {/* Section Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-serif font-semibold tracking-tight mb-2">
                    {section.name}
                  </h2>
                  <p className="text-muted-foreground">
                    {section.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {section.categories.map((category) => (
                      <span key={category} className="text-xs bg-muted px-2 py-1 rounded">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Section Products Grid - 2 products per row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
                  {paginatedProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      className="slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination className="mt-8">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const pageNum = i + 1
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNum)}
                              isActive={currentPage === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}
                      
                      {totalPages > 5 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}

                {sectionProducts.length === 0 && !searchQuery && selectedCategory === "All" && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No products available in this section yet.</p>
                  </div>
                )}
              </section>
            )
          })
        ) : (
          // Fallback to show all products if no sections exist
          <section>
            {(() => {
              // Pagination for all products
              const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
              const startIndex = (currentPage - 1) * productsPerPage
              const endIndex = startIndex + productsPerPage
              const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

              return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {paginatedProducts.map((product, index) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        className="slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination className="mt-8">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const pageNum = i + 1
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                onClick={() => setCurrentPage(pageNum)}
                                isActive={currentPage === pageNum}
                                className="cursor-pointer"
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        })}
                        
                        {totalPages > 5 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-16">
                      <h3 className="text-xl font-semibold mb-2">No products found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                </>
              )
            })()}
          </section>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Shop
