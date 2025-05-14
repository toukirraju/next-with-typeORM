import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from "class-validator";

export enum UserRole {
    GENERAL_USER = "general_user",
    SUPER_ADMIN = "super_admin",
    REGULAR_ADMIN = "regular_admin",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    @IsEmail()
    email!: string;

    @Column()
    @IsString()
    @MinLength(6)
    password!: string;

    @Column()
    @IsString()
    name!: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.GENERAL_USER,
    })
    @IsEnum(UserRole)
    role!: UserRole;

    @Column({ nullable: true })
    phone!: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    avatar?: string;
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    refreshToken?: string;
}