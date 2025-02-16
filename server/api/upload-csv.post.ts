import { Readable } from 'stream'
import { csvFiles, dataRows } from '@@/server/database/schema'
import { hubBlob } from '#imports'

export default eventHandler(async (event) => {
  const session = await requireUserSession(event)
  const db = useDrizzle()

  // Загрузка CSV-файла
  const csvData = await hubBlob().handleUpload(event, {
    formKey: 'files',
    multiple: false,
    ensure: { types: ['text/csv'] },
    put: { addRandomSuffix: true, prefix: 'csv/' }
  })

  const uploadedFile = csvData[0]
  const { pathname } = uploadedFile

  // Сохранение метаданных файла
  const [fileRecord] = await db
    .insert(csvFiles)
    .values({
      userId: session.user.id,
      fileName: pathname,
      createdAt: new Date()
    })
    .returning()

  if (!fileRecord) {
    throw createError({ statusCode: 500, message: 'Failed to insert file record' })
  }

  const blob = await hubBlob().get(pathname)
  if (!blob) {
    throw createError({ statusCode: 404, message: 'File not found in Blob' })
  }

  // Парсинг CSV
  const parseCSV = async (stream: Readable) => {
    const chunks = []
    for await (const chunk of stream) {
      chunks.push(chunk)
    }
    const rawData = Buffer.concat(chunks).toString('utf-8')

    const lines = rawData.split('\n')
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''))

    const rows = []
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue

      const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''))
      const row = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      rows.push(row)
    }
    return rows
  }

  const rows = await parseCSV(Readable.from(blob.stream()))
  console.log('Parsed Rows:', rows.length)

  // Пакетная вставка без транзакций
  const batchSize = 50 // Устанавливаем оптимальный размер пакета
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize).map(row => ({
      fileId: fileRecord.id,
      rowData: JSON.stringify(row)
    }))

    console.log(`Inserting batch ${i / batchSize + 1} with ${batch.length} records`)

    // Выполняем вставку
    await db.insert(dataRows).values(batch)
  }

  return {
    message: 'CSV file uploaded and processed successfully',
    fileId: fileRecord.id
  }
})
