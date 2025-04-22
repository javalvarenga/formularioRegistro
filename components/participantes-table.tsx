"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { sweetAlert } from "@/components/ui/sweetAlert";
//import { VerBoletaDialog } from "@/components/ver-boleta-dialog";
//import { EditarParticipanteDrawer } from "@/components/editar-participante-drawer";
//import { EliminarParticipanteDialog } from "@/components/eliminar-participante-dialog";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Eye,
  Edit,
  Trash2,
  CreditCard,
} from "lucide-react";
//import { useGetAllParticipants } from "@/hooks/Participants/useGetAllParticipants";
import { changePaymmentStatus } from "@/services/Participants";

// Tipos para los participantes
type TipoParticipante = "Estudiante" | "Catedrático" | "Invitado";
// Actualizar el tipo EstadoPago
type EstadoPago = "P" | "C" | "R" | "V";
// Nuevo tipo para el tipo de pago
type TipoPago = "E" | "C";

export interface Participante {
  idParticipante: number;
  tipoParticipante: TipoParticipante;
  nombre: string;
  carnetCarrera: number;
  carnetAnio: number;
  carnetSerie: number;
  correoElectronico: string;
  telefono: number;
  talla: "S" | "M" | "L" | "XL";
  fechaNacimiento: string; // puede ser `Date` si lo transformas al parsear
  fechaRegistro: string; // puede ser `Date` también
  institucion: string;
  Rol: string;
  codigoQR: string;
  certificadoEnviado: boolean; // tinyint lo puedes mapear a boolean en TS
  estadoPago: EstadoPago;
  tipoPago: TipoPago;
  boleta: string;
}

