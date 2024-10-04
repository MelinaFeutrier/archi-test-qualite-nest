import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
  } from 'typeorm';
  import { BadRequestException } from '@nestjs/common';
  
  @Entity()
  export class Promotion {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column({ unique: true })
    code: string;
  
    @Column({ default: 1500 })
    amount: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    constructor(name?: string, code?: string, amount?: number) {
      if (!name || !code) {
        throw new BadRequestException('Promotion must have a name and a code.');
      }
  
      this.name = name;
      this.code = code;
      this.amount = amount ?? 1500;
    }
  }
  