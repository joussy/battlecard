import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Tournament } from './entities/tournament.entity';
import { Boxer } from './entities/boxer.entity';
import { Fight } from './entities/fight.entity';
import { TournamentBoxer } from './entities/tournament_boxer.entity';
import * as dotenv from 'dotenv';
import { mockBoxers } from './mock/boxers.mock';
import { mockFights } from './mock/fights.mock';
dotenv.config({ path: '.env.local' });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'battlecard',
  entities: [User, Tournament, Boxer, Fight, TournamentBoxer],
  synchronize: true,
});

async function seed() {
  console.warn(
    '\n⚠️  WARNING: This operation will DELETE ALL tournament, boxer, and fight data in your database!',
  );
  console.warn(
    'All tables (fight, tournament_boxer, boxer, tournament) will be truncated and replaced with mock data.',
  );
  console.warn('If you wish to keep your data, stop this script now (Ctrl+C).');
  process.stdout.write('Type YES to continue: ');
  const userInput = await new Promise((resolve) => {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', (data: string | Buffer) => {
      const str = typeof data === 'string' ? data : data.toString('utf8');
      process.stdin.pause();
      resolve(str.trim());
    });
  });
  if (userInput !== 'YES') {
    console.log('Aborted by user.');
    process.exit(0);
  }

  await dataSource.initialize();

  // Truncate all tables with CASCADE to handle foreign keys
  await dataSource.query(`
    TRUNCATE TABLE "fight", "tournament_boxer", "boxer", "tournament" RESTART IDENTITY CASCADE;
  `);

  const userRepo = dataSource.getRepository(User);
  const tournamentRepo = dataSource.getRepository(Tournament);
  const boxerRepo = dataSource.getRepository(Boxer);
  const fightRepo = dataSource.getRepository(Fight);
  const tournamentBoxerRepo = dataSource.getRepository(TournamentBoxer);

  // Create mock user
  const user = await userRepo
    .find({ take: 1, order: { id: 'ASC' } })
    .then((results) => results[0] || null);
  if (!user) {
    throw new Error(
      'Insert one user in the database before running this script. Mocked data requires a user to associate with tournaments and boxers.',
    );
  }

  // Create mock tournament
  const tournament = tournamentRepo.create({
    name: 'Mock Tournament',
    userId: user.id,
    date: new Date().toISOString().slice(0, 10),
  });
  await tournamentRepo.save(tournament);

  // Create mock boxers (real world)
  const boxers = mockBoxers.map((b) =>
    boxerRepo.create({ ...b, userId: user.id }),
  );
  await boxerRepo.save(boxers);

  // Add boxers to tournament
  const tournamentBoxers = boxers.map((b) =>
    tournamentBoxerRepo.create({ tournamentId: tournament.id, boxerId: b.id }),
  );
  await tournamentBoxerRepo.save(tournamentBoxers);

  // Create a few fights between the boxers
  // Ensure boxer1Id and boxer2Id are always set and not null
  const fightBoxerPairs = [
    [0, 1], // Ali vs Tyson
    [2, 3], // Mayweather vs Pacquiao
    [4, 5], // Holm vs Shields
    [6, 7], // Taylor vs Serrano
    [8, 5], // Jonas vs Shields
    [9, 1], // Joshua vs Tyson
  ];
  const fights = mockFights.map((f, i) =>
    fightRepo.create({
      ...f,
      boxer1Id: boxers[fightBoxerPairs[i][0]].id,
      boxer2Id: boxers[fightBoxerPairs[i][1]].id,
      tournamentId: tournament.id,
    }),
  );
  await fightRepo.save(fights);

  console.log(`Database seeded with mock data for user {email} !`, user.email);
  await dataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
