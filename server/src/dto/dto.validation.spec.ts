import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateTournamentDto } from './tournament.dto';
import { CreateBoxerDto } from './boxer.dto';
import { CreateFightDto } from './fight.dto';
import { ImportBoxersDto } from './import.dto';
import { Gender } from '../shared/types/modality.type';

describe('DTO Validation', () => {
  describe('CreateTournamentDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = plainToClass(CreateTournamentDto, {
        name: 'Test Tournament',
        date: '2024-12-31',
        address: '123 Main St',
        zipCode: '12345',
        city: 'Test City',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty name', async () => {
      const dto = plainToClass(CreateTournamentDto, {
        name: '',
        date: '2024-12-31',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should fail validation with invalid date format', async () => {
      const dto = plainToClass(CreateTournamentDto, {
        name: 'Test Tournament',
        date: 'invalid-date',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('date');
    });

    it('should fail validation with overly long address', async () => {
      const dto = plainToClass(CreateTournamentDto, {
        name: 'Test Tournament',
        date: '2024-12-31',
        address: 'A'.repeat(201),
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('address');
    });
  });

  describe('CreateBoxerDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = plainToClass(CreateBoxerDto, {
        lastName: 'Doe',
        firstName: 'John',
        birthDate: '1990-01-01',
        club: 'Test Club',
        gender: Gender.MALE,
        license: 'LIC123',
        weight: 70,
        nbFights: 5,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid gender', async () => {
      const dto = plainToClass(CreateBoxerDto, {
        lastName: 'Doe',
        firstName: 'John',
        birthDate: '1990-01-01',
        club: 'Test Club',
        gender: 'invalid-gender',
        license: 'LIC123',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('gender');
    });

    it('should fail validation with negative weight', async () => {
      const dto = plainToClass(CreateBoxerDto, {
        lastName: 'Doe',
        firstName: 'John',
        birthDate: '1990-01-01',
        club: 'Test Club',
        gender: Gender.MALE,
        license: 'LIC123',
        weight: -5,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('weight');
    });

    it('should fail validation with overly long name', async () => {
      const dto = plainToClass(CreateBoxerDto, {
        lastName: 'A'.repeat(51),
        firstName: 'John',
        birthDate: '1990-01-01',
        club: 'Test Club',
        gender: Gender.MALE,
        license: 'LIC123',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('lastName');
    });
  });

  describe('CreateFightDto', () => {
    it('should pass validation with valid UUIDs', async () => {
      const dto = plainToClass(CreateFightDto, {
        boxer1Id: '123e4567-e89b-12d3-a456-426614174000',
        boxer2Id: '123e4567-e89b-12d3-a456-426614174001',
        tournamentId: '123e4567-e89b-12d3-a456-426614174002',
        order: 1,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid UUIDs', async () => {
      const dto = plainToClass(CreateFightDto, {
        boxer1Id: 'not-a-uuid',
        boxer2Id: 'also-not-a-uuid',
        tournamentId: 'still-not-a-uuid',
        order: 1,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      // Should have errors for all three UUID fields
      expect(errors.length).toBeGreaterThanOrEqual(3);
    });

    it('should fail validation with invalid order', async () => {
      const dto = plainToClass(CreateFightDto, {
        boxer1Id: '123e4567-e89b-12d3-a456-426614174000',
        boxer2Id: '123e4567-e89b-12d3-a456-426614174001',
        tournamentId: '123e4567-e89b-12d3-a456-426614174002',
        order: 0,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('order');
    });
  });

  describe('ImportBoxersDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = plainToClass(ImportBoxersDto, {
        dry: true,
        boxers: [
          {
            lastName: 'Doe',
            firstName: 'John',
            birthDate: '1990-01-01',
            club: 'Test Club',
            weight: 70,
            license: 'LIC123',
            fightRecord: 5,
          },
        ],
        tournamentId: '123e4567-e89b-12d3-a456-426614174000',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid dry flag', async () => {
      const dto = plainToClass(ImportBoxersDto, {
        dry: 'not-a-boolean',
        boxers: [],
        tournamentId: '123e4567-e89b-12d3-a456-426614174000',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('dry');
    });

    it('should fail validation with invalid tournament ID', async () => {
      const dto = plainToClass(ImportBoxersDto, {
        dry: true,
        boxers: [],
        tournamentId: 'not-a-uuid',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('tournamentId');
    });
  });
});
