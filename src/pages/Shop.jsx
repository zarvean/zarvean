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
  const { products } = useProducts()
  const { categories: adminCategories, sections, getProductSections } = useAdmin()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [adminDialogOpen, setAdminDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(10)

  const isAdmin = user?.email === 'hehe@me.pk'
  
  // Use admin categories only
  const availableCategories = adminCategories
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
  const updateURL = (newSearch, newCategory, newSort) => {
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
                           product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.colors.some(color => color.toLowerCase().includes(searchQuery.toLowerCase()))
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

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    updateURL(value, undefined, undefined)
  }

  const handleCategoryChange = (value) => {
    setSelectedCategory(value)
    updateURL(undefined, value, undefined)
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    updateURL(undefined, undefined, value)
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container py-5">
        {/* Page Header */}
        <div className="text-center mb-5 position-relative">
          {/* Admin button positioned top right */}
          {isAdmin && (
            <div className="position-absolute top-0 end-0">
              <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 me-2" />
                    Manage Shop
                  </Button>
                </DialogTrigger>
                <DialogContent className="modal-xl" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                  <DialogHeader>
                    <DialogTitle>Shop Management</DialogTitle>
                  </DialogHeader>
                  <AdminShopManager />
                </DialogContent>
              </Dialog>
            </div>
          )}
          
          {/* Centered title */}
          <h1 className="mb-3" style={{ fontSize: '2.5rem', fontFamily: 'Playfair Display, serif', fontWeight: '600', letterSpacing: '-0.025em' }}>
            Shop Collection
          </h1>
          <p className="text-muted mx-auto" style={{ fontSize: '1.125rem', maxWidth: '32rem' }}>
            Discover our curated collection of premium designs crafted with exceptional quality and timeless elegance.
          </p>
        </div>

        {/* Global Filters & Search */}
        <div className="row g-3 mb-5">
          {/* Search */}
          <div className="col-12 col-lg-6">
            <div className="position-relative">
              <Search className="position-absolute start-0 top-50 translate-middle-y ms-3" style={{ height: '1rem', width: '1rem', color: 'var(--muted-foreground)' }} />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="ps-5"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="col-12 col-lg-3">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
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
          </div>

          {/* Sort */}
          <div className="col-12 col-lg-3">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger>
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
        </div>

        {/* Category Pills */}
        <div className="d-flex flex-wrap mb-5" style={{ gap: '0.5rem' }}>
          {availableCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category)}
              className="rounded-pill"
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
                                   product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                   product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                   product.colors.some(color => color.toLowerCase().includes(searchQuery.toLowerCase()))
              
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
              <section key={section.id} className={sectionIndex > 0 ? "mt-5" : ""}>
                {/* Section Header */}
                <div className="mb-4">
                  <h2 className="mb-2" style={{ fontSize: '1.875rem', fontFamily: 'Playfair Display, serif', fontWeight: '600', letterSpacing: '-0.025em' }}>
                    {section.name}
                  </h2>
                  <p className="text-muted">
                    {section.description}
                  </p>
                  <div className="d-flex flex-wrap mt-2" style={{ gap: '0.25rem' }}>
                    {section.categories.map((category) => (
                      <span key={category} className="badge bg-secondary text-dark px-2 py-1 rounded" style={{ fontSize: '0.75rem' }}>
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Section Products Grid - 2 items on mobile */}
                <div className="row g-3 g-md-4 mb-4">
                  {paginatedProducts.map((product, index) => (
                    <div key={product.id} className="col-6 col-lg-3">
                      <ProductCard 
                        product={product} 
                        className="slide-up h-100"
                        style={{ animationDelay: `${index * 100}ms` }}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pe-none opacity-50" : "cursor-pointer"}
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
                          className={currentPage === totalPages ? "pe-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}

                {sectionProducts.length === 0 && !searchQuery && selectedCategory === "All" && (
                  <div className="text-center py-5 text-muted">
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
                  <div className="row g-3 g-md-4">
                    {paginatedProducts.map((product, index) => (
                      <div key={product.id} className="col-6 col-lg-3">
                        <ProductCard 
                          product={product} 
                          className="slide-up h-100"
                          style={{ animationDelay: `${index * 100}ms` }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination className="mt-4">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? "pe-none opacity-50" : "cursor-pointer"}
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
                            className={currentPage === totalPages ? "pe-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-5">
                      <h3 className="mb-2" style={{ fontSize: '1.25rem', fontWeight: '600' }}>No products found</h3>
                      <p className="text-muted">Try adjusting your search or filter criteria</p>
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