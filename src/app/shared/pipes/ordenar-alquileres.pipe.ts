import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordenarAlquileres',
  standalone: true,
})
export class OrdenarAlquileresPipe implements PipeTransform {
    transform(solicitudes: any[]): any[] {
        if (!solicitudes) return [];
        return solicitudes.sort((a, b) => {
          const estadoOrden = ['pendiente', 'aprobado', 'rechazado', 'finalizado'];
          const estadoA = estadoOrden.indexOf(a.estado.toLowerCase());
          const estadoB = estadoOrden.indexOf(b.estado.toLowerCase());
    
          if (estadoA !== estadoB) {
            return estadoA - estadoB;
          }
    
          // Si los estados son iguales, ordena por fecha de inicio.
          return new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime();
        });
      }
}
