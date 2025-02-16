import { Readable } from 'node:stream'
import csv from 'csv-parser'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  const filePart = formData.find(part => part.name === 'file')
  if (!filePart) {
    throw createError({ statusCode: 400, message: 'No file uploaded' })
  }

  const fileStream = Readable.from(filePart.data)
  let headers = null
  return new Promise((resolve, reject) => {
    let count = 0
    fileStream
      .pipe(csv())
      .on('data', (row) => {
        headers = Object.keys(row)
        // Пример: подсчитаем, сколько строк в CSV
        // Или можно фильтровать row/mileage < 100000 и т.д.
        console.log(row)
        count++
      })
      .on('end', () => {
        resolve({ success: true, totalRows: count, headers })
        console.log(`Processed ${count} rows`)
        console.log(headers)
      })
      .on('error', err => reject(err))
  })
})
