// fixture.component.ts — VERSIÓN MEJORADA
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PartidoService } from '../../core/services/partido.service';
import { Partido } from '../../shared/models/partido.model';
import { ShortCountryPipe } from '../../shared/pipes/short-country.pipe';

type VistaFiltro = 'GRUPOS' | 'DIECISEISAVOS' | 'OCTAVOS' | 'CUARTOS' | 'SEMIFINAL' | 'FINAL';

@Component({
  selector: 'app-fixture',
  standalone: true,
  imports: [CommonModule, DatePipe, ShortCountryPipe],
  templateUrl: './fixture.html',
  styleUrl: './fixture.css'
})

export class FixtureComponent implements OnInit {

  cargando = signal(true);
  filtroActual = signal<VistaFiltro>('GRUPOS');
  grupoActivo = signal<string | null>(null);

  private todosLosPartidos: Partido[] = [];

  grupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  fases = [
    { valor: 'GRUPOS' as VistaFiltro, label: 'Grupos', icono: 'fas fa-layer-group' },
    { valor: 'DIECISEISAVOS' as VistaFiltro, label: '16avos', icono: 'fas fa-futbol' },
    { valor: 'OCTAVOS' as VistaFiltro, label: 'Octavos', icono: 'fas fa-futbol' },
    { valor: 'CUARTOS' as VistaFiltro, label: 'Cuartos', icono: 'fas fa-futbol' },
    { valor: 'SEMIFINAL' as VistaFiltro, label: 'Semis', icono: 'fas fa-futbol' },
    { valor: 'FINAL' as VistaFiltro, label: 'Final', icono: 'fas fa-star' },
  ];

  partidosFiltrados = computed(() =>
    this.todosLosPartidos.filter(p => p.fase === this.filtroActual())
  );

  cantidadFiltrada = computed(() => this.partidosFiltrados().length);

  constructor(private partidoService: PartidoService) { }

  ngOnInit(): void {
    this.partidoService.getPartidos().subscribe({
      next: partidos => {
        this.todosLosPartidos = partidos;
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  gruposMostrados(): string[] {
    const activo = this.grupoActivo();
    if (activo) return [activo];
    return this.grupos;
  }

  getPartidosPorGrupo(grupo: string): Partido[] {
    return this.todosLosPartidos.filter(p => p.grupo === grupo);
  }

  getEquiposDelGrupo(grupo: string): { nombre: string, bandera: string }[] {
    const partidos = this.getPartidosPorGrupo(grupo);
    const equipos = new Map<string, string>();
    partidos.forEach(p => {
      if (p.equipoLocalShow) equipos.set(p.equipoLocalShow, p.equipoLocalBandera);
      if (p.equipoVisitanteShow) equipos.set(p.equipoVisitanteShow, p.equipoVisitanteBandera);
    });
    return Array.from(equipos.entries()).map(([nombre, bandera]) => ({ nombre, bandera }));
  }

  esJugado(partido: Partido): boolean {
    return new Date(partido.fechaHora) < new Date();
  }

  formatEstadio(sede: string): string {
    if (!sede) return '';
    return sede.replace(/ Stadium/gi, '').trim();
  }
}
