// estadisticas.component.ts — CON TABS: Estadísticas + Pronósticos
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EstadisticaService } from '../../core/services/estadistica.service';
import { EstadisticaPartido } from '../../shared/models/estadistica.model';

type TabActivo = 'estadisticas' | 'pronosticos';

interface EquipoPronostico {
  nombre: string;
  pos: number;
  pct: number;
}

interface GrupoPronostico {
  grupo: string;
  nota: string;
  equipos: EquipoPronostico[];
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css'
})
export class EstadisticasComponent implements OnInit {

  private route = inject(ActivatedRoute);

  cargando = signal(true);
  estadisticas = signal<EstadisticaPartido[]>([]);
  grupoActivo = signal<string | null>(null);
  tabActivo = signal<TabActivo>('estadisticas');
  grupoPronostico = signal<string | null>(null);

  readonly grupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  // ── Datos de pronósticos ───────────────────────────────────────────────────
  readonly pronosticos: GrupoPronostico[] = [
    {
      grupo: 'A',
      nota: 'México aprovecha su localía histórica y clasifica 1°. República Checa asegura el 2° por su bloque táctico europeo.',
      equipos: [
        { nombre: 'México', pos: 1, pct: 90 },
        { nombre: 'República Checa', pos: 2, pct: 72 },
        { nombre: 'Corea del Sur', pos: 3, pct: 38 },
        { nombre: 'Sudáfrica', pos: 4, pct: 8 },
      ]
    },
    {
      grupo: 'B',
      nota: 'Suiza gana la zona con oficio internacional. Canadá empuja con su localía y asegura el 2° lugar.',
      equipos: [
        { nombre: 'Suiza', pos: 1, pct: 85 },
        { nombre: 'Canadá', pos: 2, pct: 78 },
        { nombre: 'Bosnia y Herzegovina', pos: 3, pct: 25 },
        { nombre: 'Catar', pos: 4, pct: 5 },
      ]
    },
    {
      grupo: 'C',
      nota: 'Brasil avanza 1° con puntaje ideal. Marruecos ratifica su nivel competitivo en el 2° lugar.',
      equipos: [
        { nombre: 'Brasil', pos: 1, pct: 95 },
        { nombre: 'Marruecos', pos: 2, pct: 80 },
        { nombre: 'Escocia', pos: 3, pct: 32 },
        { nombre: 'Haití', pos: 4, pct: 4 },
      ]
    },
    {
      grupo: 'D',
      nota: 'Grupo de pocos goles. Estados Unidos lidera impulsado por sus estadios; Turquía se queda con el 2°.',
      equipos: [
        { nombre: 'Estados Unidos', pos: 1, pct: 82 },
        { nombre: 'Turquía', pos: 2, pct: 68 },
        { nombre: 'Paraguay', pos: 3, pct: 35 },
        { nombre: 'Australia', pos: 4, pct: 18 },
      ]
    },
    {
      grupo: 'E',
      nota: 'Alemania consolida el 1°. Los modelos inclinan la balanza por Ecuador sobre Costa de Marfil para el 2°.',
      equipos: [
        { nombre: 'Alemania', pos: 1, pct: 92 },
        { nombre: 'Ecuador', pos: 2, pct: 62 },
        { nombre: 'Costa de Marfil', pos: 3, pct: 40 },
        { nombre: 'Curazao', pos: 4, pct: 3 },
      ]
    },
    {
      grupo: 'F',
      nota: 'Países Bajos clasifica en la cima. Japón despliega su dinámica habitual para sellar la 2° posición.',
      equipos: [
        { nombre: 'Países Bajos', pos: 1, pct: 88 },
        { nombre: 'Japón', pos: 2, pct: 74 },
        { nombre: 'Suecia', pos: 3, pct: 42 },
        { nombre: 'Túnez', pos: 4, pct: 10 },
      ]
    },
    {
      grupo: 'G',
      nota: 'Bélgica domina de manera invicta. Egipto asegura el 2° si mantiene su solidez defensiva africana.',
      equipos: [
        { nombre: 'Bélgica', pos: 1, pct: 91 },
        { nombre: 'Egipto', pos: 2, pct: 70 },
        { nombre: 'Irán', pos: 3, pct: 22 },
        { nombre: 'Nueva Zelanda', pos: 4, pct: 6 },
      ]
    },
    {
      grupo: 'H',
      nota: 'España, gran favorita del torneo, pasa como líder. Uruguay clasifica con holgura en el 2° puesto.',
      equipos: [
        { nombre: 'España', pos: 1, pct: 94 },
        { nombre: 'Uruguay', pos: 2, pct: 82 },
        { nombre: 'Arabia Saudí', pos: 3, pct: 15 },
        { nombre: 'Cabo Verde', pos: 4, pct: 5 },
      ]
    },
    {
      grupo: 'I',
      nota: 'Francia toma el liderazgo sin contratiempos. Noruega favorece levemente sobre Senegal para el 2°.',
      equipos: [
        { nombre: 'Francia', pos: 1, pct: 93 },
        { nombre: 'Noruega', pos: 2, pct: 58 },
        { nombre: 'Senegal', pos: 3, pct: 52 },
        { nombre: 'Irak', pos: 4, pct: 4 },
      ]
    },
    {
      grupo: 'J',
      nota: 'Argentina clasifica 1° ganando los tres partidos. Austria asegura el 2° por su ritmo europeo.',
      equipos: [
        { nombre: 'Argentina', pos: 1, pct: 96 },
        { nombre: 'Austria', pos: 2, pct: 65 },
        { nombre: 'Argelia', pos: 3, pct: 28 },
        { nombre: 'Jordania', pos: 4, pct: 5 },
      ]
    },
    {
      grupo: 'K',
      nota: 'Portugal lidera con su recambio generacional. Colombia asegura el 2° por su gran momento colectivo.',
      equipos: [
        { nombre: 'Portugal', pos: 1, pct: 89 },
        { nombre: 'Colombia', pos: 2, pct: 76 },
        { nombre: 'Uzbekistán', pos: 3, pct: 20 },
        { nombre: 'RD Congo', pos: 4, pct: 8 },
      ]
    },
    {
      grupo: 'L',
      nota: 'Inglaterra lidera con comodidad. La experiencia de Croacia en torneos cortos le asegura el 2° puesto.',
      equipos: [
        { nombre: 'Inglaterra', pos: 1, pct: 90 },
        { nombre: 'Croacia', pos: 2, pct: 75 },
        { nombre: 'Ghana', pos: 3, pct: 18 },
        { nombre: 'Panamá', pos: 4, pct: 6 },
      ]
    },
  ];

