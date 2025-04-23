"use client"

import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, File, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  onFileChange: (file: string | null) => void // Base64 en vez de File
  value: string | null
  error?: string
  accept?: Record<string, string[]>
  maxSize?: number
  label?: string
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export function FileUpload({
  onFileChange,
  value,
  error,
  accept = {
    "application/pdf": [".pdf"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
  },
  maxSize = 200 * 1024 * 1024, // 30MB
  label = "Subir archivo",
}: FileUploadProps) {
  const [fileError, setFileError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFileError(null)
      if (acceptedFiles.length > 0) {
        const base64 = await fileToBase64(acceptedFiles[0])
        onFileChange(base64)
      }
    },
    [onFileChange]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  })

  // Manejar errores de rechazo de archivos
  React.useEffect(() => {
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0]
      if (rejection.errors[0].code === "file-too-large") {
        setFileError(`El archivo es demasiado grande. Tamaño máximo: ${(maxSize / 1024 / 1024).toFixed(0)}MB`)
      } else if (rejection.errors[0].code === "file-invalid-type") {
        setFileError("Tipo de archivo no válido. Por favor, sube un PDF, JPG o PNG")
      } else {
        setFileError(rejection.errors[0].message)
      }
    }
  }, [fileRejections, maxSize])

  // Formatear el tamaño del archivo
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1024 / 1024).toFixed(1) + " MB"
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer flex flex-col items-center justify-center ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
        } ${error || fileError ? "border-red-500 bg-red-50" : ""}`}
      >
        <input {...getInputProps()} />

        {value ? (
            <div className="w-full">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-md">
                    <File className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      Imagen cargada
                    </span>
                    <span className="text-xs text-gray-500">
                      {(value.length / 1024).toFixed(1)} KB aprox
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onFileChange(null)
                  }}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
          <>
            <div className="p-3 bg-blue-50 rounded-full mb-4">
              <UploadCloud className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
            <p className="text-xs text-gray-500 text-center mb-2">
              Arrastra y suelta tu archivo aquí, o haz clic para seleccionarlo
            </p>
            <p className="text-xs text-gray-400 text-center">
              PDF, JPG o PNG (máx. {(maxSize / 1024 / 1024).toFixed(0)}MB)
            </p>
          </>
        )}
      </div>

      {(error || fileError) && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" /> {error || fileError}
        </p>
      )}
    </div>
  )
}