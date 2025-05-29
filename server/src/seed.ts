import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Tournament } from './entities/tournament.entity';
import { Boxer } from './entities/boxer.entity';
import { Fight } from './entities/fight.entity';
import { TournamentBoxer } from './entities/tournament_boxer.entity';
import * as dotenv from 'dotenv';
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
  const boxers = [
    boxerRepo.create({
      lastName: 'Ali',
      firstName: 'Muhammad',
      birthDate: '1942-01-17',
      nbFights: 61,
      club: 'Louisville Boxing Club',
      weight: 107,
      gender: 'male',
      license: 'ALI001',
      userId: user.id,
    }),
    boxerRepo.create({
      lastName: 'Tyson',
      firstName: 'Mike',
      birthDate: '1966-06-30',
      nbFights: 58,
      club: 'Catskill Boxing Club',
      weight: 100,
      gender: 'male',
      license: 'TYS002',
      userId: user.id,
    }),
    boxerRepo.create({
      lastName: 'Mayweather',
      firstName: 'Floyd',
      birthDate: '1977-02-24',
      nbFights: 50,
      club: 'Mayweather Boxing Club',
      weight: 68,
      gender: 'male',
      license: 'MAY003',
      userId: user.id,
    }),
    boxerRepo.create({
      lastName: 'Pacquiao',
      firstName: 'Manny',
      birthDate: '1978-12-17',
      nbFights: 72,
      club: 'General Santos Gym',
      weight: 66,
      gender: 'male',
      license: 'PAC004',
      userId: user.id,
    }),
    boxerRepo.create({
      lastName: 'Holm',
      firstName: 'Holly',
      birthDate: '1981-10-17',
      nbFights: 41,
      club: 'Jackson Wink MMA Academy',
      weight: 61,
      gender: 'female',
      license: 'HOL005',
      userId: user.id,
    }),
  ];
  await boxerRepo.save(boxers);

  // Add boxers to tournament
  const tournamentBoxers = boxers.map((b) =>
    tournamentBoxerRepo.create({ tournamentId: tournament.id, boxerId: b.id }),
  );
  await tournamentBoxerRepo.save(tournamentBoxers);

  // Create a few fights between the boxers
  const fights = [
    fightRepo.create({
      order: 1,
      boxer1Id: boxers[0].id, // Ali
      boxer2Id: boxers[1].id, // Tyson
      tournamentId: tournament.id,
    }),
    fightRepo.create({
      order: 2,
      boxer1Id: boxers[2].id, // Mayweather
      boxer2Id: boxers[3].id, // Pacquiao
      tournamentId: tournament.id,
    }),
  ];
  await fightRepo.save(fights);

  console.log(`Database seeded with mock data for user {email} !`, user.email);
  await dataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
