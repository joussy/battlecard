import { Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TournamentBoxer } from './entities/tournament_boxer.entity';
import { Boxer } from './entities/boxer.entity';

@Controller('tournament-boxers')
export class TournamentBoxerController {
  constructor(
    @InjectRepository(TournamentBoxer)
    private readonly tournamentBoxerRepository: Repository<TournamentBoxer>,
    @InjectRepository(Boxer)
    private readonly boxerRepository: Repository<Boxer>,
  ) {}

  // @Get()
  // async findAll(
  //   @Query('tournamentId') tournamentId?: string,
  // ): Promise<ApiTournament_Boxer[]> {
  //   if (tournamentId) {
  //     const tournamentBoxers = await this.tournamentBoxerRepository.find({
  //       where: { tournamentId },
  //     });
  //     return tournamentBoxers.map(toApiTournamentBoxer);
  //   }
  //   const all = await this.tournamentBoxerRepository.find();
  //   return all.map(toApiTournamentBoxer);
  // }

  // @Post()
  // async create(
  //   @Body() tournamentBoxer: Partial<ApiTournament_Boxer>,
  // ): Promise<ApiTournament_Boxer> {
  //   if ('id' in tournamentBoxer) {
  //     delete tournamentBoxer.id;
  //   }
  //   const dbTournamentBoxer = await this.tournamentBoxerRepository.save(
  //     toTournamentBoxer(tournamentBoxer as ApiTournament_Boxer),
  //   );
  //   return toApiTournamentBoxer(dbTournamentBoxer);
  // }

  // @Delete()
  // async deleteMany(
  //   @Body() body: { boxerIds: string[]; tournamentId: string },
  // ): Promise<void> {
  //   const { boxerIds, tournamentId } = body;
  //   if (!Array.isArray(boxerIds) || !tournamentId) return;
  //   await this.tournamentBoxerRepository.delete({
  //     tournamentId,
  //     boxerId: In(boxerIds),
  //   });
  // }
}
