'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, Edit2, Trash2, LayoutGrid } from 'lucide-react'
import { useState } from 'react'
import { CategoryModal } from '@/components/admin/forum-categories/category-modal'
import { useGetCategories, useDeleteCategory } from '@/lib/api/forum/queries'
import { Category } from '@/lib/types/forum'

export default function AdminForumCategoriesPage() {
  const { data: categories, isLoading } = useGetCategories()
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const handleCreate = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Forum Categories</h1>
          <p className='text-sm text-muted-foreground'>
            Manage discussion categories for the community forum.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className='mr-2 h-4 w-4' />
          Add Category
        </Button>
      </div>

      <Card className='bg-card border-border'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-base'>
            <LayoutGrid className='h-5 w-5 text-primary' />
            All Categories
          </CardTitle>
          <CardDescription>
            View and manage all available forum categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex items-center justify-center h-64'>
              <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
            </div>
          ) : categories && categories.length > 0 ? (
            <div className='rounded-md border border-border'>
              <Table>
                <TableHeader>
                  <TableRow className='hover:bg-transparent'>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id} className='hover:bg-muted/50'>
                      <TableCell className='font-medium'>
                        <div className='flex items-center gap-2'>
                          <span className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs'>
                            {category.icon ? category.icon.substring(0, 2) : 'C'}
                          </span>
                          <div>
                            <p className='text-foreground'>{category.name}</p>
                            <p className='text-xs text-muted-foreground truncate max-w-[200px]'>
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {category.slug}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={category.isActive ? 'default' : 'secondary'}
                          className={
                            category.isActive
                              ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                              : 'bg-muted text-muted-foreground'
                          }
                        >
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-sm text-muted-foreground'>
                        <div className='flex flex-col'>
                          <span>{category.threadCount || category._count?.threads || 0} Threads</span>
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleEdit(category)}
                            title='Edit'
                          >
                            <Edit2 className='h-4 w-4 text-muted-foreground hover:text-primary' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleDelete(category.id)}
                            disabled={isDeleting}
                            title='Delete'
                          >
                            <Trash2 className='h-4 w-4 text-destructive hover:text-destructive/80' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-64 text-center border border-dashed border-border rounded-lg bg-muted/10'>
              <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                <LayoutGrid className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-lg font-medium text-foreground mb-1'>No Categories Found</h3>
              <p className='text-sm text-muted-foreground max-w-sm mb-4'>
                There are currently no forum categories available. Create the first one to get started.
              </p>
              <Button onClick={handleCreate} variant='outline'>
                <Plus className='mr-2 h-4 w-4' />
                Create Category
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CategoryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        category={selectedCategory}
      />
    </div>
  )
}
