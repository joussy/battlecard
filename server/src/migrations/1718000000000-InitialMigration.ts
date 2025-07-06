import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1718000000000 implements MigrationInterface {
  name = 'InitialMigration1718000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Example: adjust to match your actual entities
    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION public.log_sync_event()
        RETURNS trigger
        LANGUAGE plpgsql
        AS $function$
        BEGIN
            IF (TG_OP = 'DELETE') THEN
                INSERT INTO public.sync_log(table_name, operation, record_id)
                VALUES (TG_TABLE_NAME, 'DELETE', OLD.id);
                RETURN OLD;
            ELSE
                INSERT INTO public.sync_log(table_name, operation, record_id)
                VALUES (TG_TABLE_NAME, TG_OP, NEW.id);
                RETURN NEW;
            END IF;
        END;
        $function$
        ;
        -- For "boxer"
        CREATE OR REPLACE TRIGGER trg_boxer_log_sync
        AFTER INSERT OR UPDATE OR DELETE ON public.boxer
        FOR EACH ROW EXECUTE FUNCTION public.log_sync_event();
        `);
  }

  public down(): Promise<void> {
    throw new Error('Down migration not implemented');
  }
}
