import { FightCardTemplate } from '@/interfaces/template.interface';

export function generateFightCardHtml(
  fightCardTemplate: FightCardTemplate,
): string {
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
          <h3>${fightCardTemplate.title}</h3>
          <br/><i>${fightCardTemplate.subtitle}</i><br/>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>License (Red)</th>
                <th>Red</th>
                <th>Club (Red)</th>
                <th>License (Blue)</th>
                <th>Blue</th>
                <th>Club (Blue)</th>
                <th>Duration</th>
              </tr>
            </thead>
            ${fightCardTemplate.fights
              .map(
                (fight) => `
                  <tr>
                    <td>${fight.order}</td>
                    <td>${fight.boxer1License}</td>
                    <td>${fight.boxer1FirstName} ${fight.boxer1LastName}</td>
                    <td>${fight.boxer1Club}</td>
                    <td>${fight.boxer2License}</td>
                    <td>${fight.boxer2FirstName} ${fight.boxer2LastName}</td>
                    <td>${fight.boxer2Club}</td>
                    <td>${fight.fightDuration}</td>
                  </tr>`,
              )
              .join('')}
          </table>
        </div>
      </body>
    </html>
  `;
}
