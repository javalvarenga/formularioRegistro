"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckIcon, ArrowLeftIcon, ArrowRightIcon, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "./file-upload"

type FormData = {
  // Campos comunes
  tipoParticipante: string
  nombre: string
  email: string
  telefono: string
  fechaNacimiento: string
  boletaPago: File | null
  institucion: string
  aceptaTerminos: boolean
  pagoEfectivo: boolean // Nuevo campo para método de pago
  tallaCamisa: string // Nuevo campo para talla de camisa

  // Campos específicos por tipo de participante
  carnetPrefijo?: string // Solo para estudiantes
  carnetAnio?: string // Solo para estudiantes
  carnetNumero?: string // Solo para estudiantes
  departamento?: string // Solo para catedráticos
  cargo?: string // Solo para catedráticos
  rol?: string // Opcional para todos
}

type Errors = {
  [key in keyof FormData]?: string
}

const initialFormData: FormData = {
  tipoParticipante: "estudiante",
  nombre: "",
  email: "",
  telefono: "",
  fechaNacimiento: "",
  boletaPago: null,
  institucion: "",
  aceptaTerminos: false,
  pagoEfectivo: false, // Inicialmente, no es pago en efectivo
  tallaCamisa: "", // Inicialmente vacío
  carnetPrefijo: "",
  carnetAnio: "",
  carnetNumero: "",
  departamento: "",
  cargo: "",
  rol: "",
}

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  const steps = [
    { title: "Tipo de Participante", description: "Seleccione su rol en el evento" },
    { title: "Información Personal", description: "Datos básicos del participante" },
    { title: "Información Institucional", description: "Datos de su institución" },
    { title: "Confirmación", description: "Revise sus datos antes de enviar" },
  ]

  // Validar campos cuando cambian
  useEffect(() => {
    validateForm()
  }, [formData])

  const validateForm = () => {
    const newErrors: Errors = {}

    // Validaciones según el paso actual
    if (currentStep === 0) {
      // No hay validaciones específicas para el tipo de participante
    } else if (currentStep === 1) {
      // Validaciones para información personal
      if (touched.nombre && !formData.nombre) {
        newErrors.nombre = "El nombre es obligatorio"
      }

      if (touched.email) {
        if (!formData.email) {
          newErrors.email = "El correo electrónico es obligatorio"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "El correo electrónico no es válido"
        }
      }

      if (touched.telefono) {
        if (!formData.telefono) {
          newErrors.telefono = "El teléfono es obligatorio"
        } else if (!/^\d{8,10}$/.test(formData.telefono.replace(/\D/g, ""))) {
          newErrors.telefono = "El teléfono debe tener entre 8 y 10 dígitos"
        }
      }

      if (touched.fechaNacimiento && !formData.fechaNacimiento) {
        newErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria"
      }

      if (touched.tallaCamisa && !formData.tallaCamisa) {
        newErrors.tallaCamisa = "Debe seleccionar una talla de camisa"
      }

      // Solo validar boleta de pago si no es pago en efectivo
      if (touched.boletaPago && !formData.boletaPago && !formData.pagoEfectivo) {
        newErrors.boletaPago = "La boleta de pago es obligatoria"
      }

      // Validaciones específicas por tipo de participante
      if (formData.tipoParticipante === "estudiante") {
        if (touched.carnetPrefijo && !formData.carnetPrefijo) {
          newErrors.carnetPrefijo = "El prefijo del carnet es obligatorio"
        } else if (touched.carnetPrefijo && !/^\d{1,4}$/.test(formData.carnetPrefijo || "")) {
          newErrors.carnetPrefijo = "El prefijo debe ser un número de 1 a 4 dígitos"
        }

        if (touched.carnetAnio && !formData.carnetAnio) {
          newErrors.carnetAnio = "El año del carnet es obligatorio"
        } else if (touched.carnetAnio && !/^\d{2}$/.test(formData.carnetAnio || "")) {
          newErrors.carnetAnio = "El año debe ser un número de 2 dígitos"
        }

        if (touched.carnetNumero && !formData.carnetNumero) {
          newErrors.carnetNumero = "El número del carnet es obligatorio"
        } else if (touched.carnetNumero && !/^\d{4}$/.test(formData.carnetNumero || "")) {
          newErrors.carnetNumero = "El número debe ser un número de 4 dígitos"
        }
      }
    } else if (currentStep === 2) {
      // Validaciones para información institucional
      // Todos los campos son opcionales, no se validan
    } else if (currentStep === 3) {
      // Validación para el último paso
      if (!formData.aceptaTerminos) {
        newErrors.aceptaTerminos = "Debe aceptar los términos y condiciones"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, boletaPago: file }))
    setTouched((prev) => ({ ...prev, boletaPago: true }))
  }

  const nextStep = () => {
    // Marcar todos los campos del paso actual como tocados
    const currentStepFields = getFieldsForStep(currentStep)
    const newTouched = { ...touched }
    currentStepFields.forEach((field) => {
      newTouched[field] = true
    })
    setTouched(newTouched)

    // Validar antes de avanzar
    const isValid = validateForm()

    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Marcar todos los campos como tocados
    const allFields = Object.keys(formData)
    const newTouched: { [key: string]: boolean } = {}
    allFields.forEach((field) => {
      newTouched[field] = true
    })
    setTouched(newTouched)

    // Validar antes de enviar
    const isValid = validateForm()

    if (isValid) {
      setSubmitted(true)
      console.log("Form submitted:", formData)
    }
  }

  // Determinar qué campos mostrar según el paso actual
  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 0:
        return ["tipoParticipante"]
      case 1:
        const personalFields = ["nombre", "email", "telefono", "fechaNacimiento", "tallaCamisa", "pagoEfectivo"]
        if (!formData.pagoEfectivo) {
          personalFields.push("boletaPago")
        }
        if (formData.tipoParticipante === "estudiante") {
          personalFields.push("carnetPrefijo", "carnetAnio", "carnetNumero")
        }
        return personalFields
      case 2:
        return ["institucion", "rol"]
      case 3:
        return ["aceptaTerminos"]
      default:
        return []
    }
  }

  // Formatear el carnet completo
  const getFormattedCarnet = () => {
    if (formData.tipoParticipante !== "estudiante") return "N/A"

    const prefijo = formData.carnetPrefijo || ""
    const anio = formData.carnetAnio || ""
    const numero = formData.carnetNumero || ""

    if (!prefijo && !anio && !numero) return "No especificado"

    return `${prefijo}-${anio}-${numero}`
  }

  return (
    <div className="p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        {/* Versión móvil - Solo muestra el paso actual y la barra de progreso */}
        <div className="md:hidden">
          <div className="flex items-center justify-center mb-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-blue-500 text-blue-500 text-lg font-medium`}
            >
              {currentStep + 1}
            </div>
          </div>
          <div className="text-center mb-4">
            <p className="text-base font-medium text-gray-800">{steps[currentStep].title}</p>
            <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
          </div>
          <div className="relative mt-2">
            <div className="h-1 bg-gray-200 rounded-full">
              <div
                className="h-1 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    index < currentStep
                      ? "bg-green-500 text-white"
                      : index === currentStep
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index < currentStep ? <CheckIcon className="w-3 h-3" /> : index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Versión desktop - Muestra todos los pasos */}
        <div className="hidden md:block">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    index < currentStep
                      ? "bg-green-500 border-green-500 text-white"
                      : index === currentStep
                        ? "border-blue-500 text-blue-500"
                        : "border-gray-300 text-gray-300"
                  }`}
                >
                  {index < currentStep ? <CheckIcon className="w-5 h-5" /> : <span>{index + 1}</span>}
                </div>
                <div className="text-center mt-2">
                  <p className={`text-sm font-medium ${index <= currentStep ? "text-gray-800" : "text-gray-400"}`}>
                    {step.title}
                  </p>
                  <p className={`text-xs ${index <= currentStep ? "text-gray-600" : "text-gray-400"}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
              <div
                className="h-1 bg-blue-500 transition-all duration-300"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckIcon className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Registro Completado!</h3>
          <p className="text-gray-600 mb-6">
            Gracias por registrarte en INNOVA TEC. Estaremos enviando un correo de confirmación a {formData.email} con
            los detalles de tu registro.
            {formData.pagoEfectivo && (
              <span className="block mt-2 font-medium text-amber-700">
                Recuerda que debes contactar a los organizadores para realizar el pago en efectivo y finalizar tu
                registro.
              </span>
            )}
          </p>
          <Button
            onClick={() => {
              setFormData(initialFormData)
              setCurrentStep(0)
              setSubmitted(false)
              setErrors({})
              setTouched({})
            }}
            className="bg-blue-800 hover:bg-blue-900"
          >
            Registrar otro participante
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Step 1: Tipo de Participante */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <Label className="flex items-center text-lg mb-4">
                  Seleccione su tipo de participación <span className="text-red-500 ml-1">*</span>
                </Label>
                <RadioGroup
                  value={formData.tipoParticipante}
                  onValueChange={(value) => handleSelectChange("tipoParticipante", value)}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <Label
                    htmlFor="estudiante"
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      formData.tipoParticipante === "estudiante"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <RadioGroupItem value="estudiante" id="estudiante" className="mr-2" />
                      <span className="font-medium">Estudiante</span>
                    </div>
                    <p className="text-sm text-gray-500 ml-6">
                      Para estudiantes activos de cualquier institución educativa.
                    </p>
                  </Label>

                  <Label
                    htmlFor="catedratico"
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      formData.tipoParticipante === "catedratico"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <RadioGroupItem value="catedratico" id="catedratico" className="mr-2" />
                      <span className="font-medium">Catedrático</span>
                    </div>
                    <p className="text-sm text-gray-500 ml-6">
                      Para profesores y personal académico de instituciones educativas.
                    </p>
                  </Label>

                  <Label
                    htmlFor="invitado"
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      formData.tipoParticipante === "invitado"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <RadioGroupItem value="invitado" id="invitado" className="mr-2" />
                      <span className="font-medium">Invitado</span>
                    </div>
                    <p className="text-sm text-gray-500 ml-6">
                      Para profesionales, representantes de empresas y público general.
                    </p>
                  </Label>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 2: Información Personal */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="nombre" className="flex items-center">
                  Nombre Completo <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ingrese su nombre completo"
                  className={errors.nombre ? "border-red-500" : ""}
                  required
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.nombre}
                  </p>
                )}
              </div>

              {/* Campos de carnet solo para estudiantes */}
              {formData.tipoParticipante === "estudiante" && (
                <div>
                  <Label className="flex items-center">
                    Carnet de Estudiante <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="flex space-x-2">
                    <div className="w-1/4">
                      <Input
                        id="carnetPrefijo"
                        name="carnetPrefijo"
                        value={formData.carnetPrefijo}
                        onChange={handleInputChange}
                        placeholder="0000"
                        className={errors.carnetPrefijo ? "border-red-500" : ""}
                        required
                      />
                      {errors.carnetPrefijo && <p className="text-red-500 text-xs mt-1">{errors.carnetPrefijo}</p>}
                    </div>
                    <div className="flex items-center">-</div>
                    <div className="w-1/5">
                      <Input
                        id="carnetAnio"
                        name="carnetAnio"
                        value={formData.carnetAnio}
                        onChange={handleInputChange}
                        placeholder="00"
                        className={errors.carnetAnio ? "border-red-500" : ""}
                        required
                      />
                      {errors.carnetAnio && <p className="text-red-500 text-xs mt-1">{errors.carnetAnio}</p>}
                    </div>
                    <div className="flex items-center">-</div>
                    <div className="w-2/5">
                      <Input
                        id="carnetNumero"
                        name="carnetNumero"
                        value={formData.carnetNumero}
                        onChange={handleInputChange}
                        placeholder="0000"
                        className={errors.carnetNumero ? "border-red-500" : ""}
                        required
                      />
                      {errors.carnetNumero && <p className="text-red-500 text-xs mt-1">{errors.carnetNumero}</p>}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Formato: Prefijo-Año-Número (Ejemplo: 1490-19-1745)</p>
                </div>
              )}

              <div>
                <Label htmlFor="email" className="flex items-center">
                  Correo Electrónico <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="ejemplo@correo.com"
                  className={errors.email ? "border-red-500" : ""}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="telefono" className="flex items-center">
                  Número de Teléfono <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="Ingrese su número de teléfono"
                  className={errors.telefono ? "border-red-500" : ""}
                  required
                />
                {errors.telefono && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.telefono}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="fechaNacimiento" className="flex items-center">
                  Fecha de Nacimiento <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                  className={errors.fechaNacimiento ? "border-red-500" : ""}
                  required
                />
                {errors.fechaNacimiento && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.fechaNacimiento}
                  </p>
                )}
              </div>

              {/* Campo para talla de camisa */}
              <div>
                <Label htmlFor="tallaCamisa" className="flex items-center">
                  Talla de Camisa <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  value={formData.tallaCamisa}
                  onValueChange={(value) => handleSelectChange("tallaCamisa", value)}
                >
                  <SelectTrigger className={errors.tallaCamisa ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccione una talla" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XS">XS</SelectItem>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="XL">XL</SelectItem>
                    <SelectItem value="XXL">XXL</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tallaCamisa && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.tallaCamisa}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pagoEfectivo"
                    checked={formData.pagoEfectivo}
                    onCheckedChange={(checked) => handleCheckboxChange("pagoEfectivo", checked as boolean)}
                  />
                  <Label htmlFor="pagoEfectivo" className="text-sm cursor-pointer">
                    Realizaré el pago en efectivo
                  </Label>
                </div>
                <p className="text-xs text-gray-500">
                  Seleccione esta opción si prefiere pagar en efectivo directamente a los organizadores.
                </p>
              </div>

              {formData.pagoEfectivo && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-800">Importante</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        Al seleccionar pago en efectivo, deberá contactar a los organizadores para realizar el pago y
                        finalizar su registro. Su inscripción no estará completa hasta que realice el pago
                        correspondiente.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!formData.pagoEfectivo && (
                <div>
                  <Label className="flex items-center mb-2">
                    Boleta de Pago <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <FileUpload
                    onFileChange={handleFileChange}
                    value={formData.boletaPago}
                    error={errors.boletaPago}
                    label="Subir boleta de pago"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Información Institucional */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="institucion" className="flex items-center">
                  Institución / Empresa
                </Label>
                <Input
                  id="institucion"
                  name="institucion"
                  value={formData.institucion}
                  onChange={handleInputChange}
                  placeholder="Ingrese el nombre de su institución o empresa"
                  className={errors.institucion ? "border-red-500" : ""}
                />
                <p className="text-xs text-gray-500 mt-1">Este campo es opcional</p>
              </div>

              <div>
                <Label htmlFor="rol" className="flex items-center">
                  Rol / Cargo
                </Label>
                <Input
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                  placeholder="Ingrese su rol o cargo"
                  className={errors.rol ? "border-red-500" : ""}
                />
                <p className="text-xs text-gray-500 mt-1">Este campo es opcional</p>
              </div>
            </div>
          )}

          {/* Step 4: Confirmación */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Resumen de Registro</h3>
              <Card>
                <CardContent className="pt-6">
                  <dl className="divide-y divide-gray-200">
                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium text-gray-500">Tipo de Participante</dt>
                      <dd className="text-sm text-gray-900 col-span-2">
                        {formData.tipoParticipante === "estudiante"
                          ? "Estudiante"
                          : formData.tipoParticipante === "catedratico"
                            ? "Catedrático"
                            : "Invitado"}
                      </dd>
                    </div>

                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{formData.nombre}</dd>
                    </div>

                    {formData.tipoParticipante === "estudiante" && (
                      <div className="py-2 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500">Carnet</dt>
                        <dd className="text-sm text-gray-900 col-span-2">{getFormattedCarnet()}</dd>
                      </div>
                    )}

                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{formData.email}</dd>
                    </div>

                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{formData.telefono}</dd>
                    </div>

                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium text-gray-500">Fecha de Nacimiento</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{formData.fechaNacimiento}</dd>
                    </div>

                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium text-gray-500">Talla de Camisa</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{formData.tallaCamisa || "No seleccionada"}</dd>
                    </div>

                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium text-gray-500">Método de Pago</dt>
                      <dd className="text-sm text-gray-900 col-span-2">
                        {formData.pagoEfectivo ? "Efectivo (pendiente)" : "Transferencia/Depósito"}
                      </dd>
                    </div>

                    {!formData.pagoEfectivo && (
                      <div className="py-2 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500">Boleta de Pago</dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {formData.boletaPago ? formData.boletaPago.name : "No se ha subido archivo"}
                        </dd>
                      </div>
                    )}

                    {formData.institucion && (
                      <div className="py-2 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500">Institución / Empresa</dt>
                        <dd className="text-sm text-gray-900 col-span-2">{formData.institucion}</dd>
                      </div>
                    )}

                    {formData.rol && (
                      <div className="py-2 grid grid-cols-3">
                        <dt className="text-sm font-medium text-gray-500">Rol / Cargo</dt>
                        <dd className="text-sm text-gray-900 col-span-2">{formData.rol}</dd>
                      </div>
                    )}

                    {/* Campos específicos según el tipo de participante */}
                    {formData.tipoParticipante === "catedratico" && (
                      <>{/* Se eliminan los campos de departamento y cargo */}</>
                    )}

                  </dl>
                </CardContent>
              </Card>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aceptaTerminos"
                  checked={formData.aceptaTerminos}
                  onCheckedChange={(checked) => handleCheckboxChange("aceptaTerminos", checked as boolean)}
                  className={errors.aceptaTerminos ? "border-red-500" : ""}
                />
                <Label htmlFor="aceptaTerminos" className="text-sm cursor-pointer">
                  Acepto los términos y condiciones del evento INNOVA TEC
                </Label>
              </div>
              {errors.aceptaTerminos && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.aceptaTerminos}
                </p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep} className="bg-blue-800 hover:bg-blue-900 flex items-center">
                Siguiente
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Completar Registro
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
