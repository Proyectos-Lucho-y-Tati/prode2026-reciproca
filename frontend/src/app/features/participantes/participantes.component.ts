// src/app/features/participantes/participantes.component.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlanillaService } from '../../core/services/planilla.service';
import { PlanillaResponse } from '../../shared/models/planilla.model';

@Component({
  selector: 'app-participantes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './participantes.html',
  styleUrl: './participantes.css'
})
export class ParticipantesComponent implements OnInit {

  cargando = signal(true);
  planillas = signal<PlanillaResponse[]>([]);
  planillasFiltradas = signal<PlanillaResponse[]>([]);
  hoy = new Date();

  // Paginación
  paginaActual = signal(1);
  itemsPorPagina = 10;

  planillasPaginadas = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.planillasFiltradas().slice(inicio, fin);
  });

  totalPaginas = computed(() =>
    Math.ceil(this.planillasFiltradas().length / this.itemsPorPagina)
  );

  paginas = computed(() => {
    const total = this.totalPaginas();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  constructor(private planillaService: PlanillaService) { }

  ngOnInit(): void {
    this.planillaService.listar().subscribe({
      next: data => {
        this.planillas.set(data);
        this.planillasFiltradas.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  filtrar(evento: Event): void {
    const termino = (evento.target as HTMLInputElement).value.toLowerCase();
    this.planillasFiltradas.set(
      this.planillas().filter(p =>
        p.nombre.toLowerCase().includes(termino) ||
        p.apellido.toLowerCase().includes(termino)
      )
    );
    this.paginaActual.set(1); // Reset a la primera página al filtrar
  }

  cambiarPagina(p: number): void {
    if (p >= 1 && p <= this.totalPaginas()) {
      this.paginaActual.set(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