export function ParticipantesTable() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState<string>("todos");
  const [estadoFilter, setEstadoFilter] = useState<string>("todos");
  const [tipoPagoFilter, setTipoPagoFilter] = useState<string>("todos");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Participante | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });

  const { participantes: data, isLoading, error } = useGetAllParticipants();

  useEffect(() => {
    if (!isLoading && data?.length > 0) {
      setParticipantes(data);
    }
  }, [data]);

  // Estados para los modales/drawers
  const [selectedParticipante, setSelectedParticipante] =
    useState<Participante | null>(null);
  const [isBoletaOpen, setIsBoletaOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Función para ordenar
  const requestSort = (key: keyof Participante) => {
    let direction: "asc" | "desc" | null = "asc";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }

    setSortConfig({ key, direction });
  };

  // Función para cambiar el estado de pago
  const cambiarEstadoPago = async (id: number, nuevoEstado: EstadoPago) => {
    setParticipantes(
      participantes.map((p) =>
        p.idParticipante === id ? { ...p, estadoPago: nuevoEstado } : p
      )
    );

    const result = await changePaymmentStatus(id, nuevoEstado);
    console.log("result of changePaymmentStatus", result);

    sweetAlert(
      "Pago actualizado",
      "El estado de pago fue cambiado",
      "success",
      5000
    );
  };

  // Función para cambiar el tipo de pago
  const cambiarTipoPago = (id: number, nuevoTipo: TipoPago) => {
    setParticipantes(
      participantes.map((p) =>
        p.idParticipante === id ? { ...p, tipoPago: nuevoTipo } : p
      )
    );
  };

  // Función para actualizar un participante
  const actualizarParticipante = (participanteActualizado: Participante) => {
    setParticipantes(
      participantes.map((p) =>
        p.idParticipante === participanteActualizado.idParticipante
          ? participanteActualizado
          : p
      )
    );
    setIsEditOpen(false);
  };

  // Función para eliminar un participante
  const eliminarParticipante = (id: number) => {
    setParticipantes(participantes?.filter((p) => p.idParticipante !== id));
    setIsDeleteOpen(false);
  };

  // Aplicar filtros y ordenamiento
  const filteredAndSortedParticipantes = useMemo(() => {
    // Filtrar por búsqueda
    let result = participantes?.filter(
      (p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.correoElectronico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.institucion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtrar por tipo
    if (tipoFilter !== "todos") {
      result = result.filter((p) => p.tipoParticipante === tipoFilter);
    }

    // Filtrar por estado
    if (estadoFilter !== "todos") {
      result = result.filter((p) => p.estadoPago === estadoFilter);
    }

    // Filtrar por tipo de pago
    if (tipoPagoFilter !== "todos") {
      result = result.filter((p) => p.tipoPago === tipoPagoFilter);
    }

    // Ordenar
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [
    participantes,
    searchTerm,
    tipoFilter,
    estadoFilter,
    tipoPagoFilter,
    sortConfig,
  ]);

  // Calcular los totales para los indicadores
  const totales = useMemo(() => {
    const total = participantes?.length;
    const pendientesPago = participantes?.filter(
      (p) => p.estadoPago === "P"
    ).length;
    const pagados = participantes?.filter((p) => p.estadoPago === "C").length;
    const verificacionPendiente = participantes?.filter(
      (p) => p.estadoPago === "V"
    ).length;
    const rechazados = participantes?.filter(
      (p) => p.estadoPago === "R"
    ).length;

    return {
      total,
      pendientesPago,
      pagados,
      verificacionPendiente,
      rechazados,
    };
  }, [participantes]);

  // Renderizar el ícono de ordenamiento
  const renderSortIcon = (key: keyof Participante) => {
    if (sortConfig.key !== key) {
      return null;
    }

    if (sortConfig.direction === "asc") {
      return <ChevronUp className="ml-1 h-4 w-4" />;
    }

    if (sortConfig.direction === "desc") {
      return <ChevronDown className="ml-1 h-4 w-4" />;
    }

    return null;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            estadoFilter === "todos" ? "ring-2 ring-primary ring-offset-2" : ""
          }`}
          onClick={() => setEstadoFilter("todos")}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Total Solicitudes
              </p>
              <h3 className="text-3xl font-bold mt-2">{totales.total}</h3>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            estadoFilter === "P" ? "ring-2 ring-primary ring-offset-2" : ""
          }`}
          onClick={() => setEstadoFilter("P")}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Pendientes de Pago
              </p>
              <h3 className="text-3xl font-bold mt-2 text-blue-600">
                {totales.pendientesPago}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            estadoFilter === "C" ? "ring-2 ring-primary ring-offset-2" : ""
          }`}
          onClick={() => setEstadoFilter("C")}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Pagados
              </p>
              <h3 className="text-3xl font-bold mt-2 text-green-600">
                {totales.pagados}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            estadoFilter === "V" ? "ring-2 ring-primary ring-offset-2" : ""
          }`}
          onClick={() => setEstadoFilter("V")}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Sin Verificar
              </p>
              <h3 className="text-3xl font-bold mt-2 text-yellow-600">
                {totales.verificacionPendiente}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            estadoFilter === "Rechazado"
              ? "ring-2 ring-primary ring-offset-2"
              : ""
          }`}
          onClick={() => setEstadoFilter("R")}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Rechazados
              </p>
              <h3 className="text-3xl font-bold mt-2 text-red-600">
                {totales.rechazados}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o institución..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de participante" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="Estudiante">Estudiante</SelectItem>
                  <SelectItem value="Catedrático">Catedrático</SelectItem>
                  <SelectItem value="Invitado">Invitado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="Pendiente de Pago">
                    Pendiente de Pago
                  </SelectItem>
                  <SelectItem value="Verificacion pendiente">
                    Verificacion pendiente
                  </SelectItem>
                  <SelectItem value="Pagado">Pagado</SelectItem>
                  <SelectItem value="Rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tipoPagoFilter} onValueChange={setTipoPagoFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="Efectivo">Efectivo</SelectItem>
                  <SelectItem value="Comprobante">Comprobante</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("nombre")}
              >
                <div className="flex items-center">
                  Nombre
                  {renderSortIcon("nombre")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("correoElectronico")}
              >
                <div className="flex items-center">
                  Email
                  {renderSortIcon("correoElectronico")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("tipoParticipante")}
              >
                <div className="flex items-center">
                  Tipo
                  {renderSortIcon("tipoParticipante")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("estadoPago")}
              >
                <div className="flex items-center">
                  Estado de Pago
                  {renderSortIcon("estadoPago")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("tipoPago")}
              >
                <div className="flex items-center">
                  Tipo de Pago
                  {renderSortIcon("tipoPago")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("fechaRegistro")}
              >
                <div className="flex items-center">
                  Fecha de Registro
                  {renderSortIcon("fechaRegistro")}
                </div>
              </TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "0.6rem 0",
                }}
              >
                <small className="text-muted-foreground text-center">
                  Cargando...
                </small>
              </div>
            ) : filteredAndSortedParticipantes?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No se encontraron participantes con los filtros seleccionados
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedParticipantes?.map((participante) => (
                <TableRow key={participante.idParticipante}>
                  <TableCell className="font-medium">
                    {participante.nombre}
                  </TableCell>
                  <TableCell>{participante.correoElectronico}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        participante.tipoParticipante === "Estudiante"
                          ? "default"
                          : participante.tipoParticipante === "Catedrático"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {participante.tipoParticipante}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        participante.estadoPago === "C"
                          ? "success"
                          : participante.estadoPago === "V"
                          ? "warning"
                          : participante.estadoPago === "P"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {{
                        P: "Pendiente de Pago",
                        V: "Verificación pendiente",
                        C: "Pagado",
                        R: "Rechazado",
                      }[participante.estadoPago ?? ""] || ""}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        participante.tipoPago === "E" ? "outline" : "secondary"
                      }
                    >
                      {participante.tipoPago}
                    </Badge>
                  </TableCell>
                  <TableCell>{participante.fechaRegistro}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedParticipante(participante);
                          setIsBoletaOpen(true);
                        }}
                        title="Ver boleta"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            title="Cambiar estado de pago"
                          >
                            <CreditCard className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              cambiarEstadoPago(
                                participante.idParticipante,
                                "P"
                              )
                            }
                          >
                            Pendiente de Pago
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              cambiarEstadoPago(
                                participante.idParticipante,
                                "V"
                              )
                            }
                          >
                            Verificacion pendiente
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              cambiarEstadoPago(
                                participante.idParticipante,
                                "C"
                              )
                            }
                          >
                            Pagado
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              cambiarEstadoPago(
                                participante.idParticipante,
                                "R"
                              )
                            }
                          >
                            Rechazado
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedParticipante(participante);
                          setIsEditOpen(true);
                        }}
                        title="Editar participante"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedParticipante(participante);
                          setIsDeleteOpen(true);
                        }}
                        title="Eliminar participante"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal para ver boleta */}
      {selectedParticipante && (
        <VerBoletaDialog
          isOpen={isBoletaOpen}
          onClose={() => setIsBoletaOpen(false)}
          participante={selectedParticipante}
          onCambiarEstado={cambiarEstadoPago}
          onCambiarTipoPago={cambiarTipoPago}
        />
      )}

      {/* Drawer para editar participante */}
      {selectedParticipante && (
        <EditarParticipanteDrawer
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          participante={selectedParticipante}
          onSave={actualizarParticipante}
        />
      )}

      {/* Modal para confirmar eliminación */}
      {selectedParticipante && (
        <EliminarParticipanteDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          participante={selectedParticipante}
          onConfirm={() => eliminarParticipante(selectedParticipante.id)}
        />
      )}
    </>
  );
}

// Estilos personalizados para los badges
const badgeVariants = {
  success: "bg-green-100 text-green-800 hover:bg-green-200",
  warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  destructive: "bg-red-100 text-red-800 hover:bg-red-200",
};
