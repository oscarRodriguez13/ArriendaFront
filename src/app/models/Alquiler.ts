import { Usuario } from './Usuario';
import { Propiedad } from './Propiedad';

export class Alquiler {
    constructor(
        public id: number = 0,
        public usuarioAsignado: Usuario = new Usuario(),
        public propiedad: Propiedad = new Propiedad(),
        public fechaInicio: Date = new Date(),
        public fechaFin: Date = new Date(),
        public estado: EstadoAlquiler = EstadoAlquiler.PENDIENTE,
        public comentarios: string | null = null,
        public area: number | null = null
    ) {}
}

export enum EstadoAlquiler {
    PENDIENTE = 'PENDIENTE',
    APROBADO = 'APROBADO',
    RECHAZADO = 'RECHAZADO',
    FINALIZADO = 'FINALIZADO'
}