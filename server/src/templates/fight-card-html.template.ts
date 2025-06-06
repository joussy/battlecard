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
          .cell-red {
              background-color: #97161618 !important;
          }
          .cell-blue {
              background-color: #1638972c !important;
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
                <th colspan=3>Red Corner</th>
                <th colspan=3>Blue Corner</th>
                <th>Duration</th>
                <th>Gender</th>
              </tr>
            </thead>
            {{#fights}}
              <tr>
                <td>{{order}}</td>
                <td class="cell-red">{{boxer1License}}</td>
                <td class="cell-red">{{boxer1FirstName}} {{boxer1LastName}}</td>
                <td class="cell-red">{{boxer1Club}}</td>
                <td class="cell-blue">{{boxer2License}}</td>
                <td class="cell-blue">{{boxer2FirstName}} {{boxer2LastName}}</td>
                <td class="cell-blue">{{boxer2Club}}</td>
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