  constructor(private estadisticaService: EstadisticaService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab === 'pronosticos' || tab === 'estadisticas') {
        this.tabActivo.set(tab);
      }
    });

    this.estadisticaService.getEstadisticas().subscribe({
      next: data => { this.estadisticas.set(data); this.cargando.set(false); },
      error: () => this.cargando.set(false)
    });
  }

  // ── Métodos estadísticas ───────────────────────────────────────────────────

  estadisticasFiltradas(): EstadisticaPartido[] {
    const activo = this.grupoActivo();
    if (!activo) return this.estadisticas();
    return this.estadisticas().filter(s => s.grupo === activo);
  }

  getPct(votos: number, total: number): number {
    return total === 0 ? 0 : Math.round((votos / total) * 100);
  }

  getFavorito(stat: EstadisticaPartido): string {
    const { votosLocal, votosEmpate, votosVisitante, totalVotos } = stat;
    if (totalVotos === 0) return '';
    const max = Math.max(votosLocal, votosEmpate, votosVisitante);
    let countMax = 0;
    if (votosLocal === max) countMax++;
    if (votosEmpate === max) countMax++;
    if (votosVisitante === max) countMax++;
    if (countMax > 1 || max === 0) return '';
    if (max === votosLocal) return stat.equipoLocal;
    if (max === votosEmpate) return 'Empate';
    return stat.equipoVisitante;
  }

  totalPrediccionesLocal(): number {
    return this.estadisticas().reduce((acc, s) => acc + s.votosLocal, 0);
  }

  totalPrediccionesEmpate(): number {
    return this.estadisticas().reduce((acc, s) => acc + s.votosEmpate, 0);
  }

  totalPrediccionesVisitante(): number {
    return this.estadisticas().reduce((acc, s) => acc + s.votosVisitante, 0);
  }

  totalPlanillas(): number {
    return this.estadisticas().length > 0 ? this.estadisticas()[0].totalVotos : 0;
  }

  // ── Métodos pronósticos ────────────────────────────────────────────────────

  pronosticosFiltrados(): GrupoPronostico[] {
    const g = this.grupoPronostico();
    return g ? this.pronosticos.filter(p => p.grupo === g) : this.pronosticos;
  }

  getPctRelativo(pct: number, equipos: EquipoPronostico[]): number {
    const max = Math.max(...equipos.map(e => e.pct));
    return Math.round((pct / max) * 100);
  }
}