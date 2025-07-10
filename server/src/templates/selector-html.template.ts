import { SelectorTemplate } from '@/interfaces/template.interface';
import * as Mustache from 'mustache';

export function generateSelectorHtml(
  selectorTemplate: SelectorTemplate,
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
                <th>License</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Weight</th>
                <th>Category</th>
                <th>Birth Date</th>
                <th>Number of fights</th>
                <th>Gym</th>
                <th>Gender</th>
              </tr>
            </thead>
            {{#boxer}}
              <tr>
                <td>{{license}}</td>
                <td>{{lastName}}</td>
                <td>{{firstName}}</td>
                <td>{{weight}}</td>
                <td>{{category}}</td>
                <td>{{birthDate}} {{age}}</td>
                <td>{{nbFights}}</td>
                <td>{{club}}</td>
                <td>{{gender}}</td>
              </tr>
            {{/boxer}}
          </table>
        </div>
      </body>
    </html>
  `;
  return Mustache.render(template, selectorTemplate);
}
