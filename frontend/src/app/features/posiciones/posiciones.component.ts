// posiciones.component.ts — VERSIÓN MEJORADA
// FIX #2: _posicionesFiltradas era un array plano (no reactivo).
// totalPaginas() y posicionesPaginadas() eran métodos regulares que Angular
// re-evaluaba en cada ciclo de change detection aunque los datos no hubiesen
// cambiado. Ahora se usan signal + computed(), consistente con el patrón
// establecido en ParticipantesComponent y el resto de la app.
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PosicionService } from '../../core/services/posicion.service';
import { Posicion } from '../../shared/models/posicion.model';

@Component({
  selector: 'app-posiciones',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './posiciones.html',
  styleUrl: './posiciones.css'
})
export class PosicionesComponent implements OnInit {

  cargando = signal(true);
  posiciones = signal<Posicion[]>([]);
  paginaActual = signal(1);
  readonly POR_PAGINA = 10;

  // Podio agrupado por los 3 primeros puestos reales
  podio = computed(() => {
    const all = this.posiciones();
    if (all.length === 0) return [];

    const puntosUnicos = [...new Set(all.map(p => p.puntos))].sort((a, b) => b - a);
    const top3Puntos = puntosUnicos.slice(0, 3);

    return top3Puntos.map((pts, index) => ({
      posicion: index + 1,
      puntos: pts,
      integrantes: all.filter(p => p.puntos === pts)
    }));
  });

  private termino = '';
  private _posicionesOriginales: Posicion[] = [];
  private _posicionesProcesadas: Posicion[] = [];

  // FIX #2: _posicionesFiltradas como signal en lugar de array plano.
  // Esto permite que totalPaginas, paginas y posicionesPaginadas sean
  // computed() que solo se recalculan cuando los datos realmente cambian,
  // en lugar de en cada ciclo de change detection.
  private posicionesFiltradas = signal<Posicion[]>([]);

  // FIX #2: computed() en lugar de métodos regulares
  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.posicionesFiltradas().length / this.POR_PAGINA))
  );

  paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1)
  );

  posicionesPaginadas = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.POR_PAGINA;
    return this.posicionesFiltradas().slice(inicio, inicio + this.POR_PAGINA);
  });

  constructor(private posicionService: PosicionService) { }

  ngOnInit(): void {
    this.posicionService.getPosiciones().subscribe({
      next: data => {
        this._posicionesOriginales = data;
        this.procesarRanking();
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  private procesarRanking(): void {
    const sorted = [...this._posicionesOriginales].sort((a, b) => b.puntos - a.puntos);

    // Dense Ranking (1, 1, 2, 3, 3, 4...)
    let currentRank = 0;
    let lastPoints = -1;

    this._posicionesProcesadas = sorted.map(p => {
      if (p.puntos !== lastPoints) {
        currentRank++;
        lastPoints = p.puntos;
      }
      return { ...p, posicion: currentRank };
    });

    this.posiciones.set(this._posicionesProcesadas);
    this.actualizarFiltro();
  }

  filtrar(evento: Event): void {
    this.termino = (evento.target as HTMLInputElement).value.toLowerCase();
    this.actualizarFiltro();
    this.paginaActual.set(1);
  }

  private actualizarFiltro(): void {
    const resultado = !this.termino
      ? this._posicionesProcesadas
      : this._posicionesProcesadas.filter(p =>
        p.nombre.toLowerCase().includes(this.termino) ||
        p.apellido.toLowerCase().includes(this.termino)
      );
    // FIX #2: actualizar el signal para que computed() reaccione
    this.posicionesFiltradas.set(resultado);
  }

  paginaAnterior(): void {
    if (this.paginaActual() > 1) this.irAPagina(this.paginaActual() - 1);
  }

  paginaSiguiente(): void {
    if (this.paginaActual() < this.totalPaginas()) this.irAPagina(this.paginaActual() + 1);
  }

  irAPagina(p: number): void {
    this.paginaActual.set(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getClaseRow(posicion: number): string {
    if (posicion === 1) return 'row-gold';
    if (posicion === 2) return 'row-silver';
    if (posicion === 3) return 'row-bronze';
    return '';
  }
}
