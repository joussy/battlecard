import { Fight } from '../entities/fight.entity';
import { Tournament } from '../entities/tournament.entity';
import { format } from 'date-fns';

export function generateFightCardHtml(
  tournament: Tournament,
  fights: Fight[],
): string {
  const displayableTournamentDate = format(
    new Date(tournament.date),
    'dd/MM/yyyy',
  );
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
      <meta charset="utf-8" />
      </head>
      <body>
        <style>
          table, th, td {
            border: 2px solid black;
            border-collapse: collapse;
            padding: 5px;
          }
          .title {
            text-align: center;
            padding-bottom: 15px;
          }
          .title h3 {
            display: inline;
          }
          .table-container {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
          }
        </style>
        <div class="title">
          <h3>${tournament?.name}</h3>
          <br/><i>${displayableTournamentDate}</i><br/>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Red</th>
                <th>Club (Red)</th>
                <th>Blue</th>
                <th>Club (Blue)</th>
              </tr>
            </thead>
            ${fights
              .map(
                (fight) => `
                  <tr>
                    <td>${fight.order}</td>
                    <td>${fight.boxer1?.firstName || ''} ${fight.boxer1?.lastName || ''}</td>
                    <td>${fight.boxer1?.club}</td>
                    <td>${fight.boxer2?.firstName || ''} ${fight.boxer2?.lastName || ''}</td>
                    <td>${fight.boxer2?.club}</td>
                  </tr>`,
              )
              .join('')}
          </table>
        </div>
      </body>
    </html>
  `;
}
