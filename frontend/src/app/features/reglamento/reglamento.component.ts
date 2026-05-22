import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ArticuloReglamento {
  numero: number;
  titulo: string;
  icono: string;
  contenido: string;
  destacado?: string;
}

@Component({
  selector: 'app-reglamento',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reglamento.html',
  styleUrl: './reglamento.css',
})

export class ReglamentoComponent {

  scrollTo(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  readonly articulos: ArticuloReglamento[] = [
    {
      numero: 1,
      titulo: 'Los Partidos',
      icono: 'fa-futbol',
      contenido: `
        <p>Vas a pronosticar los <strong>72 partidos</strong> de la fase de grupos del Mundial 2026 (Canadá, Estados Unidos y México), que se jugarán desde el <strong>11 hasta el 28 de junio de 2026</strong>.</p>
        <p>Por cada partido, debés marcar una de tres opciones:</p>
        <ul>
          <li><strong>Local (L)</strong>: Gana el primer equipo.</li>
          <li><strong>Empate (E)</strong>: El partido termina igualado.</li>
          <li><strong>Visitante (V)</strong>: Gana el segundo equipo.</li>
        </ul>
        <p>Si no te decidís, podés usar el botón <strong>"Me la juego"</strong> para completar de forma aleatoria.</p>
      `
    },
    {
      numero: 2,
      titulo: 'Tu Planilla',
      icono: 'fa-floppy-disk',
      contenido: `
        <p>Una vez completados todos los campos y tus datos personales, hacé clic en <strong>Guardar Planilla</strong>.</p>
        <p>El sistema te va a dar un <strong>código único</strong> (ej: 80358702). Guardate este número, es indispensable para confirmar tu participación.</p>
        <p>Podés cargar todas las planillas que quieras. Si necesitás corregir algo, podés editar tu planilla usando ese código y tu email registrado <strong>antes</strong> de que el administrador la confirme.</p>
      `,
      destacado: `Guardá bien tu código. Si perdés el número, <strong>no podrás recuperarlo</strong>. También lo recibirás por email cuando el administrador confirme tu planilla.`
    },
    {
      numero: 3,
      titulo: 'Confirmación',
      icono: 'fa-circle-check',
      contenido: `
        <p>Para que tu planilla participe, debés presentarle al administrador el <strong>código único</strong> que te generó el sistema al guardarla.</p>
      `,
      destacado: `Las planillas se confirmarán <strong>ineludiblemente</strong> hasta el <strong>10/06/2026 a las 14:00 hs</strong>. Pasado ese horario no serán confirmadas.`
    },
    {
      numero: 4,
      titulo: 'Resultados y Puntos',
      icono: 'fa-chart-line',
      contenido: `
        <p>Se usarán los <strong>resultados oficiales de la FIFA</strong>, y vas a poder seguir tu posición en vivo desde la sección <a href="/posiciones">Posiciones</a>.</p>
        <p>Vas a sumar puntos así:</p>
        <ul>
          <li><strong>1 Punto</strong>: Por cada acierto (L, E o V). No hace falta acertar el marcador exacto, solo quién gana o si empatan.</li>
          <li><strong>2 Puntos</strong>: En los partidos especiales marcados con multiplicador <strong>X2</strong>.</li>
        </ul>
      `
    },
    {
      numero: 5,
      titulo: 'Transparencia y Publicación',
      icono: 'fa-eye',
      contenido: `
        <p>Para garantizar la transparencia del juego, una vez cerrado el período de inscripción, todas las planillas confirmadas se publicarán en la sección <a href="/participantes">Participantes</a>.</p>
        <p>Allí cualquiera podrá ver y auditar públicamente los pronósticos de todos los participantes.</p>
      `
    }
  ];
}