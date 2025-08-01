import { Report } from "src/report/report.entity";
import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
// import { Exclude } from "class-transformer";

@Entity()
export class User {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  // @Exclude()
  password: string;

  @Column({ default: true})
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with Id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with Id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with Id', this.id)
  }
}