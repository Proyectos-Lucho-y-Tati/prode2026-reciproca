// resultados.component.ts
// FIX #1: this.selecciones era un Map<number, string> plano (no reactivo),
// inconsistente con el patrón establecido en cargar-resultados.component.ts
// que usa signal<Record<number, string>> después del FIX #17 original.
//
// En este componente la UI es de solo lectura (no hay edición), por lo que
// el Map funcionaba correctamente — los datos se cargan una sola vez en
// ngOnInit y no cambian. Sin embargo, mantener el patrón consistente con el
// resto de la app facilita el mantenimiento y evita confusión futura sobre
// qué estructura usar en cada componente.
//
// Cambio: Map<number, string> → signal<Record<number, string>>
// getSeleccion() lee del signal en lugar del Map.
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { PartidoService } from '../../core/services/partido.service';
import { ResultadoService } from '../../core/services/resultado.service';
import { Partido } from '../../shared/models/partido.model';

const GRUPOS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css'
})

export class ResultadosComponent implements OnInit {

  cargando = signal(true);
  grupoActivo = signal<string | null>(null);
  partidos = signal<Partido[]>([]);

  // FIX #1: signal<Record<number, string>> en lugar de Map plano.
  // Patrón consistente con cargar-resultados.component.ts.
  private seleccionesSignal = signal<Record<number, string>>({});
  resultadosGuardados = signal<Set<number>>(new Set());

  grupos = GRUPOS;

  constructor(
    private partidoService: PartidoService,
    private resultadoService: ResultadoService
  ) { }

  ngOnInit(): void {
    forkJoin({
      partidos: this.partidoService.getPartidos(),
      resultados: this.resultadoService.getResultados()
    }).subscribe({
      next: ({ partidos, resultados }) => {
        this.partidos.set(partidos.filter(p => p.fase === 'GRUPOS'));

        const guardados: Set<number> = new Set();
        const selecciones: Record<number, string> = {};

        resultados.forEach(r => {
          const id = r.partido.id;
          selecciones[id] = r.resultado;
          guardados.add(id);
        });

        this.seleccionesSignal.set(selecciones);
        this.resultadosGuardados.set(guardados);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  gruposMostrados(): string[] {
    const activo = this.grupoActivo();
    return activo ? [activo] : this.grupos;
  }

  getPartidosPorGrupo(grupo: string): Partido[] {
    return this.partidos().filter(p => p.grupo === grupo);
  }

  getEquiposDelGrupo(grupo: string): { nombre: string; bandera: string }[] {
    const partidos = this.getPartidosPorGrupo(grupo);
    const equipos = new Map<string, string>();
    partidos.forEach(p => {
      if (p.equipoLocalShow) equipos.set(p.equipoLocalShow, p.equipoLocalBandera);
      if (p.equipoVisitanteShow) equipos.set(p.equipoVisitanteShow, p.equipoVisitanteBandera);
    });
    return Array.from(equipos.entries()).map(([nombre, bandera]) => ({ nombre, bandera }));
  }

  // FIX #1: lee del signal en lugar del Map
  getSeleccion(partidoId: number): string {
    return this.seleccionesSignal()[partidoId] ?? '';
  }

  contarGuardadosEnGrupo(grupo: string): number {
    return this.getPartidosPorGrupo(grupo)
      .filter(p => this.resultadosGuardados().has(p.id)).length;
  }

  grupoCompleto(grupo: string): boolean {
    const ps = this.getPartidosPorGrupo(grupo);
    return ps.length > 0 && ps.every(p => this.resultadosGuardados().has(p.id));
  }
}
