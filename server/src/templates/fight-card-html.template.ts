import { FightCardTemplate } from '@/interfaces/template.interface';
import * as Mustache from 'mustache';

export function generateFightCardHtml(
  fightCardTemplate: FightCardTemplate,
): string {
  const template = `
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
          <h3>{{title}}</h3>
          <br/><i>{{subtitle}}</i><br/>
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
                <th>Gender</th>
              </tr>
            </thead>
            {{#fights}}
              <tr>
                <td>{{order}}</td>
                <td>{{boxer1License}}</td>
                <td>{{boxer1FirstName}} {{boxer1LastName}}</td>
                <td>{{boxer1Club}}</td>
                <td>{{boxer2License}}</td>
                <td>{{boxer2FirstName}} {{boxer2LastName}}</td>
                <td>{{boxer2Club}}</td>
                <td>{{fightDuration}}</td>
                <td>{{gender}}</td>
              </tr>
            {{/fights}}
          </table>
        </div>
      </body>
    </html>
  `;
  return Mustache.render(template, fightCardTemplate);
}
