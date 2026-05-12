'use client'

import { format } from "date-fns"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Trophy } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetMyHackathons } from "@/lib/api/hackathon/queries"
import { Badge } from "@/components/ui/badge"

export default function OwnerHackathonsPage() {
  const { data: hackathonsData, isLoading } = useGetMyHackathons()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)

  const hackathons = hackathonsData?.data || []
  console.log('DEBUG: OwnerHackathonsPage - Hackathons fetched:', hackathons.length)
  if (hackathons.length > 0) {
    console.log('DEBUG: First Hackathon:', { id: hackathons[0].id, slug: hackathons[0].slug })
  }

  // Filter Logic
  const filteredHackathons = hackathons.filter((h) => {
    const matchesSearch =
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.description?.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (statusFilter !== "All") {
      return h.status === statusFilter.toUpperCase()
    }

    return true
  })

  // Pagination Logic
  const totalPages = Math.ceil(filteredHackathons.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedHackathons = filteredHackathons.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full max-w-[1600px] mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Hackathons</h1>
          <p className="text-muted-foreground mt-1">Manage your hackathons and select winners</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex p-5 border-primary border items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hackathons..."
            className="pl-9 bg-transparent border-slate-800 text-white placeholder:text-slate-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {["All", "Upcoming", "Active", "Judging", "Completed"].map((filter) => (
            <Button
              key={filter}
              variant={statusFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(filter)}
              className={`h-9 px-4 ${statusFilter === filter ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-transparent border-blue-900/40 text-slate-400 hover:text-blue-400 hover:border-blue-500/50"}`}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Hackathons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[250px] w-full rounded-xl bg-slate-800" />
          ))
        ) : paginatedHackathons.length > 0 ? (
          paginatedHackathons.map((hackathon) => (
            <Link
              key={hackathon.id}
              href={`/dashboard/owner/hackathons/${hackathon.id}`}
              className="group"
            >
              <Card className="bg-[#0A0A0A] border-border hover:border-primary/50 transition-all duration-300 h-full overflow-hidden flex flex-col">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {hackathon.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Trophy className="h-3 w-3 text-amber-500" />
                      {hackathon.totalPrizePool || hackathon.totalReward || 0} {hackathon.currency || 'USDC'}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors mb-2">
                    {hackathon.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
                    {hackathon.description?.replace(/<[^>]*>/g, '') || 'No description provided.'}
                  </p>

                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      {hackathon.submissionCount || 0} Submissions
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {hackathon.startDate ? format(new Date(hackathon.startDate), 'MMM dd, yyyy') : 'No date'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            No hackathons found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredHackathons.length > 0 && (
        <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center justify-end gap-4 border-t border-white/5">
          <div className="flex items-center gap-4 text-sm text-foreground">
            Rows per page
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-8 w-[70px] border-slate-800 bg-background text-xs">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                {[6, 12, 24].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="h-8 w-8 border-slate-800 bg-[#0B1121] text-foreground disabled:opacity-50"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 border-slate-800 bg-[#0B1121] text-foreground disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 border-slate-800 bg-[#0B1121] text-foreground disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 border-slate-800 bg-[#0B1121] text-foreground disabled:opacity-50"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
