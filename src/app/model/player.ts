export interface Player {
  // info
  id: string;
  name: string;
  dateCreated: number;
  image?: string;
  birthdate?: Date;

  // bgg
  bggId?: number;

  // temporary
  disabled?: boolean;
  order?: number;
}
