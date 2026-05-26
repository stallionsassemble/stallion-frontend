export interface CSVColumn<T> {
  header: string
  key: keyof T | ((item: T) => string | number | boolean | null | undefined)
}

/**
 * Exports data to a CSV file and triggers a download in the browser.
 * 
 * @param data The array of data objects to export
 * @param columns Configuration for columns (header name and key/accessor function)
 * @param filename The name of the file to download (without extension)
 */
export function exportToCSV<T>(
  data: T[],
  columns: CSVColumn<T>[],
  filename: string
) {
  if (!data.length) return

  const headers = columns.map((col) => col.header).join(',')
  const rows = data.map((item) => {
    return columns
      .map((col) => {
        let value = typeof col.key === 'function' ? col.key(item) : item[col.key]
        if (value === null || value === undefined) value = ''
        
        // Escape quotes and wrap in quotes to handle commas within values
        const stringValue = String(value).replace(/"/g, '""')
        return `"${stringValue}"`
      })
      .join(',')
  })

  const csvContent = [headers, ...rows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
