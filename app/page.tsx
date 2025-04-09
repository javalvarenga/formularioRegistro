import { RegistrationForm } from "@/components/registration-form"
import { UniversityLogo } from "@/components/university-logo"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col items-center justify-center mb-8">
          <UniversityLogo className="w-24 h-24 mb-4" />
          <h1 className="text-4xl font-bold text-center text-blue-800">INNOVA TEC</h1>
          <p className="text-lg text-gray-600 text-center mt-2">Simposio de Tecnología e Innovación</p>
        </header>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div
            className="relative p-6 text-white overflow-hidden"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1470&auto=format&fit=crop")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "160px",
            }}
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold">Registro de Participantes</h2>
              <p className="mt-1">Complete el formulario para participar en nuestro evento</p>
            </div>
          </div>

          <RegistrationForm />
        </div>

        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>© 2025 INNOVA TEC</p>
          <p>Universidad Mariano Gálvez de Guatemala</p>
        </footer>
      </div>
    </main>
  )
}

