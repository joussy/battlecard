import { ref , reactive} from 'vue'
import { Boxer, Gender, Fight, BoxingData, Opponent, BoxingStorage, BoxerAttributes, ClubFighters } from '@/types/boxing.d'
import { ModalityError, ModalityErrorType } from '@/types/modality.d'
import { BeaModality } from '@/fightModality/BeaModality'

export const store = reactive({
    fightCard: [] as Fight[],
    boxers: [] as Boxer[],
    modality: new BeaModality(),
    clear(): void {
        this.boxers = [];
        this.fightCard = [];
      },
    getNbFightsForBoxer(boxer: Boxer): number {
        return this.fightCard.filter((f : Fight) => f.boxer1.attributes.id == boxer.attributes.id || f.boxer2.attributes.id == boxer.attributes.id).length
    },
    getBoxerDisplayName(boxer: Boxer): string {
        return `${boxer.attributes.firstName} ${boxer.attributes.lastName}`;
    },
    isInFightCard(boxer: Boxer): boolean {
        return this.getNbFightsForBoxer(boxer) > 0
    },
    removeFromFightCard(boxer1: Boxer, boxer2: Boxer): void {
        let index = this.getFightId(boxer1, boxer2);
        if (index != null) {
          this.removeFromFightCardByIndex(index);
        }
    },
    getFightId(boxer1: Boxer, boxer2: Boxer): number | null {
        const index = this.fightCard.findIndex(
          (fight: Fight) =>
            (fight.boxer1.attributes.id === boxer1.attributes.id && fight.boxer2.attributes.id === boxer2.attributes.id) ||
            (fight.boxer1.attributes.id === boxer2.attributes.id && fight.boxer2.attributes.id === boxer1.attributes.id),
        );
        return index < 0 ? null : index;
      },
      removeFromFightCardByIndex(index: number): void {
        // Remove fight from the fight card
        this.fightCard.splice(index, 1);
      },
      getOpponentModalityErrors(boxer: Boxer, opponent: Boxer): ModalityError[] {
        return this.modality.getModalityProblems(boxer.attributes, opponent.attributes);
      },
      canCompete(boxer1: Boxer, boxer2: Boxer): boolean {
        return !this.isCompeting(boxer1, boxer2);
      },
  
      isCompeting(boxer1: Boxer, boxer2: Boxer): boolean {
        const index = this.getFightId(boxer1, boxer2);
  
        return index != null;
      },
      addToFightCard(boxer1: Boxer, boxer2: Boxer) {
        // Check if the fight already exists before adding to the fight card
  
        if (!this.isCompeting(boxer1, boxer2)) {
          this.fightCard.push({ boxer1, boxer2, modalityErrors: this.getOpponentModalityErrors(boxer1, boxer2) });
        }
      },
      computeBoxerOpponents() {
        for (let [index, boxer] of this.boxers.entries()) {
          boxer.opponents = this.boxers
            .map((b) => <Opponent>{
              weightDifference: Math.abs(boxer.attributes.weight - b.attributes.weight),
              boxer: b,
              modalityErrors: this.getOpponentModalityErrors(boxer, b),
              isEligible: this.getOpponentModalityErrors(boxer, b).length == 0
            })
            .filter(o =>
              !o.modalityErrors.some(modalityError => [ModalityErrorType.SAME_CLUB, ModalityErrorType.SAME_ID, ModalityErrorType.OPPOSITE_GENDER].includes(modalityError.type)))
            .sort((a, b) => a.modalityErrors.length - b.modalityErrors.length);
        }
      }  
});
