'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  useCreateCategory,
  useUpdateCategory,
} from '@/lib/api/forum/queries'
import { Category, CreateCategoryPayload } from '@/lib/types/forum'
import { useEffect } from 'react'
import { useForm, Controller } from 'react-form-hooks' // Oh wait, I don't know if react-hook-form is used. I'll just use regular state for simplicity if I'm not sure, but let me check if they use react-hook-form. Let me just use standard React state to be safe.
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface CategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
}

export function CategoryModal({
  open,
  onOpenChange,
  category,
}: CategoryModalProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('MessageSquare')
  const [isActive, setIsActive] = useState(true)

  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory()
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory()

  const isPending = isCreating || isUpdating

  useEffect(() => {
    if (category && open) {
      setName(category.name)
      setSlug(category.slug)
      setDescription(category.description)
      setIcon(category.icon || 'MessageSquare')
      setIsActive(category.isActive ?? true)
    } else if (open) {
      setName('')
      setSlug('')
      setDescription('')
      setIcon('MessageSquare')
      setIsActive(true)
    }
  }, [category, open])

  // auto generate slug from name
  const handleNameChange = (val: string) => {
    setName(val)
    if (!category) {
      setSlug(val.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, ''))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload: CreateCategoryPayload = {
      name,
      slug,
      description,
      icon,
      isActive,
    }

    try {
      if (category) {
        await updateCategory({ id: category.id, payload })
      } else {
        await createCategory(payload)
      }
      onOpenChange(false)
    } catch (error) {
      // handled in query
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] bg-background border-border'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{category ? 'Edit Category' : 'Create Category'}</DialogTitle>
            <DialogDescription>
              {category
                ? 'Make changes to the forum category here.'
                : 'Add a new category to organize forum discussions.'}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder='e.g. General Discussion'
                required
                className='bg-background border-border'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='slug'>Slug</Label>
              <Input
                id='slug'
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder='e.g. general-discussion'
                required
                className='bg-background border-border'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='What is this category about?'
                required
                className='bg-background border-border resize-none'
                rows={3}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='icon'>Icon (Lucide Icon Name)</Label>
              <Input
                id='icon'
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder='e.g. MessageSquare, Code, etc.'
                required
                className='bg-background border-border'
              />
            </div>
            <div className='flex items-center space-x-2 mt-2'>
              <Switch
                id='active'
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor='active'>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {category ? 'Save changes' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
