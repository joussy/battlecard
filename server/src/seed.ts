import { DataSource } from 'typeorm';
import { MeiliSearch } from 'meilisearch';
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

  const userEmail = process.env.SEED_INITIAL_USERNAME as string;
  const userName = process.env.SEED_INITIAL_NAME as string;
  const picture = process.env.SEED_INITIAL_PICTURE as string;

  let user = await userRepo
    .find({ take: 1, order: { id: 'ASC' } })
    .then((results) => results[0] || null);

  if (!user && userEmail && userName && picture) {
    // Create mock user
    user = await userRepo.save({
      email: userEmail,
      name: userName,
      picture: picture,
      apiEnabled: true,
    });
    console.log(`Mock user created with email: ${userEmail}`);
  }
  if (!user) {
    throw new Error(
      'Insert one user in the database before running this script. \
      Mocked data requires a user to associate with tournaments and boxers. \
      You can also setup one in .env.local using SEED_INITIAL_USERNAME, SEED_INITIAL_NAME, and SEED_INITIAL_PICTURE variables.',
    );
  }

  // Create mock tournament
  const tournament = tournamentRepo.create({
    id: '4f331141-e0e4-4a6b-bcec-2f92bfff0c04',
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

async function clearMeiliIndex() {
  const meiliHost = process.env.MEILI_HOST as string;
  const meiliBoxersIndex = process.env.MEILI_BOXER_INDEX as string;
  const meiliMasterKey = process.env.MEILI_API_KEY as string;

  if (!meiliBoxersIndex) {
    console.error('MEILI_BOXER_INDEX environment variable is not set.');
    process.exit(1);
  }

  if (!meiliHost) {
    console.error('MEILI_HOST environment variable is not set.');
    process.exit(1);
  }

  if (!meiliMasterKey) {
    console.error('MEILI_API_KEY environment variable is not set.');
    process.exit(1);
  }

  const client = new MeiliSearch({
    host: meiliHost,
    apiKey: meiliMasterKey,
  });
  try {
    console.log(`Deleting Meilisearch Boxer Index '${meiliBoxersIndex}' ...`);
    await client.deleteIndex(meiliBoxersIndex);
    console.log('Deletion done...');
  } catch (error) {
    console.error(
      'Failed to delete Meilisearch index:',
      error.message || error,
    );
    process.exit(1);
  }
}

async function promptDeletion() {
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
}

promptDeletion()
  .then(() => clearMeiliIndex())
  .then(() => seed())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
