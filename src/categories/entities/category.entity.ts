import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    category_id: string;

    @Column({ length: 100 })
    category_name: string;

    @Column({ type: 'text', nullable: true })
    category_descrip: string;

    @Column({ length: 7, default: '#3B82F6' }) // Color hex default (azul)
    category_color: string;
}
